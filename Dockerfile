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
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build --chown=101:0 /app/dist/soldati-prog/browser /usr/share/nginx/html

# env.js generato all'avvio da API_URL: stessa immagine per ogni ambiente
COPY --chmod=755 <<'SCRIPT' /docker-entrypoint.d/40-env-js.sh
#!/bin/sh
set -eu
printf 'window.__env = { apiUrl: "%s" };\n' "$API_URL" > /usr/share/nginx/html/env.js
SCRIPT

USER root
RUN chmod g+w /usr/share/nginx/html/env.js
USER 101

ENV API_URL=http://localhost:9090
EXPOSE 8080
