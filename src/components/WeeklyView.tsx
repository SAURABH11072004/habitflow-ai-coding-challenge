import React from 'react';
import { Calendar, Check, Flame } from 'lucide-react';
import type { Habit } from '../types/habit';
import { getPastDays } from '../utils/date';
import { calculateStreak } from '../utils/streak';

interface WeeklyViewProps {
  habits: Habit[];
  onToggleDateCompletion: (id: string, dateStr: string) => void;
}

export const WeeklyView: React.FC<WeeklyViewProps> = ({
  habits,
  onToggleDateCompletion,
}) => {
  const past7Days = getPastDays(7);
  const activeHabits = habits.filter(h => !h.archived);

  if (activeHabits.length === 0) {
    return null;
  }

  return (
    <section aria-label="7-Day Habit Consistency Matrix" className="mt-10 mb-8">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              7-Day Consistency Matrix
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click any cell to toggle daily check-in status
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[620px]">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <th className="py-3.5 px-4 sm:px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-1/3">
                  Habit
                </th>
                <th className="py-3.5 px-2 text-center text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-20">
                  Streak
                </th>
                {past7Days.map(day => (
                  <th
                    key={day.dateStr}
                    className={`py-3.5 px-2 text-center text-xs font-semibold uppercase tracking-wider transition-colors ${
                      day.isToday
                        ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-[11px] font-bold">{day.dayNameShort}</span>
                      <span className="text-[10px] opacity-75">{day.dayNumber}</span>
                      {day.isToday ? (
                        <span className="inline-block mt-0.5 text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-indigo-600 text-white dark:bg-indigo-500">
                          TODAY
                        </span>
                      ) : null}
                    </div>
                  </th>
                ))}
                <th className="py-3.5 px-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-24">
                  7-Day Rate
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
              {activeHabits.map(habit => {
                const { currentStreak } = calculateStreak(habit);
                const completionsIn7Days = habit.completions.filter(c =>
                  past7Days.some(d => d.dateStr === c)
                ).length;
                const sevenDayRate = Math.round((completionsIn7Days / 7) * 100);

                return (
                  <tr
                    key={habit.id}
                    className="hover:bg-slate-50/75 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Habit Info */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0" />
                        <div className="min-w-0">
                          <span className="font-semibold text-slate-900 dark:text-slate-100 truncate block">
                            {habit.name}
                          </span>
                          <span className="text-[11px] text-slate-400 dark:text-slate-500 capitalize">
                            Daily · {habit.category || 'general'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Streak Badge */}
                    <td className="py-3.5 px-2 text-center">
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        <Flame className="w-3 h-3 text-amber-500" />
                        <span>{currentStreak}d</span>
                      </div>
                    </td>

                    {/* 7 Interactive Day Cells */}
                    {past7Days.map(day => {
                      const isDone = habit.completions.includes(day.dateStr);
                      const actionTitle = isDone
                        ? `Undo completion for ${day.dayNameFull} (${day.dateStr})`
                        : `Mark complete for ${day.dayNameFull} (${day.dateStr})`;

                      return (
                        <td
                          key={day.dateStr}
                          className={`py-3.5 px-2 text-center ${
                            day.isToday ? 'bg-indigo-50/30 dark:bg-indigo-950/20' : ''
                          }`}
                        >
                          <button
                            onClick={() => onToggleDateCompletion(habit.id, day.dateStr)}
                            title={actionTitle}
                            aria-label={`${habit.name}: ${actionTitle}`}
                            className={`w-7 h-7 mx-auto rounded-lg flex items-center justify-center transition-all duration-150 active:scale-90 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                              isDone
                                ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm shadow-emerald-500/30'
                                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-300 dark:text-slate-600 border border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            {isDone ? (
                              <Check className="w-4 h-4 stroke-[3]" />
                            ) : (
                              <span className="text-xs font-medium">○</span>
                            )}
                          </button>
                        </td>
                      );
                    })}

                    {/* Completion Rate in the 7 days */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          {sevenDayRate}%
                        </span>
                        <div className="w-12 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                            style={{ width: `${sevenDayRate}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
