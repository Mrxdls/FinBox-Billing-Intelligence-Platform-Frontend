import axios, { AxiosError, type AxiosRequestConfig } from 'axios';

/**
 * Single axios instance for the whole app.
 *
 * Auth is cookie-based (httpOnly `accessToken` / `refreshToken` set by the
 * backend), so we never read or store the JWT — `withCredentials: true` lets
 * the browser attach the cookies automatically on every same-site request.
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api';

export const BACKEND_DOCS_URL =
  import.meta.env.VITE_BACKEND_DOCS_URL ?? 'http://localhost:4000/api/docs';

/** Absolute origin of the API (without the trailing /api) — used for full-page
 *  OAuth redirects that must leave the SPA (e.g. GET /auth/google). */
export const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// ── 401 → refresh → retry (once) ────────────────────────────────────────────
// When the short-lived access token expires the backend returns 401. We call
// POST /auth/refresh (which re-sets the accessToken cookie from the refresh
// cookie) exactly once, then replay the original request.
let refreshing: Promise<void> | null = null;

const doRefresh = (): Promise<void> => {
  if (!refreshing) {
    refreshing = api
      .post('/auth/refresh')
      .then(() => undefined)
      .finally(() => {
        refreshing = null;
      });
  }
  return refreshing;
};

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined;
    const status = error.response?.status;
    const url = original?.url ?? '';

    // Don't try to refresh the refresh call itself, or auth bootstrap probes.
    const isAuthRoute = url.includes('/auth/refresh') || url.includes('/auth/logout');

    if (status === 401 && original && !original._retry && !isAuthRoute) {
      original._retry = true;
      try {
        await doRefresh();
        return api(original);
      } catch {
        // fall through to reject with the original error
      }
    }
    return Promise.reject(error);
  }
);

/** Turn an unknown thrown value into a human-readable message. */
export const errorMessage = (err: unknown): string => {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { error?: { message?: string } } | undefined;
    return data?.error?.message ?? err.message ?? 'Request failed';
  }
  return err instanceof Error ? err.message : 'Something went wrong';
};
