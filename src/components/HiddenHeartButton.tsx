import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { SHOW_HIDDEN_HEART_BUTTON } from './EasterEgg';

interface HiddenHeartButtonProps {
  isActive: boolean;
  onToggle: () => void;
}

export function HiddenHeartButton({ isActive, onToggle }: HiddenHeartButtonProps) {
  const [lastToggleTime, setLastToggleTime] = useState(0);

  // Debounce toggle to prevent double-fires (500ms)
  const handleToggle = useCallback(() => {
    const now = Date.now();
    if (now - lastToggleTime < 500) {
      return; // Ignore if within 500ms of last toggle
    }
    setLastToggleTime(now);
    onToggle();
  }, [lastToggleTime, onToggle]);

  if (!SHOW_HIDDEN_HEART_BUTTON) {
    return null;
  }

  return (
    <motion.button
      onPointerUp={handleToggle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed top-4 left-4 z-30
               cursor-pointer 
               bg-midnight-900/40 
               px-3 py-2
               rounded-full 
               border border-gold/40 
               shadow-lg 
               text-xs text-gold 
               hover:bg-midnight-800/70
               focus-visible:ring-2 focus-visible:ring-rose
               transition-colors
               min-h-[44px]
               flex items-center gap-1.5
               touch-manipulation"
      style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
      role="button"
      aria-pressed={isActive}
      aria-controls="hidden-feature-panel"
      aria-label="A secret touch—tap to open"
      title="A secret touch—tap to open"
    >
      <span className="text-sm">✨</span>
      <span className="font-medium whitespace-nowrap">Secret touch</span>
    </motion.button>
  );
}
