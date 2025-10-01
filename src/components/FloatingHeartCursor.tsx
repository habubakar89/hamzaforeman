import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Heart {
  id: number;
  x: number;
  y: number;
}

export function FloatingHeartCursor() {
  const [hearts, setHearts] = useState<Heart[]>();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const newHeart: Heart = {
        id: Date.now(),
        x: mousePos.x,
        y: mousePos.y,
      };
      
      setHearts((prev) => [...(prev || []), newHeart]);
      
      // Remove heart after animation completes
      setTimeout(() => {
        setHearts((prev) => (prev || []).filter((h) => h.id !== newHeart.id));
      }, 3000);
    }, 6500); // Create hearts every 6.5 seconds

    return () => clearInterval(interval);
  }, [mousePos]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {hearts?.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{
              x: heart.x - 12,
              y: heart.y - 12,
              opacity: 0,
              scale: 0,
            }}
            animate={{
              y: heart.y - 100,
              opacity: [0, 1, 1, 0],
              scale: [0, 1, 1, 0.8],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 3,
              ease: 'easeOut',
            }}
            className="absolute text-2xl"
          >
            ❤️
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
