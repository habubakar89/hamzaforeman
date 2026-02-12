import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { VOWS, FINAL_NOTE } from '../../data/letters';

interface FinalVowsScreenProps {
  onReplay: () => void;
  onComplete: () => void;
}

// Generate background stars
function generateStars(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    delay: Math.random() * 3,
    duration: Math.random() * 2 + 2,
  }));
}

export function FinalVowsScreen({ onReplay, onComplete }: FinalVowsScreenProps) {
  const [currentVowIndex, setCurrentVowIndex] = useState(-1);
  const [showFinalNote, setShowFinalNote] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const stars = useMemo(() => generateStars(60), []);

  useEffect(() => {
    if (prefersReducedMotion) {
      // Show all immediately for reduced motion
      setCurrentVowIndex(VOWS.length);
      setShowFinalNote(true);
      setIsComplete(true);
      onComplete();
      return;
    }

    // Animate vows one by one
    const startDelay = 800;
    const vowDuration = 3000; // Time each vow is shown before next
    const totalVowTime = startDelay + (VOWS.length * vowDuration);

    // Start the first vow after initial delay
    const initialTimer = setTimeout(() => {
      setCurrentVowIndex(0);
    }, startDelay);

    // Progress through vows
    const vowTimers = VOWS.map((_, index) => {
      return setTimeout(() => {
        setCurrentVowIndex(index + 1);
      }, startDelay + (index + 1) * vowDuration);
    });

    // Show final note after all vows
    const finalTimer = setTimeout(() => {
      setShowFinalNote(true);
      setIsComplete(true);
      onComplete();
    }, totalVowTime + 500);

    return () => {
      clearTimeout(initialTimer);
      vowTimers.forEach(clearTimeout);
      clearTimeout(finalTimer);
    };
  }, [prefersReducedMotion, onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-[#060712] via-[#0a0e1a] to-[#0b0f1f] overflow-y-auto">
      {/* Background stars */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
            }}
            animate={prefersReducedMotion ? {} : {
              opacity: [0.2, 0.7, 0.2],
            }}
            transition={{
              duration: star.duration,
              delay: star.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Radial glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255,77,166,0.1) 0%, transparent 50%)',
        }}
        aria-hidden="true"
      />

      {/* Content container */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-16">
        {/* Vows section */}
        <div className="w-full max-w-3xl space-y-8 text-center mb-12">
          {prefersReducedMotion ? (
            // Show all vows at once for reduced motion
            VOWS.map((vow, index) => (
              <p
                key={index}
                className="font-playfair text-lg sm:text-xl md:text-2xl text-[#f5f5f7] leading-relaxed"
                style={{ textShadow: '0 0 30px rgba(255,77,166,0.3)' }}
              >
                {vow}
              </p>
            ))
          ) : (
            // Animated reveal
            <AnimatePresence mode="wait">
              {currentVowIndex >= 0 && currentVowIndex <= VOWS.length && (
                <>
                  {VOWS.slice(0, currentVowIndex + 1).map((vow, index) => (
                    <motion.p
                      key={index}
                      className="font-playfair text-lg sm:text-xl md:text-2xl text-[#f5f5f7] leading-relaxed"
                      style={{ textShadow: '0 0 30px rgba(255,77,166,0.3)' }}
                      initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                      animate={{
                        opacity: index === currentVowIndex ? 1 : 0.6,
                        y: 0,
                        filter: 'blur(0px)',
                      }}
                      transition={{
                        duration: 0.8,
                        ease: "easeOut",
                      }}
                    >
                      {vow}
                    </motion.p>
                  ))}
                </>
              )}
            </AnimatePresence>
          )}
        </div>

        {/* Final note */}
        <AnimatePresence>
          {showFinalNote && (
            <motion.div
              className="w-full max-w-2xl text-center"
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: prefersReducedMotion ? 0 : 0.3 }}
            >
              {/* Divider */}
              <motion.div
                className="w-24 h-px mx-auto mb-8 bg-gradient-to-r from-transparent via-[#ff4da6] to-transparent"
                initial={prefersReducedMotion ? {} : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6 }}
                aria-hidden="true"
              />

              {/* Glow card */}
              <div
                className="relative p-8 sm:p-10 rounded-2xl overflow-hidden"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,77,166,0.2)',
                  boxShadow: '0 0 60px rgba(255,77,166,0.15), inset 0 0 60px rgba(255,77,166,0.05)',
                }}
              >
                {/* Inner glow */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'radial-gradient(ellipse at center, rgba(255,77,166,0.1) 0%, transparent 70%)',
                  }}
                  aria-hidden="true"
                />

                <p className="relative text-[#e8e8ed] text-base sm:text-lg md:text-xl leading-relaxed font-light">
                  {FINAL_NOTE}
                </p>
              </div>

              {/* Signature */}
              <motion.p
                className="mt-8 text-[#ff77c8] text-lg sm:text-xl font-playfair italic"
                initial={prefersReducedMotion ? {} : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: prefersReducedMotion ? 0 : 0.6 }}
              >
                Forever yours ✨
              </motion.p>

              {/* Replay button */}
              {isComplete && (
                <motion.button
                  onClick={onReplay}
                  className="mt-10 px-8 py-4 rounded-full text-base font-medium
                           bg-gradient-to-r from-[#ff4da6]/20 to-[#ff77c8]/20
                           border border-[#ff4da6]/40 text-[#f5f5f7]
                           hover:from-[#ff4da6]/30 hover:to-[#ff77c8]/30
                           hover:border-[#ff4da6]/60
                           focus:outline-none focus:ring-2 focus:ring-[#ff4da6]/50 focus:ring-offset-2 focus:ring-offset-[#060712]
                           transition-all duration-300"
                  initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: prefersReducedMotion ? 0 : 0.8 }}
                  whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                  whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                >
                  Replay ✨
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress indicator while vows are animating */}
        {!isComplete && !prefersReducedMotion && (
          <motion.div
            className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {VOWS.map((_, index) => (
              <motion.div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-500
                          ${index <= currentVowIndex ? 'bg-[#ff4da6]' : 'bg-white/20'}`}
                animate={index === currentVowIndex ? {
                  scale: [1, 1.3, 1],
                } : {}}
                transition={{ duration: 0.5 }}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
