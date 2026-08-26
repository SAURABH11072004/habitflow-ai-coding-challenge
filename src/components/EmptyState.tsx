import React from 'react';
import { Sparkles, Search, Archive, Plus, RotateCcw } from 'lucide-react';
import type { FilterType } from '../types/habit';

interface EmptyStateProps {
  filter: FilterType;
  searchQuery: string;
  totalActiveCount: number;
  totalArchivedCount: number;
  onOpenAddModal: () => void;
  onClearFilters: () => void;
  onLoadSamples: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  filter,
  searchQuery,
  totalActiveCount,
  totalArchivedCount,
  onOpenAddModal,
  onClearFilters,
  onLoadSamples,
}) => {
  if (searchQuery) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white/50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
        <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 mb-4">
          <Search className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          No habits matching "{searchQuery}"
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm">
          Try checking for typos, searching by category, or clearing your search term.
        </p>
        <button
          onClick={onClearFilters}
          className="mt-5 px-4 py-2 rounded-xl text-sm font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Clear Search Query
        </button>
      </div>
    );
  }

  if (filter === 'archived' && totalArchivedCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white/50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
        <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 mb-4">
          <Archive className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          No Archived Habits
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm">
          When you archive a habit, it will appear here so you can restore or review it later without cluttering your main view.
        </p>
      </div>
    );
  }

  if (filter === 'active' && totalActiveCount === 0 && totalArchivedCount > 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white/50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
        <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 mb-4">
          <Archive className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          All Habits Are Archived
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm">
          You have {totalArchivedCount} archived {totalArchivedCount === 1 ? 'habit' : 'habits'}. You can restore them from the Archived tab or create a new daily habit.
        </p>
        <button
          onClick={onOpenAddModal}
          className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Habit</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white/60 dark:bg-slate-900/60 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
      <div className="p-4 rounded-2xl bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 text-indigo-600 dark:text-indigo-400 mb-4">
        <Sparkles className="w-9 h-9 animate-pulse" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
        No habits yet
      </h3>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-md">
        Build better routines one day at a time.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-500/20 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ Create Your First Habit</span>
        </button>

        <button
          onClick={onLoadSamples}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Restore Starter Habits</span>
        </button>
      </div>
    </div>
  );
};
