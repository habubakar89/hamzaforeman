import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { PHOTOS } from '../../data/photos';

interface PhotoMontageProps {
  isPlaying: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

const SLIDE_DURATION = 4000; // 4 seconds per photo
const TRANSITION_DURATION = 1.5; // 1.5 second transition

export function PhotoMontage({ isPlaying, onComplete, onSkip }: PhotoMontageProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showOverlayText, setShowOverlayText] = useState(true);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Auto-advance slides
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => {
        if (prev >= PHOTOS.length - 1) {
          clearInterval(timer);
          setTimeout(onComplete, TRANSITION_DURATION * 1000);
          return prev;
        }
        return prev + 1;
      });
    }, SLIDE_DURATION);

    return () => clearInterval(timer);
  }, [isPlaying, onComplete]);

  // Keyboard handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onSkip();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onSkip]);

  const toggleOverlayText = useCallback(() => {
    setShowOverlayText(prev => !prev);
  }, []);

  if (!isPlaying) return null;

  const currentPhoto = PHOTOS[currentIndex];

  return (
    <motion.div
      className="fixed inset-0 z-[70] bg-black overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Skip button */}
      <button
        onClick={onSkip}
        className="absolute top-4 right-4 z-30 p-3 rounded-full
                 bg-white/10 hover:bg-white/20 text-white
                 transition-all duration-200
                 focus:outline-none focus:ring-2 focus:ring-[#ff4da6]/50"
        aria-label="Skip montage"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Toggle overlay text */}
      <button
        onClick={toggleOverlayText}
        className="absolute top-4 left-4 z-30 px-3 py-2 rounded-full
                 bg-white/10 hover:bg-white/20 text-white text-xs
                 transition-all duration-200
                 focus:outline-none focus:ring-2 focus:ring-[#ff4da6]/50"
        aria-label={showOverlayText ? "Hide text overlay" : "Show text overlay"}
      >
        {showOverlayText ? 'Hide text' : 'Show text'}
      </button>

      {/* Photo slides with Ken Burns effect */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: TRANSITION_DURATION }}
        >
          <motion.img
            src={currentPhoto.src}
            alt={currentPhoto.alt}
            className="w-full h-full object-cover"
            initial={prefersReducedMotion ? {} : { scale: 1.1 }}
            animate={prefersReducedMotion ? {} : {
              scale: 1,
              x: currentIndex % 2 === 0 ? [0, -20] : [0, 20],
              y: currentIndex % 3 === 0 ? [0, -10] : [0, 10],
            }}
            transition={{
              duration: SLIDE_DURATION / 1000,
              ease: "linear",
            }}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
        </motion.div>
      </AnimatePresence>

      {/* Overlay text */}
      <AnimatePresence>
        {showOverlayText && (
          <motion.div
            className="absolute inset-x-0 bottom-20 sm:bottom-24 z-20 text-center px-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <motion.p
              key={currentIndex}
              className="font-playfair text-2xl sm:text-3xl md:text-4xl text-white"
              style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {currentPhoto.caption || 'Always us.'}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress bar */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {PHOTOS.map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full transition-all duration-300
                      ${i === currentIndex
                        ? 'w-8 bg-[#ff4da6]'
                        : i < currentIndex
                          ? 'w-2 bg-white/60'
                          : 'w-2 bg-white/20'
                      }`}
          />
        ))}
      </div>

      {/* Progress text */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20">
        <span className="text-white/50 text-xs">
          {currentIndex + 1} / {PHOTOS.length}
        </span>
      </div>
    </motion.div>
  );
}
