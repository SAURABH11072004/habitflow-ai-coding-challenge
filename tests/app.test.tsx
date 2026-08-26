import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../src/App';

describe('Habit Tracker End-to-End App Integration', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renders dashboard with stats, daily habits, and weekly matrix', () => {
    render(<App />);

    // Header brand
    expect(screen.getByRole('heading', { level: 1, name: /habitflow/i })).toBeInTheDocument();

    // Stats section
    expect(screen.getByText('Active Habits')).toBeInTheDocument();
    expect(screen.getByText('Done Today')).toBeInTheDocument();
    expect(screen.getByText('Best Streak')).toBeInTheDocument();
    expect(screen.getAllByText('7-Day Rate').length).toBeGreaterThan(0);

    // Starter habits present in cards or matrix
    expect(screen.getAllByText('Drink 2.5L Water').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Morning Mindfulness & Meditation').length).toBeGreaterThan(0);

    // 7-Day consistency matrix with TODAY indicator
    expect(screen.getByText('7-Day Consistency Matrix')).toBeInTheDocument();
    expect(screen.getByText('TODAY')).toBeInTheDocument();
  });

  it('opens create habit modal, validates input, and creates a new daily habit', () => {
    render(<App />);

    // Click Add Habit button in header
    const addButtons = screen.getAllByRole('button', { name: /add habit|new/i });
    fireEvent.click(addButtons[0]);

    // Modal opens
    expect(screen.getByRole('heading', { name: /create daily habit/i })).toBeInTheDocument();

    // Try submitting empty -> validation error
    const submitBtn = screen.getByRole('button', { name: /create daily habit/i });
    fireEvent.click(submitBtn);
    expect(screen.getByText('Habit name is required.')).toBeInTheDocument();

    // Fill in valid habit details
    const nameInput = screen.getByPlaceholderText(/e\.g\. Drink 2\.5L Water/i);
    fireEvent.change(nameInput, { target: { value: 'Read 30 Minutes' } });

    const reminderInput = screen.getByPlaceholderText(/e\.g\. Drink right after waking up/i);
    fireEvent.change(reminderInput, { target: { value: 'Read before bedtime' } });

    // Submit form
    fireEvent.click(submitBtn);

    // Verify new habit appears on dashboard
    expect(screen.getAllByText('Read 30 Minutes').length).toBeGreaterThan(0);
    expect(screen.getByText(/Reminder: Read before bedtime/i)).toBeInTheDocument();
  });

  it('filters habits by All, Active, and Archived tabs and searches across fields', () => {
    render(<App />);

    // Click Active tab
    const activeTab = screen.getByRole('button', { name: /show active habits only/i });
    fireEvent.click(activeTab);

    // Daily habits visible
    expect(screen.getAllByText('Drink 2.5L Water').length).toBeGreaterThan(0);

    // Search query filter
    const searchInput = screen.getByPlaceholderText(/Search habits, notes, tags/i);
    fireEvent.change(searchInput, { target: { value: 'Meditation' } });

    expect(screen.getAllByText('Morning Mindfulness & Meditation').length).toBeGreaterThan(0);
    // Habit card for Drink Water is not in filtered cards
    const waterCard = screen.queryByRole('heading', { name: 'Drink 2.5L Water' });
    expect(waterCard).toBeNull();

    // Clear search
    fireEvent.change(searchInput, { target: { value: '' } });
    expect(screen.getAllByText('Drink 2.5L Water').length).toBeGreaterThan(0);
  });

  it('toggles today completion on a habit card and matrix', () => {
    render(<App />);

    // Find the completion button on cards
    const doneButtons = screen.getAllByRole('button', { name: /mark as done today|completed today!/i });
    expect(doneButtons.length).toBeGreaterThan(0);

    const firstButton = doneButtons[0];
    fireEvent.click(firstButton);

    // Verify localStorage has persisted data
    expect(window.localStorage.length).toBeGreaterThan(0);
  });

  it('opens confirmation modal before resetting progress', () => {
    render(<App />);

    // Open options menu on first card
    const menuButtons = screen.getAllByRole('button', { name: /habit options menu/i });
    fireEvent.click(menuButtons[0]);

    // Click Reset Progress
    const resetOption = screen.getByRole('button', { name: /reset progress/i });
    fireEvent.click(resetOption);

    // Confirmation dialog appears
    expect(screen.getByRole('dialog', { name: /reset habit progress\?/i })).toBeInTheDocument();
  });

  it('opens confirmation modal before archiving a habit', () => {
    render(<App />);

    // Open options menu on first card
    const menuButtons = screen.getAllByRole('button', { name: /habit options menu/i });
    fireEvent.click(menuButtons[0]);

    // Click Archive
    const archiveOption = screen.getByRole('button', { name: /^archive$/i });
    fireEvent.click(archiveOption);

    // Confirmation dialog appears
    expect(screen.getByRole('dialog', { name: /archive habit\?/i })).toBeInTheDocument();
  });
});
