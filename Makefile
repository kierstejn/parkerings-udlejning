COMPOSE_TEST = docker compose -p parkering-test -f docker-compose.test.yml
COMPOSE_DEV  = docker compose -f docker-compose.dev.yml

# ── Dev ───────────────────────────────────────────────────────
dev:
	$(COMPOSE_DEV) up

dev-down:
	$(COMPOSE_DEV) down

# ── Build ─────────────────────────────────────────────────────
build:
	npm run build

# ── Test stack lifecycle ──────────────────────────────────────
test-up: build
	$(COMPOSE_TEST) up -d --build
	@echo "Waiting for app to be ready..."
	@$(COMPOSE_TEST) exec app sh -c 'until php artisan inspire > /dev/null 2>&1; do sleep 1; done'

test-down:
	$(COMPOSE_TEST) down -v

# ── Playwright ────────────────────────────────────────────────
test: test-up
	npx playwright test
	$(MAKE) test-down

test-ui: test-up
	npx playwright test --ui

test-report:
	npx playwright show-report

# ── Install ───────────────────────────────────────────────────
install:
	npm install
	npx playwright install chromium

.PHONY: dev dev-down build test-up test-down test test-ui test-report install
