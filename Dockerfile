# syntax=docker/dockerfile:1
# The landing as an immutable image: the prerendered site plus a ~5 MB server to hand it out.
#
# Not nginx. The host runs nginx as TLS terminator and router; a second one inside would mean two
# configs for the same routing with only the outer one visible to `nginx -t`. The container serves
# files, the vhost decides everything else.

# ---- build ----
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# vite build + the SSR pass + prerender, so dist/ holds a real HTML file per route. That is the
# whole point of this site: Яндекс indexes the regional pages, and it does not run JavaScript well.
RUN npm run build

# ---- serve ----
FROM joseluisq/static-web-server:2-alpine AS runtime

COPY --from=build /app/dist /public

ENV SERVER_ROOT=/public \
    SERVER_HOST=0.0.0.0 \
    SERVER_PORT=8080 \
    SERVER_HEALTH=true \
    # Every route is a real file, so a fallback page would only mask a broken prerender. The vhost
    # serves dist/404.html for genuine misses.
    SERVER_LOG_LEVEL=info

EXPOSE 8080
