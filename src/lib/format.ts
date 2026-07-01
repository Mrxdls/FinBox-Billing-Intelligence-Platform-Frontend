/** Format a number as currency. Falls back gracefully for null/unknown. */
export const money = (value: number | null | undefined, currency = 'INR'): string => {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    // Unknown ISO code → plain number with the code appended.
    return `${new Intl.NumberFormat('en-IN').format(value)} ${currency}`;
  }
};

/** Compact number, e.g. 12,340 → "12.3K". */
export const compact = (value: number | null | undefined): string => {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  return new Intl.NumberFormat('en-IN', { notation: 'compact', maximumFractionDigits: 1 }).format(
    value
  );
};

/** Format an ISO-ish date string to a short readable date. */
export const shortDate = (value: string | null | undefined): string => {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

/** Turn a SpendBucket {year, month, label} into "Jun '25". */
export const monthLabel = (label: string, year: number): string =>
  `${label} '${String(year).slice(-2)}`;
