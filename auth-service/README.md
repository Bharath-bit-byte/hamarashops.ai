# HamaraShops Authentication Microservice (`auth-service`)

## 1. Overview
The **Auth Service** handles authentication and identity management for **HamaraShops.ai** using **Sign In with LinkedIn (OpenID Connect / OAuth 2.0)**, Flyway-migrated MySQL persistence, and HttpOnly session cookies.

- **Port:** `8084` (Default Local)
- **Java Version:** Java 21
- **Framework:** Spring Boot 4.1.0 + Spring Security 6.x

## 2. API Endpoints
- `GET /api/v1/auth/linkedin/authorize` — Starts LinkedIn OAuth flow with secure anti-CSRF state & nonce.
- `GET /api/v1/auth/linkedin/url` — Returns authorization URL for client-side navigation.
- `GET /api/v1/auth/linkedin/callback` — LinkedIn redirect callback; validates state, exchanges authorization code, verifies OIDC ID Token against JWKS, persists user, sets HttpOnly session cookie, and redirects to frontend.
- `GET /api/v1/auth/me` — Returns current authenticated user profile.
- `POST /api/v1/auth/logout` — Invalidates the session cookie.

## 3. Configuration & Secrets
- `LINKEDIN_CLIENT_ID`: LinkedIn Developer App Client ID.
- `LINKEDIN_CLIENT_SECRET`: LinkedIn Developer App Client Secret (Secret Manager).
- `LINKEDIN_REDIRECT_URI`: OAuth callback URI (`http://localhost:8080/api/v1/auth/linkedin/callback` local, `https://hamarashops.com/api/v1/auth/linkedin/callback` prod).
- `JWT_SECRET`: 256-bit secret key for application session token signing.
- `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`: Database connection details.
