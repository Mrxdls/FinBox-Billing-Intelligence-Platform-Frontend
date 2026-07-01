import { ExternalLink, Info } from 'lucide-react';
import { BACKEND_DOCS_URL } from '../lib/api';
import { Button } from '../components/ui/Button';

export default function ApiDocs() {
  return (
    <div className="container-page py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">API reference</h1>
          <p className="mt-1 text-sm text-slate-400">
            Live Swagger UI served by the backend — try any endpoint right here.
          </p>
        </div>
        <a href={BACKEND_DOCS_URL} target="_blank" rel="noreferrer">
          <Button variant="secondary" size="sm">
            <ExternalLink className="h-4 w-4" /> Open in new tab
          </Button>
        </a>
      </div>

      <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-white/10 bg-ink-900/60 px-4 py-3 text-sm text-slate-400">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
        <p>
          Swagger sends your auth cookies automatically. If protected endpoints return{' '}
          <code className="text-brand-300">401</code>, sign in first (the Google consent
          screen only opens in a full browser tab), then reload this page.
        </p>
      </div>

      <div className="card mt-4 overflow-hidden bg-white p-0">
        {/* The backend mounts /api/docs before helmet, so it carries no
            X-Frame-Options header and embeds cleanly here. */}
        <iframe
          title="FinBox API reference (Swagger)"
          src={BACKEND_DOCS_URL}
          className="h-[calc(100vh-16rem)] min-h-[600px] w-full border-0"
        />
      </div>
    </div>
  );
}
