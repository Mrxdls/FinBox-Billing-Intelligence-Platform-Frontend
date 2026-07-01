import { api } from '../lib/api';
import type {
  AnalyticsFilters,
  AnalyticsSummary,
  BreakdownDimension,
  BreakdownSlice,
  RecentReceipt,
  SpendBucket,
} from './types';

/** Strip undefined/empty values so we only send meaningful query params. */
const toParams = (f: AnalyticsFilters): Record<string, string> => {
  const params: Record<string, string> = {};
  for (const [key, value] of Object.entries(f)) {
    if (value === undefined || value === null || value === '') continue;
    if (typeof value === 'boolean') {
      if (value) params[key] = 'true';
    } else {
      params[key] = String(value);
    }
  }
  return params;
};

/** GET /api/analytics/summary — headline KPIs (filtered). */
export const getSummary = async (f: AnalyticsFilters = {}): Promise<AnalyticsSummary> => {
  const { data } = await api.get<AnalyticsSummary>('/analytics/summary', {
    params: toParams(f),
  });
  return data;
};

/** GET /api/analytics/spend-over-time — monthly spend series (filtered). */
export const getSpendOverTime = async (
  f: AnalyticsFilters = {}
): Promise<SpendBucket[]> => {
  const { data } = await api.get<{ series: SpendBucket[] }>('/analytics/spend-over-time', {
    params: toParams(f),
  });
  return data.series;
};

/** GET /api/analytics/breakdown?by= — pie-chart breakdown (filtered). */
export const getBreakdown = async (
  by: BreakdownDimension,
  f: AnalyticsFilters = {}
): Promise<{ by: string; slices: BreakdownSlice[] }> => {
  const { data } = await api.get<{ by: string; slices: BreakdownSlice[] }>(
    '/analytics/breakdown',
    { params: { by, ...toParams(f) } }
  );
  return data;
};

/** GET /api/analytics/recent — recent receipts (filtered + ordered). */
export const getRecent = async (f: AnalyticsFilters = {}): Promise<RecentReceipt[]> => {
  const { data } = await api.get<{ receipts: RecentReceipt[] }>('/analytics/recent', {
    params: toParams(f),
  });
  return data.receipts;
};
