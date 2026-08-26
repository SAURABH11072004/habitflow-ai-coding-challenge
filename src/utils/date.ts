/**
 * Date utility functions for consistent YYYY-MM-DD formatting,
 * calendar calculations, and 7-day matrix generation.
 */

/**
 * Format a Date object as YYYY-MM-DD in local time
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parse a YYYY-MM-DD string into a local Date object set to 00:00:00
 */
export function parseDate(dateStr: string): Date {
  const parts = dateStr.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) {
    return new Date();
  }
  const [year, month, day] = parts;
  return new Date(year, month - 1, day, 0, 0, 0, 0);
}

/**
 * Returns today's date in YYYY-MM-DD format
 */
export function getTodayString(): string {
  return formatDate(new Date());
}

/**
 * Add or subtract days from a YYYY-MM-DD string
 */
export function addDays(dateStr: string, days: number): string {
  const d = parseDate(dateStr);
  d.setDate(d.getDate() + days);
  return formatDate(d);
}

/**
 * Returns yesterday's date relative to an optional reference date
 */
export function getYesterdayString(refDateStr?: string): string {
  const base = refDateStr || getTodayString();
  return addDays(base, -1);
}

/**
 * Calculate the difference in calendar days between two dates (date2 - date1)
 */
export function daysBetween(dateStr1: string, dateStr2: string): number {
  const d1 = parseDate(dateStr1);
  const d2 = parseDate(dateStr2);
  const diffTime = d2.getTime() - d1.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Returns the last N days up to reference date (inclusive), ordered chronologically.
 * The last day (index numDays - 1) is the reference date (Today).
 */
export function getPastDays(
  numDays: number = 7,
  refDateStr?: string
): { dateStr: string; dayNameShort: string; dayNameFull: string; dayNumber: number; isToday: boolean }[] {
  const todayStr = getTodayString();
  const targetRef = refDateStr || todayStr;
  const days: { dateStr: string; dayNameShort: string; dayNameFull: string; dayNumber: number; isToday: boolean }[] = [];

  for (let i = numDays - 1; i >= 0; i--) {
    const currentStr = addDays(targetRef, -i);
    const dateObj = parseDate(currentStr);
    
    const dayNameShort = dateObj.toLocaleDateString('en-US', { weekday: 'short' }); // e.g. Mon, Tue
    const dayNameFull = dateObj.toLocaleDateString('en-US', { weekday: 'long' });   // e.g. Monday
    const dayNumber = dateObj.getDate();

    days.push({
      dateStr: currentStr,
      dayNameShort,
      dayNameFull,
      dayNumber,
      isToday: currentStr === todayStr,
    });
  }

  return days;
}

/**
 * Formats a date string for display (e.g. "Today", "Yesterday", or "Aug 26, 2026")
 */
export function formatDisplayDate(dateStr: string): string {
  const today = getTodayString();
  const yesterday = getYesterdayString(today);

  if (dateStr === today) return 'Today';
  if (dateStr === yesterday) return 'Yesterday';

  const date = parseDate(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
  });
}
