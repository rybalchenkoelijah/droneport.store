# This argument defines the PHP version for the image.
# It defaults to 8.4 if no 'PHP_VERSION' build-arg is passed from docker-compose.
ARG PHP_VERSION=8.4

FROM php:${PHP_VERSION}-fpm AS base

# Set timezone
ENV TZ=UTC
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Install system packages
RUN apt-get update && apt-get install -y supervisor cron tzdata

# Install PHP extensions
COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/local/bin/
RUN install-php-extensions \
    @composer \
    apcu \
    gd \
    intl \
    memcached \
    mysqli \
    opcache \
    pdo_mysql \
    pdo_pgsql \
    redis \
    zip

# Configure user home directory
ARG PHP_UNAME=www-data
ARG PHP_UID=33
ENV PHP_UNAME=${PHP_UNAME}
ENV PHP_UID=${PHP_UID}

RUN if ! id -u "$PHP_UNAME" >/dev/null 2>&1; then \
        useradd -m -G www-data,root -u "$PHP_UID" -d "/home/$PHP_UNAME" "$PHP_UNAME"; \
    fi && \
    chown -R "$PHP_UNAME":www-data /var/www && \
    chmod -R g+w /var/www

ENV HOME=/home/$PHP_UNAME

# Copy OpenCart's original php.ini
COPY upload/php.ini /usr/local/etc/php/conf.d/opencart.ini

# Copy project PHP-FPM and Supervisor configurations.
COPY ./docker/php/supervisor/supervisord.conf /etc/supervisor/supervisord.conf
COPY ./docker/php/supervisor/services/ /etc/supervisor/conf.d/services/

# Copy OpenCart entrypoint
COPY docker/php/docker-opencart-entrypoint /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-opencart-entrypoint

# Set working directory
WORKDIR /var/www

# Use OpenCart entrypoint
ENTRYPOINT ["docker-opencart-entrypoint"]
CMD ["supervisord", "-c", "/etc/supervisor/supervisord.conf"]

# Production: code baked into the image (used by docker-compose.prod.yml / Coolify)
FROM base AS production
COPY --chown=www-data:www-data upload /var/www/upload
COPY docker/php/cron/crontab /var/www/docker/php/cron/crontab

# Development (default, last stage): code is bind-mounted by docker-compose.yml
FROM base AS development
