import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight,
  Boxes,
  Database,
  KeyRound,
  Layers,
  Mail,
  ShieldCheck,
  Cpu,
  BarChart3,
} from 'lucide-react';
import { health } from '../api/auth';
import { Badge } from '../components/ui/Badge';

/** A single node in the flow diagram. */
function Node({
  icon: Icon,
  label,
  sub,
}: {
  icon: typeof Mail;
  label: string;
  sub?: string;
}) {
  return (
    <div className="flex min-w-[130px] flex-col items-center rounded-xl border border-white/10 bg-ink-800/70 px-4 py-3 text-center">
      <Icon className="mb-1.5 h-5 w-5 text-brand-300" />
      <span className="text-sm font-medium text-white">{label}</span>
      {sub && <span className="text-[11px] text-slate-500">{sub}</span>}
    </div>
  );
}

function Arrow() {
  return <ArrowRight className="h-5 w-5 shrink-0 rotate-90 text-slate-600 md:rotate-0" />;
}

const layers = [
  {
    icon: Layers,
    name: 'domain/',
    desc: 'Pure contracts + types. Interfaces only — no implementation, no dependencies.',
  },
  {
    icon: Boxes,
    name: 'infra/',
    desc: 'Concrete implementations: Drizzle repos, Google OAuth, Azure/AWS secret stores, warehouse client.',
  },
  {
    icon: Cpu,
    name: 'services/',
    desc: 'Business logic implementing the domain service interfaces (auth, mail, analytics).',
  },
  {
    icon: ShieldCheck,
    name: 'controllers / routes / middlewares',
    desc: 'Thin HTTP layer. Factories that receive an interface — swapping a provider needs no change here.',
  },
];

export default function Docs() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['health'],
    queryFn: health,
    retry: 0,
  });

  return (
    <div className="container-page max-w-4xl py-16">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Architecture & system design</h1>
          <p className="mt-2 text-slate-400">
            How FinBox goes from an email in your inbox to a number on the dashboard.
          </p>
        </div>
        <div>
          {isLoading ? (
            <Badge tone="slate">checking backend…</Badge>
          ) : isError ? (
            <Badge tone="red">backend offline</Badge>
          ) : (
            <Badge tone="brand">backend: {data?.status}</Badge>
          )}
        </div>
      </div>

      {/* Data flow */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold text-white">The end-to-end flow</h2>
        <p className="mt-2 text-sm text-slate-400">
          Ingestion is asynchronous: the API stays fast while a background worker and ETL
          pipeline do the heavy lifting into the warehouse.
        </p>
        <div className="card mt-4 p-6">
          <div className="flex flex-col items-center gap-3 md:flex-row md:flex-wrap md:justify-center">
            <Node icon={Mail} label="Gmail" sub="your receipts" />
            <Arrow />
            <Node icon={ShieldCheck} label="OAuth + Vault" sub="tokens secured" />
            <Arrow />
            <Node icon={Cpu} label="Worker" sub="BullMQ mail-sync" />
            <Arrow />
            <Node icon={Database} label="ETL" sub="extract + parse" />
            <Arrow />
            <Node icon={Database} label="Warehouse" sub="Redshift" />
            <Arrow />
            <Node icon={BarChart3} label="Analytics API" sub="you are here" />
          </div>
        </div>
      </section>

      {/* Two-token model */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold text-white">The two-token model</h2>
        <p className="mt-2 text-sm text-slate-400">
          FinBox never mixes “who are you to us” with “what can we read from Google”. Two
          separate credentials, stored in two separate places.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="card p-5">
            <div className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-brand-300" />
              <h3 className="font-semibold text-white">Token #1 — App JWT</h3>
            </div>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              <li>• Authenticates requests to <span className="text-slate-200">our</span> API.</li>
              <li>• Short-lived <code className="text-brand-300">access</code> (15m) + <code className="text-brand-300">refresh</code> (30d).</li>
              <li>• Stateless, signature-verified, sent as <span className="text-slate-200">httpOnly cookies</span>.</li>
              <li>• Issued by our own <code className="text-brand-300">JwtService</code>.</li>
            </ul>
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-brand-300" />
              <h3 className="font-semibold text-white">Token #2 — Google tokens</h3>
            </div>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              <li>• Call the <span className="text-slate-200">Gmail API</span> as a linked account.</li>
              <li>• Google <code className="text-brand-300">access</code> + <code className="text-brand-300">refresh</code> tokens.</li>
              <li>• Stored in a <span className="text-slate-200">secret vault</span> (Azure Key Vault / AWS Secrets Manager).</li>
              <li>• <span className="text-slate-200">Never</span> written to Postgres — only a <code className="text-brand-300">secret_ref</code> pointer is.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Layered architecture */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold text-white">Interface-driven, dependency-injected</h2>
        <p className="mt-2 text-sm text-slate-400">
          Concrete classes implement domain interfaces and are wired in one place
          (<code className="text-brand-300">config/container.ts</code>). Swap Postgres, the OAuth
          provider, or the secret store without touching business logic.
        </p>
        <div className="mt-4 space-y-3">
          {layers.map((l) => (
            <div key={l.name} className="card flex items-start gap-4 p-5">
              <span className="mt-0.5 inline-flex rounded-xl bg-brand-500/10 p-2.5 text-brand-300">
                <l.icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-mono text-sm font-semibold text-white">{l.name}</h3>
                <p className="mt-1 text-sm text-slate-400">{l.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Auth sequence */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold text-white">Sign-in sequence</h2>
        <div className="card mt-4 p-6">
          <ol className="space-y-4">
            {[
              ['GET /api/auth/google', 'Redirect to Google consent with a signed state JWT + nonce cookie (CSRF).'],
              ['GET /api/auth/google/callback', 'Verify state, exchange the code, upsert the user + linked account, store Google tokens in the vault, set JWT cookies, redirect to the frontend.'],
              ['Frontend bootstrap', 'The SPA calls GET /api/auth/me; an expired access token is transparently refreshed via POST /api/auth/refresh.'],
              ['Authenticated calls', 'Every request carries the httpOnly cookie; the backend scopes each query to your user id.'],
            ].map(([code, desc], i) => (
              <li key={code} className="flex gap-4">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-500/15 text-sm font-semibold text-brand-300">
                  {i + 1}
                </span>
                <div>
                  <code className="text-sm text-brand-300">{code}</code>
                  <p className="mt-0.5 text-sm text-slate-400">{desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <p className="mt-10 text-center text-sm text-slate-500">
        Want the exact request/response shapes? See the{' '}
        <a href="/api-docs" className="text-brand-300 hover:underline">
          interactive API reference
        </a>
        .
      </p>
    </div>
  );
}
