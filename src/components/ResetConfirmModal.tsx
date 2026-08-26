import React from 'react';
import type { Habit } from '../types/habit';
import { ConfirmModal } from './ConfirmModal';

interface ResetConfirmModalProps {
  isOpen: boolean;
  habit: Habit | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  habit,
  onClose,
  onConfirm,
}) => {
  return (
    <ConfirmModal
      isOpen={isOpen}
      type="reset"
      title="Reset Habit Progress?"
      description={`Are you sure you want to reset all completion history for "${habit?.name}"?`}
      details={[
        `All ${habit?.completions.length || 0} check-in entries will be removed.`,
        'Current streak will reset to 0.',
        'The habit and reminder settings will remain intact.',
      ]}
      confirmLabel="Reset Progress"
      confirmVariant="danger"
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
};
