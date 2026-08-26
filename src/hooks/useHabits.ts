import { useCallback, useEffect, useMemo, useState } from 'react';
import type {
  FilterType,
  Habit,
  HabitFormData,
  HabitStatsData,
  SortOption,
  ToastMessage,
} from '../types/habit';
import { getPastDays, getTodayString } from '../utils/date';
import { getInitialSampleHabits } from '../utils/sampleData';
import {
  exportHabitsToJson,
  importHabitsFromJson,
  loadHabitsFromStorage,
  saveHabitsToStorage,
} from '../utils/storage';
import { calculateStreak } from '../utils/streak';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>(() => loadHabitsFromStorage());
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<SortOption>('created-desc');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Automatically persist changes to localStorage
  useEffect(() => {
    saveHabitsToStorage(habits);
  }, [habits]);

  // Toast notification helper
  const addToast = useCallback((type: ToastMessage['type'], title: string, description?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // 1. Add Daily Habit
  const addHabit = useCallback((data: HabitFormData): Habit => {
    const trimmedName = data.name.trim();

    // Check for duplicate name warning
    const exists = habits.some(
      h => !h.archived && h.name.toLowerCase() === trimmedName.toLowerCase()
    );

    const newHabit: Habit = {
      id: `habit-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      name: trimmedName,
      frequency: 'daily',
      notes: data.notes?.trim() || undefined,
      reminderText: data.reminderText?.trim() || undefined,
      color: data.color || 'indigo',
      category: data.category || 'other',
      completions: [],
      archived: false,
      createdAt: new Date().toISOString(),
    };

    setHabits(prev => [newHabit, ...prev]);

    if (exists) {
      addToast('warning', 'Duplicate Habit Name', `A habit named "${trimmedName}" already exists.`);
    } else {
      addToast('success', 'Habit Created', `"${newHabit.name}" has been added to your tracker.`);
    }

    return newHabit;
  }, [habits, addToast]);

  // 2. Update Habit (Preserving Completion History)
  const updateHabit = useCallback((id: string, updates: Partial<HabitFormData>) => {
    setHabits(prev =>
      prev.map(habit => {
        if (habit.id !== id) return habit;

        return {
          ...habit,
          name: updates.name !== undefined ? updates.name.trim() : habit.name,
          notes: updates.notes !== undefined ? (updates.notes.trim() || undefined) : habit.notes,
          reminderText: updates.reminderText !== undefined ? (updates.reminderText.trim() || undefined) : habit.reminderText,
          color: updates.color !== undefined ? updates.color : habit.color,
          category: updates.category !== undefined ? updates.category : habit.category,
        };
      })
    );
    addToast('info', 'Habit Updated', 'Your changes were saved successfully.');
  }, [addToast]);

  // 3. Toggle Completion for Today or a specific Date
  const toggleCompletion = useCallback((id: string, dateStr?: string) => {
    const targetDate = dateStr || getTodayString();
    let isCompletedNow = false;
    let habitName = '';
    let updatedStreak = 0;

    setHabits(prev =>
      prev.map(habit => {
        if (habit.id !== id) return habit;

        habitName = habit.name;
        const exists = habit.completions.includes(targetDate);
        isCompletedNow = !exists;

        const newCompletions = exists
          ? habit.completions.filter(d => d !== targetDate)
          : [...habit.completions, targetDate];

        const updatedHabit: Habit = {
          ...habit,
          completions: Array.from(new Set(newCompletions)).sort(),
        };

        const { currentStreak } = calculateStreak(updatedHabit);
        updatedStreak = currentStreak;

        return updatedHabit;
      })
    );

    if (isCompletedNow) {
      addToast('success', 'Marked as Done', `Check-in recorded for "${habitName}".`);
    } else {
      addToast('info', 'Check-in Removed', `Check-in removed for "${habitName}".`);
    }

    return { isCompleted: isCompletedNow, habitName, streak: updatedStreak };
  }, [addToast]);

  // 4. Archive Habit
  const archiveHabit = useCallback((id: string) => {
    let name = '';
    setHabits(prev =>
      prev.map(h => {
        if (h.id === id) {
          name = h.name;
          return { ...h, archived: true };
        }
        return h;
      })
    );
    addToast('info', 'Habit Archived', `"${name}" moved to archive.`);
  }, [addToast]);

  // 5. Restore Habit
  const restoreHabit = useCallback((id: string) => {
    let name = '';
    setHabits(prev =>
      prev.map(h => {
        if (h.id === id) {
          name = h.name;
          return { ...h, archived: false };
        }
        return h;
      })
    );
    addToast('success', 'Habit Restored', `"${name}" is active again.`);
  }, [addToast]);

  // 6. Reset Habit Progress (clears completions & streak, keeps habit configuration)
  const resetHabitProgress = useCallback((id: string) => {
    let name = '';
    setHabits(prev =>
      prev.map(h => {
        if (h.id === id) {
          name = h.name;
          return { ...h, completions: [] };
        }
        return h;
      })
    );
    addToast('warning', 'Progress Reset', `Check-in history cleared for "${name}".`);
  }, [addToast]);

  // 7. Delete Habit Permanently
  const deleteHabit = useCallback((id: string) => {
    let name = '';
    setHabits(prev => {
      const target = prev.find(h => h.id === id);
      name = target?.name || 'Habit';
      return prev.filter(h => h.id !== id);
    });
    addToast('info', 'Habit Deleted', `"${name}" has been permanently removed.`);
  }, [addToast]);

  // 8. Restore Sample Habits
  const loadSampleData = useCallback(() => {
    const samples = getInitialSampleHabits();
    setHabits(samples);
    addToast('success', 'Sample Habits Restored', 'Default starter daily habits loaded.');
  }, [addToast]);

  // 9. Export & Import
  const exportData = useCallback(() => {
    try {
      const json = exportHabitsToJson(habits);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `habitflow-backup-${getTodayString()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      addToast('success', 'Backup Exported', 'Habit backup downloaded successfully.');
    } catch {
      addToast('error', 'Export Failed', 'Unable to create backup file.');
    }
  }, [habits, addToast]);

  const importData = useCallback((fileContent: string): boolean => {
    const result = importHabitsFromJson(fileContent);
    if (result.success && result.habits) {
      setHabits(result.habits);
      addToast('success', 'Backup Restored', `Restored ${result.habits.length} habits successfully.`);
      return true;
    } else {
      addToast('error', 'Restore Failed', result.error || 'Invalid backup file format.');
      return false;
    }
  }, [addToast]);

  // Active vs Archived Habits
  const activeHabits = useMemo(() => habits.filter(h => !h.archived), [habits]);
  const archivedHabits = useMemo(() => habits.filter(h => h.archived), [habits]);

  // Filtered & Sorted Habits for UI
  const filteredHabits = useMemo(() => {
    let list: Habit[] = [];

    if (filter === 'archived') {
      list = [...archivedHabits];
    } else if (filter === 'active') {
      list = [...activeHabits];
    } else {
      // 'all' shows active habits primarily or all based on view
      list = [...activeHabits];
    }

    // Search query filter across name, notes, reminderText, category
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      list = list.filter(
        h =>
          h.name.toLowerCase().includes(query) ||
          h.notes?.toLowerCase().includes(query) ||
          h.reminderText?.toLowerCase().includes(query) ||
          h.category?.toLowerCase().includes(query)
      );
    }

    // Sort
    list.sort((a, b) => {
      if (sortOption === 'created-desc') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortOption === 'created-asc') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortOption === 'name-asc') {
        return a.name.localeCompare(b.name);
      }
      if (sortOption === 'streak-desc') {
        const streakA = calculateStreak(a).currentStreak;
        const streakB = calculateStreak(b).currentStreak;
        return streakB - streakA;
      }
      if (sortOption === 'streak-asc') {
        const streakA = calculateStreak(a).currentStreak;
        const streakB = calculateStreak(b).currentStreak;
        return streakA - streakB;
      }
      return 0;
    });

    return list;
  }, [activeHabits, archivedHabits, filter, searchQuery, sortOption]);

  // Dynamic Dashboard Statistics (Strictly Daily-Only & Excluding Archived)
  const stats = useMemo<HabitStatsData>(() => {
    const today = getTodayString();
    const active = activeHabits;

    // 1. Total Active Habits
    const totalActive = active.length;

    // 2. Done Today: number of active habits completed today / total active habits
    const completedToday = active.filter(h => h.completions.includes(today)).length;

    // 3. Best Streak: maximum current streak among all active habits
    let bestStreak = 0;
    let totalCompletionsAllTime = 0;

    for (const habit of active) {
      const { currentStreak } = calculateStreak(habit);
      if (currentStreak > bestStreak) {
        bestStreak = currentStreak;
      }
      totalCompletionsAllTime += habit.completions.length;
    }

    // 4. 7-Day Rate: total completed daily check-ins during the last 7 days / total possible daily check-ins (totalActive * 7)
    const past7Days = getPastDays(7).map(d => d.dateStr);
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
  }, [activeHabits]);

  return {
    habits,
    activeHabits,
    archivedHabits,
    filteredHabits,
    stats,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    sortOption,
    setSortOption,
    toasts,
    addToast,
    removeToast,
    addHabit,
    updateHabit,
    toggleCompletion,
    archiveHabit,
    restoreHabit,
    resetHabitProgress,
    deleteHabit,
    loadSampleData,
    exportData,
    importData,
  };
}
