# HamaraShops API Gateway (`api-gateway`)

## 1. Overview
The **API Gateway** is the single public entry point for the **HamaraShops.ai** microservices architecture. It handles request routing, centralized Cross-Origin Resource Sharing (CORS), security headers, and direct HTTP forwarding to downstream microservices.

- **Java Version:** Java 21 (Eclipse Temurin)
- **Spring Boot Version:** 4.1.0
- **Spring Cloud Version:** 2025.1.2
- **Default Local Port:** `8080` (Cloud Run dynamically binds to `${PORT}`)

---

## 2. Routing Architecture

### Local Profile (`spring.profiles.active=local`)
- **Routing Engine:** Spring Cloud Gateway Direct HTTP Routing
- **Routes:**
  - Content Suite (`/api/v1/products/**`, `/api/v1/solutions/**`, `/api/v1/services/**`, `/api/v1/insights/**`, `/api/v1/company/**`, `/api/v1/partners/**`, `/api/v1/search/**`, `/api/v1/case-studies/**`, `/api/v1/testimonials/**`, `/api/v1/integrations/**`, `/api/v1/metrics/**`) $\rightarrow$ `http://localhost:8081`
  - Business Suite (`/api/v1/industries/**`, `/api/v1/careers/**`) $\rightarrow$ `http://localhost:8082`
  - Contact Inquiries (`/api/v1/contact/**`) $\rightarrow$ `http://localhost:8083`

### Cloud Profile (`spring.profiles.active=cloud`)
- **Routing Engine:** Direct environment-driven Cloud Run URLs
- **Environment Variables:**
  - `CONTENT_SERVICE_URL`
  - `BUSINESS_SERVICE_URL`
  - `CONTACT_SERVICE_URL`

---

## 3. Local Development & Commands

### Prerequisites
1. Installed Java 21 and Maven 3.9+.
2. Downstream services running on their assigned ports (8081, 8082, 8083).

### Build & Package
```bash
mvn clean package -DskipTests
```

### Run Locally (Local Profile)
```bash
mvn spring-boot:run
```
*(Or specify profile explicitly: `mvn spring-boot:run -Dspring-boot.run.profiles=local`)*

### Verify Health Check
- **Actuator Health Check:** `http://localhost:8080/actuator/health` (HTTP 200 `{"status":"UP"}`)

---

## 4. Docker & Google Cloud Run

### Docker Multi-Stage Build
```bash
docker build -t <REGION>-docker.pkg.dev/<PROJECT_ID>/<IMAGE_REPOSITORY>/api-gateway:<IMAGE_TAG> .
```

### Google Cloud Run Deployment
Deploy using `cloud.yml` manifest template or `gcloud`:
```bash
gcloud run deploy api-gateway \
  --image <REGION>-docker.pkg.dev/<PROJECT_ID>/<IMAGE_REPOSITORY>/api-gateway:<IMAGE_TAG> \
  --set-env-vars SPRING_PROFILES_ACTIVE=cloud,CONTENT_SERVICE_URL=$CONTENT_URL,BUSINESS_SERVICE_URL=$BUSINESS_URL,CONTACT_SERVICE_URL=$CONTACT_URL
```
