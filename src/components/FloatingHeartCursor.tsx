import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Heart {
  id: number;
  x: number;
  y: number;
}

export function FloatingHeartCursor() {
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Detect mobile on mount
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    let heartId = 0;
    let lastHeartTime = 0;
    
    // Reduce frequency on mobile: 1 heart per 7-10s vs 1 per 3-5s on desktop
    const minInterval = isMobile ? 7000 : 3000;
    const maxInterval = isMobile ? 10000 : 5000;

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      const timeSinceLastHeart = now - lastHeartTime;
      const randomInterval = Math.random() * (maxInterval - minInterval) + minInterval;

      // Spawn heart based on interval
      if (timeSinceLastHeart > randomInterval) {
        lastHeartTime = now;
        const newHeart: Heart = {
          id: heartId++,
          x: e.clientX,
          y: e.clientY,
        };

        setHearts((prev) => [...prev, newHeart]);

        // Remove heart after animation
        setTimeout(() => {
          setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
        }, 2000);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile]);

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      <AnimatePresence>
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ 
              opacity: 0.6, 
              y: heart.y, 
              x: heart.x,
              scale: 0 
            }}
            animate={{ 
              opacity: 0, 
              y: heart.y - 100, 
              x: heart.x + (Math.random() * 40 - 20),
              scale: 1
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: 'easeOut' }}
            className="absolute text-rose text-xl"
            style={{ left: 0, top: 0 }}
          >
            ❤️
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
