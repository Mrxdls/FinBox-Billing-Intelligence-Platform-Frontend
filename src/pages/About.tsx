import { Github, Linkedin, Mail, MapPin } from 'lucide-react';
import { Button } from '../components/ui/Button';

const stack = [
  'TypeScript',
  'Node.js',
  'Express',
  'React',
  'PostgreSQL',
  'Drizzle ORM',
  'Redshift',
  'BullMQ',
  'Docker',
  'Google OAuth',
  'Airflow / ETL',
];

export default function About() {
  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-3xl">
        {/* Header card */}
        <div className="card overflow-hidden">
          <div className="h-28 bg-gradient-to-r from-brand-500/30 via-brand-500/10 to-cyan-500/20" />
          <div className="px-6 pb-6">
            <div className="-mt-10 flex items-end gap-4">
              <div className="grid h-20 w-20 place-items-center rounded-2xl border-4 border-ink-900 bg-brand-500 text-2xl font-black text-ink-950">
                MS
              </div>
              <div className="pb-1">
                <h1 className="text-2xl font-bold text-white">Mridul Soni</h1>
                <p className="text-sm text-slate-400">
                  Backend & Data Engineer · Builder of FinBox
                </p>
              </div>
            </div>

            <p className="mt-5 leading-relaxed text-slate-300">
              I build backend systems and data pipelines that turn messy real-world data
              into something useful. FinBox is my take on personal finance: instead of
              asking you to log expenses, it reads the receipts already in your inbox,
              extracts the numbers, and shows you where your money actually goes.
            </p>
            <p className="mt-3 leading-relaxed text-slate-400">
              The stack spans a clean, interface-driven TypeScript API, a secret-vault
              token model, a Gmail ingestion layer, and an ETL pipeline feeding a Redshift
              warehouse that powers the analytics you see in the dashboard.
            </p>

            <div className="mt-5 flex items-center gap-2 text-sm text-slate-500">
              <MapPin className="h-4 w-4" /> India · open to interesting problems
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a href="https://linkedin.com/in/mridulsoni" target="_blank" rel="noreferrer">
                <Button>
                  <Linkedin className="h-4 w-4" /> LinkedIn
                </Button>
              </a>
              <a href="mailto:mridulsoni.dev@gmail.com">
                <Button variant="secondary">
                  <Mail className="h-4 w-4" /> mridulsoni.dev@gmail.com
                </Button>
              </a>
              <a href="https://github.com/mridulsoni" target="_blank" rel="noreferrer">
                <Button variant="secondary">
                  <Github className="h-4 w-4" /> GitHub
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Tech chips */}
        <div className="card mt-5 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Tech I built FinBox with
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {stack.map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-300"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
