import React, { useEffect, useState } from 'react';
import { 
  X, 
  Sparkles, 
  Check, 
  AlertCircle,
  Bell,
  FileText,
  Tag,
  Palette,
  Clock
} from 'lucide-react';
import type { 
  Habit, 
  HabitCategory, 
  HabitColor, 
  HabitFormData 
} from '../types/habit';

interface HabitFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: HabitFormData) => void;
  editingHabit?: Habit | null;
  existingHabitNames?: string[];
}

const colorOptions: { key: HabitColor; label: string; bg: string }[] = [
  { key: 'indigo', label: 'Indigo', bg: 'bg-indigo-500' },
  { key: 'emerald', label: 'Emerald', bg: 'bg-emerald-500' },
  { key: 'violet', label: 'Violet', bg: 'bg-violet-500' },
  { key: 'amber', label: 'Amber', bg: 'bg-amber-500' },
  { key: 'rose', label: 'Rose', bg: 'bg-rose-500' },
  { key: 'cyan', label: 'Cyan', bg: 'bg-cyan-500' },
  { key: 'blue', label: 'Blue', bg: 'bg-blue-500' },
  { key: 'orange', label: 'Orange', bg: 'bg-orange-500' },
];

const categoryOptions: { key: HabitCategory; label: string }[] = [
  { key: 'health', label: 'Health' },
  { key: 'fitness', label: 'Fitness' },
  { key: 'mindfulness', label: 'Mindfulness' },
  { key: 'learning', label: 'Learning' },
  { key: 'productivity', label: 'Productivity' },
  { key: 'other', label: 'Other' },
];

interface HabitFormContentProps {
  editingHabit?: Habit | null;
  onClose: () => void;
  onSubmit: (data: HabitFormData) => void;
}

const HabitFormContent: React.FC<HabitFormContentProps> = ({
  editingHabit,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState(editingHabit?.name || '');
  const [color, setColor] = useState<HabitColor>(editingHabit?.color || 'indigo');
  const [category, setCategory] = useState<HabitCategory>(editingHabit?.category || 'health');
  const [notes, setNotes] = useState(editingHabit?.notes || '');
  const [reminderText, setReminderText] = useState(editingHabit?.reminderText || '');
  const [errors, setErrors] = useState<{ name?: string; reminder?: string }>({});

  const validate = (): boolean => {
    const newErrors: { name?: string; reminder?: string } = {};
    const trimmedName = name.trim();

    if (!trimmedName) {
      newErrors.name = 'Habit name is required.';
    } else if (trimmedName.length > 60) {
      newErrors.name = 'Habit name must be 60 characters or fewer.';
    }

    if (reminderText.trim().length > 100) {
      newErrors.reminder = 'Reminder text must be 100 characters or fewer.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      name: name.trim(),
      color,
      category,
      notes: notes.trim() || undefined,
      reminderText: reminderText.trim() || undefined,
    });

    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-5">
      {/* 1. Habit Name */}
      <div>
        <label htmlFor="habit-name-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
          Habit Name <span className="text-rose-500">*</span>
        </label>
        <input
          id="habit-name-input"
          type="text"
          value={name}
          onChange={e => {
            setName(e.target.value);
            if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
          }}
          maxLength={60}
          placeholder="e.g. Drink 2.5L Water, Read 20 Pages"
          autoFocus
          className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
            errors.name
              ? 'border-rose-500 focus:ring-rose-500'
              : 'border-slate-200 dark:border-slate-700 focus:ring-indigo-500 focus:border-transparent'
          }`}
        />
        <div className="flex justify-between items-center mt-1 text-xs">
          {errors.name ? (
            <span className="flex items-center gap-1 text-rose-500 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.name}
            </span>
          ) : (
            <span className="text-slate-400">Daily habit tracking</span>
          )}
          <span className="text-slate-400">{name.length}/60</span>
        </div>
      </div>

      {/* 2. Frequency Banner (Always Daily) */}
      <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-700 dark:text-indigo-300 font-medium">
        <Clock className="w-4 h-4 text-indigo-500 shrink-0" />
        <span>Frequency: <strong>Daily Routine</strong> (completions tracked every calendar day)</span>
      </div>

      {/* 3. Category & Color Picker */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Category */}
        <div>
          <label htmlFor="habit-category-select" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            <span>Category</span>
          </label>
          <select
            id="habit-category-select"
            value={category}
            onChange={e => setCategory(e.target.value as HabitCategory)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 capitalize cursor-pointer"
          >
            {categoryOptions.map(cat => (
              <option key={cat.key} value={cat.key} className="dark:bg-slate-900">
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Color Accent */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
            <Palette className="w-3.5 h-3.5 text-slate-400" />
            <span>Color Theme</span>
          </label>
          <div className="flex items-center gap-1.5 pt-1 overflow-x-auto">
            {colorOptions.map(col => (
              <button
                key={col.key}
                type="button"
                onClick={() => setColor(col.key)}
                className={`w-7 h-7 rounded-full ${col.bg} flex items-center justify-center transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
                  color === col.key ? 'ring-2 ring-slate-900 dark:ring-white scale-110' : ''
                }`}
                title={col.label}
                aria-label={`Color ${col.label}`}
              >
                {color === col.key && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Reminder Note */}
      <div>
        <label htmlFor="habit-reminder-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
          <Bell className="w-3.5 h-3.5 text-indigo-500" />
          <span>Reminder Cue (Optional)</span>
        </label>
        <input
          id="habit-reminder-input"
          type="text"
          value={reminderText}
          onChange={e => setReminderText(e.target.value)}
          maxLength={100}
          placeholder="e.g. Drink right after waking up in the morning"
          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        />
        <div className="flex justify-between mt-1 text-[11px] text-slate-400">
          <span>Displayed on the habit card as an actionable cue</span>
          <span>{reminderText.length}/100</span>
        </div>
      </div>

      {/* 5. Notes / Motivation */}
      <div>
        <label htmlFor="habit-notes-textarea" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
          <FileText className="w-3.5 h-3.5 text-slate-400" />
          <span>Notes & Details (Optional)</span>
        </label>
        <textarea
          id="habit-notes-textarea"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={2}
          maxLength={300}
          placeholder="e.g. Why is this habit important? Specific target details..."
          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
        />
        <div className="flex justify-end mt-1 text-[11px] text-slate-400">
          <span>{notes.length}/300</span>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 active:scale-[0.98] shadow-md shadow-indigo-500/20 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
        >
          {editingHabit ? 'Save Changes' : 'Create Daily Habit'}
        </button>
      </div>
    </form>
  );
};

export const HabitFormModal: React.FC<HabitFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingHabit,
}) => {
  // Keyboard accessibility (Escape key to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="habit-modal-title"
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 id="habit-modal-title" className="text-lg font-bold text-slate-900 dark:text-white">
                {editingHabit ? 'Edit Habit' : 'Create Daily Habit'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track your routine every day
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body keyed to re-initialize state cleanly on open/edit change */}
        <HabitFormContent
          key={editingHabit?.id || (isOpen ? 'open-new' : 'closed')}
          editingHabit={editingHabit}
          onClose={onClose}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
};
