# HamaraShops Authentication Microservice (`auth-service`)

## 1. Overview
The **Auth Service** handles authentication and identity management for **HamaraShops.ai** using **Sign In with LinkedIn (OpenID Connect / OAuth 2.0)**, JSON file-based user records, and synchronized persistence to the existing **`Companies_Details.xlsx`** Excel workbook.

- **Port:** `8084` (Default Local)
- **Java Version:** Java 21
- **Framework:** Spring Boot 4.1.0 + Spring Security 7.x
- **Storage Strategy:** Zero SQL Database dependencies.
  - User records persisted in durable JSON (`data/linkedin-users.json`).
  - Synchronized into a dedicated **`LinkedIn Users`** worksheet inside `Companies_Details.xlsx`.
  - Google Cloud Storage (`gs://<GCS_BUCKET_NAME>/...`) in Cloud Run with object-generation concurrency preconditions.

---

## 2. Fresh GitHub Clone Setup Guide

When a new developer clones this repository:

### 1. `Companies_Details.xlsx` is gitignored
To protect proprietary business leads and prevent accidental leakage of sensitive records, `*.xlsx` and `data/` are listed in `.gitignore`.
Therefore, `Companies_Details.xlsx` will **not** be present in a fresh git clone.

### 2. Safeguard Against Silent Overwrite
The application will **never** silently create an empty replacement workbook or overwrite company data.
If `Companies_Details.xlsx` is missing when attempting to synchronize a user, `auth-service` throws a descriptive `FileNotFoundException`:
```text
Required Excel workbook 'Companies_Details.xlsx' was not found at configured path: ...
On a fresh clone, you must supply the master Companies_Details.xlsx in the project root
or configure GCS bucket storage. See README.md for setup instructions.
```

### 3. Supplying the Workbook
Choose one of the following approaches:
1. **Local Development (Manual):**
   - Obtain `Companies_Details.xlsx` from approved team storage (e.g. Google Drive / 1Password / secure share).
   - Place `Companies_Details.xlsx` directly into the repository root directory (`HamaraShops-Ai/Companies_Details.xlsx`).
2. **From Google Cloud Storage (CLI):**
   ```bash
   gcloud storage cp gs://<APPROVED_GCS_BUCKET>/auth/Companies_Details.xlsx ./Companies_Details.xlsx
   ```
3. **Direct Cloud Storage Mode:**
   - In `.env`, set `STORAGE_TYPE=GCS` and `GCS_BUCKET_NAME=<BUCKET>`. The service will read and write directly to Google Cloud Storage.

---

## 3. Excel Worksheet Design

The workbook `Companies_Details.xlsx` contains three sheets:

| Worksheet | Purpose | Modification Policy |
| :--- | :--- | :--- |
| **`Companies`** | Existing corporate directory (rows 2–49) | **READ-ONLY / UNTOUCHED**. Rows, formulas, formatting, and columns are never modified. |
| **`Instructions`** | Usage instructions & field descriptions | **READ-ONLY / UNTOUCHED**. Preserved completely intact. |
| **`LinkedIn Users`** | Authenticated LinkedIn members | **UPSERT TARGET**. Automatically created if not present. |

### Schema of `LinkedIn Users` Worksheet
The dedicated worksheet contains the authorized OIDC columns:
1. **`LinkedIn ID` (`sub`)** — Primary key (e.g. `urn:li:person:...`)
2. **`Full Name`** — Full name from OIDC token claims
3. **`First Name`** — Given name (`given_name`)
4. **`Last Name`** — Family name (`family_name`)
5. **`Email`** — Verified primary email address
6. **`Email Verified`** — Boolean (`true` / `false`)
7. **`Profile Picture URL`** — Avatar image URL from claims
8. **`LinkedIn Profile URL`** — Authorized profile URL from claims (null/empty if not granted)
9. **`Provider`** — `LINKEDIN`
10. **`Created At`** — Creation timestamp formatted in Indian Standard Time (IST)
11. **`Updated At`** — Update timestamp formatted in Indian Standard Time (IST)

> [!IMPORTANT]
> **No Fabricated Data**: Fields unavailable from authorized LinkedIn OIDC scopes (such as job titles, company names, or employment dates) are **never** fabricated.

### Repeat Login Matching Logic
- The service inspects column 0 (`LinkedIn ID`).
- If a match is found:
  - Updates name, email, verification status, and picture URL.
  - **Preserves** existing `Created At` timestamp in column 8.
  - Updates `Updated At` timestamp in column 9.
  - Does **not** append a duplicate row.
- If no match is found:
  - Appends a new row at the bottom of the worksheet.

---

## 4. Google Cloud Storage Concurrency & Cloud Run

In Google Cloud Run, multiple container instances may process concurrent requests simultaneously without shared JVM memory.

### Distributed Concurrency via GCS Object Generation Preconditions
- **In-process Java Locks** (`ReentrantReadWriteLock`) only synchronize threads within the *same* instance. They do **not** provide distributed locking across Cloud Run instances.
- Cross-instance distributed concurrency is enforced using **Google Cloud Storage Object-Generation Preconditions**:
  - `Storage.BlobTargetOption.generationMatch(generation)` for existing objects.
  - `Storage.BlobTargetOption.doesNotExist()` for new objects.
- When two instances attempt simultaneous writes, GCS rejects the second write with **HTTP 412 (Precondition Failed)**.
- `GcsFileStorageService` implements an automatic **read-modify-write retry loop** with exponential backoff and jitter (up to 8 attempts):
  1. Catches HTTP 412 `StorageException`.
  2. Waits with exponential backoff (initial 60ms, increasing per attempt).
  3. Re-reads the updated object with its new generation.
  4. Re-executes the updater callback against the freshest data.
  5. Attempts generation-matched write again.
- **Result:** No user record is ever lost or silently overwritten by concurrent Cloud Run instances.

---

## 5. JSON Storage Architecture

- **Path:** `data/linkedin-users.json` (Local) or `gs://<BUCKET>/auth/linkedin-users.json` (GCS).
- **Format:** JSON array of `User` records.
- **Sensitivity Rules:**
  - **NEVER** stores `access_token`, `id_token`, `client_secret`, or `jwt_secret`.
  - Only stores permitted OIDC profile identity attributes.
- **Atomic File Replacement:** Local writes use temporary files (`.hs-tmp-*.tmp`) and atomic filesystem move (`StandardCopyOption.ATOMIC_MOVE`) to prevent file corruption during sudden shutdown.
- **Corruption Safeguard:** If `data/linkedin-users.json` contains malformed JSON, `JsonUserStorageService` throws `IllegalStateException` and halts rather than overwriting existing records with an empty array.

---

## 6. Configuration & Environment Variables

### Local Development (`.env` or environment variables)
```env
# LinkedIn OIDC Credentials
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
LINKEDIN_REDIRECT_URI=http://localhost:8080/api/v1/auth/linkedin/callback
LINKEDIN_ISSUER=https://www.linkedin.com/oauth

# JWT Session Security
JWT_SECRET=your_secure_256_bit_secret_key
JWT_EXPIRATION_MS=86400000

# File Storage Configuration (No MySQL required)
STORAGE_TYPE=LOCAL
STORAGE_LOCAL_JSON_PATH=data/linkedin-users.json
STORAGE_LOCAL_EXCEL_PATH=Companies_Details.xlsx

# Frontend & Cookies
FRONTEND_URL=http://localhost:5173
COOKIE_SECURE=false
```

### Production / Google Cloud Run
Set `SPRING_PROFILES_ACTIVE=cloud` and configure:
```env
STORAGE_TYPE=GCS
GCS_BUCKET_NAME=your-production-bucket
GCS_JSON_PATH=auth/linkedin-users.json
GCS_EXCEL_PATH=auth/Companies_Details.xlsx
LINKEDIN_REDIRECT_URI=https://www.hamarashops.ai/api/v1/auth/linkedin/callback
COOKIE_SECURE=true
```

### Required Google Cloud IAM Permissions
The Cloud Run service account requires:
- `roles/storage.objectUser` (or `roles/storage.objectAdmin`) on the target Cloud Storage bucket.
- `roles/secretmanager.secretAccessor` for mounting secrets from Secret Manager.

---

## 7. How Another Developer Runs the Project

```bash
# 1. Clone repository
git clone https://github.com/Charanranga/HamaraShops-AI.git
cd HamaraShops-AI

# 2. Place master Companies_Details.xlsx into the project root
# (Obtain from team storage or gs://<BUCKET>/auth/Companies_Details.xlsx)
cp /path/to/Companies_Details.xlsx ./Companies_Details.xlsx

# 3. Configure environment variables in auth-service/.env
cd auth-service
cp .env.example .env # edit with your LinkedIn credentials

# 4. Run tests
mvn test

# 5. Start auth service (No MySQL needed!)
mvn spring-boot:run
```

In a separate terminal:
```bash
# 6. Run frontend
cd ../frontend
npm install
npm run dev
```

---

## 8. Test Suite Summary
The test suite validates all 10 core verification requirements:
1. `JsonUserStorageServiceTest.testFirstTimeLoginCreatesRecord` — New user persisted to JSON.
2. `JsonUserStorageServiceTest.testRepeatLoginUpdatesExistingRecord` — Repeat login updates JSON without duplicates, preserving `createdAt`.
3. `ExcelUserStorageServiceTest.testAppendNewUserToLinkedInUsersSheet` — New user stored in separate `LinkedIn Users` worksheet.
4. `ExcelUserStorageServiceTest.testRepeatLoginUpdatesExistingRow` — Repeat login updates existing row in Excel.
5. `ExcelUserStorageServiceTest.testAppendNewUserToLinkedInUsersSheet` — `Companies` and `Instructions` worksheets preserved untouched.
6. `ExcelUserStorageServiceTest.testMissingWorkbookThrowsClearError` — Missing workbook throws clear error, no stub created.
7. `GcsFileStorageServiceTest.testConcurrentUpdateRetriesOnHttp412` — Concurrent Cloud Storage conflicts (HTTP 412) retry safely with generation match.
8. `EnvironmentConfigTest` — Auth service starts cleanly without MySQL or SQL database dependencies.
9. `LinkedInOidcServiceTest` — 12 tests validating OIDC security checks (issuer, audience, expiry, nonce, signature).
10. `npm run build` — Frontend production build succeeds.
