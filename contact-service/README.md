# HamaraShops Contact Service (`contact-service`)

## 1. Overview
The **Contact Service** is a Spring Boot microservice providing verified contact details and stateless inquiry validation for **HamaraShops.ai**.

- **Java Version:** Java 21 (Eclipse Temurin)
- **Spring Boot Version:** 4.1.0
- **Spring Cloud Version:** 2025.1.2
- **Default Local Port:** `8083`

> [!NOTE]
> This endpoint currently performs stateless request validation and returns a receipt. No database, email delivery, or external CRM integration is implemented.

---

## 2. API Endpoints

### Contact Metadata
- `GET /api/v1/contact` — Retrieve verified company contact details, global hub description, and inquiry categories.

### Inquiry Submission (Stateless Receipt Validation)
- `POST /api/v1/contact/inquire` — Accept inquiry DTO payload and return receipt confirmation.

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
- `GET http://localhost:8083/actuator/health`
