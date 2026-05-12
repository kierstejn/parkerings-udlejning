# Stage 1: Build frontend assets
FROM node:20-alpine AS frontend
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-audit
COPY . .
RUN npm run build

# Stage 2: PHP application
FROM php:8.2-fpm AS app

RUN apt-get update && apt-get install -y \
    zip unzip curl git libzip-dev libpng-dev libonig-dev libxml2-dev libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql mbstring zip opcache \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY composer.json composer.lock ./
ARG COMPOSER_FLAGS="--no-dev"
RUN composer install ${COMPOSER_FLAGS} --optimize-autoloader --no-scripts --no-interaction

COPY . .
COPY --from=frontend /app/public/build ./public/build
COPY docker/php/opcache.ini /usr/local/etc/php/conf.d/opcache.ini
COPY docker/php/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh \
    && chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

EXPOSE 9000
ENTRYPOINT ["/entrypoint.sh"]

# Stage 3: Nginx serving static files + proxying to app
FROM nginx:alpine AS web
COPY --from=app /var/www/public /var/www/public
COPY docker/nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
