#!/bin/sh
set -e

# Clear any stale cache files from previous runs (they live on the mounted host volume)
php artisan config:clear 2>/dev/null || true
php artisan route:clear 2>/dev/null || true

php artisan migrate:fresh --force --no-interaction

exec php-fpm -F
