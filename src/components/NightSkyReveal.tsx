import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface NightSkyRevealProps {
  isActive: boolean;
  onComplete: () => void;
}

export function NightSkyReveal({ isActive, onComplete }: NightSkyRevealProps) {
  const [stars, setStars] = useState<Array<{ x: number; y: number; size: number; delay: number }>>([]);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    // Generate random stars
    const newStars = Array.from({ length: 80 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 2
    }));
    setStars(newStars);
  }, []);

  useEffect(() => {
    if (isActive) {
      // Auto-close after 4 seconds
      const timer = setTimeout(onComplete, 4000);
      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  // Constellation points for "E + H" formation
  const constellationPoints = [
    // E shape (left side)
    { x: 35, y: 40 }, // top
    { x: 35, y: 50 }, // middle
    { x: 35, y: 60 }, // bottom
    { x: 40, y: 40 }, // top right
    { x: 40, y: 50 }, // middle right
    { x: 40, y: 60 }, // bottom right
    
    // + symbol (center)
    { x: 48, y: 50 }, // center
    { x: 52, y: 50 }, // right
    
    // H shape (right side)
    { x: 60, y: 40 }, // left top
    { x: 60, y: 50 }, // left middle
    { x: 60, y: 60 }, // left bottom
    { x: 65, y: 40 }, // right top
    { x: 65, y: 50 }, // right middle
    { x: 65, y: 60 }, // right bottom
  ];

  // Lines connecting constellation points to form letters
  const constellationLines = [
    // E lines
    { x1: 35, y1: 40, x2: 40, y2: 40 }, // top horizontal
    { x1: 35, y1: 50, x2: 40, y2: 50 }, // middle horizontal
    { x1: 35, y1: 60, x2: 40, y2: 60 }, // bottom horizontal
    { x1: 35, y1: 40, x2: 35, y2: 60 }, // vertical line
    
    // + lines
    { x1: 46, y1: 50, x2: 54, y2: 50 }, // horizontal
    { x1: 50, y1: 46, x2: 50, y2: 54 }, // vertical
    
    // H lines
    { x1: 60, y1: 40, x2: 60, y2: 60 }, // left vertical
    { x1: 65, y1: 40, x2: 65, y2: 60 }, // right vertical
    { x1: 60, y1: 50, x2: 65, y2: 50 }, // middle horizontal
  ];

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="fixed inset-0 z-50 pointer-events-none"
        >
          {/* Starry background */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a1128] via-[#1a1f3a] to-[#0b0f19]">
            {/* Stars */}
            {!prefersReducedMotion && stars.map((star, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0, 1, 0.5, 1],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 2 + star.delay,
                  repeat: Infinity,
                  delay: star.delay
                }}
                className="absolute rounded-full bg-white"
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, 0.8)`
                }}
              />
            ))}

            {/* Constellation E + H */}
            <svg className="absolute inset-0 w-full h-full">
              {/* Lines */}
              {!prefersReducedMotion && constellationLines.map((line, i) => (
                <motion.line
                  key={`line-${i}`}
                  x1={`${line.x1}%`}
                  y1={`${line.y1}%`}
                  x2={`${line.x2}%`}
                  y2={`${line.y2}%`}
                  stroke="#f5e6c4"
                  strokeWidth="1"
                  opacity="0.4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.4 }}
                  transition={{ duration: 1.5, delay: 0.5 + i * 0.1 }}
                />
              ))}

              {/* Points */}
              {constellationPoints.map((point, i) => (
                <motion.circle
                  key={`point-${i}`}
                  cx={`${point.x}%`}
                  cy={`${point.y}%`}
                  r="3"
                  fill="#f5e6c4"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: prefersReducedMotion ? 1 : [0, 1, 1, 0.8, 1],
                    scale: prefersReducedMotion ? 1 : [0, 1, 1.2, 1, 1.2, 1]
                  }}
                  transition={{
                    duration: prefersReducedMotion ? 0.5 : 2,
                    delay: prefersReducedMotion ? 0 : 0.3 + i * 0.05,
                    repeat: prefersReducedMotion ? 0 : Infinity,
                    repeatDelay: 1
                  }}
                  style={{
                    filter: 'drop-shadow(0 0 4px rgba(245, 230, 196, 0.8))'
                  }}
                />
              ))}
            </svg>

            {/* Reduced motion fallback */}
            {prefersReducedMotion && (
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-6xl md:text-8xl font-heading text-gold text-center"
                  style={{
                    textShadow: '0 0 20px rgba(245, 230, 196, 0.8)'
                  }}
                >
                  E + H ✨
                </motion.div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
