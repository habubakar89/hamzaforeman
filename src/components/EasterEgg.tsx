import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Control flag for the heart button visibility
export const SHOW_HIDDEN_HEART_BUTTON = true;

interface Habit {
  text: string;
  image?: string;
}

interface EasterEggProps {
  isOpen?: boolean;
  onToggle?: (open: boolean) => void;
}

// TODO: replace the 3 placeholder habits with personal ones
const HABITS: Habit[] = [
  {
    text: 'I will always treat yoy with the utmost respect, love, and care that you deserve. You are my queen, my everything.',
    // Optional: Add an image URL
    // image: '/images/habit1.jpg'
  },
  {
    text: 'What\'s mine is what\'s yours. Your happiness is my happiness, and I will always strive to make you feel loved and cherished.',
    // image: '/images/habit2.jpg'
  },
  {
    text: 'I am at peace. It is time to live and love life now that I have you by my side. You are my rock, my support, and my best friend.',
    // image: '/images/habit3.jpg'
  },
  {
    text: 'The smile you just got reading this is the same smile I get every time I think of you. You are my sunshine, my light, and my reason for being.',
    // image: '/images/habit3.jpg'
  }
];

export function EasterEgg({ isOpen: externalIsOpen, onToggle }: EasterEggProps = {}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Use external state if provided, otherwise use internal state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = onToggle || setInternalIsOpen;

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'h' || e.key === 'H') {
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        setCurrentIndex(0);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [setIsOpen]);

  useEffect(() => {
    if (isOpen && HABITS.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % HABITS.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 flex items-center justify-center p-4"
          onClick={() => {
            setIsOpen(false);
            setCurrentIndex(0);
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="max-w-2xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-midnight-800/90 backdrop-blur-lg rounded-2xl p-6 sm:p-8 md:p-12 border-2 border-gold/40 shadow-2xl">
              <div className="text-center mb-4 sm:mb-6">
                <h3 className="text-2xl sm:text-3xl font-playfair text-gold mb-2">
                  I knew you would come check here 😉
                </h3>
                <p className="text-sm text-gray-400">
                  {currentIndex + 1} of {HABITS.length}
                </p>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  {HABITS[currentIndex].image && (
                    <img
                      src={HABITS[currentIndex].image}
                      alt={`Habit ${currentIndex + 1}`}
                      className="w-full max-h-48 sm:max-h-64 object-cover rounded-lg mb-4 sm:mb-6 shadow-lg"
                    />
                  )}
                  <p className="text-lg sm:text-xl md:text-2xl text-gray-200 font-poppins leading-relaxed">
                    {HABITS[currentIndex].text}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-center gap-2 mt-6 sm:mt-8">
                {HABITS.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentIndex
                        ? 'bg-rose w-8'
                        : 'bg-gold/30 hover:bg-gold/50'
                    }`}
                    aria-label={`Go to habit ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={() => {
                  setIsOpen(false);
                  setCurrentIndex(0);
                }}
                className="mt-6 sm:mt-8 w-full py-3 bg-gold/20 border border-gold/40 rounded-lg 
                         text-gold hover:bg-gold/30 transition-colors
                         min-h-[44px] touch-manipulation"
                style={{ touchAction: 'manipulation' }}
              >
                Close (or press ESC)
              </button>

              <p className="text-center text-xs text-gray-500 mt-3 sm:mt-4">
                💡 Tip: Press 'H' anytime to see this again
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
