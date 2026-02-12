import { motion } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';

interface CoverScreenProps {
  onBegin: () => void;
}

// Generate random stars for background
function generateStars(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 3,
    duration: Math.random() * 2 + 2,
  }));
}

export function CoverScreen({ onBegin }: CoverScreenProps) {
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Memoize stars so they don't regenerate on every render
  const stars = useMemo(() => generateStars(80), []);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-[#060712] via-[#0a0e1a] to-[#0b0f1f] overflow-hidden">
      {/* Background Stars */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
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
            initial={{ opacity: 0.3 }}
            animate={prefersReducedMotion ? {} : {
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1],
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

      {/* Subtle gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255,77,166,0.08) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: prefersReducedMotion ? 0 : 0.8, delay: 0.3 }}
        >
          {/* Title */}
          <motion.h1
            className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#f5f5f7] mb-4 tracking-wide"
            style={{
              textShadow: '0 0 40px rgba(255,77,166,0.3), 0 0 80px rgba(255,77,166,0.15)',
            }}
          >
            For Us, Eman
            <span className="inline-block ml-2 text-3xl sm:text-4xl md:text-5xl">✨</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            className="text-[#b9b9c2] text-base sm:text-lg md:text-xl max-w-md mx-auto mb-12 leading-relaxed font-light"
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: 0.6 }}
          >
            I wrote you a few letters. Open them slowly.
          </motion.p>

          {/* CTA Button */}
          <motion.button
            onClick={onBegin}
            className="group relative px-8 py-4 rounded-full text-lg font-medium
                     bg-gradient-to-r from-[#ff4da6]/20 to-[#ff77c8]/20
                     border border-[#ff4da6]/40 text-[#f5f5f7]
                     hover:from-[#ff4da6]/30 hover:to-[#ff77c8]/30
                     hover:border-[#ff4da6]/60
                     focus:outline-none focus:ring-2 focus:ring-[#ff4da6]/50 focus:ring-offset-2 focus:ring-offset-[#060712]
                     transition-all duration-300 ease-out
                     min-h-[56px] min-w-[180px]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: 0.9 }}
            whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
            whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
            aria-label="Begin the anniversary experience"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Begin
              <span className="text-xl">💌</span>
            </span>

            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: 'radial-gradient(circle at center, rgba(255,77,166,0.3) 0%, transparent 70%)',
                filter: 'blur(15px)',
              }}
              aria-hidden="true"
            />
          </motion.button>
        </motion.div>

        {/* Decorative constellation preview */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#b9b9c2]/40 text-sm"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: 1.2 }}
          aria-hidden="true"
        >
          <div className="flex items-center gap-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-[#ff4da6]/50"
                animate={prefersReducedMotion ? {} : {
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.2,
                  repeat: Infinity,
                }}
              />
            ))}
          </div>
          <p className="mt-2 text-xs">5 letters await</p>
        </motion.div>
      </div>
    </div>
  );
}
