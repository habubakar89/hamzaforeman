import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X } from 'lucide-react';
import { ENABLE_NIGHT_SKY_REVEAL } from './Timeline';

// TODO: Set to false to disable the instruction box
export const SHOW_INSTRUCTION_BOX = true;

export function InstructionBox() {
  const [isOpen, setIsOpen] = useState(true);

  if (!SHOW_INSTRUCTION_BOX) {
    return null;
  }

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 left-6 z-40 w-12 h-12 rounded-full 
                 bg-white/10 backdrop-blur-lg border border-white/20
                 flex items-center justify-center text-gold
                 shadow-lg hover:bg-white/20 transition-colors
                 md:bottom-8 md:left-8"
        aria-label="Toggle instructions"
      >
        {isOpen ? <X size={20} /> : <HelpCircle size={20} />}
      </motion.button>

      {/* Instruction Box */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: -20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 20, x: -20 }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed bottom-24 left-6 z-30 w-80 max-w-[calc(100vw-3rem)]
                     bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl
                     shadow-2xl p-5 md:bottom-28 md:left-8"
          >
            <h3 className="font-heading text-lg text-gold mb-3 flex items-center gap-2">
              <HelpCircle size={18} />
              How to use ✨
            </h3>
            
            {/* TODO: replace with real instructions */}
            <div className="font-body text-gray-300 text-sm leading-relaxed space-y-2">
              <p>
                • Scroll through the timeline to explore our journey
              </p>
              <p>
                • Each note unlocks automatically as days pass
              </p>
              <p>
                • Use the music toggle (bottom-right) for daily surprises
              </p>
              <p>
                • Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-xs">H</kbd> for a hidden feature 👀
              </p>
              <p>
                • The love meter tracks our progress to the special day
              </p>
              {ENABLE_NIGHT_SKY_REVEAL && (
                <p className="mt-3 pt-3 border-t border-white/10 text-gold/80">
                  Psst… try clicking today's note 🌙
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
