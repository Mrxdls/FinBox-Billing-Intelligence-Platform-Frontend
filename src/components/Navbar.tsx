import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Logo } from './Logo';
import { Button } from './ui/Button';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/accounts', label: 'Accounts' },
  { to: '/docs', label: 'Docs' },
  { to: '/api-docs', label: 'API' },
  { to: '/about', label: 'About' },
];

export function Navbar() {
  const { user, loading, login, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-ink-950/80 backdrop-blur-xl">
      <nav className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <Logo />
          <span className="text-lg font-bold tracking-tight text-white">
            Fin<span className="text-brand-400">Box</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive ? 'bg-white/[0.06] text-white' : 'text-slate-400 hover:text-white'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {loading ? (
            <div className="h-9 w-24 animate-pulse rounded-xl bg-white/5" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt=""
                    className="h-8 w-8 rounded-full border border-white/10"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="grid h-8 w-8 place-items-center rounded-full bg-brand-500/20 text-sm font-semibold text-brand-300">
                    {(user.name ?? user.email).charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="max-w-[10rem] truncate text-sm text-slate-300">
                  {user.name ?? user.email}
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button size="sm" onClick={login}>
              Sign in
            </Button>
          )}
        </div>

        <button
          className="rounded-lg p-2 text-slate-300 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/[0.06] px-5 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2.5 text-sm font-medium ${
                    isActive ? 'bg-white/[0.06] text-white' : 'text-slate-300'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <div className="mt-2 border-t border-white/[0.06] pt-3">
              {user ? (
                <Button variant="secondary" size="sm" className="w-full" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" /> Sign out
                </Button>
              ) : (
                <Button size="sm" className="w-full" onClick={login}>
                  Sign in with Google
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
