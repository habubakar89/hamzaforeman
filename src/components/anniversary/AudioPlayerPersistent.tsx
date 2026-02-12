import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

// Audio file location: /public/audio/music.mp3
// To change the song, replace this file or update the path below
const AUDIO_SOURCE = '/audio/music.mp3';

interface AudioPlayerPersistentProps {
  muted: boolean;
  volume: number;
  onSettingsChange: (muted: boolean, volume: number) => void;
}

export function AudioPlayerPersistent({
  muted,
  volume,
  onSettingsChange,
}: AudioPlayerPersistentProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [needsUserGesture, setNeedsUserGesture] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Initialize audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = muted ? 0 : volume;
    audio.loop = true;

    const handleCanPlay = () => {
      setAudioReady(true);
    };

    const handleError = () => {
      console.warn('Audio file not found. Please add your audio file to /public/audio/our-song.mp3');
    };

    audio.addEventListener('canplaythrough', handleCanPlay);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlay);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  // Update volume when settings change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume;
    }
  }, [muted, volume]);

  // Attempt autoplay
  useEffect(() => {
    if (!audioReady || !audioRef.current) return;

    // Try to autoplay (will likely be blocked by browser)
    const tryAutoplay = async () => {
      try {
        await audioRef.current?.play();
        setIsPlaying(true);
      } catch {
        // Autoplay blocked - show prompt
        setNeedsUserGesture(true);
      }
    };

    // Small delay to ensure everything is ready
    const timer = setTimeout(tryAutoplay, 500);
    return () => clearTimeout(timer);
  }, [audioReady]);

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
        setNeedsUserGesture(false);
      }
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    onSettingsChange(!muted, volume);
  }, [muted, volume, onSettingsChange]);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    onSettingsChange(false, newVolume);
  }, [onSettingsChange]);

  return (
    <>
      {/* Audio element */}
      <audio ref={audioRef} preload="auto">
        <source src={AUDIO_SOURCE} type="audio/mpeg" />
      </audio>

      {/* Player UI */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40">
        {/* Autoplay prompt */}
        <AnimatePresence>
          {needsUserGesture && !isPlaying && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="absolute bottom-full right-0 mb-3 whitespace-nowrap"
            >
              <button
                onClick={togglePlay}
                className="px-4 py-2 rounded-full text-sm
                         bg-[#0b0f1f]/95 backdrop-blur-sm
                         border border-[#ff4da6]/40 text-[#ff77c8]
                         hover:bg-[#ff4da6]/10 hover:border-[#ff4da6]/60
                         transition-all duration-200
                         shadow-lg shadow-black/30"
              >
                Tap to play our song ♫
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls panel */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-full right-0 mb-3 p-4 rounded-xl
                       bg-[#0b0f1f]/95 backdrop-blur-md
                       border border-white/10 shadow-xl shadow-black/40"
              style={{ minWidth: '200px' }}
            >
              {/* Track label */}
              <p className="text-[#b9b9c2] text-xs mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ff4da6] animate-pulse" />
                Our song ♫
              </p>

              {/* Volume slider */}
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleMute}
                  className="p-1.5 rounded-lg text-[#b9b9c2] hover:text-[#f5f5f7]
                           hover:bg-white/5 transition-colors
                           focus:outline-none focus:ring-2 focus:ring-[#ff4da6]/50"
                  aria-label={muted ? "Unmute" : "Mute"}
                >
                  {muted ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={muted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="flex-1 h-1 rounded-full appearance-none cursor-pointer
                           bg-white/20 accent-[#ff4da6]
                           [&::-webkit-slider-thumb]:appearance-none
                           [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
                           [&::-webkit-slider-thumb]:rounded-full
                           [&::-webkit-slider-thumb]:bg-[#ff4da6]
                           [&::-webkit-slider-thumb]:shadow-lg
                           [&::-webkit-slider-thumb]:cursor-pointer"
                  aria-label="Volume"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main button */}
        <motion.button
          onClick={togglePlay}
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
          onFocus={() => setShowControls(true)}
          onBlur={() => setShowControls(false)}
          className="relative p-3.5 rounded-full
                   bg-[#0b0f1f]/90 backdrop-blur-sm
                   border border-[#ff4da6]/30 hover:border-[#ff4da6]/50
                   text-[#ff77c8] hover:text-[#ff4da6]
                   shadow-lg shadow-black/30
                   transition-all duration-300
                   focus:outline-none focus:ring-2 focus:ring-[#ff4da6]/50 focus:ring-offset-2 focus:ring-offset-transparent
                   min-w-[48px] min-h-[48px] flex items-center justify-center"
          whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
          whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
          aria-label={isPlaying ? "Pause music" : "Play music"}
          aria-pressed={isPlaying}
        >
          {/* Animated ring when playing */}
          {isPlaying && !prefersReducedMotion && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-[#ff4da6]/40"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.6, 0, 0.6],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              aria-hidden="true"
            />
          )}

          {/* Icon */}
          <motion.div
            animate={isPlaying && !prefersReducedMotion ? { rotate: 360 } : {}}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </motion.div>
        </motion.button>
      </div>
    </>
  );
}
