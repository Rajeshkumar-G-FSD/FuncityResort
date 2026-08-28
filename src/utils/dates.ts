/** Local-time YYYY-MM-DD for a Date (avoids UTC off-by-one from toISOString). */
export const toISODate = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

/** Today as YYYY-MM-DD. */
export const todayISO = (): string => toISODate(new Date());

/** Add n days to a YYYY-MM-DD string, returns YYYY-MM-DD. */
export const addDaysISO = (iso: string, n: number): string => {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + n);
  return toISODate(d);
};

/** Whole nights between two YYYY-MM-DD strings (0 if invalid / not positive). */
export const nightsBetween = (start: string, end: string): number => {
  if (!isISODate(start) || !isISODate(end)) return 0;
  const ms = new Date(`${end}T00:00:00`).getTime() - new Date(`${start}T00:00:00`).getTime();
  return Math.max(0, Math.round(ms / 86_400_000));
};

export const isISODate = (v: string): boolean => /^\d{4}-\d{2}-\d{2}$/.test(v);

/** Friendly label e.g. "24 Oct 2024" (empty string passes through). */
export const formatDate = (iso: string): string => {
  if (!isISODate(iso)) return iso || '';
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};
