import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { BreakdownSlice } from '../api/types';
import { money } from '../lib/format';

const COLORS = [
  '#34d399',
  '#22d3ee',
  '#818cf8',
  '#f472b6',
  '#fbbf24',
  '#fb923c',
  '#a3e635',
  '#e879f9',
];

export function BreakdownPie({ slices }: { slices: BreakdownSlice[] }) {
  const total = slices.reduce((sum, s) => sum + s.value, 0);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={slices}
            dataKey="value"
            nameKey="label"
            innerRadius={55}
            outerRadius={95}
            paddingAngle={2}
            stroke="none"
          >
            {slices.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: '#0b1220',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              color: '#e2e8f0',
            }}
            formatter={(v: number | string) => money(Number(v))}
          />
        </PieChart>
      </ResponsiveContainer>

      <ul className="flex flex-col justify-center gap-2">
        {slices.slice(0, 8).map((s, i) => {
          const pct = total > 0 ? Math.round((s.value / total) * 100) : 0;
          return (
            <li key={s.label} className="flex items-center gap-2.5 text-sm">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: COLORS[i % COLORS.length] }}
              />
              <span className="flex-1 truncate text-slate-300">{s.label}</span>
              <span className="tabular-nums text-slate-400">{money(s.value)}</span>
              <span className="w-9 text-right tabular-nums text-slate-500">{pct}%</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
