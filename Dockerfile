# syntax=docker/dockerfile:1

ARG NODE_VERSION=24
ARG NGINX_IMAGE=nginxinc/nginx-unprivileged:stable-alpine

FROM node:${NODE_VERSION}-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci
COPY . .
RUN npx ng build --configuration production

FROM ${NGINX_IMAGE}
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build --chown=101:0 /app/dist/soldati-prog/browser /usr/share/nginx/html

# env.js generato all'avvio dalle variabili d'ambiente
COPY --chmod=755 <<'SCRIPT' /docker-entrypoint.d/40-env-js.sh
#!/bin/sh
set -eu
printf 'window.__env = { apiUrl: "%s", keycloakUrl: "%s", keycloakRealm: "%s", keycloakClientId: "%s" };\n' \
  "$API_URL" "$KEYCLOAK_URL" "$KEYCLOAK_REALM" "$KEYCLOAK_CLIENT_ID" \
  > /usr/share/nginx/html/env.js
SCRIPT

USER root
RUN chmod g+w /usr/share/nginx/html/env.js
USER 101

# default per Dev: per un altro ambiente si sovrascrivono le variabili nel deployment
ENV API_URL=https://egg-gateway.dev.expleoitalia.it/api/sol-dati \
    KEYCLOAK_URL=https://sso.dev.expleoitalia.it \
    KEYCLOAK_REALM=egg \
    KEYCLOAK_CLIENT_ID=soldati
EXPOSE 8080