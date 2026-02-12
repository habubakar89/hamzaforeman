import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useState, useEffect } from 'react';
import { LETTERS, STAR_POSITIONS, CONSTELLATION_LINES } from '../../data/letters';

interface ConstellationMapProps {
  openedLetters: boolean[];
  onStarClick: (index: number) => void;
  activeIndex: number | null;
  allCompleted: boolean;
  heartbeatEnabled: boolean;
}

// Generate background stars
function generateBackgroundStars(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 1.5 + 0.5,
    delay: Math.random() * 4,
    duration: Math.random() * 3 + 2,
  }));
}

export function ConstellationMap({
  openedLetters,
  onStarClick,
  activeIndex,
  allCompleted,
  heartbeatEnabled,
}: ConstellationMapProps) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const backgroundStars = useMemo(() => generateBackgroundStars(50), []);
  const [showCompletionAnimation, setShowCompletionAnimation] = useState(false);
  const [completionPhase, setCompletionPhase] = useState(0);

  // Trigger completion animation when all letters are opened
  useEffect(() => {
    if (allCompleted && !showCompletionAnimation) {
      setShowCompletionAnimation(true);
      // Phase progression for cinematic effect
      const phases = [500, 1500, 2500];
      phases.forEach((delay, i) => {
        setTimeout(() => setCompletionPhase(i + 1), delay);
      });
    }
  }, [allCompleted, showCompletionAnimation]);

  const shouldHeartbeat = heartbeatEnabled && !prefersReducedMotion;

  return (
    <div className="relative w-full h-full min-h-[300px] md:min-h-[400px]" role="navigation" aria-label="Letter constellation navigation">
      {/* Background stars */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        {backgroundStars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full bg-white/60"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
            }}
            animate={prefersReducedMotion ? {} : {
              opacity: [0.2, 0.6, 0.2],
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

      {/* Completion shimmer effect */}
      <AnimatePresence>
        {showCompletionAnimation && completionPhase >= 2 && !prefersReducedMotion && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.3, 0],
              background: [
                'radial-gradient(circle at 30% 30%, rgba(255,77,166,0) 0%, transparent 50%)',
                'radial-gradient(circle at 70% 70%, rgba(255,119,200,0.4) 0%, transparent 60%)',
                'radial-gradient(circle at 50% 50%, rgba(255,77,166,0) 0%, transparent 50%)',
              ],
            }}
            transition={{ duration: 2, ease: "easeInOut" }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* SVG for constellation lines */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff4da6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ff77c8" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="lineGradientActive" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff4da6" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ff77c8" stopOpacity="0.9" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="0.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glowIntense">
            <feGaussianBlur stdDeviation="1" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {CONSTELLATION_LINES.map(([from, to], index) => {
          const fromPos = STAR_POSITIONS[from];
          const toPos = STAR_POSITIONS[to];
          const isConnected = openedLetters[from] && openedLetters[to];
          const shouldAnimate = allCompleted || isConnected;

          // Calculate line length for stroke animation
          const dx = toPos.x - fromPos.x;
          const dy = toPos.y - fromPos.y;
          const length = Math.sqrt(dx * dx + dy * dy);

          return (
            <motion.line
              key={index}
              x1={fromPos.x}
              y1={fromPos.y}
              x2={toPos.x}
              y2={toPos.y}
              stroke={shouldAnimate ? "url(#lineGradientActive)" : "rgba(255,255,255,0.1)"}
              strokeWidth={shouldAnimate ? "0.5" : "0.2"}
              strokeLinecap="round"
              filter={shouldAnimate ? "url(#glowIntense)" : undefined}
              strokeDasharray={length}
              initial={{ strokeDashoffset: length, opacity: 0.1 }}
              animate={{
                strokeDashoffset: shouldAnimate ? 0 : length * 0.7,
                opacity: shouldAnimate ? 0.9 : 0.15,
              }}
              transition={{
                duration: prefersReducedMotion ? 0 : (showCompletionAnimation ? 1 : 1.5),
                delay: prefersReducedMotion ? 0 : (showCompletionAnimation ? index * 0.3 : index * 0.2),
                ease: "easeOut",
              }}
            />
          );
        })}
      </svg>

      {/* Star nodes */}
      {STAR_POSITIONS.map((pos, index) => {
        const letter = LETTERS[index];
        const isOpened = openedLetters[index];
        const isActive = activeIndex === index;

        return (
          <motion.button
            key={index}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2
                       rounded-full flex items-center justify-center
                       focus:outline-none focus:ring-2 focus:ring-[#ff4da6]/60 focus:ring-offset-2 focus:ring-offset-transparent
                       transition-all duration-300 group
                       ${isActive ? 'z-20' : 'z-10'}`}
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              width: isActive ? '64px' : '48px',
              height: isActive ? '64px' : '48px',
            }}
            onClick={() => onStarClick(index)}
            whileHover={prefersReducedMotion ? {} : { scale: 1.15 }}
            whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
            aria-label={`Open letter: ${letter.title}${isOpened ? ' (opened)' : ''}`}
            aria-pressed={isActive}
          >
            {/* Heartbeat glow ring */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: isOpened
                  ? 'radial-gradient(circle, rgba(255,77,166,0.4) 0%, transparent 70%)'
                  : 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
              }}
              animate={shouldHeartbeat ? {
                scale: [1, 1.3, 1, 1.2, 1],
                opacity: [0.5, 0.3, 0.5, 0.35, 0.5],
              } : prefersReducedMotion ? {} : {
                scale: [1, 1.3, 1],
                opacity: [0.5, 0.3, 0.5],
              }}
              transition={shouldHeartbeat ? {
                duration: 2,
                times: [0, 0.15, 0.3, 0.45, 1],
                repeat: Infinity,
                ease: "easeInOut",
              } : {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Star core */}
            <motion.div
              className={`relative rounded-full transition-all duration-300
                         ${isOpened
                           ? 'bg-gradient-to-br from-[#ff4da6] to-[#ff77c8]'
                           : 'bg-gradient-to-br from-white/80 to-white/40'
                         }
                         ${isActive ? 'w-8 h-8' : 'w-6 h-6'}
                         group-hover:shadow-xl`}
              animate={shouldHeartbeat && isOpened ? {
                boxShadow: [
                  '0 0 15px rgba(255,77,166,0.4), 0 0 30px rgba(255,77,166,0.2)',
                  '0 0 25px rgba(255,77,166,0.6), 0 0 50px rgba(255,77,166,0.3)',
                  '0 0 15px rgba(255,77,166,0.4), 0 0 30px rgba(255,77,166,0.2)',
                  '0 0 20px rgba(255,77,166,0.5), 0 0 40px rgba(255,77,166,0.25)',
                  '0 0 15px rgba(255,77,166,0.4), 0 0 30px rgba(255,77,166,0.2)',
                ],
              } : {}}
              transition={shouldHeartbeat ? {
                duration: 2,
                times: [0, 0.15, 0.3, 0.45, 1],
                repeat: Infinity,
                ease: "easeInOut",
              } : {}}
              style={{
                boxShadow: isOpened
                  ? '0 0 20px rgba(255,77,166,0.6), 0 0 40px rgba(255,77,166,0.3)'
                  : '0 0 15px rgba(255,255,255,0.4)',
              }}
            >
              {/* Opened indicator */}
              {isOpened && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  ✓
                </motion.div>
              )}
            </motion.div>

            {/* Tooltip */}
            <motion.div
              className="absolute top-full mt-3 left-1/2 -translate-x-1/2
                        px-3 py-1.5 rounded-lg whitespace-nowrap
                        bg-[#0b0f1f]/95 backdrop-blur-sm border border-[#ff4da6]/30
                        text-sm text-[#f5f5f7] pointer-events-none
                        opacity-0 group-hover:opacity-100 group-focus:opacity-100
                        transition-opacity duration-200"
              aria-hidden="true"
            >
              {letter.title}
              {isOpened && <span className="ml-1 text-[#ff77c8]">✨</span>}
            </motion.div>
          </motion.button>
        );
      })}

      {/* Completion indicator with animation */}
      <AnimatePresence>
        {allCompleted && (
          <motion.div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: showCompletionAnimation ? 2.5 : 0.5 }}
          >
            <motion.p
              className="text-[#ff77c8] text-sm font-medium"
              animate={shouldHeartbeat ? {
                textShadow: [
                  '0 0 10px rgba(255,77,166,0.3)',
                  '0 0 20px rgba(255,77,166,0.5)',
                  '0 0 10px rgba(255,77,166,0.3)',
                ],
              } : {}}
              transition={shouldHeartbeat ? {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              } : {}}
            >
              Constellation complete ✨
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
