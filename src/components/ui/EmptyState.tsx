import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface Props {
  icon?: LucideIcon;
  title: string;
  message?: string;
  children?: ReactNode;
}

export function EmptyState({ icon: Icon, title, message, children }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/10 py-12 text-center">
      {Icon && (
        <div className="rounded-full bg-white/5 p-3 text-slate-400">
          <Icon className="h-6 w-6" />
        </div>
      )}
      <div>
        <p className="font-medium text-slate-200">{title}</p>
        {message && <p className="mt-1 text-sm text-slate-500">{message}</p>}
      </div>
      {children}
    </div>
  );
}
