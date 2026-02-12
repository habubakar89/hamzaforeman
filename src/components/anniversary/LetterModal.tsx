import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Letter, LETTERS } from '../../data/letters';
import { SealedEnvelope } from './SealedEnvelope';

interface LetterModalProps {
  letter: Letter | null;
  letterIndex: number;
  isNewLetter: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onLetterOpened: () => void;
  heartbeatEnabled?: boolean;
}

export function LetterModal({
  letter,
  letterIndex,
  isNewLetter,
  onClose,
  onNext,
  onPrevious,
  onLetterOpened,
  heartbeatEnabled = true,
}: LetterModalProps) {
  const [showEnvelope, setShowEnvelope] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const processedLetterRef = useRef<number | null>(null);
  const onLetterOpenedRef = useRef(onLetterOpened);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const hasPrevious = letterIndex > 0;
  const hasNext = letterIndex < LETTERS.length - 1;
  const shouldHeartbeat = heartbeatEnabled && !prefersReducedMotion;

  // Keep ref updated
  onLetterOpenedRef.current = onLetterOpened;

  // Handle envelope opening complete
  const handleEnvelopeOpen = () => {
    setShowEnvelope(false);
    setShowContent(true);
    onLetterOpenedRef.current();
  };

  // Reset state when letter changes
  useEffect(() => {
    if (letter) {
      // Only process if this is a different letter than we already processed
      if (processedLetterRef.current !== letter.id) {
        if (isNewLetter && !prefersReducedMotion) {
          setShowEnvelope(true);
          setShowContent(false);
        } else {
          setShowEnvelope(false);
          setShowContent(true);
          if (isNewLetter) {
            onLetterOpenedRef.current();
          }
        }
        processedLetterRef.current = letter.id;
      }
    } else {
      setShowEnvelope(false);
      setShowContent(false);
      processedLetterRef.current = null;
    }
  }, [letter, isNewLetter, prefersReducedMotion]);

  // Focus trap and keyboard handling
  useEffect(() => {
    if (!letter) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && hasPrevious) {
        onPrevious();
      } else if (e.key === 'ArrowRight' && hasNext) {
        onNext();
      }
    };

    // Focus the close button when modal opens
    closeButtonRef.current?.focus();

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [letter, onClose, onNext, onPrevious, hasPrevious, hasNext]);

  // Click outside to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle navigation - reset processed ref to allow re-processing
  const handleNext = () => {
    processedLetterRef.current = null;
    onNext();
  };

  const handlePrevious = () => {
    processedLetterRef.current = null;
    onPrevious();
  };

  return (
    <AnimatePresence>
      {letter && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="letter-title"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-hidden="true"
          />

          {/* Modal container with heartbeat glow */}
          <motion.div
            ref={modalRef}
            className="relative z-10 w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl"
            style={{
              background: 'linear-gradient(180deg, rgba(15,19,32,0.98) 0%, rgba(11,15,31,0.98) 100%)',
              border: '1px solid rgba(255,77,166,0.2)',
            }}
            initial={{ scale: 0.9, y: 20 }}
            animate={{
              scale: 1,
              y: 0,
              boxShadow: shouldHeartbeat ? [
                '0 25px 50px -12px rgba(0,0,0,0.5), 0 0 40px rgba(255,77,166,0.1)',
                '0 25px 50px -12px rgba(0,0,0,0.5), 0 0 60px rgba(255,77,166,0.2)',
                '0 25px 50px -12px rgba(0,0,0,0.5), 0 0 40px rgba(255,77,166,0.1)',
                '0 25px 50px -12px rgba(0,0,0,0.5), 0 0 50px rgba(255,77,166,0.15)',
                '0 25px 50px -12px rgba(0,0,0,0.5), 0 0 40px rgba(255,77,166,0.1)',
              ] : '0 25px 50px -12px rgba(0,0,0,0.5), 0 0 60px rgba(255,77,166,0.1)',
            }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={shouldHeartbeat ? {
              scale: { duration: 0.3, type: "spring", damping: 25 },
              y: { duration: 0.3, type: "spring", damping: 25 },
              boxShadow: {
                duration: 2,
                times: [0, 0.15, 0.3, 0.45, 1],
                repeat: Infinity,
                ease: "easeInOut",
              },
            } : { duration: prefersReducedMotion ? 0 : 0.3, type: "spring", damping: 25 }}
          >
            {/* Close button */}
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-full
                       bg-white/5 hover:bg-white/10 border border-white/10
                       text-[#b9b9c2] hover:text-white
                       transition-all duration-200
                       focus:outline-none focus:ring-2 focus:ring-[#ff4da6]/50"
              aria-label="Close letter"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Envelope animation */}
            <AnimatePresence mode="wait">
              {showEnvelope && (
                <motion.div
                  key="envelope"
                  className="flex items-center justify-center min-h-[400px]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <SealedEnvelope
                    isOpening={true}
                    onOpenComplete={handleEnvelopeOpen}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Letter content */}
            <AnimatePresence mode="wait">
              {showContent && (
                <motion.div
                  key="content"
                  className="overflow-y-auto max-h-[85vh] scrollbar-thin"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.4 }}
                >
                  {/* Letter number indicator */}
                  <div className="px-6 sm:px-8 pt-6 pb-2">
                    <p className="text-[#ff77c8] text-sm font-medium tracking-wider uppercase">
                      Letter {letterIndex + 1} of {LETTERS.length}
                    </p>
                  </div>

                  {/* Title */}
                  <motion.h2
                    id="letter-title"
                    className="px-6 sm:px-8 pb-6 font-playfair text-2xl sm:text-3xl md:text-4xl text-[#f5f5f7]"
                    animate={shouldHeartbeat ? {
                      textShadow: [
                        '0 0 20px rgba(255,77,166,0.15)',
                        '0 0 30px rgba(255,77,166,0.25)',
                        '0 0 20px rgba(255,77,166,0.15)',
                      ],
                    } : {
                      textShadow: '0 0 30px rgba(255,77,166,0.2)',
                    }}
                    transition={shouldHeartbeat ? {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    } : {}}
                  >
                    {letter.title}
                  </motion.h2>

                  {/* Body paragraphs */}
                  <div className="px-6 sm:px-8 pb-8 space-y-5">
                    {letter.body.map((paragraph, index) => (
                      <motion.p
                        key={index}
                        className="text-[#e0e0e5] text-base sm:text-lg leading-relaxed"
                        style={{ lineHeight: '1.75' }}
                        initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: prefersReducedMotion ? 0 : index * 0.1 + 0.2 }}
                      >
                        {paragraph}
                      </motion.p>
                    ))}
                  </div>

                  {/* Navigation footer */}
                  <div className="sticky bottom-0 px-6 sm:px-8 py-4 border-t border-white/10 bg-[#0b0f1f]/95 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={handlePrevious}
                        disabled={!hasPrevious}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg
                                  transition-all duration-200 text-sm font-medium
                                  focus:outline-none focus:ring-2 focus:ring-[#ff4da6]/50
                                  ${hasPrevious
                                    ? 'text-[#f5f5f7] hover:bg-white/10'
                                    : 'text-[#4a4a55] cursor-not-allowed'
                                  }`}
                        aria-label="Previous letter"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </button>

                      {/* Star indicator */}
                      <div className="flex items-center gap-1.5" aria-hidden="true">
                        {LETTERS.map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full transition-all duration-300
                                      ${i === letterIndex
                                        ? 'bg-[#ff4da6] scale-125'
                                        : 'bg-white/20'
                                      }`}
                          />
                        ))}
                      </div>

                      <button
                        onClick={handleNext}
                        disabled={!hasNext}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg
                                  transition-all duration-200 text-sm font-medium
                                  focus:outline-none focus:ring-2 focus:ring-[#ff4da6]/50
                                  ${hasNext
                                    ? 'text-[#f5f5f7] hover:bg-white/10'
                                    : 'text-[#4a4a55] cursor-not-allowed'
                                  }`}
                        aria-label="Next letter"
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
