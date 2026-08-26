import React from 'react';
import { CheckCircle2, Flame, TrendingUp, Layers } from 'lucide-react';
import type { HabitStatsData } from '../types/habit';

interface HabitStatsProps {
  stats: HabitStatsData;
}

export const HabitStats: React.FC<HabitStatsProps> = ({ stats }) => {
  const {
    totalActive,
    completedToday,
    bestStreak,
    sevenDayCompletionRate,
  } = stats;

  const todayCompletionPercentage =
    totalActive > 0 ? Math.round((completedToday / totalActive) * 100) : 0;

  return (
    <section aria-label="Habit Dashboard Statistics" className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
      
      {/* 1. Total Active Habits */}
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Active Habits
          </span>
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
            <Layers className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {totalActive}
          </span>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            daily {totalActive === 1 ? 'habit' : 'habits'}
          </span>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
          <span>Tracked daily</span>
        </div>
      </div>

      {/* 2. Completed Today */}
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Done Today
          </span>
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {completedToday}
            <span className="text-base sm:text-lg font-medium text-slate-400 dark:text-slate-500">
              /{totalActive}
            </span>
          </span>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            {todayCompletionPercentage}%
          </span>
        </div>
        {/* Progress Bar */}
        <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, todayCompletionPercentage)}%` }}
          />
        </div>
      </div>

      {/* 3. Best Current Streak */}
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Best Streak
          </span>
          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
            <Flame className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {bestStreak}
          </span>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {bestStreak === 1 ? 'day' : 'days'}
          </span>
        </div>
        <div className="mt-3 flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400">
          <Flame className="w-3.5 h-3.5" />
          <span>{bestStreak > 0 ? 'Consecutive days active' : 'Complete a habit today'}</span>
        </div>
      </div>

      {/* 4. 7-Day Completion Rate */}
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            7-Day Rate
          </span>
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {sevenDayCompletionRate}%
          </span>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            consistency
          </span>
        </div>
        {/* Progress Bar */}
        <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-indigo-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, sevenDayCompletionRate)}%` }}
          />
        </div>
      </div>

    </section>
  );
};
