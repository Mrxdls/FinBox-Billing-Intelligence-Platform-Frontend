import { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/Logo';
import { Button } from '../components/ui/Button';

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.4 14.97.4 12 .4A11 11 0 0 0 2.18 7.05l3.66 2.84C6.71 6.68 9.14 4.75 12 4.75Z"
    />
  </svg>
);

export default function Login() {
  const { user, loading, login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const from = (location.state as { from?: string } | null)?.from ?? '/dashboard';

  useEffect(() => {
    if (!loading && user) navigate(from, { replace: true });
  }, [loading, user, from, navigate]);

  if (!loading && user) return <Navigate to={from} replace />;

  return (
    <div className="container-page grid place-items-center py-24">
      <div className="card w-full max-w-md p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center">
          <Logo className="h-12 w-12" />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-white">Welcome to FinBox</h1>
        <p className="mt-2 text-sm text-slate-400">
          Sign in with Google to connect your inbox and see your spend.
        </p>

        <Button size="lg" className="mt-7 w-full" onClick={login}>
          <GoogleIcon /> Continue with Google
        </Button>

        <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-white/10 bg-ink-800/50 px-4 py-3 text-left text-xs text-slate-400">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
          <p>
            FinBox requests <span className="text-slate-200">read-only</span> Gmail access.
            Your Google tokens are kept in a secret vault, never in a database.
          </p>
        </div>
      </div>
    </div>
  );
}
