# ParkDel — Server

Laravel 12 + Inertia.js + React backend for the ParkDel parking marketplace.

## Stack

- **Backend:** Laravel 12, PHP 8.2, PostgreSQL
- **Frontend:** React 19, Inertia.js, Tailwind CSS 4, Vite
- **Auth:** Session-based + Google OAuth (Socialite)
- **Storage:** S3-compatible (MinIO in dev, configurable in production)
- **Containerisation:** Docker (multi-stage build), Dokploy for production

## Prerequisites

- Docker + Docker Compose
- Node.js 20+
- make

## Development

```sh
make install      # install npm deps + Playwright browser
make dev          # start the full dev stack
```

The dev stack starts on:

| Service       | URL                          |
|---------------|------------------------------|
| App (HTTPS)   | https://localhost:8443       |
| App (HTTP→redirect) | http://localhost:8080  |
| Vite HMR      | https://localhost:5173       |
| MinIO console | http://localhost:9001        |

### Environment

Copy `.env.example` to `.env` and fill in the required values:

```sh
cp .env.example .env
```

Key variables:

```
# Database (auto-set by docker-compose.dev.yml)
DB_HOST=localhost
DB_PORT=5432

# S3 / MinIO
AWS_ACCESS_KEY_ID=minioadmin
AWS_SECRET_ACCESS_KEY=minioadmin
AWS_BUCKET=parkering
AWS_ENDPOINT=http://minio:9000
AWS_URL=http://localhost:9000/parkering

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=https://localhost:8443/auth/google/callback
```

### Google OAuth setup

1. Create an OAuth 2.0 client at [console.cloud.google.com](https://console.cloud.google.com)
2. Add `https://localhost:8443/auth/google/callback` as an authorized redirect URI
3. Copy the client ID and secret into `.env`

### MinIO bucket

After starting the dev stack, create the `parkering` bucket via the MinIO console at `http://localhost:9001` (credentials: `minioadmin` / `minioadmin`) and set its access policy to public.

## E2E Tests

Tests run Playwright on the host against an isolated Docker test stack that uses different ports and its own database — the dev stack can stay running in parallel.

```sh
make test         # build assets → start test stack → run tests → tear down
make test-ui      # start test stack + open Playwright UI (interactive)
make test-down    # tear down test stack when done with test-ui
make test-report  # open the last HTML test report
```

### Test stack ports

| Service     | Port |
|-------------|------|
| PostgreSQL  | 5433 |
| Nginx (HTTP)| 9080 |

### Writing tests

Tests live in `e2e/`. The auth setup (`e2e/auth.setup.ts`) logs in or registers a test user once per run and saves the session to `e2e/.auth/user.json`. Tests that need auth load this state:

```ts
import { test, expect } from '@playwright/test';

test.use({ storageState: 'e2e/.auth/user.json' });

test('my authenticated test', async ({ page }) => {
    await page.goto('/profile');
    // ...
});
```

## Makefile reference

| Command          | Description                                      |
|------------------|--------------------------------------------------|
| `make install`   | `npm install` + install Playwright Chromium      |
| `make dev`       | Start dev Docker stack                           |
| `make dev-down`  | Stop dev Docker stack                            |
| `make build`     | Build frontend assets (`npm run build`)          |
| `make test`      | Full E2E test run (up → test → down)             |
| `make test-up`   | Build assets + start test stack                  |
| `make test-down` | Stop test stack and remove volumes               |
| `make test-ui`   | Open Playwright UI (test stack stays running)    |
| `make test-report` | Open last HTML test report                    |

## Deployment

Production uses `docker-compose.yml` via Dokploy. Set the following environment variables in Dokploy:

```
APP_ENV=production
APP_KEY=
APP_URL=https://your-domain.com
DB_HOST=
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_BUCKET=
AWS_ENDPOINT=
AWS_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=https://your-domain.com/auth/google/callback
```
