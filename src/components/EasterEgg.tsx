import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Habit {
  text: string;
  image?: string;
}

// TODO: replace the 3 placeholder habits with personal ones
const HABITS: Habit[] = [
  {
    text: 'How you always do that hmmm every time you are sleepy',
    // Optional: Add an image URL
    // image: '/images/habit1.jpg'
  },
  {
    text: 'When I bombard you with the world of information and you say okkkk, just melts my heart sm!',
    // image: '/images/habit2.jpg'
  },
  {
    text: 'How you send me cute snaps, making cute faces that makes me melt away every single time!',
    // image: '/images/habit3.jpg'
  },
];

export function EasterEgg() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

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
  }, []);

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
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
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
            className="max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-midnight-800/90 backdrop-blur-lg rounded-2xl p-8 md:p-12 border-2 border-gold/40 shadow-2xl">
              <div className="text-center mb-6">
                <h3 className="text-3xl font-playfair text-gold mb-2">
                  your cutesy lil habits i can't stop loving
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
                      className="w-full max-h-64 object-cover rounded-lg mb-6 shadow-lg"
                    />
                  )}
                  <p className="text-xl md:text-2xl text-gray-200 font-poppins leading-relaxed">
                    {HABITS[currentIndex].text}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-center gap-2 mt-8">
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
                className="mt-8 w-full py-3 bg-gold/20 border border-gold/40 rounded-lg 
                         text-gold hover:bg-gold/30 transition-colors"
              >
                Close (or press ESC)
              </button>

              <p className="text-center text-xs text-gray-500 mt-4">
                💡 Tip: Press 'H' anytime to see this again
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
