import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState, useCallback } from 'react';
import { X, Lock } from 'lucide-react';
import { PHOTOS } from '../../data/photos';
import { Lightbox } from './Lightbox';

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedCount: number;
}

export function GalleryModal({ isOpen, onClose, unlockedCount }: GalleryModalProps) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Focus trap and keyboard handling
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedPhotoIndex !== null) {
          setSelectedPhotoIndex(null);
        } else {
          onClose();
        }
      }
    };

    closeButtonRef.current?.focus();
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, selectedPhotoIndex]);

  const handlePhotoClick = useCallback((index: number) => {
    if (index < unlockedCount && !imageErrors.has(index)) {
      setSelectedPhotoIndex(index);
    }
  }, [unlockedCount, imageErrors]);

  const handleLightboxClose = useCallback(() => {
    setSelectedPhotoIndex(null);
  }, []);

  const handleLightboxNext = useCallback(() => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex < unlockedCount - 1) {
      setSelectedPhotoIndex(selectedPhotoIndex + 1);
    }
  }, [selectedPhotoIndex, unlockedCount]);

  const handleLightboxPrev = useCallback(() => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex > 0) {
      setSelectedPhotoIndex(selectedPhotoIndex - 1);
    }
  }, [selectedPhotoIndex]);

  const handleImageError = useCallback((index: number) => {
    setImageErrors(prev => new Set(prev).add(index));
  }, []);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-label="Photo memories gallery"
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal container */}
            <motion.div
              className="relative z-10 w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl"
              style={{
                background: 'linear-gradient(180deg, rgba(15,19,32,0.98) 0%, rgba(11,15,31,0.98) 100%)',
                border: '1px solid rgba(255,77,166,0.2)',
              }}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <div>
                  <h2 className="font-playfair text-xl sm:text-2xl text-[#f5f5f7]">
                    Memories ✨
                  </h2>
                  <p className="text-[#b9b9c2] text-sm mt-1">
                    {unlockedCount} of {PHOTOS.length} unlocked
                  </p>
                </div>
                <button
                  ref={closeButtonRef}
                  onClick={onClose}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10
                           border border-white/10 text-[#b9b9c2] hover:text-white
                           transition-all duration-200
                           focus:outline-none focus:ring-2 focus:ring-[#ff4da6]/50"
                  aria-label="Close gallery"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Desktop Grid / Mobile Carousel */}
              <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                {/* Desktop: 2x5 Grid */}
                <div className="hidden sm:grid grid-cols-5 gap-3">
                  {PHOTOS.map((photo, index) => (
                    <PhotoCard
                      key={photo.id}
                      photo={photo}
                      index={index}
                      isUnlocked={index < unlockedCount}
                      hasError={imageErrors.has(index)}
                      onClick={() => handlePhotoClick(index)}
                      onError={() => handleImageError(index)}
                      prefersReducedMotion={prefersReducedMotion}
                    />
                  ))}
                </div>

                {/* Mobile: Horizontal Snap Carousel */}
                <div
                  ref={carouselRef}
                  className="sm:hidden flex gap-3 overflow-x-auto snap-x snap-mandatory pb-4
                           scrollbar-thin"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {PHOTOS.map((photo, index) => (
                    <div key={photo.id} className="flex-shrink-0 w-[70vw] snap-center">
                      <PhotoCard
                        photo={photo}
                        index={index}
                        isUnlocked={index < unlockedCount}
                        hasError={imageErrors.has(index)}
                        onClick={() => handlePhotoClick(index)}
                        onError={() => handleImageError(index)}
                        prefersReducedMotion={prefersReducedMotion}
                        isMobile
                      />
                    </div>
                  ))}
                </div>

                {/* Unlock hint */}
                {unlockedCount < PHOTOS.length && (
                  <p className="text-center text-[#b9b9c2] text-sm mt-4">
                    Open more letters to unlock memories 💕
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      {selectedPhotoIndex !== null && (
        <Lightbox
          photos={PHOTOS.slice(0, unlockedCount)}
          currentIndex={selectedPhotoIndex}
          onClose={handleLightboxClose}
          onNext={handleLightboxNext}
          onPrev={handleLightboxPrev}
        />
      )}
    </>
  );
}

// Photo Card Component
interface PhotoCardProps {
  photo: { id: number; src: string; alt: string; caption?: string };
  index: number;
  isUnlocked: boolean;
  hasError: boolean;
  onClick: () => void;
  onError: () => void;
  prefersReducedMotion: boolean;
  isMobile?: boolean;
}

function PhotoCard({
  photo,
  index,
  isUnlocked,
  hasError,
  onClick,
  onError,
  prefersReducedMotion,
  isMobile,
}: PhotoCardProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={!isUnlocked || hasError}
      className={`relative aspect-square rounded-xl overflow-hidden
                 border transition-all duration-300
                 focus:outline-none focus:ring-2 focus:ring-[#ff4da6]/50
                 ${isUnlocked && !hasError
                   ? 'border-[#ff4da6]/30 hover:border-[#ff4da6]/60 cursor-pointer'
                   : 'border-white/10 cursor-not-allowed'
                 }
                 ${isMobile ? 'w-full' : ''}`}
      whileHover={isUnlocked && !hasError && !prefersReducedMotion ? { scale: 1.03 } : {}}
      whileTap={isUnlocked && !hasError && !prefersReducedMotion ? { scale: 0.98 } : {}}
      aria-label={isUnlocked ? photo.alt : 'Locked memory'}
    >
      {/* Image or placeholder */}
      {hasError ? (
        <div className="absolute inset-0 bg-[#1a1f2e] flex items-center justify-center">
          <span className="text-[#4a4a55] text-xs">Image not found</span>
        </div>
      ) : (
        <img
          src={photo.src}
          alt={photo.alt}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-500
                    ${isUnlocked ? '' : 'blur-xl scale-110'}`}
          onError={onError}
          loading="lazy"
        />
      )}

      {/* Locked overlay */}
      {!isUnlocked && !hasError && (
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2">
          <motion.div
            animate={prefersReducedMotion ? {} : {
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Lock className="w-6 h-6 text-[#ff4da6]/60" />
          </motion.div>
          <span className="text-[#b9b9c2] text-xs">Locked</span>
        </div>
      )}

      {/* Caption overlay for unlocked */}
      {isUnlocked && !hasError && photo.caption && (
        <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
          <p className="text-white text-xs text-center truncate">{photo.caption}</p>
        </div>
      )}

      {/* Memory number badge */}
      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm">
        <span className="text-white/80 text-xs font-medium">{index + 1}</span>
      </div>
    </motion.button>
  );
}
