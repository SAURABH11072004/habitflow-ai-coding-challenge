import React from 'react';
import { AlertCircle, CheckCircle2, Info, X, XCircle } from 'lucide-react';
import type { ToastMessage } from '../types/habit';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map(toast => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />,
          info: <Info className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />,
          warning: <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />,
          error: <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />,
        };

        const borderStyles = {
          success: 'border-emerald-500/30 dark:border-emerald-500/20 bg-white/95 dark:bg-slate-900/95 shadow-emerald-500/10',
          info: 'border-indigo-500/30 dark:border-indigo-500/20 bg-white/95 dark:bg-slate-900/95 shadow-indigo-500/10',
          warning: 'border-amber-500/30 dark:border-amber-500/20 bg-white/95 dark:bg-slate-900/95 shadow-amber-500/10',
          error: 'border-rose-500/30 dark:border-rose-500/20 bg-white/95 dark:bg-slate-900/95 shadow-rose-500/10',
        };

        return (
          <div
            key={toast.id}
            role="alert"
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-lg transition-all duration-300 transform translate-y-0 opacity-100 ${borderStyles[toast.type]}`}
          >
            {icons[toast.type]}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                {toast.title}
              </h4>
              {toast.description && (
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-normal">
                  {toast.description}
                </p>
              )}
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
