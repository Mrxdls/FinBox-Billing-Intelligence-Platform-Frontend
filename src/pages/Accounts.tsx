import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AtSign,
  Inbox,
  Mail,
  Plus,
  RefreshCw,
  Trash2,
  UserPlus,
} from 'lucide-react';
import { listAccounts, startGoogleLink } from '../api/auth';
import { addSender, listSenders, removeSender } from '../api/senders';
import { enqueueSync, getRecentMail } from '../api/mail';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { useToast } from '../components/ui/Toast';
import { errorMessage } from '../lib/api';
import { shortDate } from '../lib/format';

export default function Accounts() {
  const qc = useQueryClient();
  const toast = useToast();
  const [selected, setSelected] = useState<string | null>(null);
  const [newSender, setNewSender] = useState('');

  const accounts = useQuery({ queryKey: ['accounts'], queryFn: listAccounts });

  // Default the selection to the primary (or first) account once loaded.
  useEffect(() => {
    if (!selected && accounts.data && accounts.data.length > 0) {
      const primary = accounts.data.find((a) => a.isPrimary) ?? accounts.data[0];
      setSelected(primary.id);
    }
  }, [accounts.data, selected]);

  const senders = useQuery({
    queryKey: ['senders', selected],
    queryFn: () => listSenders(selected!),
    enabled: !!selected,
  });

  const mail = useQuery({
    queryKey: ['mail', selected],
    queryFn: () => getRecentMail(selected!, 10),
    enabled: !!selected,
  });

  const addMut = useMutation({
    mutationFn: () => addSender(selected!, newSender.trim()),
    onSuccess: (data) => {
      qc.setQueryData(['senders', selected], data);
      setNewSender('');
      toast.success('Sender added');
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  const removeMut = useMutation({
    mutationFn: (senderId: string) => removeSender(selected!, senderId),
    onSuccess: (data) => {
      qc.setQueryData(['senders', selected], data);
      toast.info('Sender removed');
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  const syncMut = useMutation({
    mutationFn: () => enqueueSync(selected!),
    onSuccess: () => toast.success('Sync queued — receipts will appear shortly'),
    onError: (e) => toast.error(errorMessage(e)),
  });

  const submitSender = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSender.trim()) addMut.mutate();
  };

  return (
    <div className="container-page py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Linked accounts</h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage the Google accounts FinBox reads, and the senders it tracks.
          </p>
        </div>
        <Button onClick={startGoogleLink}>
          <UserPlus className="h-4 w-4" /> Link another account
        </Button>
      </div>

      {accounts.isLoading ? (
        <Spinner label="Loading accounts…" />
      ) : accounts.isError ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {errorMessage(accounts.error)}
        </div>
      ) : accounts.data && accounts.data.length === 0 ? (
        <EmptyState icon={Inbox} title="No linked accounts" message="Link a Google account to start.">
          <Button onClick={startGoogleLink}>
            <UserPlus className="h-4 w-4" /> Link account
          </Button>
        </EmptyState>
      ) : (
        <>
          {/* Account cards */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {accounts.data?.map((a) => (
              <button
                key={a.id}
                onClick={() => setSelected(a.id)}
                className={`card p-4 text-left transition ${
                  selected === a.id ? 'ring-2 ring-brand-500/50' : 'hover:border-white/20'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-500/15 text-brand-300">
                      <Mail className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">{a.email}</p>
                      <p className="text-xs text-slate-500">Linked {shortDate(a.createdAt)}</p>
                    </div>
                  </div>
                  {a.isPrimary && <Badge tone="brand">Primary</Badge>}
                </div>
              </button>
            ))}
          </div>

          {selected && (
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              {/* Senders */}
              <div className="card p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-semibold text-white">Tracked senders</h2>
                  <Badge tone="slate">{senders.data?.count ?? 0}</Badge>
                </div>

                <form onSubmit={submitSender} className="mb-4 flex gap-2">
                  <div className="relative flex-1">
                    <AtSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      type="email"
                      required
                      placeholder="alerts@vendor.com"
                      className="input pl-9"
                      value={newSender}
                      onChange={(e) => setNewSender(e.target.value)}
                    />
                  </div>
                  <Button type="submit" disabled={addMut.isPending}>
                    <Plus className="h-4 w-4" /> Add
                  </Button>
                </form>

                {senders.isLoading ? (
                  <Spinner />
                ) : senders.data && senders.data.senders.length > 0 ? (
                  <ul className="divide-y divide-white/[0.05]">
                    {senders.data.senders.map((s) => (
                      <li key={s.id} className="flex items-center justify-between py-2.5">
                        <span className="truncate text-sm text-slate-200">{s.senderEmail}</span>
                        <button
                          onClick={() => removeMut.mutate(s.id)}
                          disabled={removeMut.isPending}
                          className="rounded-lg p-1.5 text-slate-500 transition hover:bg-red-500/10 hover:text-red-300"
                          aria-label="Remove sender"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <EmptyState
                    icon={AtSign}
                    title="No senders tracked"
                    message="Add the email addresses your receipts come from."
                  />
                )}
              </div>

              {/* Recent mail + sync */}
              <div className="card p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-semibold text-white">Recent mail</h2>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => syncMut.mutate()}
                    disabled={syncMut.isPending}
                  >
                    <RefreshCw className={`h-4 w-4 ${syncMut.isPending ? 'animate-spin' : ''}`} />
                    Sync now
                  </Button>
                </div>

                {mail.isLoading ? (
                  <Spinner />
                ) : mail.isError ? (
                  <div className="rounded-xl border border-white/10 bg-ink-800/50 px-4 py-3 text-sm text-slate-400">
                    {errorMessage(mail.error)}
                  </div>
                ) : mail.data && mail.data.length > 0 ? (
                  <ul className="space-y-3">
                    {mail.data.map((m) => (
                      <li key={m.id} className="rounded-xl border border-white/[0.06] bg-ink-800/40 p-3">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-medium text-slate-100">
                            {m.subject || '(no subject)'}
                          </p>
                          <span className="shrink-0 text-xs text-slate-500">{m.date}</span>
                        </div>
                        <p className="mt-0.5 truncate text-xs text-slate-500">{m.from}</p>
                        {m.snippet && (
                          <p className="mt-1.5 line-clamp-2 text-xs text-slate-400">{m.snippet}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <EmptyState icon={Inbox} title="No recent mail" message="Nothing to show for this account." />
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
