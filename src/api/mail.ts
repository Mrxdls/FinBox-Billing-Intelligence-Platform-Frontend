import { api } from '../lib/api';
import type { MailMessage } from './types';

/** GET /api/mail/:accountId?max= — recent emails for one linked account. */
export const getRecentMail = async (
  accountId: string,
  max = 10
): Promise<MailMessage[]> => {
  const { data } = await api.get<{ messages: MailMessage[] }>(`/mail/${accountId}`, {
    params: { max },
  });
  return data.messages;
};

/** POST /api/mail/:accountId/sync — enqueue a background mail-sync job (202). */
export const enqueueSync = async (
  accountId: string,
  max?: number
): Promise<{ queued: boolean; accountId: string }> => {
  const { data } = await api.post<{ queued: boolean; accountId: string }>(
    `/mail/${accountId}/sync`,
    max ? { max } : {}
  );
  return data;
};
