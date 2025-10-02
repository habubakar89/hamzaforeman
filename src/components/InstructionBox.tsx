import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X } from 'lucide-react';
import { ENABLE_NIGHT_SKY_REVEAL } from './Timeline';

// TODO: Set to false to disable the instruction box
export const SHOW_INSTRUCTION_BOX = true;

export function InstructionBox() {
  // Default collapsed state
  const [isOpen, setIsOpen] = useState(false);

  if (!SHOW_INSTRUCTION_BOX) {
    return null;
  }

  return (
    <>
      {/* Instruction Panel - BL corner, slides up-right */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="fixed left-4 bottom-[calc(env(safe-area-inset-bottom)+74px)] z-30
                     max-w-[85vw] sm:max-w-sm origin-bottom-left"
            style={{ transformOrigin: 'bottom left' }}
          >
            <div className="bg-midnight-800/95 backdrop-blur-lg border border-gold/20
                          rounded-2xl p-5 shadow-2xl">
              <h3 className="font-heading text-lg text-gold mb-3 flex items-center gap-2">
                <HelpCircle size={18} />
                How to use ✨
              </h3>
              
              <div className="font-body text-gray-300 text-sm leading-relaxed space-y-2 max-h-[50vh] overflow-y-auto">
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
                  • Toggle the hidden surprise: press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-xs">H</kbd> or tap the heart in the top-left 💖
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button - BL corner */}
      <motion.button
        onPointerUp={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-[calc(env(safe-area-inset-bottom)+16px)] left-4 z-30
                 px-4 py-2.5 rounded-full
                 bg-midnight-800/90 backdrop-blur-lg border border-gold/30
                 flex items-center gap-2 text-gold text-sm font-medium
                 shadow-lg hover:bg-midnight-800 transition-colors
                 min-h-[44px]
                 touch-manipulation"
        style={{ touchAction: 'manipulation' }}
        aria-label="Toggle instructions"
        aria-pressed={isOpen}
        aria-controls="instruction-panel"
      >
        {isOpen ? <X size={18} /> : <HelpCircle size={18} />}
        <span>How to use</span>
      </motion.button>
    </>
  );
}
