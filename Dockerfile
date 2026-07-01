# syntax=docker/dockerfile:1
# Multi-stage build for the FinBox frontend.
#   - builder : install deps, bake in VITE_* env, produce static /dist via Vite.
#   - runtime : nginx serving the static SPA with history-mode fallback.

# ---- builder ----------------------------------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app

# Build-time API config. VITE_* vars are inlined into the bundle at build time,
# so they MUST be provided here (not at `docker run`). Override with:
#   docker build --build-arg VITE_API_BASE_URL=https://api.example.com/api .
ARG VITE_API_BASE_URL=https://finbox-api.mridulsoni.in
ARG VITE_BACKEND_DOCS_URL=https://finbox-api.mridulsoni.in/api/docs
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_BACKEND_DOCS_URL=$VITE_BACKEND_DOCS_URL

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build            # tsc + vite build -> /app/dist

# ---- runtime ----------------------------------------------------------------
FROM nginx:alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
