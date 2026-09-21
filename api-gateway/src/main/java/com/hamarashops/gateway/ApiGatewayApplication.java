package com.hamarashops.gateway;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@SpringBootApplication
public class ApiGatewayApplication {

    @Value("${CONTENT_SERVICE_URL:http://localhost:8081}")
    private String contentServiceUrl;

    @Value("${BUSINESS_SERVICE_URL:http://localhost:8082}")
    private String businessServiceUrl;

    @Value("${CONTACT_SERVICE_URL:http://localhost:8083}")
    private String contactServiceUrl;

    @Value("${CORS_ALLOWED_ORIGINS:http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173,http://127.0.0.1:5174,http://localhost:3000,https://frontend-27562154208.asia-south1.run.app,https://hamarashops.com,https://www.hamarashops.com}")
    private String allowedOrigins;

    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        List<String> origins = Arrays.stream(allowedOrigins.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
        corsConfig.setAllowedOrigins(origins);
        corsConfig.setMaxAge(3600L);
        corsConfig.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"));
        corsConfig.setAllowedHeaders(Arrays.asList("*"));
        corsConfig.setAllowCredentials(false);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);

        return new CorsWebFilter(source);
    }

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("content-service-routes", r -> r.path(
                        "/api/v1/products", "/api/v1/products/**",
                        "/api/v1/solutions", "/api/v1/solutions/**",
                        "/api/v1/services", "/api/v1/services/**",
                        "/api/v1/insights", "/api/v1/insights/**",
                        "/api/v1/company", "/api/v1/company/**",
                        "/api/v1/partners", "/api/v1/partners/**",
                        "/api/v1/search", "/api/v1/search/**",
                        "/api/v1/case-studies", "/api/v1/case-studies/**",
                        "/api/v1/testimonials", "/api/v1/testimonials/**",
                        "/api/v1/integrations", "/api/v1/integrations/**",
                        "/api/v1/metrics", "/api/v1/metrics/**",
                        "/api/v1/assistant", "/api/v1/assistant/**"
                ).uri(contentServiceUrl))
                .route("business-service-routes", r -> r.path(
                        "/api/v1/industries", "/api/v1/industries/**",
                        "/api/v1/careers", "/api/v1/careers/**"
                ).uri(businessServiceUrl))
                .route("contact-service-routes", r -> r.path(
                        "/api/v1/contact", "/api/v1/contact/**"
                ).uri(contactServiceUrl))
                .build();
    }
}
