import { SlidersHorizontal, X } from 'lucide-react';
import type { AnalyticsFilters } from '../api/types';
import { Button } from './ui/Button';

interface Props {
  value: AnalyticsFilters;
  onChange: (next: AnalyticsFilters) => void;
}

/** Shared filter bar backing all four /analytics endpoints. */
export function FiltersBar({ value, onChange }: Props) {
  const set = <K extends keyof AnalyticsFilters>(key: K, v: AnalyticsFilters[K]) =>
    onChange({ ...value, [key]: v });

  const activeCount = Object.values(value).filter(
    (v) => v !== undefined && v !== '' && v !== false
  ).length;

  return (
    <div className="card p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
          <SlidersHorizontal className="h-4 w-4 text-brand-400" />
          Filters
          {activeCount > 0 && (
            <span className="rounded-full bg-brand-500/15 px-2 py-0.5 text-xs text-brand-300">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <Button variant="ghost" size="sm" onClick={() => onChange({})}>
            <X className="h-3.5 w-3.5" /> Clear
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <div>
          <label className="label">From</label>
          <input
            type="date"
            className="input"
            value={value.from ?? ''}
            onChange={(e) => set('from', e.target.value || undefined)}
          />
        </div>
        <div>
          <label className="label">To</label>
          <input
            type="date"
            className="input"
            value={value.to ?? ''}
            onChange={(e) => set('to', e.target.value || undefined)}
          />
        </div>
        <div>
          <label className="label">Vendor</label>
          <input
            className="input"
            placeholder="e.g. Uber"
            value={value.vendor ?? ''}
            onChange={(e) => set('vendor', e.target.value || undefined)}
          />
        </div>
        <div>
          <label className="label">Category</label>
          <input
            className="input"
            placeholder="e.g. Travel"
            value={value.category ?? ''}
            onChange={(e) => set('category', e.target.value || undefined)}
          />
        </div>
        <div>
          <label className="label">Currency</label>
          <input
            className="input"
            placeholder="INR"
            value={value.currency ?? ''}
            onChange={(e) => set('currency', e.target.value || undefined)}
          />
        </div>
        <div>
          <label className="label">Min total</label>
          <input
            type="number"
            className="input"
            value={value.minTotal ?? ''}
            onChange={(e) =>
              set('minTotal', e.target.value ? Number(e.target.value) : undefined)
            }
          />
        </div>
        <div>
          <label className="label">Max total</label>
          <input
            type="number"
            className="input"
            value={value.maxTotal ?? ''}
            onChange={(e) =>
              set('maxTotal', e.target.value ? Number(e.target.value) : undefined)
            }
          />
        </div>
        <div className="flex items-end">
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-ink-800/70 px-3.5 py-2.5 text-sm text-slate-200">
            <input
              type="checkbox"
              className="h-4 w-4 accent-brand-500"
              checked={value.anomalyOnly ?? false}
              onChange={(e) => set('anomalyOnly', e.target.checked || undefined)}
            />
            Anomalies only
          </label>
        </div>
      </div>
    </div>
  );
}
