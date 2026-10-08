package com.hamarashops.auth.service;

import com.hamarashops.auth.dto.LinkedInProfile;
import com.hamarashops.auth.dto.OAuthState;
import com.hamarashops.auth.exception.OAuthAuthenticationException;
import com.hamarashops.auth.serviceimpl.LinkedInOidcServiceImpl;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.RSASSASigner;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.gen.RSAKeyGenerator;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class LinkedInOidcServiceTest {

    private LinkedInOidcServiceImpl linkedInOidcService;
    private RSAKey testRsaKey;
    private JWKSet testJwkSet;

    @BeforeEach
    public void setUp() throws Exception {
        linkedInOidcService = new LinkedInOidcServiceImpl(
                "test-client-id",
                "test-client-secret",
                "http://localhost:8080/api/v1/auth/linkedin/callback",
                "https://www.linkedin.com/oauth/v2/authorization",
                "https://www.linkedin.com/oauth/v2/accessToken",
                "https://api.linkedin.com/v2/userinfo",
                "https://www.linkedin.com/oauth/openid/jwks",
                "https://www.linkedin.com/oauth",
                "test-hmac-secret-at-least-32-bytes-long-key-123456"
        );

        testRsaKey = new RSAKeyGenerator(2048)
                .keyID("test-key-id-1")
                .generate();
        testJwkSet = new JWKSet(testRsaKey.toPublicJWK());
    }

    private String createTestIdToken(String issuer, String audience, String nonce, Date expiration, RSAKey signingKey) throws Exception {
        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                .issuer(issuer)
                .audience(audience)
                .subject("urn:li:person:mock-sub-123")
                .claim("email", "dev@hamarashops.ai")
                .claim("email_verified", true)
                .claim("given_name", "Dev")
                .claim("family_name", "User")
                .claim("name", "Dev User")
                .claim("nonce", nonce)
                .issueTime(new Date())
                .expirationTime(expiration)
                .build();

        JWSHeader header = new JWSHeader.Builder(JWSAlgorithm.RS256)
                .keyID(signingKey.getKeyID())
                .build();

        SignedJWT signedJWT = new SignedJWT(header, claimsSet);
        signedJWT.sign(new RSASSASigner(signingKey));
        return signedJWT.serialize();
    }

    @Test
    @DisplayName("Create authorization request generates URL, state, nonce, and secure cookie")
    public void testCreateAuthorizationRequest() {
        OAuthState state = linkedInOidcService.createAuthorizationRequest("/industries");

        assertNotNull(state);
        assertNotNull(state.getState());
        assertNotNull(state.getNonce());
        assertEquals("/industries", state.getTargetRedirect());
        assertNotNull(state.getCookieValue());
        assertTrue(state.getCookieValue().contains("."));

        String url = state.getAuthUrl();
        assertTrue(url.contains("response_type=code"));
        assertTrue(url.contains("client_id=test-client-id"));
        assertTrue(url.contains("redirect_uri="));
        assertTrue(url.contains("scope=openid%20profile%20email"));
        assertTrue(url.contains("state=" + state.getState()));
        assertTrue(url.contains("nonce=" + state.getNonce()));
    }

    @Test
    @DisplayName("Validate state cookie succeeds with matching state")
    public void testValidateStateCookieSuccess() {
        OAuthState state = linkedInOidcService.createAuthorizationRequest("/architecture");
        OAuthState validated = linkedInOidcService.validateStateCookie(state.getCookieValue(), state.getState());

        assertNotNull(validated);
        assertEquals(state.getState(), validated.getState());
        assertEquals(state.getNonce(), validated.getNonce());
        assertEquals("/architecture", validated.getTargetRedirect());
    }

    @Test
    @DisplayName("Validate state cookie fails if state parameter is mismatched")
    public void testValidateStateCookieMismatch() {
        OAuthState state = linkedInOidcService.createAuthorizationRequest("/");

        assertThrows(OAuthAuthenticationException.class, () ->
                linkedInOidcService.validateStateCookie(state.getCookieValue(), "tampered-state-value"));
    }

    @Test
    @DisplayName("Validate state cookie fails if cookie signature is tampered")
    public void testValidateStateCookieTamperedSignature() {
        OAuthState state = linkedInOidcService.createAuthorizationRequest("/");
        String tampered = state.getCookieValue() + "bad";

        assertThrows(OAuthAuthenticationException.class, () ->
                linkedInOidcService.validateStateCookie(tampered, state.getState()));
    }

    @Test
    @DisplayName("Validate state cookie fails if cookie is null or empty")
    public void testValidateStateCookieEmpty() {
        assertThrows(OAuthAuthenticationException.class, () ->
                linkedInOidcService.validateStateCookie(null, "state"));
        assertThrows(OAuthAuthenticationException.class, () ->
                linkedInOidcService.validateStateCookie("", "state"));
    }

    @Test
    @DisplayName("ID token with correct issuer https://www.linkedin.com/oauth is accepted")
    public void testVerifyIdTokenCorrectIssuerAccepted() throws Exception {
        Date futureExp = Date.from(Instant.now().plusSeconds(3600));
        String validToken = createTestIdToken("https://www.linkedin.com/oauth", "test-client-id", "mock-nonce-123", futureExp, testRsaKey);

        LinkedInProfile profile = linkedInOidcService.verifyIdToken(validToken, "mock-nonce-123", testJwkSet);

        assertNotNull(profile);
        assertEquals("urn:li:person:mock-sub-123", profile.getSub());
        assertEquals("dev@hamarashops.ai", profile.getEmail());
        assertEquals("Dev User", profile.getName());
    }

    @Test
    @DisplayName("ID token with incorrect issuer is rejected")
    public void testVerifyIdTokenIncorrectIssuerRejected() throws Exception {
        Date futureExp = Date.from(Instant.now().plusSeconds(3600));
        String badIssuerToken = createTestIdToken("https://evil-idp.com", "test-client-id", "mock-nonce-123", futureExp, testRsaKey);

        OAuthAuthenticationException ex = assertThrows(OAuthAuthenticationException.class, () ->
                linkedInOidcService.verifyIdToken(badIssuerToken, "mock-nonce-123", testJwkSet));

        assertTrue(ex.getMessage().contains("issuer mismatch"));
    }

    @Test
    @DisplayName("ID token with audience mismatch is rejected")
    public void testVerifyIdTokenAudienceMismatchRejected() throws Exception {
        Date futureExp = Date.from(Instant.now().plusSeconds(3600));
        String badAudienceToken = createTestIdToken("https://www.linkedin.com/oauth", "different-client-id", "mock-nonce-123", futureExp, testRsaKey);

        OAuthAuthenticationException ex = assertThrows(OAuthAuthenticationException.class, () ->
                linkedInOidcService.verifyIdToken(badAudienceToken, "mock-nonce-123", testJwkSet));

        assertTrue(ex.getMessage().contains("audience mismatch"));
    }

    @Test
    @DisplayName("Expired ID token is rejected")
    public void testVerifyIdTokenExpiredRejected() throws Exception {
        Date pastExp = Date.from(Instant.now().minusSeconds(3600));
        String expiredToken = createTestIdToken("https://www.linkedin.com/oauth", "test-client-id", "mock-nonce-123", pastExp, testRsaKey);

        OAuthAuthenticationException ex = assertThrows(OAuthAuthenticationException.class, () ->
                linkedInOidcService.verifyIdToken(expiredToken, "mock-nonce-123", testJwkSet));

        assertTrue(ex.getMessage().contains("expired"));
    }

    @Test
    @DisplayName("ID token with mismatched nonce is rejected")
    public void testVerifyIdTokenInvalidNonceRejected() throws Exception {
        Date futureExp = Date.from(Instant.now().plusSeconds(3600));
        String invalidNonceToken = createTestIdToken("https://www.linkedin.com/oauth", "test-client-id", "wrong-nonce", futureExp, testRsaKey);

        OAuthAuthenticationException ex = assertThrows(OAuthAuthenticationException.class, () ->
                linkedInOidcService.verifyIdToken(invalidNonceToken, "expected-nonce", testJwkSet));

        assertTrue(ex.getMessage().contains("nonce mismatch"));
    }

    @Test
    @DisplayName("ID token with null nonce (LinkedIn OIDC behavior) is accepted")
    public void testVerifyIdTokenNullNonceAccepted() throws Exception {
        Date futureExp = Date.from(Instant.now().plusSeconds(3600));
        String nullNonceToken = createTestIdToken("https://www.linkedin.com/oauth", "test-client-id", null, futureExp, testRsaKey);

        LinkedInProfile profile = linkedInOidcService.verifyIdToken(nullNonceToken, "expected-nonce", testJwkSet);

        assertNotNull(profile);
        assertEquals("urn:li:person:mock-sub-123", profile.getSub());
        assertEquals("dev@hamarashops.ai", profile.getEmail());
    }

    @Test
    @DisplayName("ID token with invalid signature is rejected")
    public void testVerifyIdTokenInvalidSignatureRejected() throws Exception {
        RSAKey differentKey = new RSAKeyGenerator(2048).keyID("test-key-id-1").generate();
        Date futureExp = Date.from(Instant.now().plusSeconds(3600));
        String badSignatureToken = createTestIdToken("https://www.linkedin.com/oauth", "test-client-id", "mock-nonce-123", futureExp, differentKey);

        OAuthAuthenticationException ex = assertThrows(OAuthAuthenticationException.class, () ->
                linkedInOidcService.verifyIdToken(badSignatureToken, "mock-nonce-123", testJwkSet));

        assertTrue(ex.getMessage().contains("signature verification failed"));
    }
}
