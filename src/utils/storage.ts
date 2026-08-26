import type { Habit, HabitColor } from '../types/habit';
import { getInitialSampleHabits } from './sampleData';

export const STORAGE_KEY = 'HABIT_TRACKER_DATA_V1';
export const STORAGE_VERSION = 1;

export interface StoragePayload {
  version: number;
  exportedAt: string;
  habits: Habit[];
}

/**
 * Validate that an object has the essential structure of a Habit
 */
export function isValidHabit(item: unknown): item is Habit {
  if (!item || typeof item !== 'object') return false;
  const h = item as Record<string, unknown>;

  const hasValidId = typeof h.id === 'string' && h.id.trim().length > 0;
  const hasValidName = typeof h.name === 'string' && h.name.trim().length > 0;
  const hasValidCompletions = Array.isArray(h.completions) && h.completions.every(c => typeof c === 'string');

  return hasValidId && hasValidName && hasValidCompletions;
}

/**
 * Normalize and sanitize a raw habit record into a daily Habit
 */
export function sanitizeHabitRecord(raw: unknown): Habit | null {
  if (!isValidHabit(raw)) return null;

  const validColors: HabitColor[] = ['indigo', 'emerald', 'violet', 'amber', 'rose', 'cyan', 'blue', 'orange'];
  const color: HabitColor = validColors.includes(raw.color as HabitColor) ? (raw.color as HabitColor) : 'indigo';

  return {
    id: String(raw.id),
    name: String(raw.name).trim(),
    frequency: 'daily',
    notes: typeof raw.notes === 'string' ? raw.notes.trim() || undefined : undefined,
    reminderText: typeof raw.reminderText === 'string' ? raw.reminderText.trim() || undefined : undefined,
    completions: Array.from(new Set(raw.completions.filter(c => typeof c === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(c)))).sort(),
    archived: Boolean(raw.archived),
    createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : new Date().toISOString(),
    color,
    category: raw.category || 'other',
  };
}

/**
 * Load habits from localStorage with graceful fallback
 */
export function loadHabitsFromStorage(): Habit[] {
  if (typeof window === 'undefined' || !window.localStorage) {
    return getInitialSampleHabits();
  }

  try {
    const rawData = window.localStorage.getItem(STORAGE_KEY);
    if (!rawData) {
      // First-time visit: initialize with starter sample habits
      const initialHabits = getInitialSampleHabits();
      saveHabitsToStorage(initialHabits);
      return initialHabits;
    }

    const parsed = JSON.parse(rawData);
    
    // Support both wrapped payload { version, habits } and direct array
    let habitsArray: unknown[] = [];
    if (Array.isArray(parsed)) {
      habitsArray = parsed;
    } else if (parsed && typeof parsed === 'object' && Array.isArray((parsed as StoragePayload).habits)) {
      habitsArray = (parsed as StoragePayload).habits;
    } else {
      console.warn('Malformed habit data in localStorage, restoring defaults.');
      return getInitialSampleHabits();
    }

    const sanitizedHabits = habitsArray
      .map(sanitizeHabitRecord)
      .filter((h): h is Habit => h !== null);

    // Deduplicate by ID
    const uniqueMap = new Map<string, Habit>();
    for (const habit of sanitizedHabits) {
      if (!uniqueMap.has(habit.id)) {
        uniqueMap.set(habit.id, habit);
      }
    }

    return Array.from(uniqueMap.values());
  } catch (error) {
    console.error('Failed to parse habits from localStorage:', error);
    return getInitialSampleHabits();
  }
}

/**
 * Persist habits array to localStorage
 */
export function saveHabitsToStorage(habits: Habit[]): boolean {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }

  try {
    const payload: StoragePayload = {
      version: STORAGE_VERSION,
      exportedAt: new Date().toISOString(),
      habits,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch (error) {
    console.error('Failed to save habits to localStorage:', error);
    return false;
  }
}

/**
 * Export habits as formatted JSON string matching schema
 */
export function exportHabitsToJson(habits: Habit[]): string {
  const payload: StoragePayload = {
    version: STORAGE_VERSION,
    exportedAt: new Date().toISOString(),
    habits,
  };
  return JSON.stringify(payload, null, 2);
}

/**
 * Import habits from JSON string with strict validation and deduplication
 */
export function importHabitsFromJson(jsonString: string): { success: boolean; habits?: Habit[]; error?: string } {
  try {
    const parsed = JSON.parse(jsonString);
    let rawHabits: unknown[] = [];

    if (Array.isArray(parsed)) {
      rawHabits = parsed;
    } else if (parsed && typeof parsed === 'object' && Array.isArray(parsed.habits)) {
      rawHabits = parsed.habits;
    } else {
      return { success: false, error: 'Invalid JSON structure: Expected a backup payload with a habits array.' };
    }

    if (rawHabits.length === 0) {
      return { success: false, error: 'Backup file contains no habits.' };
    }

    const sanitized = rawHabits.map(sanitizeHabitRecord).filter((h): h is Habit => h !== null);

    if (sanitized.length === 0) {
      return { success: false, error: 'No valid habit records found in the uploaded file.' };
    }

    // Deduplicate by ID
    const uniqueMap = new Map<string, Habit>();
    for (const habit of sanitized) {
      if (!uniqueMap.has(habit.id)) {
        uniqueMap.set(habit.id, habit);
      }
    }

    return { success: true, habits: Array.from(uniqueMap.values()) };
  } catch (err) {
    return { success: false, error: err instanceof Error ? `JSON parsing failed: ${err.message}` : 'Invalid JSON file' };
  }
}
