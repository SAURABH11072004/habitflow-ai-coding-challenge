import type { Habit } from '../types/habit';
import { addDays, getTodayString } from './date';

export function getInitialSampleHabits(): Habit[] {
  const today = getTodayString();
  const dMinus1 = addDays(today, -1);
  const dMinus2 = addDays(today, -2);
  const dMinus3 = addDays(today, -3);
  const dMinus4 = addDays(today, -4);
  const dMinus6 = addDays(today, -6);

  return [
    {
      id: 'habit-1-water',
      name: 'Drink 2.5L Water',
      frequency: 'daily',
      notes: 'Stay hydrated with a glass right upon waking and before each meal.',
      reminderText: 'Keep a full water bottle at your desk in the morning.',
      completions: [dMinus4, dMinus3, dMinus2, dMinus1, today],
      archived: false,
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      color: 'cyan',
      category: 'health',
    },
    {
      id: 'habit-2-meditation',
      name: 'Morning Mindfulness & Meditation',
      frequency: 'daily',
      notes: '15 minutes of silent mindfulness using Box Breathing.',
      reminderText: 'Practice right after morning coffee before checking screen/email.',
      completions: [dMinus3, dMinus2, dMinus1, today],
      archived: false,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      color: 'violet',
      category: 'mindfulness',
    },
    {
      id: 'habit-3-reading',
      name: 'Read 25 Pages of Non-Fiction',
      frequency: 'daily',
      notes: 'Current book: Atomic Habits by James Clear.',
      reminderText: 'Read before bed instead of phone scrolling.',
      completions: [dMinus6, dMinus4, dMinus3, dMinus2, dMinus1], // Active streak from yesterday, ready for today!
      archived: false,
      createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      color: 'amber',
      category: 'learning',
    },
    {
      id: 'habit-4-workout',
      name: 'Daily 30-Min Workout & Mobility',
      frequency: 'daily',
      notes: 'Cardio, strength, or active recovery yoga stretching.',
      reminderText: 'Work out at 7:00 AM before starting work.',
      completions: [dMinus6, dMinus4, dMinus2, today],
      archived: false,
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      color: 'emerald',
      category: 'fitness',
    },
    {
      id: 'habit-5-journaling',
      name: 'Evening Reflection & Journaling',
      frequency: 'daily',
      notes: 'Write down 3 wins and 1 thing to improve for tomorrow.',
      reminderText: 'Journal at 9:30 PM before winding down.',
      completions: [dMinus3, dMinus2, dMinus1],
      archived: false,
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      color: 'indigo',
      category: 'productivity',
    },
  ];
}
