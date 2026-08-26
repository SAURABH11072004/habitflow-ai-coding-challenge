import type { Habit } from '../types/habit';
import { addDays, daysBetween, getTodayString } from './date';

/**
 * Deduplicate and sort completion dates in ascending order (earliest to latest)
 */
export function sanitizeCompletions(completions: string[]): string[] {
  const unique = Array.from(new Set(completions.filter(Boolean)));
  return unique.sort((a, b) => a.localeCompare(b));
}

/**
 * Calculate Daily Streak
 *
 * Rules:
 * 1. Deduplicate & sort dates in chronological order.
 * 2. If completions are empty, currentStreak = 0, longestStreak = 0.
 * 3. A streak counts consecutive calendar days (difference between adjacent days is exactly 1).
 * 4. Current streak:
 *    - If today (reference date) is completed: count consecutive days backward from today.
 *    - If today is NOT in completions, check if yesterday was completed.
 *      If yesterday was completed, the active streak from yesterday is preserved (since today is still open),
 *      counting consecutive days backward from yesterday.
 *    - If neither today nor yesterday is completed, currentStreak = 0.
 * 5. Longest streak: find maximum consecutive sequence across entire history.
 */
export function calculateDailyStreak(
  completions: string[],
  refDateStr: string = getTodayString()
): { currentStreak: number; longestStreak: number } {
  const dates = sanitizeCompletions(completions);
  if (dates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const dateSet = new Set(dates);
  const yesterdayStr = addDays(refDateStr, -1);

  // 1. Calculate Current Streak
  let currentStreak = 0;
  let checkDate: string | null = null;

  if (dateSet.has(refDateStr)) {
    checkDate = refDateStr;
  } else if (dateSet.has(yesterdayStr)) {
    checkDate = yesterdayStr;
  }

  if (checkDate) {
    let curr = checkDate;
    while (dateSet.has(curr)) {
      currentStreak++;
      curr = addDays(curr, -1);
    }
  }

  // 2. Calculate Longest All-Time Streak
  let longestStreak = 0;
  let runningStreak = 0;

  for (let i = 0; i < dates.length; i++) {
    if (i === 0) {
      runningStreak = 1;
    } else {
      const diff = daysBetween(dates[i - 1], dates[i]);
      if (diff === 1) {
        runningStreak++;
      } else if (diff > 1) {
        runningStreak = 1;
      }
    }

    if (runningStreak > longestStreak) {
      longestStreak = runningStreak;
    }
  }

  // Longest streak should be at least current streak
  longestStreak = Math.max(longestStreak, currentStreak);

  return { currentStreak, longestStreak };
}

/**
 * Helper to calculate daily streak for a Habit object
 */
export function calculateStreak(
  habit: Habit,
  refDateStr?: string
): { currentStreak: number; longestStreak: number } {
  return calculateDailyStreak(habit.completions, refDateStr);
}
