# HamaraShops.ai — LinkedIn OIDC Authentication Architecture & Implementation Plan

> **Document Version:** 1.0.0  
> **Target Platform:** HamaraShops.ai (React 19 Frontend + Spring Boot 4.x / Spring Cloud 2025.x Microservices)  
> **Auth Protocol:** OpenID Connect (OIDC) / OAuth 2.0 Authorization Code Grant with Anti-CSRF State & Server-Side Token Exchange  
> **Status:** Architectural Blueprint & Implementation Specification (No code changes committed yet)

---

## 1. Executive Summary

This document establishes the end-to-end architectural blueprint for adding **Sign In with LinkedIn using OpenID Connect (OIDC)** to the **HamaraShops.ai** platform.

### Critical Discovery from Deep Repository Inspection
An exhaustive audit across every directory, build manifest, and configuration file in `d:\HamaraShops-Ai` verified that:
1. **No Authentication Layer Exists:** There is currently no `auth-service`, `user-service`, Spring Security configuration, JWT utility, or session state.
2. **No User Persistence Exists:** There is no database (MySQL, PostgreSQL, MongoDB, H2), no Spring Data JPA repository, no Flyway/Liquibase migration, and no `User` entity. Existing backend microservices (`content-service`, `business-service`) serve static datasets loaded from in-memory JSON files, while `contact-service` forwards inquiry payloads to the external Resend REST API.
3. **No Frontend Auth UI Exists:** The React 19 frontend contains no login/registration page, no protected route guards, no auth context, and no token storage in `localStorage`/`sessionStorage`.

Rather than refactoring a legacy user table or retrofitting an existing auth system, this task introduces the **HamaraShops Core Authentication Architecture**. This plan specifies an enterprise-grade, cloud-native **`auth-service`** microservice that fits the existing architecture:
- Routed through the existing **Spring Cloud WebFlux API Gateway** (`api-gateway`).
- Standardized under the `/api/v1/auth/**` URL prefix.
- Deployed independently to **Google Cloud Run** with Docker.
- Consumed by the **React 19 SPA** frontend via centralized Axios interceptors and React Context.

---

## 2. Existing Project Architecture

The HamaraShops.ai repository is structured as a distributed microservices platform deployed on Google Cloud Run:

```
HamaraShops-Ai/
├── api-gateway/            # Spring Cloud Gateway WebFlux (Port 8080)
├── business-service/       # Industries & Careers Microservice (Port 8082, In-Memory JSON)
├── contact-service/        # Lead Inquiries & Resend Email (Port 8083, Stateless)
├── content-service/        # AI Products & Solutions Microservice (Port 8081, In-Memory JSON)
└── frontend/               # React 19 + Vite SPA (Port 5173 dev / Nginx Port 80 prod)
```

### Technology Stacks
- **Backend Stack:** Java 21 (Eclipse Temurin), Spring Boot `4.1.0`, Spring Cloud `2025.1.2`, Apache Maven `3.9.9`.
- **Frontend Stack:** React `19.0.0`, Vite `5.4.11`, React Router DOM `7.1.5`, Axios `1.7.9`, Tailwind CSS `3.4.17`, Framer Motion `12.4.3`, Lucide Icons `0.475.0`.
- **Infrastructure & Deployment:** Multi-stage container builds (`Dockerfile`), Google Cloud Run Knative manifests (`cloud.yml`), Google Artifact Registry (`asia-south1-docker.pkg.dev` and `us-central1-docker.pkg.dev`).
- **Ingress Strategy:** Single ingress through `api-gateway` on port `8080` (or Cloud Run `${PORT}`), routing to internal microservice topographies via direct HTTP.

---

## 3. Current Authentication Architecture

| Component | Status in Repository | Evidence / File Reference |
| :--- | :---: | :--- |
| **Auth-Service** | **DOES NOT EXIST** | Verified via recursive directory scan and Maven root inspection. |
| **User-Service** | **DOES NOT EXIST** | No user management or account service exists. |
| **Spring Security** | **DOES NOT EXIST** | `spring-boot-starter-security` is absent in all `pom.xml` files. |
| **OAuth2 Client** | **DOES NOT EXIST** | No Spring Security OAuth2 or third-party client dependencies exist. |
| **JWT Library** | **DOES NOT EXIST** | Neither `jjwt` nor `nimbus-jose-jwt` is present. |
| **Session Policy** | **STATELESS** | All microservices run stateless HTTP endpoints. |
| **Mock Auth Documentation** | **PRESENT (MOCK ONLY)** | `frontend/src/pages/ApiDocs.jsx` (lines 9–10) documents `/api/v1/auth/token`, but no backing backend implementation exists. |

---

## 4. Current Frontend Authentication Flow

- **Login Page:** None. React Router in `frontend/src/App.jsx` registers only informational/marketing routes (`/`, `/about`, `/industries`, `/use-cases`, `/architecture`, `/business-value`, `/contact`, `/our-journey`, `/api-docs`, `/integrations`, `/ethics`, `/privacy`, `/sales-terms`).
- **Protected Routes:** None. All routes are publicly accessible without authentication checks.
- **Authentication State Management:** None. No React Context, Zustand store, or Redux store is defined for authentication.
- **Token Management:** `localStorage` and `sessionStorage` are completely unused for credentials or bearer tokens.
- **HTTP Client Interceptor:** `frontend/src/services/apiClient.js` configures an Axios instance with base URL `VITE_API_BASE_URL` (defaulting to `http://localhost:8080/api/v1`). It unwraps response bodies (`response.data`) but does not inject `Authorization` headers.
- **Header Navigation:** `frontend/src/components/common/Header.jsx` renders marketing navigation links, a search trigger, and an appointment booking trigger ("Schedule Appointment"). It has no user avatar, account menu, or login button.

---

## 5. Current Backend Authentication Flow

- **Traffic Entry:** Inbound HTTP traffic targets `api-gateway` (Port `8080`).
- **Gateway Filter Chain:** The gateway evaluates path predicates in `ApiGatewayApplication.java` and `application.yml`, applying a reactive CORS `WebFilter`.
- **Downstream Dispatch:** If a path matches `/api/v1/products/**`, `/api/v1/industries/**`, or `/api/v1/contact/**`, the request is proxied directly via HTTP to the respective downstream microservice without authentication or authorization checks.
- **Security Interceptors:** None. Downstream microservices do not inspect headers for bearer tokens or user identity.

---

## 6. Current Database/User Architecture

- **Database Engine:** None. No relational (MySQL, PostgreSQL) or NoSQL database is configured.
- **ORM / Persistence:** No Spring Data JPA, Hibernate, or JDBC dependencies exist in any `pom.xml`.
- **Schema Migrations:** No migration scripts (Flyway `src/main/resources/db/migration` or Liquibase) exist in the repository.
- **User Entity:** Does not exist.
- **Storage Strategy for LinkedIn OIDC:** To persist authenticated LinkedIn users, a persistent storage layer must be introduced into the new `auth-service`:
  - **Local Development:** H2 in-memory/file database (or local MySQL container).
  - **Production:** Google Cloud SQL (MySQL 8.0) connected via Google Cloud Run Cloud SQL socket or managed connection URL.

---

## 7. LinkedIn OIDC Requirements

HamaraShops holds a registered LinkedIn Developer application configured with the product:
**"Sign In with LinkedIn using OpenID Connect"**

### Required OIDC Scopes (Phase 1)
- `openid`: Mandatory for OIDC authentication. Instructs LinkedIn to generate an ID Token (JWT).
- `profile`: Requests basic member profile details (`sub`, `name`, `given_name`, `family_name`, `picture`).
- `email`: Requests the user's primary verified email address (`email`, `email_verified`).

### Official LinkedIn OIDC Endpoints
- **Authorization URL:** `https://www.linkedin.com/oauth/v2/authorization`
- **Token Exchange URL:** `https://www.linkedin.com/oauth/v2/accessToken`
- **Userinfo Endpoint:** `https://api.linkedin.com/v2/userinfo`
- **JWKS Endpoint (Token Signature Verification):** `https://www.linkedin.com/oauth/openid/jwks`
- **Issuer Identifier:** `https://www.linkedin.com`

### Target Claims Extracted from LinkedIn ID Token / Userinfo
| Claim Key | Semantic Meaning | Stored in HamaraShops User Model |
| :--- | :--- | :--- |
| `sub` | Unique, immutable LinkedIn member ID | `linkedin_id` (Unique, Indexed) |
| `given_name` | First name | `first_name` |
| `family_name` | Last name | `last_name` |
| `name` | Full formatted name | `name` |
| `email` | Primary email address | `email` (Unique, Indexed) |
| `email_verified`| Whether the email is verified by LinkedIn | `email_verified` (Boolean) |
| `picture` | Profile avatar URL | `picture_url` |

---

## 8. Recommended LinkedIn OIDC Architecture

To preserve the clean separation of concerns and maintain the high-throughput performance of the reactive API Gateway, we establish a dedicated **`auth-service`**:

```
+-----------------------------------------------------------------------------------+
|                                 CLIENT LAYER                                      |
|                                                                                   |
|      +--------------------------------------------------------------------+       |
|      |                        React 19 SPA Frontend                       |       |
|      |         URL: https://frontend-27562154208.asia-south1.run.app      |       |
|      |         - AuthContext (user, token, login, logout)                 |       |
|      |         - Header Account Menu / Avatar                             |       |
|      |         - AuthCallback Route (/auth/callback)                      |       |
|      +----------------------------------+---------------------------------+       |
+-----------------------------------------|-----------------------------------------+
                                          | HTTPS / REST JSON
                                          v
+-----------------------------------------------------------------------------------+
|                              API GATEWAY LAYER                                    |
|                                                                                   |
|      +--------------------------------------------------------------------+       |
|      |                    Spring Cloud API Gateway                        |       |
|      |        URL: https://api-gateway-27562154208.asia-south1.run.app   |       |
|      |        Port: 8080 | WebFlux Reactive Direct HTTP Forwarding        |       |
|      +-----+-----------------+------------------+-------------------+-----+       |
+------------|-----------------|------------------|-------------------|-------------+
             |                 |                  |                   |
             | /api/v1/auth/** | /api/v1/products | /api/v1/careers   | /api/v1/contact
             v                 v                  v                   v
   +--------------------+  +------------+  +--------------+  +-----------------+
   |    Auth Service    |  |  Content   |  |   Business   |  |     Contact     |
   | (OIDC, JWT, Users) |  |  Service   |  |   Service    |  |     Service     |
   |     Port: 8084     |  | Port: 8081 |  |  Port: 8082  |  |   Port: 8083    |
   +---------+----------+  +------------+  +--------------+  +-----------------+
             |
             v
   +--------------------+
   |   Cloud SQL MySQL  |
   |   (Users Table)    |
   +--------------------+
```

### Architectural Rationale
1. **Gateway Remains Lightweight:** `api-gateway` operates on reactive Netty. Running database drivers (JDBC/JPA) and cryptographic token validation inside the gateway introduces blocking threads and architectural coupling. Keeping it as a pure reverse proxy matches its existing design.
2. **Autonomous Domain Microservices:** `content-service`, `business-service`, and `contact-service` remain untouched and independently deployable.
3. **Clean Microservice Packaging:** `auth-service` encapsulates all LinkedIn OIDC communication, cryptographic validation, user persistence, and HamaraShops application JWT issuance.

---

## 9. Complete OAuth/OIDC Flow

We adopt the **Backend-Orchestrated Code Exchange with Frontend Callback Flow**:

```
[User] 
  │ 1. Clicks "Sign in with LinkedIn"
  ▼
[React 19 Frontend]
  │ 2. GET /api/v1/auth/linkedin/url
  ▼
[API Gateway :8080] ──> [Auth-Service :8084]
  │ 3. Generates cryptographically secure `state` parameter
  │ 4. Constructs LinkedIn Authorization URL:
  │    https://www.linkedin.com/oauth/v2/authorization
  │      ?response_type=code
  │      &client_id=${LINKEDIN_CLIENT_ID}
  │      &redirect_uri=${LINKEDIN_REDIRECT_URI}
  │      &state=${STATE}
  │      &scope=openid%20profile%20email
  ▼
[React 19 Frontend]
  │ 5. Stores `state` in sessionStorage for anti-CSRF matching
  │ 6. Redirects browser window: window.location.href = authUrl
  ▼
[LinkedIn Authentication & Consent Dialog]
  │ 7. User authenticates on LinkedIn & grants consent
  │ 8. LinkedIn redirects browser back to:
  │    ${LINKEDIN_REDIRECT_URI} (e.g., https://hamarashops.com/auth/callback?code=XYZ&state=ABC)
  ▼
[React 19 Frontend - AuthCallback Page]
  │ 9. Validates returned `state` against sessionStorage `state`
  │ 10. POST /api/v1/auth/linkedin/callback { code: "XYZ", state: "ABC" }
  ▼
[API Gateway :8080] ──> [Auth-Service :8084]
  │ 11. Validates `state`
  │ 12. Executes POST https://www.linkedin.com/oauth/v2/accessToken
  │     (client_id, client_secret, code, redirect_uri, grant_type=authorization_code)
  │ 13. Receives { access_token, id_token, expires_in }
  │ 14. Validates ID Token (signature against LinkedIn JWKS, issuer, aud, exp)
  │ 15. Extracts member claims: sub, email, name, given_name, family_name, picture
  │ 16. Queries users table:
  │     - If exists by linkedin_id -> update last_login and picture
  │     - If exists by verified email -> link linkedin_id to existing account
  │     - If new user -> insert user record
  │ 17. Generates signed HamaraShops Session JWT (HMAC-SHA256)
  │ 18. Returns HTTP 200 { token: "HS_JWT...", user: { id, email, name, picture } }
  ▼
[React 19 Frontend]
  │ 19. Stores HS_JWT in localStorage
  │ 20. Sets AuthContext user state
  │ 21. Redirects user to landing page or previously intended route
```

---

## 10. Frontend Changes Required

### 1. Which existing file contains the Login UI?
**Finding:** No login UI currently exists in the repository.  
**Requirement:** `NEW FILE REQUIRED` at `frontend/src/pages/Login.jsx`.

### 2. Which existing file handles authentication?
**Finding:** No file currently handles authentication.  
**Requirement:** `NEW FILE REQUIRED` at `frontend/src/context/AuthContext.jsx`.

### 3. Which existing file handles API requests?
**Finding:** Handled by [frontend/src/services/apiClient.js](file:///d:/HamaraShops-Ai/frontend/src/services/apiClient.js) and [frontend/src/services/api.js](file:///d:/HamaraShops-Ai/frontend/src/services/api.js).  
**Requirement:** `MODIFY EXISTING` files:
- Update `apiClient.js` with an Axios request interceptor that injects `Authorization: Bearer <token>` when a token is found in `localStorage`.
- Update `api.js` to expose `AuthApi` containing `getLinkedInUrl()`, `callback(code, state)`, `getMe()`, and `logout()`.

### 4. Which existing file contains routing?
**Finding:** [frontend/src/App.jsx](file:///d:/HamaraShops-Ai/frontend/src/App.jsx) (configured with `react-router-dom`).  
**Requirement:** `MODIFY EXISTING` `frontend/src/App.jsx`:
- Import `Login` and `AuthCallback`.
- Add `<Route path="/login" element={<Login />} />`.
- Add `<Route path="/auth/callback" element={<AuthCallback />} />`.

### 5. Where should the "Login with LinkedIn" button be added?
1. **Primary Location:** On the new dedicated login page (`frontend/src/pages/Login.jsx`).
2. **Header Navigation:** In [frontend/src/components/common/Header.jsx](file:///d:/HamaraShops-Ai/frontend/src/components/common/Header.jsx#L199-L218):
   - Replace or complement the existing button area with a "Sign In" link when logged out.
   - Render the user's avatar image, name, and a sign-out dropdown when logged in.

### 6. What existing authentication flow will LinkedIn OIDC integrate with?
Since no prior authentication exists, LinkedIn OIDC will serve as the **foundational primary authentication provider** for HamaraShops.ai.

### 7. Whether a new frontend file is actually required?
**YES.** Five new frontend files are required:
- `frontend/src/context/AuthContext.jsx` (Global auth state provider)
- `frontend/src/pages/Login.jsx` (Dedicated sign-in page)
- `frontend/src/pages/AuthCallback.jsx` (OIDC redirect callback receiver)
- `frontend/src/components/auth/LinkedInButton.jsx` (Reusable LinkedIn branded button)
- `frontend/src/components/auth/ProtectedRoute.jsx` (Route guard wrapper for future authenticated views)

### 8. Whether any existing frontend file should be modified?
**YES.** Four existing files must be modified:
- [frontend/src/main.jsx](file:///d:/HamaraShops-Ai/frontend/src/main.jsx): Wrap `<App />` with `<AuthProvider>`.
- [frontend/src/App.jsx](file:///d:/HamaraShops-Ai/frontend/src/App.jsx): Add routes for `/login` and `/auth/callback`.
- [frontend/src/components/common/Header.jsx](file:///d:/HamaraShops-Ai/frontend/src/components/common/Header.jsx): Add auth status, sign-in CTA, and user profile avatar menu.
- [frontend/src/services/apiClient.js](file:///d:/HamaraShops-Ai/frontend/src/services/apiClient.js): Add request interceptor for JWT authorization header.
- [frontend/src/services/api.js](file:///d:/HamaraShops-Ai/frontend/src/services/api.js): Add `AuthApi` endpoints.

---

## 11. Backend Changes Required

### 1. API Gateway Route Configuration
**File:** [api-gateway/src/main/java/com/hamarashops/gateway/ApiGatewayApplication.java](file:///d:/HamaraShops-Ai/api-gateway/src/main/java/com/hamarashops/gateway/ApiGatewayApplication.java)  
**Required Change:** Add `authServiceUrl` injection and configure path predicate for `/api/v1/auth/**`:
```java
@Value("${AUTH_SERVICE_URL:http://localhost:8084}")
private String authServiceUrl;

// Inside customRouteLocator bean:
.route("auth-service-routes", r -> r.path(
        "/api/v1/auth", "/api/v1/auth/**"
).uri(authServiceUrl))
```

**Files:**
- [api-gateway/src/main/resources/application.yml](file:///d:/HamaraShops-Ai/api-gateway/src/main/resources/application.yml)
- [api-gateway/src/main/resources/application-local.yml](file:///d:/HamaraShops-Ai/api-gateway/src/main/resources/application-local.yml)
- [api-gateway/src/main/resources/application-cloud.yml](file:///d:/HamaraShops-Ai/api-gateway/src/main/resources/application-cloud.yml)
- [api-gateway/cloud.yml](file:///d:/HamaraShops-Ai/api-gateway/cloud.yml)

**Required Change:** Declare `auth-service-routes` and inject `AUTH_SERVICE_URL`.

### 2. Creation of `auth-service` Microservice
Create directory `d:\HamaraShops-Ai\auth-service` containing:
- **`pom.xml`**: Configured with Java 21, Spring Boot `4.1.0`, Spring Cloud `2025.1.2`, Spring Web, Spring Data JPA, Spring Security, MySQL Connector, H2 Database, JJWT, and Nimbus JOSE JWT.
- **`Dockerfile`**: Eclipse Temurin 21 multi-stage build matching `content-service/Dockerfile`.
- **`cloud.yml`**: Knative deployment specification targeting Google Cloud Run.
- **Java Source Packages (`com.hamarashops.auth`):**
  - `AuthServiceApplication.java`: Main application entry point.
  - `config/SecurityConfig.java`: Spring Security `SecurityFilterChain` permitting `/api/v1/auth/linkedin/**` publicly, enforcing JWT authentication on `/api/v1/auth/me`.
  - `config/JwtAuthenticationFilter.java`: OncePerRequestFilter parsing Bearer token and populating `SecurityContextHolder`.
  - `controller/AuthController.java`: REST controller exposing `/api/v1/auth/linkedin/url`, `/api/v1/auth/linkedin/callback`, `/api/v1/auth/me`, `/api/v1/auth/logout`.
  - `model/entity/User.java`: JPA entity storing user profiles.
  - `model/dto/LinkedInAuthUrlResponse.java`
  - `model/dto/LinkedInCallbackRequest.java`
  - `model/dto/AuthResponse.java`
  - `model/dto/UserResponse.java`
  - `repository/UserRepository.java`: Spring Data JPA repository.
  - `service/LinkedInOidcService.java` & `impl/LinkedInOidcServiceImpl.java`: State generation, token exchange, and ID Token validation via JWKS.
  - `service/JwtTokenService.java` & `impl/JwtTokenServiceImpl.java`: Application JWT generation and validation.
  - `service/UserService.java` & `impl/UserServiceImpl.java`: User find-or-create logic and account linking.
  - `exception/GlobalExceptionHandler.java`: Standardized JSON error response matching `contact-service`.

---

## 12. Database Changes Required

### User Table Schema (DDL)
```sql
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    linkedin_id VARCHAR(128) NULL,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NULL,
    last_name VARCHAR(100) NULL,
    name VARCHAR(200) NULL,
    picture_url VARCHAR(1024) NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    provider VARCHAR(50) NOT NULL DEFAULT 'LINKEDIN',
    role VARCHAR(50) NOT NULL DEFAULT 'ROLE_USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_users_email UNIQUE (email),
    CONSTRAINT uq_users_linkedin_id UNIQUE (linkedin_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_linkedin_id ON users(linkedin_id);
```

### Entity Mapping Details
```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "linkedin_id", unique = true, length = 128)
    private String linkedinId;

    @Column(name = "email", nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "first_name", length = 100)
    private String firstName;

    @Column(name = "last_name", length = 100)
    private String lastName;

    @Column(name = "name", length = 200)
    private String name;

    @Column(name = "picture_url", length = 1024)
    private String pictureUrl;

    @Column(name = "email_verified")
    private Boolean emailVerified;

    @Column(name = "provider", nullable = false, length = 50)
    private String provider = "LINKEDIN";

    @Column(name = "role", nullable = false, length = 50)
    private String role = "ROLE_USER";

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Getters, Setters, Constructors
}
```

---

## 13. Configuration Changes Required

### 1. `auth-service/src/main/resources/application.yml`
```yaml
server:
  port: ${PORT:8084}

spring:
  application:
    name: auth-service
  profiles:
    active: ${SPRING_PROFILES_ACTIVE:local}
  datasource:
    url: ${SPRING_DATASOURCE_URL:jdbc:h2:file:./data/authdb;DB_CLOSE_DELAY=-1;AUTO_SERVER=TRUE}
    username: ${SPRING_DATASOURCE_USERNAME:sa}
    password: ${SPRING_DATASOURCE_PASSWORD:}
    driver-class-name: ${SPRING_DATASOURCE_DRIVER:org.h2.Driver}
  jpa:
    hibernate:
      ddl-auto: ${SPRING_JPA_HIBERNATE_DDL_AUTO:update}
    show-sql: false
    properties:
      hibernate:
        format_sql: false

linkedin:
  client-id: ${LINKEDIN_CLIENT_ID}
  client-secret: ${LINKEDIN_CLIENT_SECRET}
  redirect-uri: ${LINKEDIN_REDIRECT_URI}
  issuer: https://www.linkedin.com
  authorization-url: https://www.linkedin.com/oauth/v2/authorization
  token-url: https://www.linkedin.com/oauth/v2/accessToken
  userinfo-url: https://api.linkedin.com/v2/userinfo
  jwks-url: https://www.linkedin.com/oauth/openid/jwks

security:
  jwt:
    secret: ${JWT_SECRET:404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970}
    expiration-ms: ${JWT_EXPIRATION_MS:86400000} # 24 Hours

management:
  endpoints:
    web:
      exposure:
        include: health, info
  endpoint:
    health:
      show-details: always
```

### 2. `api-gateway/src/main/resources/application-local.yml`
```yaml
CONTENT_SERVICE_URL: http://localhost:8081
BUSINESS_SERVICE_URL: http://localhost:8082
CONTACT_SERVICE_URL: http://localhost:8083
AUTH_SERVICE_URL: http://localhost:8084
```

### 3. `api-gateway/src/main/resources/application-cloud.yml`
```yaml
# Add Route 4: Auth Service
- id: auth-service-routes
  uri: ${AUTH_SERVICE_URL}
  predicates:
    - Path=/api/v1/auth,/api/v1/auth/**
```

---

## 14. API Endpoints Required

| Method | Endpoint Path | Service Owner | Auth Type | Description |
| :--- | :--- | :--- | :---: | :--- |
| `GET` | `/api/v1/auth/linkedin/url` | `auth-service` | Public | Generates anti-CSRF state token and returns LinkedIn authorization redirect URL. |
| `POST`| `/api/v1/auth/linkedin/callback` | `auth-service` | Public | Accepts `{ code, state }`, performs server-side token exchange with LinkedIn, verifies ID token, upserts user, and returns HamaraShops JWT. |
| `GET` | `/api/v1/auth/me` | `auth-service` | Bearer JWT | Returns current authenticated user profile from token claims/database. |
| `POST`| `/api/v1/auth/logout` | `auth-service` | Bearer JWT | Client session invalidation hook. |

---

## 15. Dependencies Required

### For New `auth-service/pom.xml`:
| Dependency Artifact | Version | Why Required |
| :--- | :--- | :--- |
| `spring-boot-starter-web` | Managed (4.1.0) | Standard Spring MVC REST controllers |
| `spring-boot-starter-security` | Managed (4.1.0) | Security filter chain and bearer token processing |
| `spring-boot-starter-data-jpa` | Managed (4.1.0) | Relational persistence for user accounts |
| `spring-boot-starter-actuator` | Managed (4.1.0) | Health and readiness probes for Cloud Run |
| `mysql-connector-j` | Runtime | Cloud SQL MySQL database connectivity in production |
| `h2` | Runtime / Test | In-memory database for local testing and offline runs |
| `jjwt-api` / `jjwt-impl` / `jjwt-jackson` | `0.12.6` | Generation and signing of HamaraShops application JWTs |
| `nimbus-jose-jwt` | `9.40` | Validation of LinkedIn OIDC ID Token RS256 signature via JWKS |
| `spring-boot-starter-test` | Test | Unit and integration test framework |

*Note: No new dependencies are required for `api-gateway`, `content-service`, `business-service`, `contact-service`, or `frontend` (Axios, React Router, Lucide, and Tailwind are already installed).*

---

## 16. Exact Files to Modify

| File | Purpose | Required Change |
| :--- | :--- | :--- |
| [api-gateway/src/main/java/com/hamarashops/gateway/ApiGatewayApplication.java](file:///d:/HamaraShops-Ai/api-gateway/src/main/java/com/hamarashops/gateway/ApiGatewayApplication.java) | Gateway routing | Add `@Value("${AUTH_SERVICE_URL:http://localhost:8084}")` and register `/api/v1/auth/**` route locator. |
| [api-gateway/src/main/resources/application.yml](file:///d:/HamaraShops-Ai/api-gateway/src/main/resources/application.yml) | Gateway configuration | Ensure CORS settings permit `Authorization` header and add default routes. |
| [api-gateway/src/main/resources/application-local.yml](file:///d:/HamaraShops-Ai/api-gateway/src/main/resources/application-local.yml) | Gateway local routes | Add `AUTH_SERVICE_URL: http://localhost:8084` and `auth-service-routes` declaration. |
| [api-gateway/src/main/resources/application-cloud.yml](file:///d:/HamaraShops-Ai/api-gateway/src/main/resources/application-cloud.yml) | Gateway cloud routes | Add `auth-service-routes` mapping to `${AUTH_SERVICE_URL}`. |
| [api-gateway/cloud.yml](file:///d:/HamaraShops-Ai/api-gateway/cloud.yml) | Cloud Run gateway manifest | Add environment variable `- name: AUTH_SERVICE_URL value: "<DEPLOYED_AUTH_SERVICE_URL>"`. |
| [frontend/src/main.jsx](file:///d:/HamaraShops-Ai/frontend/src/main.jsx) | React entry point | Wrap `<App />` inside `<AuthProvider>`. |
| [frontend/src/App.jsx](file:///d:/HamaraShops-Ai/frontend/src/App.jsx) | Route declarations | Add `<Route path="/login" element={<Login />} />` and `<Route path="/auth/callback" element={<AuthCallback />} />`. |
| [frontend/src/components/common/Header.jsx](file:///d:/HamaraShops-Ai/frontend/src/components/common/Header.jsx) | Global navigation | Add user authentication status, profile avatar dropdown, or "Sign In" link. |
| [frontend/src/services/apiClient.js](file:///d:/HamaraShops-Ai/frontend/src/services/apiClient.js) | Centralized Axios client | Add request interceptor attaching `Authorization: Bearer <token>` from `localStorage`. |
| [frontend/src/services/api.js](file:///d:/HamaraShops-Ai/frontend/src/services/api.js) | API Service Registry | Export `AuthApi` containing LinkedIn OAuth interaction methods. |

---

## 17. Exact New Files to Create

### Backend (`auth-service/`)
1. `auth-service/pom.xml`
2. `auth-service/Dockerfile`
3. `auth-service/cloud.yml`
4. `auth-service/src/main/resources/application.yml`
5. `auth-service/src/main/resources/application-local.yml`
6. `auth-service/src/main/resources/application-cloud.yml`
7. `auth-service/src/main/java/com/hamarashops/auth/AuthServiceApplication.java`
8. `auth-service/src/main/java/com/hamarashops/auth/config/SecurityConfig.java`
9. `auth-service/src/main/java/com/hamarashops/auth/config/JwtAuthenticationFilter.java`
10. `auth-service/src/main/java/com/hamarashops/auth/controller/AuthController.java`
11. `auth-service/src/main/java/com/hamarashops/auth/exception/GlobalExceptionHandler.java`
12. `auth-service/src/main/java/com/hamarashops/auth/model/entity/User.java`
13. `auth-service/src/main/java/com/hamarashops/auth/model/dto/LinkedInAuthUrlResponse.java`
14. `auth-service/src/main/java/com/hamarashops/auth/model/dto/LinkedInCallbackRequest.java`
15. `auth-service/src/main/java/com/hamarashops/auth/model/dto/AuthResponse.java`
16. `auth-service/src/main/java/com/hamarashops/auth/model/dto/UserResponse.java`
17. `auth-service/src/main/java/com/hamarashops/auth/repository/UserRepository.java`
18. `auth-service/src/main/java/com/hamarashops/auth/service/LinkedInOidcService.java`
19. `auth-service/src/main/java/com/hamarashops/auth/service/JwtTokenService.java`
20. `auth-service/src/main/java/com/hamarashops/auth/service/UserService.java`
21. `auth-service/src/main/java/com/hamarashops/auth/service/impl/LinkedInOidcServiceImpl.java`
22. `auth-service/src/main/java/com/hamarashops/auth/service/impl/JwtTokenServiceImpl.java`
23. `auth-service/src/main/java/com/hamarashops/auth/service/impl/UserServiceImpl.java`
24. `auth-service/src/test/java/com/hamarashops/auth/service/LinkedInOidcServiceTest.java`

### Frontend (`frontend/`)
1. `frontend/src/context/AuthContext.jsx`
2. `frontend/src/pages/Login.jsx`
3. `frontend/src/pages/AuthCallback.jsx`
4. `frontend/src/components/auth/LinkedInButton.jsx`
5. `frontend/src/components/auth/ProtectedRoute.jsx`

---

## 18. Files That Must NOT Be Changed

To prevent regression across existing features:
- `content-service/**`: DO NOT modify any files in content-service (Stateless product catalog and solutions).
- `business-service/**`: DO NOT modify any files in business-service (Industries and careers data).
- `contact-service/**`: DO NOT modify any files in contact-service (Contact inquiries and Resend email transmission).
- `frontend/src/pages/Home.jsx`, `About.jsx`, `Industries.jsx`, `Contact.jsx`, `UseCases.jsx`, etc.: Marketing content pages must remain unchanged.
- `frontend/src/components/home/**`: Home showcase sections, 3D canvases, and WebGL shaders must remain untouched.

---

## 19. Environment Variables Required

| Variable Name | Applied Service | Secret? | Description / Example |
| :--- | :--- | :---: | :--- |
| `LINKEDIN_CLIENT_ID` | `auth-service` | No | LinkedIn Developer App Client ID |
| `LINKEDIN_CLIENT_SECRET` | `auth-service` | **YES** | LinkedIn Developer App Client Secret |
| `LINKEDIN_REDIRECT_URI` | `auth-service` | No | OIDC redirect callback URI (matches frontend callback route) |
| `JWT_SECRET` | `auth-service` | **YES** | 256-bit secret key for HMAC-SHA256 token signing |
| `JWT_EXPIRATION_MS` | `auth-service` | No | Session duration in milliseconds (default: `86400000` = 24h) |
| `AUTH_SERVICE_URL` | `api-gateway` | No | Downstream URL of `auth-service` (`http://localhost:8084` or Cloud Run URL) |
| `SPRING_DATASOURCE_URL` | `auth-service` | **YES** | Cloud SQL JDBC connection string |
| `SPRING_DATASOURCE_USERNAME`| `auth-service` | **YES** | Database username |
| `SPRING_DATASOURCE_PASSWORD`| `auth-service` | **YES** | Database password |
| `VITE_API_BASE_URL` | `frontend` | No | Gateway API Base (`http://localhost:8080/api/v1` or production URL) |

---

## 20. Local Development Configuration

### Root `.env` Additions:
```properties
# LinkedIn Developer Application Credentials
LINKEDIN_CLIENT_ID=your_linkedin_client_id_here
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret_here
LINKEDIN_REDIRECT_URI=http://localhost:5173/auth/callback

# HamaraShops Internal Auth Security
JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
JWT_EXPIRATION_MS=86400000

# Auth Service Gateway Routing
AUTH_SERVICE_URL=http://localhost:8084
```

### Startup Order (Separate Terminals):
```bash
# Terminal 1: Content Service (Port 8081)
cd content-service && mvn spring-boot:run

# Terminal 2: Business Service (Port 8082)
cd business-service && mvn spring-boot:run

# Terminal 3: Contact Service (Port 8083)
cd contact-service && mvn spring-boot:run

# Terminal 4: Auth Service (Port 8084) - NEW
cd auth-service && mvn spring-boot:run

# Terminal 5: API Gateway (Port 8080)
cd api-gateway && mvn spring-boot:run

# Terminal 6: Frontend SPA (Port 5173)
cd frontend && npm run dev
```

---

## 21. Production / Cloud Run Configuration

### 1. Secret Manager Configuration
Store the following secrets in Google Cloud Secret Manager:
- `linkedin-client-secret`: Actual LinkedIn Client Secret.
- `jwt-secret`: Generated 512-bit cryptographically secure string.
- `db-password`: Cloud SQL database user password.

### 2. `auth-service` Cloud Run Deployment Command
```bash
gcloud run deploy auth-service \
  --image asia-south1-docker.pkg.dev/hamarashops-ai/hamarashops-repo/auth-service:v1.0.0 \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars SPRING_PROFILES_ACTIVE=cloud,LINKEDIN_CLIENT_ID="your_client_id",LINKEDIN_REDIRECT_URI="https://hamarashops.com/auth/callback" \
  --set-secrets LINKEDIN_CLIENT_SECRET=linkedin-client-secret:latest,JWT_SECRET=jwt-secret:latest,SPRING_DATASOURCE_PASSWORD=db-password:latest
```

### 3. API Gateway Cloud Run Redeployment
Update `api-gateway` with the new route variable:
```bash
gcloud run deploy api-gateway \
  --image asia-south1-docker.pkg.dev/hamarashops-ai/hamarashops-repo/api-gateway:v1.0.0 \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars SPRING_PROFILES_ACTIVE=cloud,CONTENT_SERVICE_URL=$CONTENT_URL,BUSINESS_SERVICE_URL=$BUSINESS_URL,CONTACT_SERVICE_URL=$CONTACT_URL,AUTH_SERVICE_URL=$AUTH_URL
```

### 4. LinkedIn Developer Portal Allowed Redirect URIs
Register both local and production redirect callback URIs in the LinkedIn Developer Console:
- Development: `http://localhost:5173/auth/callback`
- Production: `https://hamarashops.com/auth/callback` and `https://www.hamarashops.com/auth/callback`

---

## 22. Security Requirements

| Security Concern | Risk Description | Project Mitigation Strategy |
| :--- | :--- | :--- |
| **Client Secret Exposure** | Leakage of LinkedIn secret in React bundle allows impersonation. | **Strict Backend Isolation:** React client never receives or stores `LINKEDIN_CLIENT_SECRET`. Code exchange occurs entirely within `auth-service`. |
| **OAuth CSRF / State Injection** | Attacker intercepts auth code and binds victim account to attacker session. | **Cryptographic State Verification:** Backend generates an HMAC-signed state token; frontend persists state in `sessionStorage` and verifies equality before dispatching code exchange. |
| **ID Token Forgery** | Malicious actor crafts fake JWT claiming identity. | **JWKS Cryptographic Verification:** Backend parses LinkedIn's public keys from `https://www.linkedin.com/oauth/openid/jwks`, verifies RS256 signature, ensures `iss == https://www.linkedin.com` and `aud == LINKEDIN_CLIENT_ID`. |
| **Token Leakage via URLs** | Authorization code or JWT in query strings stored in browser history/logs. | **POST Exchange Body:** Code is transmitted to backend in HTTP POST body. Returned JWT is returned in JSON payload, never in URL fragments. |
| **Account Takeover via Email** | Unverified LinkedIn email matching existing user overwrites account. | **Strict Email Verification Enforcement:** Backend verifies claim `email_verified == true`. If false, account linking is rejected. |
| **Open Redirect Vulnerability** | Attacker tampers with redirect target to steal user credentials. | **Whitelisted Callback URI:** LinkedIn strictly validates redirect URI against registered whitelist in Developer Console. |

---

## 23. Account Linking Strategy

### Scenario Analysis:
- **Scenario 1: New User logs in with LinkedIn.**
  - *Action:* System inserts a new record into `users` (`provider = 'LINKEDIN'`, `linkedin_id = sub`, `email = claims.email`, `name = claims.name`, `picture_url = claims.picture`). Issues HamaraShops JWT.
- **Scenario 2: Existing user exists with same email, but `linkedin_id` is null.**
  - *Condition:* If and only if LinkedIn asserts `email_verified == true`.
  - *Action:* System updates existing user record, linking `linkedin_id = sub` and updating `picture_url`. Issues HamaraShops JWT.
  - *Security Rationale:* Safe because LinkedIn has verified ownership of the email.
- **Scenario 3: Existing user already has a matching `linkedin_id`.**
  - *Action:* Immediate sign-in. Updates `last_login` timestamp and refreshes avatar if changed. Issues HamaraShops JWT.
- **Scenario 4: User email on LinkedIn differs from pre-registered email.**
  - *Action:* Treated as a separate distinct account tied to the LinkedIn email. No merging occurs.
- **Scenario 5: User logs out.**
  - *Action:* Frontend clears JWT from `localStorage`, resets `AuthContext`, and calls `/api/v1/auth/logout`.
- **Scenario 6: User logs in again.**
  - *Action:* Matched by `linkedin_id` index; immediate token issuance with zero duplication.

---

## 24. Error Handling

### Backend Error Standard
`auth-service` will use `GlobalExceptionHandler` returning consistent JSON error bodies matching `contact-service`:
```json
{
  "timestamp": "2026-10-08T16:15:00.000",
  "status": 400,
  "error": "Bad Request",
  "message": "Invalid or expired LinkedIn authorization code."
}
```

### Specific Error Scenarios Handled:
1. **User denies consent on LinkedIn (`error=user_cancelled_login`):** Frontend `AuthCallback.jsx` detects `error` query param and renders user-friendly message with "Back to Login" action.
2. **Invalid / Expired Authorization Code:** Backend catches LinkedIn 400 response and maps to custom `OAuthAuthenticationException`.
3. **State Mismatch:** Frontend rejects request prior to backend call; backend rejects request if state signature does not match.
4. **LinkedIn JWKS / API Outage:** Backend returns HTTP 502 Bad Gateway with retry guidance.

---

## 25. Testing Plan

### 1. Unit Tests (`auth-service`)
- `LinkedInOidcServiceTest`: Mock LinkedIn token endpoint; verify state generation, authorization URL construction, and JWKS token validation.
- `JwtTokenServiceTest`: Verify signing, claim extraction, expiration enforcement, and tampering detection.
- `UserServiceTest`: Verify user creation, existing user lookup, and verified email linking.

### 2. Integration Tests
- `AuthControllerIntegrationTest`: Using `@SpringBootTest` and MockMvc, simulate `/api/v1/auth/linkedin/callback` end-to-end with an embedded H2 database.
- `ApiGatewayRouteTest`: Verify Gateway correctly routes `/api/v1/auth/**` to `auth-service` with appropriate CORS headers.

### 3. Manual Browser Verification Matrix
| Test Case | Steps | Expected Result |
| :--- | :--- | :--- |
| **Happy Path Login** | Navigate to `/login` -> Click "Sign in with LinkedIn" -> Authenticate & Consent -> Redirect to `/auth/callback` -> Redirect to home. | Header displays user name and profile picture; JWT stored in `localStorage`. |
| **Denied Consent** | Click "Cancel" on LinkedIn consent screen. | Returns to `/login` displaying "Consent was declined. Please try again." |
| **State Tampering** | Alter `state` query param in browser before `/auth/callback` loads. | Page displays "Security validation failed (State mismatch)." No token issued. |
| **Logout** | Click user avatar in Header -> Select "Sign Out". | JWT removed from `localStorage`; Header resets to "Sign In" button. |
| **Protected API Call** | Call `/api/v1/auth/me` with valid Bearer token. | Returns HTTP 200 with user profile JSON. |
| **Expired Token** | Call `/api/v1/auth/me` with expired token. | Returns HTTP 401 Unauthorized. |

---

## 26. Deployment Plan

1. **Step 1: Database Setup**
   - Provision Cloud SQL MySQL 8.0 instance (or use existing project database).
   - Execute the `users` table DDL.
2. **Step 2: Google Cloud Secret Manager**
   - Populate `linkedin-client-secret`, `jwt-secret`, and `db-password`.
3. **Step 3: Build & Deploy `auth-service`**
   - Build container image via Google Cloud Build: `gcloud builds submit --tag asia-south1-docker.pkg.dev/.../auth-service:v1.0.0 ./auth-service`.
   - Deploy to Cloud Run with environment variables and secrets.
4. **Step 4: Update & Redeploy `api-gateway`**
   - Add `AUTH_SERVICE_URL` pointing to deployed `auth-service` Cloud Run URL.
   - Deploy updated gateway image to Cloud Run.
5. **Step 5: Build & Deploy `frontend`**
   - Build frontend container: `npm run build && docker build -t .../frontend:v1.0.0 ./frontend`.
   - Deploy frontend to Cloud Run.
6. **Step 6: Live Smoke Test**
   - Test live OIDC login on `https://hamarashops.com`.

---

## 27. Rollback Plan

- **API Gateway Rollback:** If `auth-service` encounters unforeseen production issues, simply revert `api-gateway` traffic revision in Google Cloud Run to the previous revision (`151e4d1`). Gateway will instantly drop the `/api/v1/auth` route without affecting `content-service`, `business-service`, or `contact-service`.
- **Frontend Rollback:** Roll back Cloud Run `frontend` service to previous revision. Marketing pages will operate normally without the login UI.
- **Database Safety:** The `users` table is additive and completely independent; dropping or freezing it has zero impact on existing microservices.

---

## 28. Phase 1 Implementation Order

The implementation should be carried out in the following strict order:
1. **Foundation (`auth-service` Module):** Create `auth-service` Maven module, POM, and configuration.
2. **Domain & Persistence:** Create `User` entity, `UserRepository`, and database connection.
3. **Security & Tokens:** Create `SecurityConfig`, `JwtTokenService`, and `JwtAuthenticationFilter`.
4. **LinkedIn OIDC Integration:** Create `LinkedInOidcService` (state, token exchange, JWKS validation).
5. **REST API Controllers:** Implement `AuthController` (`/url`, `/callback`, `/me`, `/logout`).
6. **API Gateway Ingress:** Update `ApiGatewayApplication.java` and `application*.yml` to route `/api/v1/auth/**`.
7. **Frontend Auth Layer:** Create `AuthContext.jsx`, update `apiClient.js` with bearer interceptor, and update `api.js`.
8. **Frontend UI Components:** Create `LinkedInButton.jsx`, `Login.jsx`, and `AuthCallback.jsx`.
9. **Navigation Integration:** Update `Header.jsx` with auth state / profile menu and register routes in `App.jsx`.
10. **End-to-End Testing:** Verify local flow end-to-end on ports 8080/8084/5173.

---

## 29. Phase 2 Future Extension for Verified on LinkedIn Plus

When LinkedIn approves access to the **Verified on LinkedIn Plus** product, the system can be seamlessly extended without rewriting the Phase 1 architecture:
1. **Scope Additions:** Add Plus-specific scopes to the authorization URL (e.g., current employment and verification scopes).
2. **Schema Extension:** Add columns to the `users` table:
   ```sql
   ALTER TABLE users ADD COLUMN job_title VARCHAR(255) NULL;
   ALTER TABLE users ADD COLUMN company_name VARCHAR(255) NULL;
   ALTER TABLE users ADD COLUMN company_linkedin_id VARCHAR(128) NULL;
   ALTER TABLE users ADD COLUMN verification_status VARCHAR(50) NULL;
   ```
3. **Service Enrichment:** In `LinkedInOidcServiceImpl.java`, invoke LinkedIn's verified profile / position endpoints using the stored access token and populate the enriched user model.

---

## 30. Final File-by-File Implementation Checklist

- [ ] **`auth-service/pom.xml`**: Dependencies for Spring Web, Security, JPA, MySQL, H2, JJWT, Nimbus.
- [ ] **`auth-service/src/main/resources/application.yml`**: Application properties and LinkedIn config.
- [ ] **`auth-service/src/main/java/com/hamarashops/auth/model/entity/User.java`**: JPA User entity.
- [ ] **`auth-service/src/main/java/com/hamarashops/auth/repository/UserRepository.java`**: Spring Data repository.
- [ ] **`auth-service/src/main/java/com/hamarashops/auth/service/LinkedInOidcService.java`**: OIDC service interface.
- [ ] **`auth-service/src/main/java/com/hamarashops/auth/service/impl/LinkedInOidcServiceImpl.java`**: OIDC service logic.
- [ ] **`auth-service/src/main/java/com/hamarashops/auth/service/JwtTokenService.java`**: JWT service interface.
- [ ] **`auth-service/src/main/java/com/hamarashops/auth/service/impl/JwtTokenServiceImpl.java`**: JWT service logic.
- [ ] **`auth-service/src/main/java/com/hamarashops/auth/controller/AuthController.java`**: REST API endpoints.
- [ ] **`auth-service/src/main/java/com/hamarashops/auth/config/SecurityConfig.java`**: Spring Security chain.
- [ ] **`api-gateway/src/main/java/com/hamarashops/gateway/ApiGatewayApplication.java`**: Route `/api/v1/auth/**`.
- [ ] **`api-gateway/src/main/resources/application-local.yml`**: Local route for auth-service (`:8084`).
- [ ] **`api-gateway/src/main/resources/application-cloud.yml`**: Cloud route for auth-service.
- [ ] **`frontend/src/context/AuthContext.jsx`**: Global authentication provider.
- [ ] **`frontend/src/services/apiClient.js`**: Axios bearer token interceptor.
- [ ] **`frontend/src/services/api.js`**: `AuthApi` service functions.
- [ ] **`frontend/src/components/auth/LinkedInButton.jsx`**: Branded LinkedIn button component.
- [ ] **`frontend/src/pages/Login.jsx`**: Sign-in page.
- [ ] **`frontend/src/pages/AuthCallback.jsx`**: OIDC callback handling page.
- [ ] **`frontend/src/components/common/Header.jsx`**: User profile avatar and sign-in link.
- [ ] **`frontend/src/App.jsx`**: Route definitions for `/login` and `/auth/callback`.

---

## IMPLEMENTATION ORDER

1. **Create `auth-service/pom.xml`** with Spring Boot, Spring Security, JPA, JJWT, and Nimbus dependencies.
2. **Create `auth-service/src/main/resources/application.yml`** with LinkedIn OAuth endpoints, JWT secret, and database configuration.
3. **Create `auth-service/src/main/java/com/hamarashops/auth/model/entity/User.java`** and `UserRepository.java`.
4. **Create `auth-service/src/main/java/com/hamarashops/auth/service/JwtTokenService.java`** and its implementation.
5. **Create `auth-service/src/main/java/com/hamarashops/auth/service/LinkedInOidcService.java`** with token exchange and JWKS validation.
6. **Create `auth-service/src/main/java/com/hamarashops/auth/config/SecurityConfig.java`** and `JwtAuthenticationFilter.java`.
7. **Create `auth-service/src/main/java/com/hamarashops/auth/controller/AuthController.java`** exposing auth endpoints.
8. **Modify `api-gateway/src/main/java/com/hamarashops/gateway/ApiGatewayApplication.java`** to route `/api/v1/auth/**`.
9. **Modify `api-gateway/src/main/resources/application-local.yml` and `application-cloud.yml`** adding `AUTH_SERVICE_URL`.
10. **Modify `frontend/src/services/apiClient.js`** to inject Bearer tokens into request headers.
11. **Modify `frontend/src/services/api.js`** adding `AuthApi` definitions.
12. **Create `frontend/src/context/AuthContext.jsx`** to maintain auth state and persist tokens.
13. **Create `frontend/src/components/auth/LinkedInButton.jsx`**, `frontend/src/pages/Login.jsx`, and `frontend/src/pages/AuthCallback.jsx`.
14. **Modify `frontend/src/main.jsx`** to wrap `<App />` in `<AuthProvider>`.
15. **Modify `frontend/src/App.jsx`** to register `/login` and `/auth/callback` routes.
16. **Modify `frontend/src/components/common/Header.jsx`** to display sign-in buttons and user avatars.
17. **Execute Local Integration Tests** verifying end-to-end OAuth flow across ports 8080, 8084, and 5173.
18. **Deploy to Google Cloud Run** following the Cloud Run deployment plan.

---

## FILE CHANGE SUMMARY

### FRONTEND:
- **Modify:** `frontend/src/main.jsx` (Wrap with AuthProvider)
- **Modify:** `frontend/src/App.jsx` (Add `/login` and `/auth/callback` routes)
- **Modify:** `frontend/src/components/common/Header.jsx` (Add user avatar / login button)
- **Modify:** `frontend/src/services/apiClient.js` (Add Bearer token interceptor)
- **Modify:** `frontend/src/services/api.js` (Add `AuthApi` methods)
- **Create (New):** `frontend/src/context/AuthContext.jsx`
- **Create (New):** `frontend/src/pages/Login.jsx`
- **Create (New):** `frontend/src/pages/AuthCallback.jsx`
- **Create (New):** `frontend/src/components/auth/LinkedInButton.jsx`
- **Create (New):** `frontend/src/components/auth/ProtectedRoute.jsx`

### BACKEND:
- **Modify:** `api-gateway/src/main/java/com/hamarashops/gateway/ApiGatewayApplication.java`
- **Create (New Microservice):** `auth-service/pom.xml`
- **Create (New):** `auth-service/src/main/java/com/hamarashops/auth/AuthServiceApplication.java`
- **Create (New):** `auth-service/src/main/java/com/hamarashops/auth/config/SecurityConfig.java`
- **Create (New):** `auth-service/src/main/java/com/hamarashops/auth/config/JwtAuthenticationFilter.java`
- **Create (New):** `auth-service/src/main/java/com/hamarashops/auth/controller/AuthController.java`
- **Create (New):** `auth-service/src/main/java/com/hamarashops/auth/exception/GlobalExceptionHandler.java`
- **Create (New):** `auth-service/src/main/java/com/hamarashops/auth/model/entity/User.java`
- **Create (New):** `auth-service/src/main/java/com/hamarashops/auth/model/dto/LinkedInAuthUrlResponse.java`
- **Create (New):** `auth-service/src/main/java/com/hamarashops/auth/model/dto/LinkedInCallbackRequest.java`
- **Create (New):** `auth-service/src/main/java/com/hamarashops/auth/model/dto/AuthResponse.java`
- **Create (New):** `auth-service/src/main/java/com/hamarashops/auth/model/dto/UserResponse.java`
- **Create (New):** `auth-service/src/main/java/com/hamarashops/auth/repository/UserRepository.java`
- **Create (New):** `auth-service/src/main/java/com/hamarashops/auth/service/LinkedInOidcService.java`
- **Create (New):** `auth-service/src/main/java/com/hamarashops/auth/service/JwtTokenService.java`
- **Create (New):** `auth-service/src/main/java/com/hamarashops/auth/service/UserService.java`
- **Create (New):** `auth-service/src/main/java/com/hamarashops/auth/service/impl/LinkedInOidcServiceImpl.java`
- **Create (New):** `auth-service/src/main/java/com/hamarashops/auth/service/impl/JwtTokenServiceImpl.java`
- **Create (New):** `auth-service/src/main/java/com/hamarashops/auth/service/impl/UserServiceImpl.java`

### DATABASE:
- **Create (New):** `auth-service/src/main/resources/db/migration/V1__create_users_table.sql` (or DDL script executed in MySQL)

### CONFIG:
- **Modify:** `api-gateway/src/main/resources/application.yml`
- **Modify:** `api-gateway/src/main/resources/application-local.yml`
- **Modify:** `api-gateway/src/main/resources/application-cloud.yml`
- **Create (New):** `auth-service/src/main/resources/application.yml`
- **Create (New):** `auth-service/src/main/resources/application-local.yml`
- **Create (New):** `auth-service/src/main/resources/application-cloud.yml`

### DEPLOYMENT:
- **Modify:** `api-gateway/cloud.yml` (Add `AUTH_SERVICE_URL`)
- **Create (New):** `auth-service/Dockerfile`
- **Create (New):** `auth-service/cloud.yml`

### TESTS:
- **Create (New):** `auth-service/src/test/java/com/hamarashops/auth/service/LinkedInOidcServiceTest.java`
- **Create (New):** `auth-service/src/test/java/com/hamarashops/auth/controller/AuthControllerTest.java`

---

## IMPORTANT QUESTIONS / BLOCKERS

1. **LinkedIn Developer Credentials:**
   - `LINKEDIN_CLIENT_ID` and `LINKEDIN_CLIENT_SECRET` must be configured in environment variables / Secret Manager before testing live authentication.
2. **Authorized Redirect URI Whitelist in LinkedIn Portal:**
   - Both `http://localhost:5173/auth/callback` (for local development) and `https://hamarashops.com/auth/callback` (for production) must be explicitly listed under the "Redirect URLs" in your LinkedIn Developer App.
3. **Persistent Production Database:**
   - **NOT FOUND IN REPOSITORY — NEEDS CONFIRMATION:** The existing services do not use a persistent database. Confirm whether Google Cloud SQL MySQL is already provisioned or if an existing database connection string is available for the production environment. (For local development, an H2 file/memory database is pre-configured as a zero-setup fallback).
4. **Production Domain Routing Confirmation:**
   - The production frontend is hosted at `https://frontend-27562154208.asia-south1.run.app` and mapped to `https://hamarashops.com`. Confirm that `https://hamarashops.com/auth/callback` redirects properly to the frontend single-page application.
