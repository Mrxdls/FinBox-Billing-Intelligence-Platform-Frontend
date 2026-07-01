import type { LucideIcon } from 'lucide-react';

interface Props {
  label: string;
  value: string;
  icon: LucideIcon;
  hint?: string;
  tone?: 'brand' | 'amber';
}

export function KpiCard({ label, value, icon: Icon, hint, tone = 'brand' }: Props) {
  const accent = tone === 'amber' ? 'text-amber-300 bg-amber-500/10' : 'text-brand-300 bg-brand-500/10';
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
        <span className={`rounded-lg p-1.5 ${accent}`}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight text-white">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
