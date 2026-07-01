import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  AlertTriangle,
  ArrowUpDown,
  Building2,
  Receipt,
  Wallet,
  TrendingUp,
} from 'lucide-react';
import {
  getBreakdown,
  getRecent,
  getSpendOverTime,
  getSummary,
} from '../api/analytics';
import type { AnalyticsFilters, BreakdownDimension } from '../api/types';
import { KpiCard } from '../components/KpiCard';
import { FiltersBar } from '../components/FiltersBar';
import { SpendChart } from '../components/SpendChart';
import { BreakdownPie } from '../components/BreakdownPie';
import { Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { money, shortDate } from '../lib/format';
import { errorMessage } from '../lib/api';

const DIMS: { key: BreakdownDimension; label: string }[] = [
  { key: 'vendor', label: 'Vendor' },
  { key: 'category', label: 'Category' },
  { key: 'currency', label: 'Currency' },
  { key: 'status', label: 'Status' },
];

const ORDERS: { key: NonNullable<AnalyticsFilters['order']>; label: string }[] = [
  { key: 'date', label: 'Date' },
  { key: 'total', label: 'Total' },
  { key: 'vendor', label: 'Vendor' },
];

export default function Dashboard() {
  const [filters, setFilters] = useState<AnalyticsFilters>({});
  const [by, setBy] = useState<BreakdownDimension>('vendor');

  const summary = useQuery({
    queryKey: ['summary', filters],
    queryFn: () => getSummary(filters),
  });
  const spend = useQuery({
    queryKey: ['spend', filters],
    queryFn: () => getSpendOverTime(filters),
  });
  const breakdown = useQuery({
    queryKey: ['breakdown', by, filters],
    queryFn: () => getBreakdown(by, filters),
  });
  const recent = useQuery({
    queryKey: ['recent', filters],
    queryFn: () => getRecent(filters),
  });

  const anyError = summary.isError && spend.isError && breakdown.isError && recent.isError;

  return (
    <div className="container-page py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white">Spend analytics</h1>
        <p className="mt-1 text-sm text-slate-400">
          Everything FinBox extracted from your linked inboxes.
        </p>
      </div>

      {anyError && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          Couldn’t load analytics: {errorMessage(summary.error)}
        </div>
      )}

      <FiltersBar value={filters} onChange={setFilters} />

      {/* KPIs */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
        {summary.isLoading ? (
          <div className="col-span-full">
            <Spinner label="Crunching KPIs…" />
          </div>
        ) : summary.data ? (
          <>
            <KpiCard label="Receipts" value={String(summary.data.receipts)} icon={Receipt} />
            <KpiCard label="Total spend" value={money(summary.data.totalSpend)} icon={Wallet} />
            <KpiCard label="Vendors" value={String(summary.data.vendors)} icon={Building2} />
            <KpiCard label="Avg receipt" value={money(summary.data.avgReceipt)} icon={TrendingUp} />
            <KpiCard
              label="Anomalies"
              value={String(summary.data.anomalies)}
              icon={AlertTriangle}
              tone="amber"
            />
          </>
        ) : null}
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-4 lg:grid-cols-5">
        <div className="card p-5 lg:col-span-3">
          <h2 className="mb-4 font-semibold text-white">Spend over time</h2>
          {spend.isLoading ? (
            <Spinner />
          ) : spend.data && spend.data.length > 0 ? (
            <SpendChart data={spend.data} />
          ) : (
            <EmptyState icon={TrendingUp} title="No spend in range" message="Adjust the filters or sync more mail." />
          )}
        </div>

        <div className="card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-white">Breakdown</h2>
            <div className="flex rounded-lg border border-white/10 p-0.5">
              {DIMS.map((d) => (
                <button
                  key={d.key}
                  onClick={() => setBy(d.key)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                    by === d.key ? 'bg-brand-500/20 text-brand-200' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
          {breakdown.isLoading ? (
            <Spinner />
          ) : breakdown.data && breakdown.data.slices.length > 0 ? (
            <BreakdownPie slices={breakdown.data.slices} />
          ) : (
            <EmptyState icon={Building2} title="Nothing to break down" message="No receipts match these filters." />
          )}
        </div>
      </div>

      {/* Recent receipts */}
      <div className="card mt-6 p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-semibold text-white">Recent receipts</h2>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">
              <ArrowUpDown className="mr-1 inline h-3.5 w-3.5" />
              Sort
            </span>
            <select
              className="rounded-lg border border-white/10 bg-ink-800 px-2 py-1.5 text-slate-200"
              value={filters.order ?? 'date'}
              onChange={(e) =>
                setFilters({ ...filters, order: e.target.value as AnalyticsFilters['order'] })
              }
            >
              {ORDERS.map((o) => (
                <option key={o.key} value={o.key}>
                  {o.label}
                </option>
              ))}
            </select>
            <select
              className="rounded-lg border border-white/10 bg-ink-800 px-2 py-1.5 text-slate-200"
              value={filters.dir ?? 'desc'}
              onChange={(e) =>
                setFilters({ ...filters, dir: e.target.value as AnalyticsFilters['dir'] })
              }
            >
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
            <select
              className="rounded-lg border border-white/10 bg-ink-800 px-2 py-1.5 text-slate-200"
              value={filters.limit ?? 25}
              onChange={(e) => setFilters({ ...filters, limit: Number(e.target.value) })}
            >
              {[10, 25, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n} rows
                </option>
              ))}
            </select>
          </div>
        </div>

        {recent.isLoading ? (
          <Spinner />
        ) : recent.data && recent.data.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="pb-2.5 pr-4 font-medium">Vendor</th>
                  <th className="pb-2.5 pr-4 font-medium">Date</th>
                  <th className="pb-2.5 pr-4 font-medium">Invoice #</th>
                  <th className="pb-2.5 pr-4 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {recent.data.map((r) => (
                  <tr key={r.emailId} className="border-b border-white/[0.04] last:border-0">
                    <td className="py-2.5 pr-4 text-slate-200">{r.vendor ?? '—'}</td>
                    <td className="py-2.5 pr-4 text-slate-400">{shortDate(r.emailDate)}</td>
                    <td className="py-2.5 pr-4 font-mono text-xs text-slate-500">
                      {r.invoiceNumber ?? '—'}
                    </td>
                    <td className="py-2.5 pr-4 text-right tabular-nums text-slate-200">
                      {money(r.total, r.currency ?? 'INR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState icon={Receipt} title="No receipts yet" message="Link an account and run a sync from the Accounts page." />
        )}
      </div>
    </div>
  );
}
