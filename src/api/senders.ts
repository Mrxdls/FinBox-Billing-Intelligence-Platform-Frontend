import { api } from '../lib/api';
import type { SendersResponse } from './types';

/** GET /api/accounts/:accountId/senders — list all target senders. */
export const listSenders = async (accountId: string): Promise<SendersResponse> => {
  const { data } = await api.get<SendersResponse>(`/accounts/${accountId}/senders`);
  return data;
};

/** POST /api/accounts/:accountId/senders — add ONE sender (append, no override). */
export const addSender = async (
  accountId: string,
  sender: string
): Promise<SendersResponse> => {
  const { data } = await api.post<SendersResponse>(`/accounts/${accountId}/senders`, {
    sender,
  });
  return data;
};

/** DELETE /api/accounts/:accountId/senders/:senderId — remove ONE sender. */
export const removeSender = async (
  accountId: string,
  senderId: string
): Promise<SendersResponse> => {
  const { data } = await api.delete<SendersResponse>(
    `/accounts/${accountId}/senders/${senderId}`
  );
  return data;
};
