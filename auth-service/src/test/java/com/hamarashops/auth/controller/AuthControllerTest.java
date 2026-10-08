package com.hamarashops.auth.controller;

import com.hamarashops.auth.dto.OAuthState;
import com.hamarashops.auth.exception.GlobalExceptionHandler;
import com.hamarashops.auth.model.entity.User;
import com.hamarashops.auth.service.JwtTokenService;
import com.hamarashops.auth.service.LinkedInOidcService;
import com.hamarashops.auth.service.UserService;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Collections;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class AuthControllerTest {

    private MockMvc mockMvc;
    private LinkedInOidcService linkedInOidcService;
    private UserService userService;
    private JwtTokenService jwtTokenService;

    @BeforeEach
    public void setUp() {
        linkedInOidcService = mock(LinkedInOidcService.class);
        userService = mock(UserService.class);
        jwtTokenService = mock(JwtTokenService.class);

        AuthController controller = new AuthController(
                linkedInOidcService,
                userService,
                jwtTokenService,
                "http://localhost:5173",
                false
        );

        this.mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    @DisplayName("GET /api/v1/auth/linkedin/authorize sets state cookie and redirects to LinkedIn")
    public void testAuthorizeRedirect() throws Exception {
        OAuthState state = new OAuthState("state123", "nonce123", "/", "https://www.linkedin.com/oauth/v2/authorization?state=state123", "cookiePayload.signature");
        when(linkedInOidcService.createAuthorizationRequest(anyString())).thenReturn(state);

        mockMvc.perform(get("/api/v1/auth/linkedin/authorize").param("redirect", "/about"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("https://www.linkedin.com/oauth/v2/authorization?state=state123"))
                .andExpect(cookie().exists("hs_oauth_state"))
                .andExpect(cookie().httpOnly("hs_oauth_state", true));
    }

    @Test
    @DisplayName("GET /api/v1/auth/linkedin/url returns JSON authorization URL")
    public void testGetAuthorizationUrlJson() throws Exception {
        OAuthState state = new OAuthState("state_json", "nonce_json", "/contact", "https://www.linkedin.com/oauth/v2/authorization?state=state_json", "payload.sig");
        when(linkedInOidcService.createAuthorizationRequest(anyString())).thenReturn(state);

        mockMvc.perform(get("/api/v1/auth/linkedin/url").param("redirect", "/contact"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.authorizationUrl").value("https://www.linkedin.com/oauth/v2/authorization?state=state_json"))
                .andExpect(cookie().exists("hs_oauth_state"));
    }

    @Test
    @DisplayName("GET /api/v1/auth/me without authentication principal returns 401")
    public void testGetMeUnauthenticated() throws Exception {
        mockMvc.perform(get("/api/v1/auth/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("GET /api/v1/auth/me with principal returns 200 OK with User profile")
    public void testGetMeAuthenticated() throws Exception {
        User user = new User("li_999", "charan@hamarashops.ai", "Charan", "Ranga", "Charan Ranga", "https://img.com/me.png", true);
        user.setId(5L);

        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                user, null, Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
        );

        mockMvc.perform(get("/api/v1/auth/me").principal(auth))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(5))
                .andExpect(jsonPath("$.email").value("charan@hamarashops.ai"))
                .andExpect(jsonPath("$.name").value("Charan Ranga"))
                .andExpect(jsonPath("$.linkedinId").value("li_999"));
    }

    @Test
    @DisplayName("POST /api/v1/auth/logout clears auth cookie")
    public void testLogoutClearsCookie() throws Exception {
        mockMvc.perform(post("/api/v1/auth/logout"))
                .andExpect(status().isOk())
                .andExpect(cookie().maxAge("hs_auth_token", 0))
                .andExpect(jsonPath("$.message").value("Logged out successfully"));
    }
}
