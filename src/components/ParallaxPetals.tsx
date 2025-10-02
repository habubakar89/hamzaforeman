import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function ParallaxPetals() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile on mount
    setIsMobile(window.innerWidth < 768);
  }, []);

  // Reduce petal count on mobile (40% of desktop)
  const allPetals = [
    { id: 1, delay: 0, duration: 15, left: '10%', size: 'text-2xl' },
    { id: 2, delay: 3, duration: 18, left: '25%', size: 'text-xl' },
    { id: 3, delay: 6, duration: 20, left: '40%', size: 'text-3xl' },
    { id: 4, delay: 2, duration: 17, left: '55%', size: 'text-2xl' },
    { id: 5, delay: 5, duration: 16, left: '70%', size: 'text-xl' },
    { id: 6, delay: 8, duration: 19, left: '85%', size: 'text-2xl' },
    { id: 7, delay: 1, duration: 21, left: '15%', size: 'text-xl' },
    { id: 8, delay: 7, duration: 18, left: '60%', size: 'text-2xl' },
  ];

  // Show only first 3 petals on mobile (40% density)
  const petals = isMobile ? allPetals.slice(0, 3) : allPetals;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          className={`absolute ${petal.size} opacity-10`}
          style={{ left: petal.left }}
          initial={{ y: '110vh', rotate: 0 }}
          animate={{
            y: '-10vh',
            rotate: 360,
            x: [0, 30, -30, 0],
          }}
          transition={{
            y: {
              duration: petal.duration,
              repeat: Infinity,
              delay: petal.delay,
              ease: 'linear',
            },
            rotate: {
              duration: petal.duration / 2,
              repeat: Infinity,
              delay: petal.delay,
              ease: 'linear',
            },
            x: {
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          }}
        >
          🌸
        </motion.div>
      ))}
    </div>
  );
}
