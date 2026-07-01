import type { LinkedAccount } from '../api/types';

interface Props {
  accounts: LinkedAccount[];
  value: string | null;
  onChange: (id: string) => void;
}

/** Compact selector for choosing which linked Google account to act on. */
export function AccountPicker({ accounts, value, onChange }: Props) {
  if (accounts.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {accounts.map((a) => {
        const active = a.id === value;
        return (
          <button
            key={a.id}
            onClick={() => onChange(a.id)}
            className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition ${
              active
                ? 'border-brand-500/50 bg-brand-500/10 text-brand-200'
                : 'border-white/10 bg-ink-800/60 text-slate-300 hover:border-white/20'
            }`}
          >
            <span className="truncate">{a.email}</span>
            {a.isPrimary && (
              <span className="rounded-full bg-brand-500/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-brand-300">
                Primary
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
