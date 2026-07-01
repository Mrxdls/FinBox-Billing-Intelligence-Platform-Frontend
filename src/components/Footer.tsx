import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail } from 'lucide-react';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="mt-20 border-t border-white/[0.06]">
      <div className="container-page flex flex-col items-center justify-between gap-6 py-10 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <Logo className="h-7 w-7" />
          <div>
            <p className="text-sm font-semibold text-white">
              Fin<span className="text-brand-400">Box</span>
            </p>
            <p className="text-xs text-slate-500">Your inbox, in numbers.</p>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-400">
          <Link to="/docs" className="hover:text-white">
            Architecture
          </Link>
          <Link to="/api-docs" className="hover:text-white">
            API Reference
          </Link>
          <Link to="/about" className="hover:text-white">
            About
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="https://linkedin.com/in/mridulsoni"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-white/10 p-2 text-slate-400 transition hover:border-brand-500/40 hover:text-brand-300"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-4 w-4" />
          </a>
          <a
            href="mailto:mridulsoni.dev@gmail.com"
            className="rounded-lg border border-white/10 p-2 text-slate-400 transition hover:border-brand-500/40 hover:text-brand-300"
            aria-label="Email"
          >
            <Mail className="h-4 w-4" />
          </a>
          <a
            href="https://github.com/mridulsoni"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-white/10 p-2 text-slate-400 transition hover:border-brand-500/40 hover:text-brand-300"
            aria-label="GitHub"
          >
            <Github className="h-4 w-4" />
          </a>
        </div>
      </div>
      <div className="border-t border-white/[0.04] py-5 text-center text-xs text-slate-600">
        Built by Mridul Soni · © {new Date().getFullYear()} FinBox
      </div>
    </footer>
  );
}
