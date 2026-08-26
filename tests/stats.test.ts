import { describe, it, expect } from 'vitest';
import type { Habit } from '../src/types/habit';
import { getPastDays, getTodayString, addDays } from '../src/utils/date';
import { calculateStreak } from '../src/utils/streak';

// Helper function that mirrors the hook's pure statistics calculation
function calculateDashboardStats(habits: Habit[], refDateStr: string = getTodayString()) {
  const active = habits.filter(h => !h.archived);
  const totalActive = active.length;
  const completedToday = active.filter(h => h.completions.includes(refDateStr)).length;

  let bestStreak = 0;
  let totalCompletionsAllTime = 0;

  for (const habit of active) {
    const { currentStreak } = calculateStreak(habit, refDateStr);
    if (currentStreak > bestStreak) {
      bestStreak = currentStreak;
    }
    totalCompletionsAllTime += habit.completions.length;
  }

  const past7Days = getPastDays(7, refDateStr).map(d => d.dateStr);
  const totalPossibleCheckins = totalActive * 7;

  let totalDoneInPast7Days = 0;
  for (const habit of active) {
    const doneCount = habit.completions.filter(c => past7Days.includes(c)).length;
    totalDoneInPast7Days += doneCount;
  }

  const sevenDayCompletionRate =
    totalPossibleCheckins > 0
      ? Math.min(100, Math.round((totalDoneInPast7Days / totalPossibleCheckins) * 100))
      : 0;

  return {
    totalActive,
    completedToday,
    bestStreak,
    sevenDayCompletionRate,
    totalCompletionsAllTime,
  };
}

describe('Dashboard Statistics Calculations', () => {
  const TODAY = '2026-08-26';
  const D_MINUS_1 = addDays(TODAY, -1);
  const D_MINUS_2 = addDays(TODAY, -2);
  const D_MINUS_3 = addDays(TODAY, -3);

  it('calculates Done Today correctly (active habits completed today / total active habits)', () => {
    const habits: Habit[] = [
      {
        id: 'h1',
        name: 'Habit 1',
        frequency: 'daily',
        completions: [TODAY],
        archived: false,
        createdAt: '2026-08-01T00:00:00.000Z',
      },
      {
        id: 'h2',
        name: 'Habit 2',
        frequency: 'daily',
        completions: [D_MINUS_1], // Not completed today
        archived: false,
        createdAt: '2026-08-01T00:00:00.000Z',
      },
      {
        id: 'h3',
        name: 'Habit 3',
        frequency: 'daily',
        completions: [TODAY],
        archived: false,
        createdAt: '2026-08-01T00:00:00.000Z',
      },
    ];

    const stats = calculateDashboardStats(habits, TODAY);
    expect(stats.totalActive).toBe(3);
    expect(stats.completedToday).toBe(2); // 2 out of 3
  });

  it('calculates 7-Day Completion Rate accurately', () => {
    const habits: Habit[] = [
      {
        id: 'h1',
        name: 'Habit 1',
        frequency: 'daily',
        completions: [D_MINUS_3, D_MINUS_2, D_MINUS_1, TODAY], // 4 completed in last 7 days
        archived: false,
        createdAt: '2026-08-01T00:00:00.000Z',
      },
      {
        id: 'h2',
        name: 'Habit 2',
        frequency: 'daily',
        completions: [D_MINUS_1, TODAY], // 2 completed in last 7 days
        archived: false,
        createdAt: '2026-08-01T00:00:00.000Z',
      },
    ];

    // Total possible = 2 habits * 7 days = 14
    // Total done = 4 + 2 = 6
    // Rate = 6 / 14 * 100 = 42.85% -> 43%
    const stats = calculateDashboardStats(habits, TODAY);
    expect(stats.sevenDayCompletionRate).toBe(43);
  });

  it('identifies Best Streak across all active habits', () => {
    const habits: Habit[] = [
      {
        id: 'h1',
        name: 'Habit 1 (2 day streak)',
        frequency: 'daily',
        completions: [D_MINUS_1, TODAY],
        archived: false,
        createdAt: '2026-08-01T00:00:00.000Z',
      },
      {
        id: 'h2',
        name: 'Habit 2 (4 day streak)',
        frequency: 'daily',
        completions: [D_MINUS_3, D_MINUS_2, D_MINUS_1, TODAY],
        archived: false,
        createdAt: '2026-08-01T00:00:00.000Z',
      },
    ];

    const stats = calculateDashboardStats(habits, TODAY);
    expect(stats.bestStreak).toBe(4);
  });

  it('strictly excludes archived habits from active statistics', () => {
    const habits: Habit[] = [
      {
        id: 'h1',
        name: 'Active Habit',
        frequency: 'daily',
        completions: [TODAY],
        archived: false,
        createdAt: '2026-08-01T00:00:00.000Z',
      },
      {
        id: 'h2',
        name: 'Archived Habit with large streak',
        frequency: 'daily',
        completions: [D_MINUS_3, D_MINUS_2, D_MINUS_1, TODAY], // 4-day streak, completed today
        archived: true, // ARCHIVED
        createdAt: '2026-08-01T00:00:00.000Z',
      },
    ];

    const stats = calculateDashboardStats(habits, TODAY);
    expect(stats.totalActive).toBe(1);
    expect(stats.completedToday).toBe(1);
    expect(stats.bestStreak).toBe(1); // Not 4 from the archived habit!
  });

  it('returns zeros when there are no active habits', () => {
    const stats = calculateDashboardStats([], TODAY);
    expect(stats.totalActive).toBe(0);
    expect(stats.completedToday).toBe(0);
    expect(stats.bestStreak).toBe(0);
    expect(stats.sevenDayCompletionRate).toBe(0);
  });
});
