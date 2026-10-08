package com.hamarashops.gateway;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.web.reactive.server.WebTestClient;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class ApiGatewayCorsTest {

    @LocalServerPort
    private int port;

    private WebTestClient webTestClient;

    @BeforeEach
    public void setUp() {
        this.webTestClient = WebTestClient.bindToServer()
                .baseUrl("http://localhost:" + port)
                .build();
    }

    @Test
    @DisplayName("Preflight CORS OPTIONS /api/v1/industries with https://hamarashops.com succeeds with 200 OK and CORS header")
    public void testPreflightCors_Industries_ProductionOrigin() {
        webTestClient.options()
                .uri("/api/v1/industries")
                .header("Origin", "https://hamarashops.com")
                .header("Access-Control-Request-Method", "GET")
                .header("Access-Control-Request-Headers", "Content-Type,Accept")
                .exchange()
                .expectStatus().isOk()
                .expectHeader().valueEquals("Access-Control-Allow-Origin", "https://hamarashops.com")
                .expectHeader().valueEquals("Access-Control-Max-Age", "3600");
    }

    @Test
    @DisplayName("Preflight CORS OPTIONS /api/v1/company with https://hamarashops.com succeeds with 200 OK and CORS header")
    public void testPreflightCors_Company_ProductionOrigin() {
        webTestClient.options()
                .uri("/api/v1/company")
                .header("Origin", "https://hamarashops.com")
                .header("Access-Control-Request-Method", "GET")
                .header("Access-Control-Request-Headers", "Content-Type,Accept")
                .exchange()
                .expectStatus().isOk()
                .expectHeader().valueEquals("Access-Control-Allow-Origin", "https://hamarashops.com")
                .expectHeader().valueEquals("Access-Control-Max-Age", "3600");
    }

    @Test
    @DisplayName("Preflight CORS OPTIONS /api/v1/industries with https://www.hamarashops.com succeeds with 200 OK and CORS header")
    public void testPreflightCors_WwwProductionOrigin() {
        webTestClient.options()
                .uri("/api/v1/industries")
                .header("Origin", "https://www.hamarashops.com")
                .header("Access-Control-Request-Method", "GET")
                .header("Access-Control-Request-Headers", "Content-Type,Accept")
                .exchange()
                .expectStatus().isOk()
                .expectHeader().valueEquals("Access-Control-Allow-Origin", "https://www.hamarashops.com");
    }

    @Test
    @DisplayName("Preflight CORS OPTIONS with localhost development origin succeeds with 200 OK and CORS header")
    public void testPreflightCors_LocalhostOrigin() {
        webTestClient.options()
                .uri("/api/v1/industries")
                .header("Origin", "http://localhost:5173")
                .header("Access-Control-Request-Method", "GET")
                .header("Access-Control-Request-Headers", "Content-Type,Accept")
                .exchange()
                .expectStatus().isOk()
                .expectHeader().valueEquals("Access-Control-Allow-Origin", "http://localhost:5173");
    }

    @Test
    @DisplayName("Preflight CORS OPTIONS with unauthorized origin (https://evil-attacker.com) does NOT receive Access-Control-Allow-Origin")
    public void testPreflightCors_UnauthorizedOrigin_Rejected() {
        webTestClient.options()
                .uri("/api/v1/industries")
                .header("Origin", "https://evil-attacker.com")
                .header("Access-Control-Request-Method", "GET")
                .header("Access-Control-Request-Headers", "Content-Type,Accept")
                .exchange()
                .expectHeader().doesNotExist("Access-Control-Allow-Origin");
    }
}
