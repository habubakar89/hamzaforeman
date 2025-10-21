import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EntryBannerProps {
  onComplete: () => void;
}

export function EntryBanner({ onComplete }: EntryBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-hide after animation completes (~2s total)
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Call onComplete after fade out
      setTimeout(onComplete, 400);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  // TODO: confirm design choice - currently using blur overlay + gradient
  // Alternative: pure blur without gradient (remove gradient from className below)
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ 
            backdropFilter: 'blur(12px)',
            opacity: 0 
          }}
          animate={{ 
            backdropFilter: 'blur(12px)',
            opacity: 1 
          }}
          exit={{ 
            backdropFilter: 'blur(0px)',
            opacity: 0
          }}
          transition={{ 
            opacity: { duration: 0.3 },
            backdropFilter: { duration: 0.4 }
          }}
          className="fixed inset-0 bg-gradient-to-b from-midnight-900/40 via-midnight-900/20 to-transparent z-50 flex flex-col items-center justify-center"
          style={{ backdropFilter: 'blur(12px)' }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ 
              opacity: { duration: 0.3 },
              y: { duration: 0.3 }
            }}
            className="text-center"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-heading font-bold text-rose-300 drop-shadow-lg tracking-wide">
              To the Happiest 25th
            </h1>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
