import confetti from 'canvas-confetti';

/**
 * Triggers a celebratory confetti explosion
 */
export function triggerCompletionConfetti() {
  try {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#3b82f6', '#8b5cf6'],
      ticks: 200,
      gravity: 1.2,
      scalar: 0.9,
    });
  } catch {
    // Graceful fallback if canvas is not supported
  }
}

/**
 * Triggers a massive confetti cannon for streak milestones (e.g. 7 days, 30 days)
 */
export function triggerMilestoneConfetti() {
  try {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      colors: ['#f59e0b', '#ef4444', '#10b981', '#6366f1', '#ec4899'],
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  } catch {
    // Graceful fallback
  }
}
