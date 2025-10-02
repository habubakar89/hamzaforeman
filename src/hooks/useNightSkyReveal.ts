import { useCallback, useRef, useState } from 'react';

// One-shot reveal hook - decouples overlay visibility from persistent parent state
export function useNightSkyReveal() {
  const [revealVisible, setRevealVisible] = useState(false);
  const [revealKey, setRevealKey] = useState(0);
  const lastTapTime = useRef(0);

  // One-shot show function with debouncing
  const show = useCallback(() => {
    // Debounce: ignore if within 250ms of last tap
    const now = Date.now();
    if (now - lastTapTime.current < 250) {
      return;
    }
    lastTapTime.current = now;

    // If already visible, queue for next tick (after current teardown completes)
    if (revealVisible) {
      return; // Ignore while one is already active
    }

    // Set visible and increment key to force fresh mount
    setRevealVisible(true);
    setRevealKey(k => k + 1);
  }, [revealVisible]);

  // Callback for when overlay auto-dismisses itself
  const handleAutoDismiss = useCallback(() => {
    setRevealVisible(false);
  }, []);

  return {
    revealVisible,
    revealKey,
    show,
    onAutoDismiss: handleAutoDismiss,
  };
}
