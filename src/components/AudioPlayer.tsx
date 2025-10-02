import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Volume2, VolumeX } from 'lucide-react';
import { format } from 'date-fns';
import { MUSIC_NOTES_BY_DAY, DEFAULT_MUSIC_NOTE } from '../data/notes';

// TODO: drop your MP3 at /public/audio/bg-music.mp3
// TODO: to use different tracks per day, add files under /public/audio and map by date here
const AUDIO_SOURCE = '/audio/bg-music.mp3';

interface AudioPlayerProps {
  shouldAutoPlay?: boolean;
}

export function AudioPlayer({ shouldAutoPlay = false }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [audioMissing, setAudioMissing] = useState(false);
  const [showRibbon, setShowRibbon] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Get today's music note message
  const today = format(new Date(), 'yyyy-MM-dd');
  const musicNote = MUSIC_NOTES_BY_DAY[today] || DEFAULT_MUSIC_NOTE;

  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (audioRef.current) {
      // TODO: change default volume here (0.0–1.0) if desired
      audioRef.current.volume = 0.3;
    }
  }, []);

  useEffect(() => {
    // Check if audio file exists
    const checkAudio = async () => {
      try {
        const response = await fetch(AUDIO_SOURCE, { method: 'HEAD' });
        if (!response.ok) {
          setAudioMissing(true);
          console.warn('⚠️ Audio file missing: Please add your MP3 to /public/audio/bg-music.mp3 and reload.');
        }
      } catch {
        setAudioMissing(true);
        console.warn('⚠️ Audio file missing: Please add your MP3 to /public/audio/bg-music.mp3 and reload.');
      }
    };
    checkAudio();
  }, []);

  useEffect(() => {
    // Auto-play audio after password unlock, but respect reduced motion preference
    if (shouldAutoPlay && !audioMissing && !prefersReducedMotion && audioRef.current) {
      // Small delay to ensure smooth transition after unlock animation
      const timer = setTimeout(() => {
        audioRef.current?.play().then(() => {
          setIsPlaying(true);
        }).catch((err) => {
          console.log('Audio auto-play failed:', err);
          // Auto-play may be blocked by browser, user can manually start
        });
      }, 1500); // 1.5s delay matches the unlock animation duration
      
      return () => clearTimeout(timer);
    }
  }, [shouldAutoPlay, audioMissing, prefersReducedMotion]);

  const togglePlay = () => {
    if (audioMissing) {
      console.warn('⚠️ Please add your MP3 to /public/audio/bg-music.mp3 and reload.');
      return;
    }
    
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((err) => {
          console.log('Audio playback failed:', err);
          setAudioMissing(true);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleRibbon = () => {
    setShowRibbon(!showRibbon);
  };

  return (
    <>
      <audio ref={audioRef} loop>
        <source src={AUDIO_SOURCE} type="audio/mpeg" />
      </audio>

      {/* Lyric Ribbon Panel - opens upward from BR corner */}
      <AnimatePresence>
        {showRibbon && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.18 }}
            className="fixed bottom-[calc(env(safe-area-inset-bottom)+74px)] right-4 z-30
                     max-w-[85vw] sm:max-w-sm origin-bottom-right"
            style={{ transformOrigin: 'bottom right' }}
            onClick={toggleRibbon}
            role="button"
            aria-label="Daily music note"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleRibbon();
              }
            }}
          >
            <div className="bg-midnight-800/90 backdrop-blur-lg border border-gold/30 rounded-2xl 
                          px-4 py-3 shadow-lg cursor-pointer hover:border-gold/50 transition-colors"
                 id="music-ribbon-panel">
              <p className="text-sm text-gray-300 leading-relaxed break-words">
                {musicNote}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Music Button - BR corner, fixed position */}
      <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+16px)] right-4 z-30">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onPointerUp={togglePlay}
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
          className="bg-midnight-800/80 backdrop-blur-sm rounded-full 
                   p-3 border border-gold/20 
                   hover:border-gold/40 transition-colors 
                   shadow-lg
                   min-w-[48px] min-h-[48px] flex items-center justify-center
                   touch-manipulation"
          style={{ touchAction: 'manipulation' }}
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
          aria-pressed={isPlaying}
          aria-controls="music-ribbon-panel"
        >
          <motion.div
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ duration: 3, repeat: isPlaying ? Infinity : 0, ease: 'linear' }}
          >
            <Music className="w-6 h-6 text-gold" />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-full right-0 mb-2 bg-midnight-800/90 backdrop-blur-sm 
                       rounded-lg px-3 py-2 border border-gold/20 text-xs text-gray-300 whitespace-nowrap z-40"
            >
              {audioMissing ? (
                <span className="flex items-center gap-1 text-yellow-400">
                  ⚠️ add bg-music.mp3
                </span>
              ) : isPlaying ? (
                <span className="flex items-center gap-1">
                  <Volume2 className="w-3 h-3" />
                  playing
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <VolumeX className="w-3 h-3" />
                  click to play
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
