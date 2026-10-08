package com.hamarashops.auth.service;

import com.hamarashops.auth.model.entity.User;
import com.hamarashops.auth.serviceimpl.JwtTokenServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class JwtTokenServiceTest {

    private JwtTokenService jwtTokenService;
    private static final String TEST_SECRET = "0123456789012345678901234567890123456789012345678901234567890123";

    @BeforeEach
    public void setUp() {
        jwtTokenService = new JwtTokenServiceImpl(TEST_SECRET, 3600000L); // 1 hour
    }

    @Test
    @DisplayName("Generate token and validate extracted claims")
    public void testGenerateAndValidateToken() {
        User user = new User("li-12345", "test@hamarashops.ai", "Test", "User", "Test User", "https://img.com/avatar.png", true);
        user.setId(99L);

        String token = jwtTokenService.generateToken(user);
        assertNotNull(token);
        assertTrue(jwtTokenService.validateToken(token));

        assertEquals("test@hamarashops.ai", jwtTokenService.extractEmail(token));
        assertEquals(99L, jwtTokenService.extractUserId(token));
    }

    @Test
    @DisplayName("Invalid token fails validation")
    public void testInvalidTokenFails() {
        assertFalse(jwtTokenService.validateToken("invalid.token.string"));
        assertFalse(jwtTokenService.validateToken(""));
        assertFalse(jwtTokenService.validateToken(null));
    }

    @Test
    @DisplayName("Expired token fails validation")
    public void testExpiredTokenFails() {
        JwtTokenService expiredService = new JwtTokenServiceImpl(TEST_SECRET, -1000L); // Already expired
        User user = new User("li-12345", "test@hamarashops.ai", "Test", "User", "Test User", null, true);
        user.setId(1L);

        String token = expiredService.generateToken(user);
        assertFalse(expiredService.validateToken(token));
    }
}
