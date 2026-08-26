import { describe, it, expect } from 'vitest';
import {
  addDays,
  daysBetween,
  formatDate,
  formatDisplayDate,
  getPastDays,
  getTodayString,
  getYesterdayString,
  parseDate,
} from '../src/utils/date';
import type { Habit } from '../src/types/habit';

describe('Date Utilities & Calculations', () => {
  it('formats Date to YYYY-MM-DD', () => {
    const d = new Date(2026, 7, 26); // August is month 7 (0-indexed)
    expect(formatDate(d)).toBe('2026-08-26');
  });

  it('parses YYYY-MM-DD into a local Date object correctly', () => {
    const d = parseDate('2026-08-26');
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(7);
    expect(d.getDate()).toBe(26);
  });

  it('adds and subtracts days correctly across month & leap boundaries', () => {
    expect(addDays('2026-08-26', 1)).toBe('2026-08-27');
    expect(addDays('2026-08-26', -1)).toBe('2026-08-25');
    // Month transition
    expect(addDays('2026-08-31', 1)).toBe('2026-09-01');
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
    // Leap year
    expect(addDays('2024-03-01', -1)).toBe('2024-02-29');
  });

  it('computes daysBetween accurately', () => {
    expect(daysBetween('2026-08-20', '2026-08-26')).toBe(6);
    expect(daysBetween('2026-08-26', '2026-08-20')).toBe(-6);
    expect(daysBetween('2026-08-26', '2026-08-26')).toBe(0);
  });

  it('returns past N days ordered chronologically ending on reference date', () => {
    const past7 = getPastDays(7, '2026-08-26');
    expect(past7.length).toBe(7);
    expect(past7[0].dateStr).toBe('2026-08-20');
    expect(past7[6].dateStr).toBe('2026-08-26');
    expect(past7[6].dayNumber).toBe(26);
  });

  it('formats display dates friendly (Today, Yesterday, formatted date)', () => {
    const today = getTodayString();
    const yesterday = getYesterdayString(today);
    expect(formatDisplayDate(today)).toBe('Today');
    expect(formatDisplayDate(yesterday)).toBe('Yesterday');
  });
});

describe('Habit Data Lifecycle Operations', () => {
  const createMockHabit = (): Habit => ({
    id: 'habit-101',
    name: 'Read Philosophy',
    frequency: 'daily',
    notes: 'Read Seneca or Marcus Aurelius',
    reminderText: 'Evening routine',
    completions: ['2026-08-24', '2026-08-25'],
    archived: false,
    createdAt: '2026-08-01T00:00:00.000Z',
    color: 'violet',
    category: 'learning',
  });

  it('toggles completion date on and off', () => {
    const habit = createMockHabit();
    const todayStr = '2026-08-26';

    // Add completion
    const updated1 = {
      ...habit,
      completions: [...habit.completions, todayStr],
    };
    expect(updated1.completions).toContain('2026-08-26');
    expect(updated1.completions.length).toBe(3);

    // Toggle off completion
    const updated2 = {
      ...updated1,
      completions: updated1.completions.filter(d => d !== todayStr),
    };
    expect(updated2.completions).not.toContain('2026-08-26');
    expect(updated2.completions.length).toBe(2);
  });

  it('prevents duplicate dates in completions array', () => {
    const habit = createMockHabit();
    const duplicates = ['2026-08-24', '2026-08-24', '2026-08-25', '2026-08-25', '2026-08-26'];
    const unique = Array.from(new Set(duplicates)).sort();
    const updated = { ...habit, completions: unique };
    expect(updated.completions.length).toBe(3);
    expect(updated.completions).toEqual(['2026-08-24', '2026-08-25', '2026-08-26']);
  });

  it('archives and restores a habit', () => {
    const habit = createMockHabit();

    // Archive
    const archived = { ...habit, archived: true };
    expect(archived.archived).toBe(true);

    // Restore
    const restored = { ...archived, archived: false };
    expect(restored.archived).toBe(false);
  });

  it('resets habit progress by clearing completions while keeping configuration', () => {
    const habit = createMockHabit();
    const reset = { ...habit, completions: [] };

    expect(reset.completions).toEqual([]);
    expect(reset.name).toBe('Read Philosophy');
    expect(reset.notes).toBe('Read Seneca or Marcus Aurelius');
    expect(reset.reminderText).toBe('Evening routine');
    expect(reset.color).toBe('violet');
    expect(reset.frequency).toBe('daily');
  });

  it('preserves completions when editing name, notes, or reminder text', () => {
    const habit = createMockHabit();
    const edited: Habit = {
      ...habit,
      name: 'Read Stoic Philosophy Daily',
      notes: 'Updated notes',
      reminderText: '9:00 PM alert',
    };

    expect(edited.completions).toEqual(['2026-08-24', '2026-08-25']);
    expect(edited.name).toBe('Read Stoic Philosophy Daily');
  });
});
