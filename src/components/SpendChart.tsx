import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { SpendBucket } from '../api/types';
import { compact, money, monthLabel } from '../lib/format';

export function SpendChart({ data }: { data: SpendBucket[] }) {
  const rows = data.map((d) => ({ ...d, name: monthLabel(d.label, d.year) }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={rows} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
        <defs>
          <linearGradient id="spendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
        <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis
          tickFormatter={(v) => compact(v as number)}
          tick={{ fill: '#94a3b8', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={56}
        />
        <Tooltip
          cursor={{ stroke: 'rgba(16,185,129,0.3)' }}
          contentStyle={{
            background: '#0b1220',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 12,
            color: '#e2e8f0',
          }}
          formatter={(v: number | string, key) =>
            key === 'total' ? [money(Number(v)), 'Spend'] : [v, 'Receipts']
          }
        />
        <Area
          type="monotone"
          dataKey="total"
          stroke="#34d399"
          strokeWidth={2.5}
          fill="url(#spendFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
