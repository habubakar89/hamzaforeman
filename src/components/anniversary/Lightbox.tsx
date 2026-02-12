import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Photo } from '../../data/photos';

interface LightboxProps {
  photos: Photo[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export function Lightbox({ photos, currentIndex, onClose, onNext, onPrev }: LightboxProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const currentPhoto = photos[currentIndex];
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < photos.length - 1;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (hasPrev) onPrev();
          break;
        case 'ArrowRight':
          if (hasNext) onNext();
          break;
      }
    };

    closeButtonRef.current?.focus();
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose, onNext, onPrev, hasPrev, hasNext]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[60] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
        onClick={handleBackdropClick}
        role="dialog"
        aria-modal="true"
        aria-label={`Viewing photo: ${currentPhoto?.alt}`}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/95" />

        {/* Close button */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-3 rounded-full
                   bg-white/10 hover:bg-white/20
                   text-white transition-all duration-200
                   focus:outline-none focus:ring-2 focus:ring-[#ff4da6]/50"
          aria-label="Close lightbox"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Navigation - Previous */}
        <button
          onClick={onPrev}
          disabled={!hasPrev}
          className={`absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20
                    p-3 rounded-full transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-[#ff4da6]/50
                    ${hasPrev
                      ? 'bg-white/10 hover:bg-white/20 text-white'
                      : 'bg-white/5 text-white/30 cursor-not-allowed'
                    }`}
          aria-label="Previous photo"
        >
          <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>

        {/* Navigation - Next */}
        <button
          onClick={onNext}
          disabled={!hasNext}
          className={`absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20
                    p-3 rounded-full transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-[#ff4da6]/50
                    ${hasNext
                      ? 'bg-white/10 hover:bg-white/20 text-white'
                      : 'bg-white/5 text-white/30 cursor-not-allowed'
                    }`}
          aria-label="Next photo"
        >
          <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>

        {/* Image container */}
        <motion.div
          key={currentIndex}
          className="relative z-10 max-w-[90vw] max-h-[85vh] flex flex-col items-center"
          initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          {currentPhoto && (
            <>
              <img
                src={currentPhoto.src}
                alt={currentPhoto.alt}
                className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
              />

              {/* Caption */}
              {currentPhoto.caption && (
                <motion.p
                  className="mt-4 text-white/90 text-center text-sm sm:text-base font-light"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {currentPhoto.caption}
                </motion.p>
              )}
            </>
          )}
        </motion.div>

        {/* Photo counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/50 backdrop-blur-sm">
            <span className="text-white/90 text-sm">
              {currentIndex + 1} / {photos.length}
            </span>
          </div>
        </div>

        {/* Dot indicators */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
          {photos.map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300
                        ${i === currentIndex
                          ? 'bg-[#ff4da6] w-4'
                          : 'bg-white/30'
                        }`}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
