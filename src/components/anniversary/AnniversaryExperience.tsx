import { useState, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Heart } from 'lucide-react';
import { useAnniversaryState } from '../../hooks/useLocalStorage';
import { LETTERS } from '../../data/letters';
import { CoverScreen } from './CoverScreen';
import { ConstellationMap } from './ConstellationMap';
import { LetterModal } from './LetterModal';
import { FinalVowsScreen } from './FinalVowsScreen';
import { AudioPlayerPersistent } from './AudioPlayerPersistent';
import { GalleryModal } from './GalleryModal';
import { PhotoMontage } from './PhotoMontage';

type Screen = 'cover' | 'main' | 'vows' | 'montage';

// Generate background stars for main experience
function generateStars(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 1.5 + 0.5,
    delay: Math.random() * 4,
    duration: Math.random() * 3 + 2,
  }));
}

export function AnniversaryExperience() {
  const {
    state,
    openLetter,
    setAudioSettings,
    completeVows,
    setHeartbeatMode,
    setHasSeenMontage,
    resetState,
    allLettersOpened,
  } = useAnniversaryState();

  const [currentScreen, setCurrentScreen] = useState<Screen>('cover');
  const [selectedLetterIndex, setSelectedLetterIndex] = useState<number | null>(null);
  const [isNewLetter, setIsNewLetter] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const backgroundStars = useMemo(() => generateStars(40), []);

  // Use refs to store latest state for callbacks
  const stateRef = useRef(state);
  const selectedLetterIndexRef = useRef(selectedLetterIndex);
  stateRef.current = state;
  selectedLetterIndexRef.current = selectedLetterIndex;

  // Start the experience
  const handleBegin = useCallback(() => {
    setCurrentScreen('main');
  }, []);

  // Open a letter from constellation
  const handleStarClick = useCallback((index: number) => {
    const wasOpened = stateRef.current.openedLetters[index];
    setSelectedLetterIndex(index);
    setIsNewLetter(!wasOpened);
  }, []);

  // Close letter modal
  const handleCloseLetter = useCallback(() => {
    setSelectedLetterIndex(null);
    setIsNewLetter(false);
  }, []);

  // Navigate to next letter
  const handleNextLetter = useCallback(() => {
    const currentIndex = selectedLetterIndexRef.current;
    if (currentIndex !== null && currentIndex < LETTERS.length - 1) {
      const nextIndex = currentIndex + 1;
      const wasOpened = stateRef.current.openedLetters[nextIndex];
      setSelectedLetterIndex(nextIndex);
      setIsNewLetter(!wasOpened);
    }
  }, []);

  // Navigate to previous letter
  const handlePreviousLetter = useCallback(() => {
    const currentIndex = selectedLetterIndexRef.current;
    if (currentIndex !== null && currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      const wasOpened = stateRef.current.openedLetters[prevIndex];
      setSelectedLetterIndex(prevIndex);
      setIsNewLetter(!wasOpened);
    }
  }, []);

  // Mark letter as opened - stable callback
  const handleLetterOpened = useCallback(() => {
    const currentIndex = selectedLetterIndexRef.current;
    if (currentIndex !== null) {
      openLetter(currentIndex);
      setIsNewLetter(false);
    }
  }, [openLetter]);

  // Go to final vows
  const handleShowVows = useCallback(() => {
    setCurrentScreen('vows');
  }, []);

  // Complete vows and show montage
  const handleVowsComplete = useCallback(() => {
    completeVows();
    // Show montage if not seen yet
    if (!stateRef.current.hasSeenMontage) {
      setCurrentScreen('montage');
    }
  }, [completeVows]);

  // Montage complete
  const handleMontageComplete = useCallback(() => {
    setHasSeenMontage(true);
    setCurrentScreen('vows');
  }, [setHasSeenMontage]);

  // Skip montage
  const handleSkipMontage = useCallback(() => {
    setHasSeenMontage(true);
    setCurrentScreen('vows');
  }, [setHasSeenMontage]);

  // Replay from start
  const handleReplay = useCallback(() => {
    resetState();
    setCurrentScreen('cover');
    setSelectedLetterIndex(null);
    setIsNewLetter(false);
    setShowGallery(false);
  }, [resetState]);

  // Handle audio settings
  const handleAudioSettings = useCallback((muted: boolean, volume: number) => {
    setAudioSettings(muted, volume);
  }, [setAudioSettings]);

  // Toggle heartbeat mode
  const handleToggleHeartbeat = useCallback(() => {
    setHeartbeatMode(!stateRef.current.heartbeatMode);
  }, [setHeartbeatMode]);

  // Get selected letter
  const selectedLetter = selectedLetterIndex !== null ? LETTERS[selectedLetterIndex] : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#060712] via-[#0a0e1a] to-[#0b0f1f]">
      {/* Cover Screen */}
      <AnimatePresence mode="wait">
        {currentScreen === 'cover' && (
          <motion.div
            key="cover"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
          >
            <CoverScreen onBegin={handleBegin} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Experience */}
      <AnimatePresence>
        {currentScreen === 'main' && (
          <motion.div
            key="main"
            className="min-h-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
          >
            {/* Background stars */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
              {backgroundStars.map((star) => (
                <motion.div
                  key={star.id}
                  className="absolute rounded-full bg-white/50"
                  style={{
                    left: `${star.x}%`,
                    top: `${star.y}%`,
                    width: star.size,
                    height: star.size,
                  }}
                  animate={prefersReducedMotion ? {} : {
                    opacity: [0.2, 0.5, 0.2],
                  }}
                  transition={{
                    duration: star.duration,
                    delay: star.delay,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>

            {/* Subtle gradient overlay */}
            <div
              className="fixed inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at 50% 30%, rgba(255,77,166,0.06) 0%, transparent 50%)',
              }}
              aria-hidden="true"
            />

            {/* Main content */}
            <div className="relative z-10 min-h-screen flex flex-col">
              {/* Header */}
              <header className="flex-shrink-0 pt-4 sm:pt-6 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                  {/* Title */}
                  <motion.h1
                    className="font-playfair text-xl sm:text-2xl md:text-3xl text-[#f5f5f7]"
                    style={{ textShadow: '0 0 30px rgba(255,77,166,0.2)' }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: prefersReducedMotion ? 0 : 0.3 }}
                  >
                    For Us, Eman ✨
                  </motion.h1>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    {/* Heartbeat toggle */}
                    <motion.button
                      onClick={handleToggleHeartbeat}
                      className={`p-2 sm:p-2.5 rounded-full border transition-all duration-300
                               focus:outline-none focus:ring-2 focus:ring-[#ff4da6]/50
                               ${state.heartbeatMode
                                 ? 'bg-[#ff4da6]/20 border-[#ff4da6]/50 text-[#ff4da6]'
                                 : 'bg-white/5 border-white/20 text-white/60 hover:text-white'
                               }`}
                      whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                      whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                      aria-label={state.heartbeatMode ? 'Disable heartbeat mode' : 'Enable heartbeat mode'}
                      aria-pressed={state.heartbeatMode}
                      title="Heartbeat mode"
                    >
                      <Heart className="w-4 h-4 sm:w-5 sm:h-5" fill={state.heartbeatMode ? 'currentColor' : 'none'} />
                    </motion.button>

                    {/* Memories button */}
                    <motion.button
                      onClick={() => setShowGallery(true)}
                      className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full
                               bg-white/5 hover:bg-white/10 border border-white/20 hover:border-[#ff4da6]/40
                               text-white/80 hover:text-white text-sm
                               transition-all duration-300
                               focus:outline-none focus:ring-2 focus:ring-[#ff4da6]/50"
                      whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                      whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: prefersReducedMotion ? 0 : 0.5 }}
                    >
                      <Image className="w-4 h-4" />
                      <span className="hidden sm:inline">Memories</span>
                      <span className="sm:hidden">✨</span>
                    </motion.button>
                  </div>
                </div>

                {/* Subtitle */}
                <motion.p
                  className="mt-2 text-[#b9b9c2] text-sm text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: prefersReducedMotion ? 0 : 0.5 }}
                >
                  Tap a star to open its letter
                </motion.p>
              </header>

              {/* Constellation area */}
              <main className="flex-1 flex items-center justify-center px-6 py-8">
                <motion.div
                  className="w-full max-w-xl aspect-square"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: prefersReducedMotion ? 0 : 0.4, duration: 0.5 }}
                >
                  <ConstellationMap
                    openedLetters={state.openedLetters}
                    onStarClick={handleStarClick}
                    activeIndex={selectedLetterIndex}
                    allCompleted={allLettersOpened}
                    heartbeatEnabled={state.heartbeatMode}
                  />
                </motion.div>
              </main>

              {/* Footer / Progress */}
              <footer className="flex-shrink-0 pb-24 sm:pb-8 px-6">
                <div className="max-w-md mx-auto text-center">
                  {/* Progress indicator */}
                  <div className="flex items-center justify-center gap-1 mb-4">
                    {state.openedLetters.map((opened, i) => (
                      <motion.div
                        key={i}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-500
                                  ${opened
                                    ? 'bg-[#ff4da6]'
                                    : 'bg-white/20'
                                  }`}
                        animate={opened && state.heartbeatMode && !prefersReducedMotion ? {
                          boxShadow: [
                            '0 0 5px rgba(255,77,166,0.3)',
                            '0 0 10px rgba(255,77,166,0.5)',
                            '0 0 5px rgba(255,77,166,0.3)',
                          ],
                        } : {}}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    ))}
                  </div>

                  <p className="text-[#b9b9c2] text-sm">
                    {state.openedLetters.filter(Boolean).length} of {LETTERS.length} letters opened
                  </p>

                  {/* Unlock Final Vows button */}
                  <AnimatePresence>
                    {allLettersOpened && (
                      <motion.button
                        onClick={handleShowVows}
                        className="mt-6 px-6 py-3 rounded-full text-sm font-medium
                                 bg-gradient-to-r from-[#ff4da6]/30 to-[#ff77c8]/30
                                 border border-[#ff4da6]/50 text-[#f5f5f7]
                                 hover:from-[#ff4da6]/40 hover:to-[#ff77c8]/40
                                 hover:border-[#ff4da6]/70
                                 focus:outline-none focus:ring-2 focus:ring-[#ff4da6]/50
                                 transition-all duration-300"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                        whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                      >
                        Unlock Final Vows 💫
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </footer>
            </div>

            {/* Letter Modal */}
            <LetterModal
              letter={selectedLetter}
              letterIndex={selectedLetterIndex ?? 0}
              isNewLetter={isNewLetter}
              onClose={handleCloseLetter}
              onNext={handleNextLetter}
              onPrevious={handlePreviousLetter}
              onLetterOpened={handleLetterOpened}
              heartbeatEnabled={state.heartbeatMode}
            />

            {/* Gallery Modal */}
            <GalleryModal
              isOpen={showGallery}
              onClose={() => setShowGallery(false)}
              unlockedCount={state.unlockedPhotoCount}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Final Vows Screen */}
      <AnimatePresence>
        {currentScreen === 'vows' && (
          <motion.div
            key="vows"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
          >
            <FinalVowsScreen
              onReplay={handleReplay}
              onComplete={handleVowsComplete}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Photo Montage */}
      <AnimatePresence>
        {currentScreen === 'montage' && (
          <PhotoMontage
            isPlaying={true}
            onComplete={handleMontageComplete}
            onSkip={handleSkipMontage}
          />
        )}
      </AnimatePresence>

      {/* Persistent Audio Player (visible on all screens except cover) */}
      {currentScreen !== 'cover' && (
        <AudioPlayerPersistent
          muted={state.audioMuted}
          volume={state.audioVolume}
          onSettingsChange={handleAudioSettings}
        />
      )}
    </div>
  );
}
