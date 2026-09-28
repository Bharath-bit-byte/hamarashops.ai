# HamaraShops Business Service (`business-service`)

## 1. Overview
The **Business Service** is a Spring Boot microservice delivering verified **Industry Verticals** and **Career Openings** datasets for **HamaraShops.ai**.

- **Java Version:** Java 21 (Eclipse Temurin)
- **Spring Boot Version:** 4.1.0
- **Spring Cloud Version:** 2025.1.2
- **Default Local Port:** `8082`

---

## 2. API Endpoints

### Industries
- `GET /api/v1/industries` — List all 6 verified industry verticals
- `GET /api/v1/industries/{slug}` — Retrieve industry vertical details by slug/id

### Careers
- `GET /api/v1/careers` — List all 5 verified career positions
- `GET /api/v1/careers/{id}` — Retrieve career opening details by ID or slug

---

## 3. Local Development & Build

### Build Service
```bash
mvn clean package -DskipTests
```

### Run Service
```bash
mvn spring-boot:run
```

### Actuator Health
- `GET http://localhost:8082/actuator/health`
