import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

interface SealedEnvelopeProps {
  isOpening: boolean;
  onOpenComplete: () => void;
}

export function SealedEnvelope({ isOpening, onOpenComplete }: SealedEnvelopeProps) {
  const [phase, setPhase] = useState<'sealed' | 'opening' | 'opened'>('sealed');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasCalledComplete = useRef(false);
  const onOpenCompleteRef = useRef(onOpenComplete);

  // Keep the ref updated
  onOpenCompleteRef.current = onOpenComplete;

  useEffect(() => {
    if (!isOpening || hasCalledComplete.current) return;

    if (prefersReducedMotion) {
      // Skip animation for reduced motion
      hasCalledComplete.current = true;
      onOpenCompleteRef.current();
      return;
    }

    setPhase('opening');
    const timer = setTimeout(() => {
      setPhase('opened');
      setTimeout(() => {
        if (!hasCalledComplete.current) {
          hasCalledComplete.current = true;
          onOpenCompleteRef.current();
        }
      }, 300);
    }, 800);

    return () => clearTimeout(timer);
  }, [isOpening, prefersReducedMotion]);

  if (prefersReducedMotion && isOpening) {
    return null;
  }

  return (
    <div className="flex items-center justify-center p-8">
      <motion.div
        className="relative w-48 h-32 sm:w-64 sm:h-44"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 1.1, opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Envelope body */}
        <div
          className="absolute inset-0 rounded-lg"
          style={{
            background: 'linear-gradient(145deg, #1a1f2e 0%, #0f1320 100%)',
            border: '1px solid rgba(255,77,166,0.3)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.4), 0 0 30px rgba(255,77,166,0.1)',
          }}
        />

        {/* Envelope flap */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-1/2 origin-top"
          style={{
            background: 'linear-gradient(180deg, #252a3c 0%, #1a1f2e 100%)',
            clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
            borderTop: '1px solid rgba(255,77,166,0.4)',
            borderLeft: '1px solid rgba(255,77,166,0.2)',
            borderRight: '1px solid rgba(255,77,166,0.2)',
          }}
          animate={{
            rotateX: phase === 'sealed' ? 0 : 180,
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />

        {/* Wax seal */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10
                     w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center"
          style={{
            background: 'radial-gradient(circle at 30% 30%, #ff77c8 0%, #ff4da6 50%, #cc3d85 100%)',
            boxShadow: '0 4px 15px rgba(255,77,166,0.5), inset 0 -2px 4px rgba(0,0,0,0.3)',
          }}
          animate={{
            scale: phase === 'opening' ? [1, 1.2, 0] : 1,
            opacity: phase === 'opened' ? 0 : 1,
          }}
          transition={{ duration: 0.4 }}
        >
          <span className="text-white text-lg sm:text-xl">💌</span>
        </motion.div>

        {/* Sparkle effects on opening */}
        {phase === 'opening' && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-[#ff77c8]"
                initial={{ x: 0, y: 0, scale: 0 }}
                animate={{
                  x: Math.cos((i * 60 * Math.PI) / 180) * 60,
                  y: Math.sin((i * 60 * Math.PI) / 180) * 60,
                  scale: [0, 1, 0],
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.05,
                }}
              />
            ))}
          </>
        )}

        {/* Inner letter peek */}
        <motion.div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-3/4 h-3/4 rounded-sm"
          style={{
            background: 'linear-gradient(180deg, #faf8f5 0%, #f0ede8 100%)',
          }}
          animate={{
            y: phase === 'opened' ? -20 : 0,
            opacity: phase === 'opened' ? 1 : 0.3,
          }}
          transition={{ duration: 0.3, delay: 0.4 }}
        />
      </motion.div>
    </div>
  );
}
