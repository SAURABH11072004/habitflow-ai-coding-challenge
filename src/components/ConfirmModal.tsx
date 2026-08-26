import React, { useEffect } from 'react';
import { AlertTriangle, X, Archive, RotateCcw, Trash2 } from 'lucide-react';

export type ConfirmActionType = 'reset' | 'archive' | 'restore-samples' | 'delete';

interface ConfirmModalProps {
  isOpen: boolean;
  type: ConfirmActionType;
  title: string;
  description: string;
  details?: string[];
  confirmLabel: string;
  confirmVariant?: 'danger' | 'warning' | 'indigo';
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  type,
  title,
  description,
  details = [],
  confirmLabel,
  confirmVariant = 'danger',
  onClose,
  onConfirm,
}) => {
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

  const iconMap = {
    reset: <RotateCcw className="w-6 h-6 text-amber-500" />,
    archive: <Archive className="w-6 h-6 text-indigo-500" />,
    'restore-samples': <RotateCcw className="w-6 h-6 text-blue-500" />,
    delete: <Trash2 className="w-6 h-6 text-rose-500" />,
  };

  const bgIconMap = {
    reset: 'bg-amber-50 dark:bg-amber-950/50',
    archive: 'bg-indigo-50 dark:bg-indigo-950/50',
    'restore-samples': 'bg-blue-50 dark:bg-blue-950/50',
    delete: 'bg-rose-50 dark:bg-rose-950/50',
  };

  const confirmBtnStyles = {
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20 focus:ring-rose-500',
    warning: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20 focus:ring-amber-500',
    indigo: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20 focus:ring-indigo-500',
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6">
        
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-2xl ${bgIconMap[type]} shrink-0`}>
            {iconMap[type] || <AlertTriangle className="w-6 h-6 text-amber-500" />}
          </div>

          <div className="flex-1">
            <h3 id="confirm-modal-title" className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
              {title}
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {description}
            </p>
            {details.length > 0 && (
              <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-1">
                {details.map((d, i) => (
                  <p key={i}>• {d}</p>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md active:scale-[0.98] transition-all focus:outline-none focus:ring-2 ${confirmBtnStyles[confirmVariant]}`}
          >
            {confirmLabel}
          </button>
        </div>

      </div>
    </div>
  );
};
