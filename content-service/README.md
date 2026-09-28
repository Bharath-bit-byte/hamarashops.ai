# HamaraShops Content Service (`content-service`)

## Overview
The **Content Service** is a stateless, in-memory JSON-loaded microservice for **HamaraShops.ai**. It serves product catalogs, solution suites, managed services, industry insights, company profiles, partner ecosystems, customer testimonials, and platform integrations.

- **Java Version:** Java 21 (Eclipse Temurin)
- **Spring Boot Version:** 4.1.0
- **Default Local Port:** `8081`

---

## REST Endpoints
- `GET /api/v1/products`
- `GET /api/v1/solutions`
- `GET /api/v1/services`
- `GET /api/v1/insights`
- `GET /api/v1/company`
- `GET /api/v1/partners`
- `GET /api/v1/testimonials`
- `GET /api/v1/integrations`
- `GET /api/v1/search?q={query}`
