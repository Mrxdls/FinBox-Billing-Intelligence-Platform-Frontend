import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { getMe, logout as apiLogout, startGoogleLogin } from '../api/auth';
import type { User } from '../api/types';

interface AuthState {
  user: User | null;
  loading: boolean;
  login: () => void; // full-page redirect to Google
  logout: () => Promise<void>;
  refetch: () => Promise<void>;
}

const Ctx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    try {
      const me = await getMe();
      setUser(me);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Bootstrap the session once on mount. The 401 interceptor transparently
  // refreshes an expired access token, so a valid refresh cookie keeps us in.
  useEffect(() => {
    void refetch();
  }, [refetch]);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } finally {
      setUser(null);
    }
  }, []);

  const value: AuthState = { user, loading, login: startGoogleLogin, logout, refetch };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
