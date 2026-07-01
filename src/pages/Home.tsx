import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  Boxes,
  Gauge,
  Link2,
  Mail,
  ShieldCheck,
  Sparkles,
  Wallet,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';

const features = [
  {
    icon: Mail,
    title: 'Reads your receipts',
    body: 'Connect Gmail read-only. FinBox finds order confirmations, invoices and payment receipts — no forwarding, no manual entry.',
  },
  {
    icon: Boxes,
    title: 'Multiple accounts',
    body: 'Link several Google accounts to one FinBox login. Personal, work, side-project — all your spend in one place.',
  },
  {
    icon: BarChart3,
    title: 'Real analytics',
    body: 'KPIs, spend-over-time, and vendor / category / currency breakdowns powered by a proper data warehouse.',
  },
  {
    icon: ShieldCheck,
    title: 'Anomaly flags',
    body: 'Unusual charges are flagged automatically so a surprise renewal never slips past you.',
  },
];

const steps = [
  {
    icon: Link2,
    title: 'Connect Gmail',
    body: 'Sign in with Google. FinBox gets read-only access — your tokens live in a secret vault, never in a database.',
  },
  {
    icon: Sparkles,
    title: 'We parse receipts',
    body: 'A background pipeline extracts vendor, amount, currency and dates from the emails you already receive.',
  },
  {
    icon: Gauge,
    title: 'See your money',
    body: 'Open the dashboard: totals, trends and breakdowns update as new receipts arrive.',
  },
];

export default function Home() {
  const { user, login } = useAuth();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-grid-faint [background-size:44px_44px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
          <div className="animate-float absolute -left-24 top-10 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
          <div className="animate-float absolute -right-16 top-40 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl [animation-delay:-6s]" />
        </div>

        <div className="container-page pb-16 pt-20 text-center sm:pt-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-slate-300">
            <Sparkles className="h-3.5 w-3.5 text-brand-400" />
            Turn inbox receipts into spend analytics
          </span>

          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-6xl">
            Understand every rupee your{' '}
            <span className="bg-gradient-to-r from-brand-300 to-cyan-300 bg-clip-text text-transparent">
              inbox already knows
            </span>{' '}
            about.
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-lg text-slate-400">
            FinBox reads the receipts sitting in your Gmail and turns them into clean,
            filterable spend analytics — automatically.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {user ? (
              <Link to="/dashboard">
                <Button size="lg">
                  Open dashboard <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Button size="lg" onClick={login}>
                <Wallet className="h-4 w-4" /> Connect Gmail
              </Button>
            )}
            <Link to="/docs">
              <Button variant="secondary" size="lg">
                How it works
              </Button>
            </Link>
          </div>

          <p className="mt-4 text-xs text-slate-600">
            Read-only Gmail access · Google OAuth · your tokens stay in a secret vault
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="container-page py-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="card group p-5 transition hover:border-brand-500/30">
              <span className="inline-flex rounded-xl bg-brand-500/10 p-2.5 text-brand-300 transition group-hover:bg-brand-500/20">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-semibold text-white">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="container-page py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white">How it works</h2>
          <p className="mt-3 text-slate-400">Three steps, then it runs on its own.</p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.title} className="card relative p-6">
              <span className="absolute right-5 top-5 text-5xl font-black text-white/[0.04]">
                {i + 1}
              </span>
              <span className="inline-flex rounded-xl bg-white/5 p-2.5 text-brand-300">
                <s.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-semibold text-white">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-page pb-8">
        <div className="card relative overflow-hidden p-10 text-center">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-brand-500/10 via-transparent to-cyan-500/10" />
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Ready to see where it all goes?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-slate-400">
            Connect your Gmail and get your first spend breakdown in minutes.
          </p>
          <div className="mt-6 flex justify-center">
            {user ? (
              <Link to="/dashboard">
                <Button size="lg">
                  Open dashboard <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Button size="lg" onClick={login}>
                <Wallet className="h-4 w-4" /> Get started free
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
