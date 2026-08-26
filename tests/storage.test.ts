import { describe, it, expect, beforeEach } from 'vitest';
import {
  STORAGE_KEY,
  exportHabitsToJson,
  importHabitsFromJson,
  isValidHabit,
  loadHabitsFromStorage,
  sanitizeHabitRecord,
  saveHabitsToStorage,
} from '../src/utils/storage';
import type { Habit } from '../src/types/habit';

describe('Storage Utility & Persistence', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('loads starter sample daily habits when localStorage is empty', () => {
    const habits = loadHabitsFromStorage();
    expect(habits.length).toBeGreaterThan(0);
    expect(habits[0]).toHaveProperty('id');
    expect(habits[0]).toHaveProperty('name');
    expect(habits[0].frequency).toBe('daily');
  });

  it('saves and loads daily habits correctly from localStorage', () => {
    const mockHabits: Habit[] = [
      {
        id: 'test-1',
        name: 'Morning Stretch',
        frequency: 'daily',
        completions: ['2026-08-25', '2026-08-26'],
        archived: false,
        createdAt: '2026-08-20T00:00:00.000Z',
        color: 'emerald',
        category: 'fitness',
      },
    ];

    const saved = saveHabitsToStorage(mockHabits);
    expect(saved).toBe(true);

    const loaded = loadHabitsFromStorage();
    expect(loaded.length).toBe(1);
    expect(loaded[0].name).toBe('Morning Stretch');
    expect(loaded[0].frequency).toBe('daily');
    expect(loaded[0].completions).toEqual(['2026-08-25', '2026-08-26']);
  });

  it('gracefully handles corrupted JSON in localStorage without throwing', () => {
    window.localStorage.setItem(STORAGE_KEY, 'invalid{{json:broken!');
    
    // Should not throw, should fallback to sample starter habits
    const loaded = loadHabitsFromStorage();
    expect(loaded.length).toBeGreaterThan(0);
  });

  it('validates habit objects using isValidHabit', () => {
    expect(isValidHabit({ id: '1', name: 'Valid Daily Habit', completions: [] })).toBe(true);
    expect(isValidHabit({ id: '2', name: 'Valid Hydration', completions: ['2026-08-26'] })).toBe(true);
    
    // Invalid structures
    expect(isValidHabit(null)).toBe(false);
    expect(isValidHabit({})).toBe(false);
    expect(isValidHabit({ id: '', name: 'Empty ID', completions: [] })).toBe(false);
    expect(isValidHabit({ id: '3', name: '', completions: [] })).toBe(false);
    expect(isValidHabit({ id: '4', name: 'Bad Completions', completions: 'not-array' })).toBe(false);
  });

  it('sanitizes raw habit records and enforces daily frequency', () => {
    const raw = {
      id: 'h-100',
      name: '  Drink Water  ',
      frequency: 'other_custom',
      notes: 'Stay hydrated',
      reminderText: 'Morning',
      completions: ['2026-08-26', 'invalid-date', '2026-08-26'],
      archived: false,
      color: 'cyan',
      category: 'health',
    };

    const sanitized = sanitizeHabitRecord(raw);
    expect(sanitized).not.toBeNull();
    expect(sanitized?.name).toBe('Drink Water'); // Trimmed
    expect(sanitized?.frequency).toBe('daily'); // Enforced daily
    expect(sanitized?.completions).toEqual(['2026-08-26']); // Filtered and deduplicated
  });

  it('exports and imports backup JSON with versioned payload', () => {
    const mockHabits: Habit[] = [
      {
        id: 'h-export',
        name: 'Exported Daily Habit',
        frequency: 'daily',
        completions: ['2026-08-26'],
        archived: false,
        createdAt: '2026-08-26T00:00:00.000Z',
        color: 'rose',
        category: 'productivity',
      },
    ];

    const json = exportHabitsToJson(mockHabits);
    const parsed = JSON.parse(json);
    expect(parsed.version).toBe(1);
    expect(parsed.exportedAt).toBeDefined();
    expect(parsed.habits.length).toBe(1);

    const importResult = importHabitsFromJson(json);
    expect(importResult.success).toBe(true);
    expect(importResult.habits?.length).toBe(1);
    expect(importResult.habits?.[0].name).toBe('Exported Daily Habit');
  });

  it('returns error when importing invalid JSON or empty structure', () => {
    const invalidJsonResult = importHabitsFromJson('{ not valid json');
    expect(invalidJsonResult.success).toBe(false);
    expect(invalidJsonResult.error).toBeDefined();

    const emptyArrayResult = importHabitsFromJson(JSON.stringify([]));
    expect(emptyArrayResult.success).toBe(false);
  });
});
