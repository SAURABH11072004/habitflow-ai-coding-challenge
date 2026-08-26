export type HabitFrequency = 'daily';

export type HabitCategory = 
  | 'health' 
  | 'productivity' 
  | 'mindfulness' 
  | 'fitness' 
  | 'learning' 
  | 'other';

export type HabitColor = 
  | 'indigo' 
  | 'emerald' 
  | 'violet' 
  | 'amber' 
  | 'rose' 
  | 'cyan'
  | 'blue'
  | 'orange';

export interface Habit {
  id: string;
  name: string;
  frequency: 'daily';
  notes?: string;
  reminderText?: string;
  completions: string[]; // Stored in YYYY-MM-DD format
  archived: boolean;
  createdAt: string; // ISO String
  color?: HabitColor;
  category?: HabitCategory;
}

export type FilterType = 'all' | 'active' | 'archived';

export type SortOption = 'created-desc' | 'created-asc' | 'name-asc' | 'streak-desc' | 'streak-asc';

export interface HabitStatsData {
  totalActive: number;
  completedToday: number;
  bestStreak: number;
  sevenDayCompletionRate: number;
  totalCompletionsAllTime: number;
}

export interface HabitFormData {
  name: string;
  notes?: string;
  reminderText?: string;
  color?: HabitColor;
  category?: HabitCategory;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  description?: string;
}

export interface DayProgress {
  dateStr: string;
  dayNameShort: string;
  dayNameFull: string;
  dayNumber: number;
  isToday: boolean;
}
