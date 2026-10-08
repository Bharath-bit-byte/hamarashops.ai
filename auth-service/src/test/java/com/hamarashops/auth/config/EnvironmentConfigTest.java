package com.hamarashops.auth.config;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.env.Environment;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("local")
public class EnvironmentConfigTest {

    private static final Logger log = LoggerFactory.getLogger(EnvironmentConfigTest.class);

    @Autowired
    private Environment environment;

    @Test
    @DisplayName("Verify Spring Boot resolves local environment configuration correctly")
    void verifyEnvironmentConfigurationResolution() {
        String clientId = environment.getProperty("linkedin.client-id");
        String clientSecret = environment.getProperty("linkedin.client-secret");
        String redirectUri = environment.getProperty("linkedin.redirect-uri");
        String jwtSecret = environment.getProperty("security.jwt.secret");
        String frontendUrl = environment.getProperty("app.frontend-url");

        assertNotNull(clientId, "linkedin.client-id must be resolved");
        assertFalse(clientId.isBlank(), "linkedin.client-id must not be blank");

        assertNotNull(clientSecret, "linkedin.client-secret must be resolved");
        assertFalse(clientSecret.isBlank(), "linkedin.client-secret must not be blank");

        assertNotNull(redirectUri, "linkedin.redirect-uri must be resolved");
        assertFalse(redirectUri.isBlank(), "linkedin.redirect-uri must not be blank");
        assertTrue(redirectUri.startsWith("http"), "linkedin.redirect-uri must be a valid HTTP(S) URI");

        assertNotNull(jwtSecret, "security.jwt.secret must be resolved");
        assertTrue(jwtSecret.length() >= 32, "security.jwt.secret must have sufficient entropy");

        assertNotNull(frontendUrl, "app.frontend-url must be resolved");
        assertEquals("http://localhost:5173", frontendUrl);

        // Safe status outputs conforming to prompt requirements (NEVER logging secret values)
        log.info("LINKEDIN_CLIENT_ID: CONFIGURED");
        log.info("LINKEDIN_CLIENT_SECRET: CONFIGURED");
        log.info("LINKEDIN_REDIRECT_URI: CONFIGURED");
        log.info("JWT_SECRET: CONFIGURED");
        log.info("FRONTEND_URL: CONFIGURED");
    }
}
