import { api, API_ORIGIN } from '../lib/api';
import type { LinkedAccount, User } from './types';

// ── Browser (full-page) redirects — these leave the SPA ─────────────────────
// Google's consent screen can't be fetched via XHR, so we navigate the tab.

/** GET /api/auth/google — begin sign-in. */
export const startGoogleLogin = (): void => {
  window.location.href = `${API_ORIGIN}/api/auth/google`;
};

/** GET /api/auth/google/link — link another Google account (requires session). */
export const startGoogleLink = (): void => {
  window.location.href = `${API_ORIGIN}/api/auth/google/link`;
};

// ── XHR endpoints ───────────────────────────────────────────────────────────

/** GET /api/auth/me — current authenticated user. */
export const getMe = async (): Promise<User> => {
  const { data } = await api.get<{ user: User }>('/auth/me');
  return data.user;
};

/** GET /api/auth/accounts — linked Google accounts for the current user. */
export const listAccounts = async (): Promise<LinkedAccount[]> => {
  const { data } = await api.get<{ accounts: LinkedAccount[] }>('/auth/accounts');
  return data.accounts;
};

/** POST /api/auth/refresh — mint a fresh access token from the refresh cookie. */
export const refresh = async (): Promise<string> => {
  const { data } = await api.post<{ accessToken: string }>('/auth/refresh');
  return data.accessToken;
};

/** POST /api/auth/logout — clear the auth cookies. */
export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

/** GET /api/health — liveness probe (no auth). */
export const health = async (): Promise<{ status: string }> => {
  const { data } = await api.get<{ status: string }>('/health');
  return data;
};
