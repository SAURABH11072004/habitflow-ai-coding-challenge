import { useEffect, useRef, useState } from 'react';
import { useHabits } from './hooks/useHabits';
import type { Habit, HabitFormData } from './types/habit';
import { Header } from './components/Header';
import { HabitStats } from './components/HabitStats';
import { HabitFilters } from './components/HabitFilters';
import { HabitCard } from './components/HabitCard';
import { WeeklyView } from './components/WeeklyView';
import { HabitFormModal } from './components/HabitFormModal';
import { ConfirmModal } from './components/ConfirmModal';
import { EmptyState } from './components/EmptyState';
import { ToastContainer } from './components/Toast';
import { Plus, ShieldCheck } from 'lucide-react';

export function App() {
  const {
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
  } = useHabits();

  // Dark Mode Theme State with safe window/matchMedia check
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('HABITFLOW_THEME');
      if (saved) return saved === 'dark';
      if (typeof window.matchMedia === 'function') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('HABITFLOW_THEME', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('HABITFLOW_THEME', 'light');
    }
  }, [darkMode]);

  // Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  // Confirmation Modals State
  const [resetHabitTarget, setResetHabitTarget] = useState<Habit | null>(null);
  const [archiveHabitTarget, setArchiveHabitTarget] = useState<Habit | null>(null);
  const [deleteHabitTarget, setDeleteHabitTarget] = useState<Habit | null>(null);
  const [isRestoreSamplesConfirmOpen, setIsRestoreSamplesConfirmOpen] = useState(false);

  const footerFileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenAddModal = () => {
    setEditingHabit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (habit: Habit) => {
    setEditingHabit(habit);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = (data: HabitFormData) => {
    if (editingHabit) {
      updateHabit(editingHabit.id, data);
    } else {
      addHabit(data);
    }
  };

  const handleFooterFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        importData(content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Header Bar */}
      <Header
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenAddModal={handleOpenAddModal}
        onExportData={exportData}
        onImportData={importData}
        onResetSampleData={() => setIsRestoreSamplesConfirmOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Top Summary Statistics */}
        <HabitStats stats={stats} />

        {/* Filters, Search & Sort Navigation (All / Active / Archived) */}
        <HabitFilters
          currentFilter={filter}
          onFilterChange={setFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortOption={sortOption}
          onSortChange={setSortOption}
          counts={{
            all: activeHabits.length,
            active: activeHabits.length,
            archived: archivedHabits.length,
          }}
        />

        {/* Habit Cards Grid / List */}
        {filteredHabits.length > 0 ? (
          <section aria-label="Habit Cards Grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredHabits.map(habit => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onToggleToday={toggleCompletion}
                onToggleDate={toggleCompletion}
                onEdit={handleOpenEditModal}
                onRequestArchive={setArchiveHabitTarget}
                onRestore={restoreHabit}
                onRequestReset={setResetHabitTarget}
                onRequestDelete={setDeleteHabitTarget}
              />
            ))}
          </section>
        ) : (
          <EmptyState
            filter={filter}
            searchQuery={searchQuery}
            totalActiveCount={activeHabits.length}
            totalArchivedCount={archivedHabits.length}
            onOpenAddModal={handleOpenAddModal}
            onClearFilters={() => setSearchQuery('')}
            onLoadSamples={loadSampleData}
          />
        )}

        {/* 7-Day Consistency Matrix View (displayed when active habits exist and not viewing archive) */}
        {filter !== 'archived' && activeHabits.length > 0 && (
          <WeeklyView
            habits={activeHabits}
            onToggleDateCompletion={toggleCompletion}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">HabitFlow</span>
            <span>·</span>
            <span>Daily Habit Tracker</span>
            <span>·</span>
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Local & Private
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={() => setIsRestoreSamplesConfirmOpen(true)}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus:outline-none focus:underline"
            >
              Restore Starter Habits
            </button>
            <span>·</span>
            <button
              onClick={exportData}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus:outline-none focus:underline"
            >
              Export Backup
            </button>
            <span>·</span>
            <button
              onClick={() => footerFileInputRef.current?.click()}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus:outline-none focus:underline"
            >
              Import Backup
            </button>
            <input
              type="file"
              ref={footerFileInputRef}
              onChange={handleFooterFileUpload}
              accept=".json"
              className="hidden"
            />
          </div>
        </div>
      </footer>

      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-6 right-6 sm:hidden z-40">
        <button
          onClick={handleOpenAddModal}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl flex items-center justify-center active:scale-95 focus:outline-none focus:ring-4 focus:ring-indigo-500/30"
          aria-label="Add New Daily Habit"
        >
          <Plus className="w-7 h-7 stroke-[2.5]" />
        </button>
      </div>

      {/* Habit Create / Edit Modal */}
      <HabitFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        editingHabit={editingHabit}
        existingHabitNames={activeHabits.map(h => h.name)}
      />

      {/* 1. Reset Progress Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(resetHabitTarget)}
        type="reset"
        title="Reset Habit Progress?"
        description={`Are you sure you want to clear all check-in history for "${resetHabitTarget?.name}"?`}
        details={[
          `All ${resetHabitTarget?.completions.length || 0} recorded daily check-ins will be cleared.`,
          'Current and all-time streak will reset to 0.',
          'The habit name, notes, and reminder settings will remain intact.',
        ]}
        confirmLabel="Reset Progress"
        confirmVariant="danger"
        onClose={() => setResetHabitTarget(null)}
        onConfirm={() => {
          if (resetHabitTarget) resetHabitProgress(resetHabitTarget.id);
        }}
      />

      {/* 2. Archive Habit Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(archiveHabitTarget)}
        type="archive"
        title="Archive Habit?"
        description={`Archive "${archiveHabitTarget?.name}"?`}
        details={[
          'This habit will be moved to the Archived tab.',
          'It will be excluded from your active daily statistics.',
          'You can restore it to your active dashboard anytime.',
        ]}
        confirmLabel="Archive Habit"
        confirmVariant="warning"
        onClose={() => setArchiveHabitTarget(null)}
        onConfirm={() => {
          if (archiveHabitTarget) archiveHabit(archiveHabitTarget.id);
        }}
      />

      {/* 3. Delete Habit Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteHabitTarget)}
        type="delete"
        title="Delete Habit Permanently?"
        description={`Permanently delete "${deleteHabitTarget?.name}"?`}
        details={[
          'This action cannot be undone.',
          'All completion records and settings will be removed completely.',
        ]}
        confirmLabel="Delete Permanently"
        confirmVariant="danger"
        onClose={() => setDeleteHabitTarget(null)}
        onConfirm={() => {
          if (deleteHabitTarget) deleteHabit(deleteHabitTarget.id);
        }}
      />

      {/* 4. Restore Starter Habits Confirmation Modal */}
      <ConfirmModal
        isOpen={isRestoreSamplesConfirmOpen}
        type="restore-samples"
        title="Restore Starter Habits?"
        description="Load default starter daily habits into your tracker?"
        details={[
          'This will replace your current habit list with standard starter habits.',
          'Recommended if you want a clean slate or want to re-explore sample routines.',
        ]}
        confirmLabel="Load Starter Habits"
        confirmVariant="indigo"
        onClose={() => setIsRestoreSamplesConfirmOpen(false)}
        onConfirm={loadSampleData}
      />

      {/* Toast Notification Layer */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

    </div>
  );
}

export default App;
