package com.hamarashops.auth.serviceimpl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hamarashops.auth.dto.LinkedInProfile;
import com.hamarashops.auth.dto.OAuthState;
import com.hamarashops.auth.exception.OAuthAuthenticationException;
import com.hamarashops.auth.service.LinkedInOidcService;
import com.nimbusds.jose.crypto.RSASSAVerifier;
import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.util.UriComponentsBuilder;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.*;

@Service
public class LinkedInOidcServiceImpl implements LinkedInOidcService {

    private static final Logger log = LoggerFactory.getLogger(LinkedInOidcServiceImpl.class);
    private static final long STATE_EXPIRATION_SECONDS = 900; // 15 minutes
    private static final SecureRandom secureRandom = new SecureRandom();

    private final String clientId;
    private final String clientSecret;
    private final String redirectUri;
    private final String authorizationUrl;
    private final String tokenUrl;
    private final String userinfoUrl;
    private final String jwksUrl;
    private final String issuer;
    private final String hmacSecret;

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    // Cache JWKS in memory to prevent hitting LinkedIn JWKS on every request
    private volatile JWKSet cachedJwkSet;
    private volatile Instant jwkSetCacheExpiry = Instant.MIN;

    public LinkedInOidcServiceImpl(
            @Value("${linkedin.client-id:}") String clientId,
            @Value("${linkedin.client-secret:}") String clientSecret,
            @Value("${linkedin.redirect-uri:http://localhost:8080/api/v1/auth/linkedin/callback}") String redirectUri,
            @Value("${linkedin.authorization-url:https://www.linkedin.com/oauth/v2/authorization}") String authorizationUrl,
            @Value("${linkedin.token-url:https://www.linkedin.com/oauth/v2/accessToken}") String tokenUrl,
            @Value("${linkedin.userinfo-url:https://api.linkedin.com/v2/userinfo}") String userinfoUrl,
            @Value("${linkedin.jwks-url:https://www.linkedin.com/oauth/openid/jwks}") String jwksUrl,
            @Value("${linkedin.issuer:https://www.linkedin.com/oauth}") String issuer,
            @Value("${security.jwt.secret:404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970}") String hmacSecret) {

        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.redirectUri = redirectUri;
        this.authorizationUrl = authorizationUrl;
        this.tokenUrl = tokenUrl;
        this.userinfoUrl = userinfoUrl;
        this.jwksUrl = jwksUrl;
        this.issuer = issuer;
        this.hmacSecret = hmacSecret;

        this.restClient = RestClient.builder().build();
        this.objectMapper = new ObjectMapper();
    }

    @Override
    public OAuthState createAuthorizationRequest(String targetRedirect) {
        String state = generateRandomString(24);
        String nonce = generateRandomString(24);
        long timestamp = Instant.now().getEpochSecond();
        String safeTarget = (targetRedirect != null && !targetRedirect.isBlank()) ? targetRedirect : "/";
        String encodedTarget = Base64.getUrlEncoder().withoutPadding().encodeToString(safeTarget.getBytes(StandardCharsets.UTF_8));

        String payload = state + ":" + nonce + ":" + timestamp + ":" + encodedTarget;
        String signature = computeHmac(payload);
        String cookieValue = payload + "." + signature;

        String authUrl = UriComponentsBuilder.fromUriString(authorizationUrl)
                .queryParam("response_type", "code")
                .queryParam("client_id", clientId)
                .queryParam("redirect_uri", redirectUri)
                .queryParam("state", state)
                .queryParam("scope", "openid profile email")
                .queryParam("nonce", nonce)
                .encode()
                .build()
                .toUriString();

        return new OAuthState(state, nonce, safeTarget, authUrl, cookieValue);
    }

    @Override
    public OAuthState validateStateCookie(String cookieValue, String returnedState) {
        if (cookieValue == null || cookieValue.isBlank()) {
            throw new OAuthAuthenticationException("Missing OAuth state verification cookie. Session expired or cross-site request detected.");
        }
        if (returnedState == null || returnedState.isBlank()) {
            throw new OAuthAuthenticationException("Missing state parameter returned by LinkedIn.");
        }

        int dotIndex = cookieValue.lastIndexOf('.');
        if (dotIndex <= 0) {
            throw new OAuthAuthenticationException("Malformed OAuth state cookie format.");
        }

        String payload = cookieValue.substring(0, dotIndex);
        String signature = cookieValue.substring(dotIndex + 1);

        String expectedSignature = computeHmac(payload);
        if (!MessageDigestEquals(signature, expectedSignature)) {
            throw new OAuthAuthenticationException("Invalid OAuth state cookie signature.");
        }

        String[] parts = payload.split(":", 4);
        if (parts.length < 4) {
            throw new OAuthAuthenticationException("Invalid OAuth state payload structure.");
        }

        String savedState = parts[0];
        String nonce = parts[1];
        long timestamp;
        try {
            timestamp = Long.parseLong(parts[2]);
        } catch (NumberFormatException e) {
            throw new OAuthAuthenticationException("Invalid timestamp in OAuth state cookie.");
        }

        String targetRedirect = "/";
        try {
            byte[] decoded = Base64.getUrlDecoder().decode(parts[3]);
            targetRedirect = new String(decoded, StandardCharsets.UTF_8);
        } catch (Exception ignored) {
        }

        if (Instant.now().getEpochSecond() - timestamp > STATE_EXPIRATION_SECONDS) {
            throw new OAuthAuthenticationException("OAuth authentication session expired. Please try signing in again.");
        }

        if (!MessageDigestEquals(savedState, returnedState)) {
            throw new OAuthAuthenticationException("OAuth state mismatch. Potential CSRF attack detected.");
        }

        return new OAuthState(savedState, nonce, targetRedirect, null, cookieValue);
    }

    @Override
    public LinkedInProfile exchangeCodeAndVerify(String code, String expectedNonce) {
        if (clientId == null || clientId.isBlank() || clientSecret == null || clientSecret.isBlank()) {
            throw new OAuthAuthenticationException("LinkedIn Client ID or Client Secret is not configured in backend environment.");
        }

        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("grant_type", "authorization_code");
        form.add("code", code);
        form.add("redirect_uri", redirectUri);
        form.add("client_id", clientId);
        form.add("client_secret", clientSecret);

        String responseBody;
        try {
            responseBody = restClient.post()
                    .uri(tokenUrl)
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .accept(MediaType.APPLICATION_JSON)
                    .body(form)
                    .retrieve()
                    .body(String.class);
        } catch (RestClientResponseException e) {
            log.error("LinkedIn token exchange failed: HTTP {} body: {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new OAuthAuthenticationException("LinkedIn token exchange failed: " + e.getStatusCode());
        } catch (Exception e) {
            log.error("Error communicating with LinkedIn token endpoint", e);
            throw new OAuthAuthenticationException("Unable to connect to LinkedIn authorization servers.", e);
        }

        String accessToken = null;
        String idToken = null;

        try {
            JsonNode root = objectMapper.readTree(responseBody);
            if (root.has("access_token")) {
                accessToken = root.get("access_token").asText();
            }
            if (root.has("id_token")) {
                idToken = root.get("id_token").asText();
            }
        } catch (Exception e) {
            throw new OAuthAuthenticationException("Failed to parse LinkedIn token exchange response.", e);
        }

        if (idToken == null || idToken.isBlank()) {
            throw new OAuthAuthenticationException("LinkedIn did not return an OIDC ID token. Verify openid scope is configured.");
        }

        // Validate OIDC ID Token cryptographically against LinkedIn JWKS
        LinkedInProfile profile = verifyIdToken(idToken, expectedNonce);

        // If email or picture is missing from ID token, fetch from userinfo endpoint
        if (profile.getEmail() == null || profile.getPicture() == null) {
            enrichFromUserInfo(profile, accessToken);
        }

        return profile;
    }

    public LinkedInProfile verifyIdToken(String idToken, String expectedNonce) {
        return verifyIdToken(idToken, expectedNonce, getJwks());
    }

    public LinkedInProfile verifyIdToken(String idToken, String expectedNonce, JWKSet jwkSet) {
        SignedJWT signedJWT;
        try {
            signedJWT = SignedJWT.parse(idToken);
        } catch (Exception e) {
            throw new OAuthAuthenticationException("Invalid ID token format: cannot parse JWT.", e);
        }

        // 1. Verify Signature using JWKS
        String keyId = signedJWT.getHeader().getKeyID();
        JWK jwk = (keyId != null) ? jwkSet.getKeyByKeyId(keyId) : null;

        if (jwk == null && !jwkSet.getKeys().isEmpty()) {
            // Refresh JWKS once if keyId is not found (key rotation)
            refreshJwks();
            jwkSet = getJwks();
            jwk = (keyId != null) ? jwkSet.getKeyByKeyId(keyId) : null;
        }

        if (jwk == null && !jwkSet.getKeys().isEmpty()) {
            // Fallback to first matching key if keyId is null
            jwk = jwkSet.getKeys().get(0);
        }

        if (jwk == null) {
            throw new OAuthAuthenticationException("Unable to find matching public key in LinkedIn JWKS for keyId: " + keyId);
        }

        try {
            RSAKey rsaKey = (RSAKey) jwk;
            RSASSAVerifier verifier = new RSASSAVerifier(rsaKey.toRSAPublicKey());
            if (!signedJWT.verify(verifier)) {
                throw new OAuthAuthenticationException("LinkedIn ID token signature verification failed.");
            }
        } catch (OAuthAuthenticationException e) {
            throw e;
        } catch (Exception e) {
            throw new OAuthAuthenticationException("Error verifying LinkedIn ID token signature.", e);
        }

        // 2. Validate Claims
        JWTClaimsSet claims;
        try {
            claims = signedJWT.getJWTClaimsSet();
        } catch (Exception e) {
            throw new OAuthAuthenticationException("Unable to extract claims from ID token.", e);
        }

        // Safely log non-sensitive ID token claims (NEVER logging access_token, client_secret, or full ID token)
        try {
            log.info("Decoded LinkedIn ID Token claims - iss: '{}', aud: '{}', sub: '{}', exp: '{}', iat: '{}', nonce: '{}'",
                    claims.getIssuer(),
                    claims.getAudience(),
                    claims.getSubject(),
                    claims.getExpirationTime(),
                    claims.getIssueTime(),
                    claims.getStringClaim("nonce"));
        } catch (Exception ignored) {
        }

        // Verify Issuer against official LinkedIn OIDC metadata (https://www.linkedin.com/oauth)
        String tokenIssuer = claims.getIssuer();
        if (tokenIssuer == null || (!tokenIssuer.equals(issuer) && !tokenIssuer.equals(issuer + "/"))) {
            throw new OAuthAuthenticationException("ID token issuer mismatch. Expected: " + issuer + ", Received: " + tokenIssuer);
        }

        // Verify Audience
        List<String> audience = claims.getAudience();
        if (audience == null || !audience.contains(clientId)) {
            throw new OAuthAuthenticationException("ID token audience mismatch. Client ID not in audience.");
        }

        // Verify Expiration
        Date expiration = claims.getExpirationTime();
        if (expiration == null || expiration.before(new Date())) {
            throw new OAuthAuthenticationException("LinkedIn ID token has expired.");
        }

        try {
            // Verify Nonce if present in the token (LinkedIn OIDC does not return nonce in its ID token)
            String tokenNonce = claims.getStringClaim("nonce");
            if (tokenNonce != null && expectedNonce != null && !MessageDigestEquals(tokenNonce, expectedNonce)) {
                throw new OAuthAuthenticationException("OIDC nonce mismatch. Replay or tampering detected.");
            }

            // Extract Identity Claims safely (handling string, boolean, or numeric representations from LinkedIn)
            String sub = claims.getSubject();
            String email = parseStringClaim(claims.getClaim("email"));
            Boolean emailVerified = parseBooleanClaim(claims.getClaim("email_verified"));
            String givenName = parseStringClaim(claims.getClaim("given_name"));
            String familyName = parseStringClaim(claims.getClaim("family_name"));
            String name = parseStringClaim(claims.getClaim("name"));
            String picture = parseStringClaim(claims.getClaim("picture"));

            return new LinkedInProfile(sub, email, emailVerified != null ? emailVerified : false, givenName, familyName, name, picture);
        } catch (Exception e) {
            throw new OAuthAuthenticationException("Failed to parse claims from ID token: " + e.getMessage(), e);
        }
    }

    private void enrichFromUserInfo(LinkedInProfile profile, String accessToken) {
        if (accessToken == null || accessToken.isBlank()) {
            return;
        }
        try {
            String userInfoJson = restClient.get()
                    .uri(userinfoUrl)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                    .accept(MediaType.APPLICATION_JSON)
                    .retrieve()
                    .body(String.class);

            if (userInfoJson != null) {
                JsonNode userNode = objectMapper.readTree(userInfoJson);
                if (profile.getEmail() == null && userNode.has("email")) {
                    profile.setEmail(userNode.get("email").asText());
                }
                if (profile.getEmailVerified() == null && userNode.has("email_verified")) {
                    profile.setEmailVerified(userNode.get("email_verified").asBoolean());
                }
                if (profile.getName() == null && userNode.has("name")) {
                    profile.setName(userNode.get("name").asText());
                }
                if (profile.getPicture() == null && userNode.has("picture")) {
                    profile.setPicture(userNode.get("picture").asText());
                }
            }
        } catch (Exception e) {
            log.warn("Failed to enrich user profile from LinkedIn userinfo endpoint: {}", e.getMessage());
        }
    }

    private synchronized JWKSet getJwks() {
        if (cachedJwkSet != null && Instant.now().isBefore(jwkSetCacheExpiry)) {
            return cachedJwkSet;
        }
        refreshJwks();
        return cachedJwkSet;
    }

    private synchronized void refreshJwks() {
        try {
            cachedJwkSet = JWKSet.load(new URL(jwksUrl));
            jwkSetCacheExpiry = Instant.now().plusSeconds(3600); // cache for 1 hour
            log.info("Successfully fetched and cached LinkedIn JWKS public keys.");
        } catch (Exception e) {
            log.error("Failed to load LinkedIn JWKS from URL: {}", jwksUrl, e);
            if (cachedJwkSet == null) {
                throw new OAuthAuthenticationException("Unable to load LinkedIn JWKS public keys.", e);
            }
        }
    }

    private String generateRandomString(int length) {
        byte[] bytes = new byte[length];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String computeHmac(String data) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(hmacSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKeySpec);
            byte[] rawHmac = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(rawHmac);
        } catch (Exception e) {
            throw new IllegalStateException("Failed to compute HMAC", e);
        }
    }

    private static boolean MessageDigestEquals(String a, String b) {
        if (a == null || b == null) {
            return false;
        }
        return java.security.MessageDigest.isEqual(
                a.getBytes(StandardCharsets.UTF_8),
                b.getBytes(StandardCharsets.UTF_8)
        );
    }

    private Boolean parseBooleanClaim(Object claim) {
        if (claim == null) {
            return false;
        }
        if (claim instanceof Boolean b) {
            return b;
        }
        if (claim instanceof String s) {
            return Boolean.parseBoolean(s) || "1".equals(s) || "yes".equalsIgnoreCase(s);
        }
        if (claim instanceof Number n) {
            return n.intValue() != 0;
        }
        return false;
    }

    private String parseStringClaim(Object claim) {
        if (claim == null) {
            return null;
        }
        if (claim instanceof String s) {
            return s;
        }
        return String.valueOf(claim);
    }
}
