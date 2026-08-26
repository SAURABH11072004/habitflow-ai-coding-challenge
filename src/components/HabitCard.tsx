import React, { useState } from 'react';
import { 
  Check, 
  Flame, 
  MoreVertical, 
  Edit3, 
  Archive, 
  RotateCcw, 
  Trash2, 
  Bell, 
  FileText, 
  Clock, 
  CheckCircle2, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  Activity,
  Heart,
  BookOpen,
  Zap,
  Smile
} from 'lucide-react';
import type { Habit, HabitCategory, HabitColor } from '../types/habit';
import { getPastDays, getTodayString } from '../utils/date';
import { calculateStreak } from '../utils/streak';
import { triggerCompletionConfetti, triggerMilestoneConfetti } from './Confetti';

interface HabitCardProps {
  habit: Habit;
  onToggleToday: (id: string) => { isCompleted: boolean; habitName: string; streak: number };
  onToggleDate: (id: string, dateStr: string) => void;
  onEdit: (habit: Habit) => void;
  onRequestArchive: (habit: Habit) => void;
  onRestore: (id: string) => void;
  onRequestReset: (habit: Habit) => void;
  onRequestDelete: (habit: Habit) => void;
}

const colorMap: Record<HabitColor, { border: string; bg: string; text: string; ring: string; lightBg: string }> = {
  indigo: { border: 'border-indigo-500', bg: 'bg-indigo-600', text: 'text-indigo-600 dark:text-indigo-400', ring: 'ring-indigo-500/20', lightBg: 'bg-indigo-50 dark:bg-indigo-950/40' },
  emerald: { border: 'border-emerald-500', bg: 'bg-emerald-600', text: 'text-emerald-600 dark:text-emerald-400', ring: 'ring-emerald-500/20', lightBg: 'bg-emerald-50 dark:bg-emerald-950/40' },
  violet: { border: 'border-violet-500', bg: 'bg-violet-600', text: 'text-violet-600 dark:text-violet-400', ring: 'ring-violet-500/20', lightBg: 'bg-violet-50 dark:bg-violet-950/40' },
  amber: { border: 'border-amber-500', bg: 'bg-amber-600', text: 'text-amber-600 dark:text-amber-400', ring: 'ring-amber-500/20', lightBg: 'bg-amber-50 dark:bg-amber-950/40' },
  rose: { border: 'border-rose-500', bg: 'bg-rose-600', text: 'text-rose-600 dark:text-rose-400', ring: 'ring-rose-500/20', lightBg: 'bg-rose-50 dark:bg-rose-950/40' },
  cyan: { border: 'border-cyan-500', bg: 'bg-cyan-600', text: 'text-cyan-600 dark:text-cyan-400', ring: 'ring-cyan-500/20', lightBg: 'bg-cyan-50 dark:bg-cyan-950/40' },
  blue: { border: 'border-blue-500', bg: 'bg-blue-600', text: 'text-blue-600 dark:text-blue-400', ring: 'ring-blue-500/20', lightBg: 'bg-blue-50 dark:bg-blue-950/40' },
  orange: { border: 'border-orange-500', bg: 'bg-orange-600', text: 'text-orange-600 dark:text-orange-400', ring: 'ring-orange-500/20', lightBg: 'bg-orange-50 dark:bg-orange-950/40' },
};

const categoryIcons: Record<HabitCategory, React.ReactNode> = {
  health: <Heart className="w-3.5 h-3.5" />,
  fitness: <Activity className="w-3.5 h-3.5" />,
  mindfulness: <Smile className="w-3.5 h-3.5" />,
  learning: <BookOpen className="w-3.5 h-3.5" />,
  productivity: <Zap className="w-3.5 h-3.5" />,
  other: <Sparkles className="w-3.5 h-3.5" />,
};

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  onToggleToday,
  onToggleDate,
  onEdit,
  onRequestArchive,
  onRestore,
  onRequestReset,
  onRequestDelete,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);

  const todayStr = getTodayString();
  const past7Days = getPastDays(7);
  const { currentStreak, longestStreak } = calculateStreak(habit);

  const colorStyles = colorMap[habit.color || 'indigo'];
  const isCompletedToday = habit.completions.includes(todayStr);

  const handleToggle = () => {
    const result = onToggleToday(habit.id);
    if (result.isCompleted) {
      if (result.streak > 0 && result.streak % 7 === 0) {
        triggerMilestoneConfetti();
      } else {
        triggerCompletionConfetti();
      }
    }
  };

  return (
    <div className={`relative flex flex-col justify-between rounded-2xl bg-white dark:bg-slate-900 border transition-all duration-200 shadow-sm hover:shadow-md ${
      habit.archived 
        ? 'border-slate-200 dark:border-slate-800 opacity-70 bg-slate-50/50 dark:bg-slate-900/40' 
        : isCompletedToday
          ? 'border-slate-200/90 dark:border-slate-800/90 ring-1 ring-emerald-500/20'
          : 'border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
    }`}>
      
      {/* Top Header Row */}
      <div className="p-4 sm:p-5 pb-3">
        <div className="flex items-start justify-between gap-3">
          
          {/* Category & Daily Badges */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${colorStyles.lightBg} ${colorStyles.text}`}>
              {categoryIcons[habit.category || 'other']}
              <span className="capitalize">{habit.category || 'General'}</span>
            </span>

            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              <Clock className="w-3 h-3" /> Daily
            </span>
          </div>

          {/* Action Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Habit options menu"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowMenu(false)} 
                />
                <div className="absolute right-0 mt-1 w-44 z-20 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl py-1 text-xs">
                  {!habit.archived && (
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onEdit(habit);
                      }}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Edit Habit</span>
                    </button>
                  )}

                  {!habit.archived ? (
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onRequestArchive(habit);
                      }}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors"
                    >
                      <Archive className="w-3.5 h-3.5 text-amber-500" />
                      <span>Archive</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onRestore(habit.id);
                      }}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Restore</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onRequestReset(habit);
                    }}
                    className="w-full flex items-center gap-2 px-3.5 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-orange-500" />
                    <span>Reset Progress</span>
                  </button>

                  <div className="my-1 border-t border-slate-100 dark:border-slate-700" />

                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onRequestDelete(habit);
                    }}
                    className="w-full flex items-center gap-2 px-3.5 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Permanently</span>
                  </button>
                </div>
              </>
            )}
          </div>

        </div>

        {/* Habit Name & Streak */}
        <div className="mt-3 flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className={`text-base sm:text-lg font-bold leading-snug tracking-tight text-slate-900 dark:text-white ${
              habit.archived ? 'line-through text-slate-400 dark:text-slate-500' : ''
            }`}>
              {habit.name}
            </h3>
          </div>

          {/* Current Daily Streak Badge */}
          <div className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-transform ${
            currentStreak > 0
              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
          }`}>
            <Flame className={`w-3.5 h-3.5 ${currentStreak > 0 ? 'text-amber-500 animate-bounce' : ''}`} />
            <span>{currentStreak} {currentStreak === 1 ? 'day' : 'days'}</span>
          </div>
        </div>

        {/* Reminder Text Banner if present */}
        {habit.reminderText && (
          <div className="mt-2.5 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 text-xs font-medium border border-indigo-100 dark:border-indigo-900/40">
            <Bell className="w-3.5 h-3.5 shrink-0 text-indigo-500" />
            <span className="truncate">Reminder: {habit.reminderText}</span>
          </div>
        )}

        {/* Notes Collapsible if present */}
        {habit.notes && (
          <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
            {habit.notes.length > 80 ? (
              <div>
                <p className="leading-relaxed">
                  {isNotesExpanded ? habit.notes : `${habit.notes.slice(0, 80)}...`}
                </p>
                <button
                  onClick={() => setIsNotesExpanded(!isNotesExpanded)}
                  className="mt-1 inline-flex items-center gap-0.5 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  {isNotesExpanded ? (
                    <>Show less <ChevronUp className="w-3 h-3" /></>
                  ) : (
                    <>Read notes <ChevronDown className="w-3 h-3" /></>
                  )}
                </button>
              </div>
            ) : (
              <p className="flex items-center gap-1 leading-relaxed">
                <FileText className="w-3 h-3 shrink-0 text-slate-400" />
                <span>{habit.notes}</span>
              </p>
            )}
          </div>
        )}

      </div>

      {/* Mini 7-Day History Track */}
      <div className="px-4 sm:px-5 py-2.5 bg-slate-50/70 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center justify-between gap-1">
          {past7Days.map(day => {
            const isDone = habit.completions.includes(day.dateStr);
            const actionLabel = isDone 
              ? `Undo completion for ${day.dayNameFull} (${day.dateStr})` 
              : `Mark complete for ${day.dayNameFull} (${day.dateStr})`;

            return (
              <button
                key={day.dateStr}
                onClick={() => onToggleDate(habit.id, day.dateStr)}
                title={actionLabel}
                aria-label={`${habit.name} - ${actionLabel}`}
                disabled={habit.archived}
                className={`flex flex-col items-center gap-1 p-1 rounded-lg transition-all ${
                  day.isToday ? 'bg-indigo-100/60 dark:bg-indigo-950/60 font-semibold ring-1 ring-indigo-500/30' : 'hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
                }`}
              >
                <span className={`text-[10px] ${day.isToday ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-400 dark:text-slate-500'}`}>
                  {day.dayNameShort.charAt(0)}
                </span>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] transition-transform active:scale-90 ${
                  isDone
                    ? `${colorStyles.bg} text-white shadow-sm`
                    : 'border border-slate-300 dark:border-slate-600 text-transparent'
                }`}>
                  {isDone ? <Check className="w-3 h-3 stroke-[3]" /> : '·'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Big One-Tap Completion Footer Button */}
      <div className="p-3 sm:p-4 pt-2 border-t border-slate-100 dark:border-slate-800/80">
        {!habit.archived ? (
          <button
            onClick={handleToggle}
            className={`w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98] shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
              isCompletedToday
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20 focus:ring-emerald-500'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 focus:ring-indigo-500 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {isCompletedToday ? (
              <>
                <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                <span>Completed Today!</span>
              </>
            ) : (
              <>
                <div className="w-5 h-5 rounded-full border-2 border-slate-400 dark:border-slate-500" />
                <span>Mark as Done Today</span>
              </>
            )}
          </button>
        ) : (
          <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 py-1">
            <span>Archived Routine</span>
            <button
              onClick={() => onRestore(habit.id)}
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              Restore to Active
            </button>
          </div>
        )}

        {/* Best Streak metadata */}
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 px-1">
          <span>All-time best: {longestStreak} {longestStreak === 1 ? 'day' : 'days'}</span>
          <span>{habit.completions.length} total check-ins</span>
        </div>
      </div>

    </div>
  );
};
