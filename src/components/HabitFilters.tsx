import React from 'react';
import { Search, X, ArrowUpDown, Archive, CheckCircle2, ListFilter } from 'lucide-react';
import type { FilterType, SortOption } from '../types/habit';

interface HabitFiltersProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  counts: {
    all: number;
    active: number;
    archived: number;
  };
}

export const HabitFilters: React.FC<HabitFiltersProps> = ({
  currentFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  sortOption,
  onSortChange,
  counts,
}) => {
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4 mb-6">
      
      {/* Filter Tabs (All / Active / Archived) */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 dark:bg-slate-900/90 rounded-2xl overflow-x-auto scrollbar-none border border-slate-200/50 dark:border-slate-800">
        <button
          onClick={() => onFilterChange('all')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
            currentFilter === 'all'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
          aria-label="Show all active habits"
        >
          <ListFilter className="w-4 h-4" />
          <span>All</span>
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${
            currentFilter === 'all' 
              ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400' 
              : 'bg-slate-300/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}>
            {counts.all}
          </span>
        </button>

        <button
          onClick={() => onFilterChange('active')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
            currentFilter === 'active'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
          aria-label="Show active habits only"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Active</span>
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${
            currentFilter === 'active' 
              ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400' 
              : 'bg-slate-300/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}>
            {counts.active}
          </span>
        </button>

        <button
          onClick={() => onFilterChange('archived')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
            currentFilter === 'archived'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
          aria-label="Show archived habits"
        >
          <Archive className="w-4 h-4" />
          <span>Archived</span>
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${
            currentFilter === 'archived' 
              ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400' 
              : 'bg-slate-300/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}>
            {counts.archived}
          </span>
        </button>
      </div>

      {/* Search & Sort Controls */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        
        {/* Search Bar */}
        <div className="relative flex-1 sm:w-64">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search habits, notes, tags..."
            className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            aria-label="Search habits"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-md"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort Select */}
        <div className="relative shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-sm">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortOption}
              onChange={e => onSortChange(e.target.value as SortOption)}
              className="bg-transparent text-xs sm:text-sm focus:outline-none cursor-pointer pr-1"
              aria-label="Sort habits"
            >
              <option value="created-desc" className="dark:bg-slate-900">Newest First</option>
              <option value="created-asc" className="dark:bg-slate-900">Oldest First</option>
              <option value="name-asc" className="dark:bg-slate-900">Name (A-Z)</option>
              <option value="streak-desc" className="dark:bg-slate-900">Highest Streak</option>
              <option value="streak-asc" className="dark:bg-slate-900">Lowest Streak</option>
            </select>
          </div>
        </div>

      </div>

    </div>
  );
};
