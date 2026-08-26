# AI-Assisted Development Log: HabitFlow

This document transparently outlines the prompts, architectural reasoning, testing strategy, and iterative decisions used during the development and refinement of the **HabitFlow** application.

---

## 1. Architectural Planning & Project Scaffolding

### Prompt Used:
> *"Design a modular, production-ready React + TypeScript + Vite architecture for a local-first Daily Habit Tracker web application. The application requires daily habits only, streak calculations across month/year/leap-year boundaries, a 7-day consistency matrix ending today with a visible TODAY badge, mathematical dashboard statistics (Active Habits, Done Today, Best Streak, 7-Day Rate), archiving with confirmation, progress resets with confirmation, and robust localStorage persistence with schema validation. What project structure and state management approach is best?"*

### Decision & Adaptation:
- **Decision**: Separate pure mathematical date/streak logic (`src/utils/date.ts`, `src/utils/streak.ts`) from state management (`src/hooks/useHabits.ts`) and UI presentation (`src/components/*`).
- **Adaptation**: Rather than relying on heavyweight state management libraries, a centralized custom React hook (`useHabits`) with `useMemo` optimizations was chosen to keep bundle size lightweight and dependency overhead minimal while maintaining strict separation of concerns.

---

## 2. Data Modeling & TypeScript Contracts

### Prompt Used:
> *"Define strong TypeScript interfaces for Habit, HabitCategory, HabitColor, FilterType, SortOption, ToastMessage, and HabitStatsData. All habits must be strictly Daily with frequency: 'daily'. Habits must store completions as ISO date strings (`YYYY-MM-DD`) and support archiving, optional reminder cues, and optional notes."*

### Decision & Adaptation:
- **Decision**: Stored `completions` as an array of `YYYY-MM-DD` strings.
- **Adaptation**: Ensured all completion arrays are deduplicated on write and validated against ISO date regex patterns (`/^\d{4}-\d{2}-\d{2}$/`) during localStorage deserialization to guard against corrupted or manual storage edits.

---

## 3. Daily Streak Calculation Engine

### Prompt Used:
> *"Develop a pure, deterministic daily streak engine that handles all calendar edge cases: consecutive calendar days, yesterday completed while today is open (grace rule), broken streaks, month rollovers, leap years (Feb 29), year rollovers (Dec 31 to Jan 1), and duplicate check-ins."*

### Decision & Adaptation:
- **Daily Streak Algorithm**:
  1. Deduplicate and sort completion dates chronologically.
  2. If today is completed, count backward consecutively.
  3. If today is not completed but yesterday was completed, retain yesterday's streak as active (pending today's check-in).
  4. Compute both `currentStreak` and all-time `longestStreak`.

---

## 4. Mathematical Statistics Formulas

### Prompt Used:
> *"Implement mathematical formulas for the dashboard statistics ensuring archived habits are strictly excluded: (1) Active Habits: count of non-archived daily habits, (2) Done Today: number of active habits completed today / total active habits, (3) Best Streak: maximum current streak among active habits, (4) 7-Day Rate: total completed daily check-ins in past 7 days / (totalActive * 7) * 100."*

### Decision & Adaptation:
- Implemented pure `useMemo` calculations in `src/hooks/useHabits.ts` with dedicated unit test suite in `tests/stats.test.ts`.

---

## 5. UI Design & Interactive Polish

### Prompt Used:
> *"Preserve the existing sleek dark visual theme, responsive layout, glassmorphic cards, and glowing metric cards while removing all weekly options, filters, and text. Add confirmation dialogs before resetting progress, archiving a habit, and restoring starter habits. Ensure the 7-day consistency matrix highlights today with a visible TODAY badge and provides accessible tooltips for Mark complete and Undo completion."*

### Decision & Adaptation:
- Built accessible modal dialogs with backdrop blur, autofocus, character counters, and keyboard shortcuts (<kbd>Escape</kbd> to close).
- Added `canvas-confetti` bursts on habit completions and a special cannon blast for 7-day streak milestones.
- Created `ConfirmModal.tsx` to handle safety confirmations before destructive or irreversible actions.

---

## 6. Testing & Verification Suite

### Prompt Used:
> *"Write comprehensive Vitest test suites covering: (1) daily streak calculations across leap years and month boundaries, (2) date utility calculations, (3) habit CRUD lifecycle operations, (4) mathematical correctness of statistics formulas, (5) localStorage persistence, schema validation, and corrupted data recovery, and (6) end-to-end React component rendering with `@testing-library/react`."*

### Decision & Adaptation:
- Created 5 test suites with **43 total tests**:
  - `tests/streak.test.ts`: 14 unit tests.
  - `tests/habit.test.ts`: 11 unit tests.
  - `tests/stats.test.ts`: 5 statistics tests.
  - `tests/storage.test.ts`: 7 persistence & recovery tests.
  - `tests/app.test.tsx`: 6 integration tests.
- Polyfilled `window.matchMedia` and mocked `canvas-confetti` in `tests/setup.ts` to ensure 100% reliable execution in headless jsdom environments.

---

## 7. Refinement & Code Quality

- **Strict TypeScript**: Compiled with `tsc -b` and `vite build` with zero errors or warnings.
- **Accessibility**: Added accessible `aria-labels` and keyboard controls to all icon buttons and dialogs.
- **Zero Weekly Leftovers**: Ensured all weekly frequencies, badges, text, filters, and calculations were completely removed.
