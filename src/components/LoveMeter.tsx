import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { NOTES } from '../data/notes';

// Control flag for session persistence of collapsed state
export const LOVE_METER_PERSIST_SESSION = false;

export function LoveMeter() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Count visible (unblurred) notes to determine progress
  const totalNotes = NOTES.length;
  const visibleNotes = NOTES.filter(note => note.isBlurred === false).length;
  
  // Calculate percentage based on manually revealed notes (minimum 5% when at least 1 note visible)
  const basePercentage = ((visibleNotes - 1) / (totalNotes - 1)) * 95; // Scale from 0-95%
  const percentage = Math.round(basePercentage + 5); // Add 5% minimum
  
  // Display day count based on visible notes
  const currentDay = visibleNotes;

  // Collapse state management - auto-collapse after 3s
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Check session storage first
    const saved = sessionStorage.getItem('love_meter_collapsed');
    return saved === 'true';
  });

  // Auto-collapse after 3 seconds on mount (only if not already collapsed from storage)
  useEffect(() => {
    if (!isCollapsed) {
      const timer = setTimeout(() => {
        setIsCollapsed(true);
        sessionStorage.setItem('love_meter_collapsed', 'true');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  // Save to session storage whenever collapsed state changes
  useEffect(() => {
    sessionStorage.setItem('love_meter_collapsed', String(isCollapsed));
  }, [isCollapsed]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {!isCollapsed ? (
          <motion.div
            key="expanded"
            initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={prefersReducedMotion ? {} : { opacity: 0, scale: 0.9 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
            className="fixed top-4 right-4 z-30
                      bg-midnight-800/80 backdrop-blur-sm rounded-lg border border-gold/20 
                      p-4 w-[52vw] max-w-[280px] sm:w-48
                      shadow-xl"
          >
            {/* Header with collapse button */}
            <div className="flex items-center justify-between mb-2">
              <p className="font-body text-xs text-gray-400">love level</p>
              <button
                onClick={toggleCollapse}
                className="p-1 hover:bg-white/10 rounded transition-colors 
                         focus-visible:ring-2 focus-visible:ring-gold
                         min-w-[24px] min-h-[24px]"
                aria-label="Collapse love meter"
                aria-pressed={isCollapsed}
              >
                <ChevronUp size={16} className="text-gray-400" />
              </button>
            </div>

            <div className="text-center mb-2">
              <p className="text-xl sm:text-2xl font-heading text-rose">{percentage}%</p>
              <p className="font-body text-xs text-gray-500">full</p>
            </div>

            <div className="relative h-32 bg-midnight-900/50 rounded-full overflow-hidden border border-gold/20">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${percentage}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="absolute bottom-0 w-full bg-gradient-to-t from-rose via-rose/70 to-gold/50"
              />
              
              {/* Animated sparkles */}
              {!prefersReducedMotion && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {[...Array(2)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        y: [40, -40],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 3,
                        delay: i * 1,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                      className="absolute left-1/2 transform -translate-x-1/2 text-gold text-xs"
                      style={{ bottom: `${percentage}%` }}
                    >
                      ✨
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-2 text-center">
              <p className="font-body text-xs text-gray-500">
                day {currentDay} of {totalNotes}
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="collapsed"
            onPointerUp={toggleCollapse}
            initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={prefersReducedMotion ? {} : { opacity: 0, scale: 0.8 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
            whileHover={!prefersReducedMotion ? { scale: 1.05 } : {}}
            whileTap={{ scale: 0.95 }}
            className="fixed top-4 right-4 z-30
                     min-h-[44px]
                     px-4 py-2.5
                     rounded-full
                     bg-midnight-800/90 backdrop-blur-lg
                     border border-rose/40
                     flex items-center gap-2
                     shadow-lg shadow-rose/20
                     hover:bg-midnight-800 hover:border-rose/60
                     focus-visible:ring-2 focus-visible:ring-rose
                     transition-colors
                     touch-manipulation"
            style={{ touchAction: 'manipulation' }}
            role="button"
            aria-label="Show love meter"
            aria-pressed={isCollapsed}
          >
            <span className="text-rose text-sm font-medium whitespace-nowrap">Leading up to your love 💖</span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
