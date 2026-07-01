import type { ReactNode } from 'react';

type Tone = 'brand' | 'slate' | 'amber' | 'red';

const tones: Record<Tone, string> = {
  brand: 'bg-brand-500/15 text-brand-300 border-brand-500/30',
  slate: 'bg-white/5 text-slate-300 border-white/10',
  amber: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  red: 'bg-red-500/15 text-red-300 border-red-500/30',
};

export function Badge({ tone = 'slate', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
