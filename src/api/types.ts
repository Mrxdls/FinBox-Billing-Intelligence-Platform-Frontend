// Types mirror the backend's OpenAPI schemas (Backend/src/docs/openapi.ts).

export interface User {
  id: string;
  email: string;
  name: string | null;
  picture: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LinkedAccount {
  id: string;
  email: string;
  scope: string | null;
  expiryDate: number | null;
  isPrimary: boolean;
  createdAt: string;
}

export interface MailMessage {
  id: string;
  subject: string;
  from: string;
  date: string;
  snippet: string;
}

export interface TargetSender {
  id: string;
  googleAccountId: string;
  senderEmail: string;
  createdAt: string;
}

export interface SendersResponse {
  accountId: string;
  count: number;
  senders: TargetSender[];
}

export interface AnalyticsSummary {
  receipts: number;
  totalSpend: number;
  vendors: number;
  avgReceipt: number;
  anomalies: number;
}

export interface SpendBucket {
  year: number;
  month: number;
  label: string; // e.g. "Jun"
  total: number;
  receipts: number;
}

export interface BreakdownSlice {
  label: string;
  value: number; // summed total
  receipts: number;
}

export type BreakdownDimension = 'vendor' | 'category' | 'currency' | 'status';

export interface RecentReceipt {
  emailId: string;
  vendor: string | null;
  total: number | null;
  currency: string | null;
  emailDate: string | null;
  invoiceNumber: string | null;
}

/** Shared filter query params accepted by every /analytics endpoint. */
export interface AnalyticsFilters {
  from?: string; // YYYY-MM-DD
  to?: string; // YYYY-MM-DD
  vendorKey?: string;
  vendor?: string;
  category?: string;
  currency?: string;
  minTotal?: number;
  maxTotal?: number;
  anomalyOnly?: boolean;
  order?: 'date' | 'total' | 'vendor';
  dir?: 'asc' | 'desc';
  limit?: number; // 1..100
}
