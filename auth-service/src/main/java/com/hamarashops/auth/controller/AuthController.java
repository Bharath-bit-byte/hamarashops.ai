package com.hamarashops.auth.controller;

import com.hamarashops.auth.config.JwtAuthenticationFilter;
import com.hamarashops.auth.dto.LinkedInProfile;
import com.hamarashops.auth.dto.OAuthState;
import com.hamarashops.auth.dto.UserResponse;
import com.hamarashops.auth.exception.OAuthAuthenticationException;
import com.hamarashops.auth.model.entity.User;
import com.hamarashops.auth.service.JwtTokenService;
import com.hamarashops.auth.service.LinkedInOidcService;
import com.hamarashops.auth.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);
    public static final String STATE_COOKIE_NAME = "hs_oauth_state";

    private final LinkedInOidcService linkedInOidcService;
    private final UserService userService;
    private final JwtTokenService jwtTokenService;
    private final String frontendUrl;
    private final boolean cookieSecure;

    public AuthController(
            LinkedInOidcService linkedInOidcService,
            UserService userService,
            JwtTokenService jwtTokenService,
            @Value("${app.frontend-url:http://localhost:5173}") String frontendUrl,
            @Value("${app.cookie-secure:false}") boolean cookieSecure) {
        this.linkedInOidcService = linkedInOidcService;
        this.userService = userService;
        this.jwtTokenService = jwtTokenService;
        this.frontendUrl = frontendUrl;
        this.cookieSecure = cookieSecure;
    }

    /**
     * Step 1: Initiate LinkedIn OAuth 2.0 / OIDC Authorization
     * Generates state & nonce, saves secure correlation cookie, and redirects browser to LinkedIn.
     */
    @GetMapping("/linkedin/authorize")
    public void authorize(
            @RequestParam(value = "redirect", required = false, defaultValue = "/") String redirect,
            HttpServletResponse response) throws IOException {

        OAuthState oauthState = linkedInOidcService.createAuthorizationRequest(redirect);

        // Store anti-CSRF state & nonce in HttpOnly SameSite=Lax cookie (15 minutes)
        ResponseCookie stateCookie = ResponseCookie.from(STATE_COOKIE_NAME, oauthState.getCookieValue())
                .httpOnly(true)
                .secure(cookieSecure)
                .path("/api/v1/auth")
                .sameSite("Lax")
                .maxAge(900)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, stateCookie.toString());
        response.sendRedirect(oauthState.getAuthUrl());
    }

    /**
     * Alternative JSON endpoint for clients that prefer to trigger window.location redirect client-side.
     */
    @GetMapping("/linkedin/url")
    public ResponseEntity<Map<String, String>> getAuthorizationUrl(
            @RequestParam(value = "redirect", required = false, defaultValue = "/") String redirect,
            HttpServletResponse response) {

        OAuthState oauthState = linkedInOidcService.createAuthorizationRequest(redirect);

        ResponseCookie stateCookie = ResponseCookie.from(STATE_COOKIE_NAME, oauthState.getCookieValue())
                .httpOnly(true)
                .secure(cookieSecure)
                .path("/api/v1/auth")
                .sameSite("Lax")
                .maxAge(900)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, stateCookie.toString());
        return ResponseEntity.ok(Map.of("authorizationUrl", oauthState.getAuthUrl()));
    }

    /**
     * Step 2: LinkedIn Redirect Callback
     * Receives authorization code & state, verifies state, exchanges code for OIDC ID token,
     * cryptographically verifies token via LinkedIn JWKS, upserts user, establishes session cookie,
     * and redirects browser back to frontend.
     */
    @GetMapping("/linkedin/callback")
    public void callback(
            @RequestParam(value = "code", required = false) String code,
            @RequestParam(value = "state", required = false) String state,
            @RequestParam(value = "error", required = false) String error,
            @RequestParam(value = "error_description", required = false) String errorDescription,
            HttpServletRequest request,
            HttpServletResponse response) throws IOException {

        // 1. Handle user denied consent or LinkedIn errors
        if (error != null) {
            log.warn("LinkedIn OAuth callback returned error: {} - {}", error, errorDescription);
            clearStateCookie(response);
            String target = UriComponentsBuilder.fromUriString(frontendUrl + "/login")
                    .queryParam("error", "cancelled")
                    .queryParam("reason", error)
                    .build().toUriString();
            response.sendRedirect(target);
            return;
        }

        if (code == null || code.isBlank() || state == null || state.isBlank()) {
            clearStateCookie(response);
            response.sendRedirect(frontendUrl + "/login?error=missing_code");
            return;
        }

        // 2. Validate Anti-CSRF state cookie
        String stateCookieValue = extractCookie(request, STATE_COOKIE_NAME);
        OAuthState validatedState;
        try {
            validatedState = linkedInOidcService.validateStateCookie(stateCookieValue, state);
        } catch (OAuthAuthenticationException ex) {
            log.warn("State verification failed: {}", ex.getMessage());
            clearStateCookie(response);
            String target = UriComponentsBuilder.fromUriString(frontendUrl + "/login")
                    .queryParam("error", "invalid_state")
                    .queryParam("message", URLEncoder.encode(ex.getMessage(), StandardCharsets.UTF_8))
                    .build().toUriString();
            response.sendRedirect(target);
            return;
        }

        // Clear the state cookie once used
        clearStateCookie(response);

        // 3. Exchange code for tokens and cryptographically verify OIDC ID token
        LinkedInProfile profile;
        try {
            profile = linkedInOidcService.exchangeCodeAndVerify(code, validatedState.getNonce());
        } catch (Exception ex) {
            log.error("Failed to verify LinkedIn tokens or fetch identity: {}", ex.getMessage());
            String target = UriComponentsBuilder.fromUriString(frontendUrl + "/login")
                    .queryParam("error", "auth_failed")
                    .queryParam("message", URLEncoder.encode(ex.getMessage(), StandardCharsets.UTF_8))
                    .build().toUriString();
            response.sendRedirect(target);
            return;
        }

        // 4. Find or create HamaraShops user
        User user;
        try {
            user = userService.processLinkedInUser(
                    profile.getSub(),
                    profile.getEmail(),
                    profile.getEmailVerified(),
                    profile.getFirstName(),
                    profile.getLastName(),
                    profile.getName(),
                    profile.getPicture()
            );
        } catch (Exception ex) {
            log.error("Error persisting user profile: {}", ex.getMessage());
            String target = UriComponentsBuilder.fromUriString(frontendUrl + "/login")
                    .queryParam("error", "user_creation_failed")
                    .queryParam("message", URLEncoder.encode(ex.getMessage(), StandardCharsets.UTF_8))
                    .build().toUriString();
            response.sendRedirect(target);
            return;
        }

        // 5. Generate secure HamaraShops Session JWT
        String token = jwtTokenService.generateToken(user);
        long maxAgeSeconds = jwtTokenService.getExpirationMs() / 1000;

        // Set HttpOnly, SameSite=Lax, Secure session cookie
        ResponseCookie authCookie = ResponseCookie.from(JwtAuthenticationFilter.AUTH_COOKIE_NAME, token)
                .httpOnly(true)
                .secure(cookieSecure)
                .path("/")
                .sameSite("Lax")
                .maxAge(maxAgeSeconds)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, authCookie.toString());

        // 6. Redirect user back to target frontend route
        String targetRedirect = validatedState.getTargetRedirect();
        if (targetRedirect == null || targetRedirect.isBlank() || targetRedirect.startsWith("http")) {
            targetRedirect = "/";
        }
        String redirectUrl = UriComponentsBuilder.fromUriString(frontendUrl + targetRedirect)
                .queryParam("auth", "success")
                .build().toUriString();

        response.sendRedirect(redirectUrl);
    }

    /**
     * Step 3: Current Authenticated User Identity
     */
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof User user)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(UserResponse.fromEntity(user));
    }

    /**
     * Step 4: Logout
     * Invalidates the HttpOnly session cookie.
     */
    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpServletResponse response) {
        ResponseCookie clearAuthCookie = ResponseCookie.from(JwtAuthenticationFilter.AUTH_COOKIE_NAME, "")
                .httpOnly(true)
                .secure(cookieSecure)
                .path("/")
                .sameSite("Lax")
                .maxAge(0)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, clearAuthCookie.toString());
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    private void clearStateCookie(HttpServletResponse response) {
        ResponseCookie clearState = ResponseCookie.from(STATE_COOKIE_NAME, "")
                .httpOnly(true)
                .secure(cookieSecure)
                .path("/api/v1/auth")
                .sameSite("Lax")
                .maxAge(0)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, clearState.toString());
    }

    private String extractCookie(HttpServletRequest request, String cookieName) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookieName.equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}
