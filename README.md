# FinBox — Frontend

React + TypeScript SPA for **FinBox**, the Gmail-based receipt-analytics product.
It implements **every** backend endpoint and ships a marketing site, an architecture
doc, an embedded API reference, and the authenticated app (dashboard + accounts).

- **Stack:** Vite · React 18 · TypeScript · React Router · Tailwind CSS · TanStack Query · axios · Recharts
- **Auth:** cookie-based (httpOnly JWTs set by the backend). The SPA never stores a token; every call uses `withCredentials`, and a 401 transparently triggers `POST /auth/refresh` + retry.

## Pages

| Route | What |
|---|---|
| `/` | Marketing homepage (hero, features, how-it-works, CTA) |
| `/about` | About the author — Mridul Soni |
| `/docs` | Architecture & system design, with a live backend health check |
| `/api-docs` | Embedded Swagger UI (iframe of the backend's `/api/docs`) |
| `/login` | Google sign-in |
| `/dashboard` | Analytics: KPIs, spend-over-time, breakdown pie, recent receipts, filters *(protected)* |
| `/accounts` | Linked accounts, senders CRUD, recent mail, sync *(protected)* |

## Endpoint coverage (`src/api/`)

- **auth.ts** — `google` / `google/link` redirects, `me`, `accounts`, `refresh`, `logout`, `health`
- **mail.ts** — `GET /mail/:id`, `POST /mail/:id/sync`
- **senders.ts** — list / add / remove target senders
- **analytics.ts** — `summary`, `spend-over-time`, `breakdown?by=`, `recent` (all with the shared filter set)

## Local development

```bash
cp .env.example .env      # defaults point at http://localhost:4000/api
npm install
npm run dev               # http://localhost:3000
```

The dev server runs on **port 3000** on purpose — it matches the backend's default
`CLIENT_URL`, so cookies, CORS and the OAuth redirect all line up with **no backend
change** in local dev. Make sure the backend is running (`cd ../Backend && npm run dev`).

### Environment variables

| Var | Default | Purpose |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:4000/api` | Backend API base (must include `/api`) |
| `VITE_BACKEND_DOCS_URL` | `http://localhost:4000/api/docs` | Swagger UI embedded on `/api-docs` |

> `VITE_*` values are **baked in at build time**, not read at runtime. For Docker, pass them as build args (below).

## Build

```bash
npm run build     # type-checks then emits static files to dist/
npm run preview   # serve the production build locally on :3000
```

## Docker

```bash
# from the Frontend/ directory
docker build -t finbox-frontend .
docker run -p 3000:3000 finbox-frontend
# → http://localhost:3000

# point at a deployed backend:
docker build \
  --build-arg VITE_API_BASE_URL=https://api.yourhost.com/api \
  --build-arg VITE_BACKEND_DOCS_URL=https://api.yourhost.com/api/docs \
  -t finbox-frontend .
```

nginx serves the static build with SPA history fallback, so deep links like
`/dashboard` resolve on refresh.

### Optional: add to the backend's docker-compose

You can run the frontend alongside the backend by appending a service to
`../Backend/docker-compose.yaml`:

```yaml
  frontend:
    build:
      context: ../Frontend
      args:
        VITE_API_BASE_URL: http://localhost:4000/api
        VITE_BACKEND_DOCS_URL: http://localhost:4000/api/docs
    ports:
      - "3000:3000"
    restart: unless-stopped
```

## ⭐ Backend callback / CORS — what to change

Two different URLs in `Backend/.env` — **don't** confuse them:

1. **`CLIENT_URL`** — where the backend lands the browser after Google login
   (`Backend/src/controllers/auth.controller.ts` → `res.redirect(config.clientUrl)`)
   **and** the allowed CORS origin (`Backend/src/app.ts`). Set it to **this frontend's
   origin**. For local dev the default `http://localhost:3000` already matches → nothing
   to change. Hosting the frontend elsewhere? Set `CLIENT_URL=https://your-frontend-host`
   and rebuild the frontend with a matching `VITE_API_BASE_URL`.

2. **`GOOGLE_REDIRECT_URI`** — this is **Google → backend**
   (`http://localhost:4000/api/auth/google/callback`). Leave it pointing at the backend
   and register the exact same URL in Google Cloud Console. **Do not** point it at the
   frontend.

*(Optional)* To land users on `/dashboard` instead of the homepage after login, change the
redirect in `Backend/src/controllers/auth.controller.ts` to
`` res.redirect(`${config.clientUrl}/dashboard`) ``.
