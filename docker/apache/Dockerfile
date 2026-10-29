FROM httpd:2.4-alpine AS base

COPY docker/apache/conf/httpd.conf /usr/local/apache2/conf/httpd.conf

RUN mkdir -p /usr/local/apache2/conf/sites-available

COPY docker/apache/conf/opencart.conf /usr/local/apache2/conf/sites-available/opencart.conf

EXPOSE 80

# Production: static files baked into the image (used by docker-compose.prod.yml / Coolify)
FROM base AS production
COPY upload /var/www/upload

# Development (default, last stage): code is bind-mounted by docker-compose.yml
FROM base AS development
