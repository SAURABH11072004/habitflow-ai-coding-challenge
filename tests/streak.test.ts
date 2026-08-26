import { describe, it, expect } from 'vitest';
import {
  calculateDailyStreak,
  calculateStreak,
  sanitizeCompletions,
} from '../src/utils/streak';
import type { Habit } from '../src/types/habit';

describe('Daily Streak Engine Tests', () => {
  const REF_DATE = '2026-03-15'; // Reference "today" for deterministic testing

  it('returns 0 for empty completions', () => {
    const result = calculateDailyStreak([], REF_DATE);
    expect(result.currentStreak).toBe(0);
    expect(result.longestStreak).toBe(0);
  });

  it('returns 1 when only today is completed', () => {
    const result = calculateDailyStreak(['2026-03-15'], REF_DATE);
    expect(result.currentStreak).toBe(1);
    expect(result.longestStreak).toBe(1);
  });

  it('returns 1 when only yesterday is completed (streak remains active pending today)', () => {
    const result = calculateDailyStreak(['2026-03-14'], REF_DATE);
    expect(result.currentStreak).toBe(1);
    expect(result.longestStreak).toBe(1);
  });

  it('returns 0 when last completion was 2 days ago (broken streak)', () => {
    const result = calculateDailyStreak(['2026-03-13'], REF_DATE);
    expect(result.currentStreak).toBe(0);
    expect(result.longestStreak).toBe(1);
  });

  it('calculates consecutive completions ending today', () => {
    const completions = ['2026-03-11', '2026-03-12', '2026-03-13', '2026-03-14', '2026-03-15'];
    const result = calculateDailyStreak(completions, REF_DATE);
    expect(result.currentStreak).toBe(5);
    expect(result.longestStreak).toBe(5);
  });

  it('calculates consecutive completions ending yesterday (missing today)', () => {
    const completions = ['2026-03-11', '2026-03-12', '2026-03-13', '2026-03-14'];
    const result = calculateDailyStreak(completions, REF_DATE);
    expect(result.currentStreak).toBe(4);
    expect(result.longestStreak).toBe(4);
  });

  it('handles broken streaks and identifies longest all-time streak', () => {
    // 6 consecutive days in past, 2 day gap, then 2 consecutive days currently
    const completions = [
      '2026-03-01',
      '2026-03-02',
      '2026-03-03',
      '2026-03-04',
      '2026-03-05',
      '2026-03-06',
      // Gap: 07, 08 missing
      '2026-03-14',
      '2026-03-15',
    ];
    const result = calculateDailyStreak(completions, REF_DATE);
    expect(result.currentStreak).toBe(2);
    expect(result.longestStreak).toBe(6);
  });

  it('correctly handles month boundaries (e.g. Feb 27 -> Feb 28 -> Mar 1 -> Mar 2 in non-leap year)', () => {
    const refDate = '2025-03-02';
    const completions = ['2025-02-27', '2025-02-28', '2025-03-01', '2025-03-02'];
    const result = calculateDailyStreak(completions, refDate);
    expect(result.currentStreak).toBe(4);
    expect(result.longestStreak).toBe(4);
  });

  it('correctly handles leap year month boundaries (Feb 28 -> Feb 29 -> Mar 1 in 2024)', () => {
    const refDate = '2024-03-01';
    const completions = ['2024-02-28', '2024-02-29', '2024-03-01'];
    const result = calculateDailyStreak(completions, refDate);
    expect(result.currentStreak).toBe(3);
    expect(result.longestStreak).toBe(3);
  });

  it('correctly handles year boundary transitions (Dec 30 -> Dec 31 -> Jan 1 -> Jan 2)', () => {
    const refDate = '2026-01-02';
    const completions = ['2025-12-30', '2025-12-31', '2026-01-01', '2026-01-02'];
    const result = calculateDailyStreak(completions, refDate);
    expect(result.currentStreak).toBe(4);
    expect(result.longestStreak).toBe(4);
  });

  it('deduplicates duplicate completion dates without inflating streak', () => {
    const completions = [
      '2026-03-13',
      '2026-03-14',
      '2026-03-14', // Duplicate
      '2026-03-15',
      '2026-03-15', // Duplicate
    ];
    const result = calculateDailyStreak(completions, REF_DATE);
    expect(result.currentStreak).toBe(3);
    expect(result.longestStreak).toBe(3);
  });

  it('handles unsorted completion lists correctly', () => {
    const completions = ['2026-03-15', '2026-03-13', '2026-03-14'];
    const result = calculateDailyStreak(completions, REF_DATE);
    expect(result.currentStreak).toBe(3);
    expect(result.longestStreak).toBe(3);
  });

  it('sanitizes completions by removing falsy values and sorting', () => {
    const raw = ['2026-03-15', '', '2026-03-10', '2026-03-12', '2026-03-10'];
    const sanitized = sanitizeCompletions(raw);
    expect(sanitized).toEqual(['2026-03-10', '2026-03-12', '2026-03-15']);
  });

  it('calculates streak for Habit object via calculateStreak helper', () => {
    const habit: Habit = {
      id: 'h1',
      name: 'Daily Hydration',
      frequency: 'daily',
      completions: ['2026-03-14', '2026-03-15'],
      archived: false,
      createdAt: '2026-03-01T00:00:00.000Z',
    };
    const result = calculateStreak(habit, REF_DATE);
    expect(result.currentStreak).toBe(2);
    expect(result.longestStreak).toBe(2);
  });
});
