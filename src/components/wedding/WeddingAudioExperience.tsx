import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  WEDDING_AUDIO_SRC,
  getActiveWeddingCaption,
} from '../../data/weddingAudioCaptions';

// ─── Palette ──────────────────────────────────────────────────────────────────
const C = {
  ivory:     '#FAF3E8',
  emerald:   '#123D32',
  gold:      '#C7A45A',
  champagne: '#E8D7AA',
} as const;

const POPPINS = 'var(--font-family-poppins)';

// ─── Icons ────────────────────────────────────────────────────────────────────
function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M3.5 2.2 L11.5 7 L3.5 11.8 Z" fill={C.emerald} />
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="2.5" y="2"   width="3.5" height="10" rx="1.2" fill={C.emerald} />
      <rect x="8"   y="2"   width="3.5" height="10" rx="1.2" fill={C.emerald} />
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function WeddingAudioExperience() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying,   setIsPlaying]   = useState(false);
  const [hasStarted,  setHasStarted]  = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioError,  setAudioError]  = useState(false);

  const reduced       = useReducedMotion() ?? false;
  const activeCaption = getActiveWeddingCaption(currentTime);
  const captionText   = activeCaption?.english ?? '';

  // ── Audio setup + autoplay ────────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime  = () => setCurrentTime(audio.currentTime);
    const onEnded = () => setIsPlaying(false);
    const onError = () => {
      console.warn('[WeddingAudio] Could not load:', WEDDING_AUDIO_SRC);
      setAudioError(true);
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('ended',      onEnded);
    audio.addEventListener('error',      onError);

    audio.volume = 0.55;
    audio.play()
      .then(() => {
        setHasStarted(true);
        setIsPlaying(true);
      })
      .catch(() => {
        // Autoplay blocked (iOS Safari etc.) — show mini button in paused
        // state and start on the very first touch anywhere on the page.
        setHasStarted(true);
        setIsPlaying(false);

        const startOnGesture = () => {
          audio.play()
            .then(() => setIsPlaying(true))
            .catch(() => {});
        };
        document.addEventListener('touchstart', startOnGesture, { once: true, passive: true });
        document.addEventListener('mousedown',  startOnGesture, { once: true });
      });

    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('ended',      onEnded);
      audio.removeEventListener('error',      onError);
    };
  }, []);

  // ── Play / Pause toggle ───────────────────────────────────────────────────
  const handleToggle = () => {
    const audio = audioRef.current;
    if (!audio || audioError) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  return (
    <>
      {/* Hidden audio element */}
      <audio ref={audioRef} src={WEDDING_AUDIO_SRC} preload="auto" />

      {/* ── Caption ribbon overlay ── */}
      {/*
        Two-layer animation:
          Outer  — fixed key "caption-ribbon", fades in/out when play state changes.
          Inner  — keyed by captionText, slides each new line in from below and out upward.
      */}
      <AnimatePresence>
        {hasStarted && !audioError && isPlaying && (
          <motion.div
            key="caption-ribbon"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            style={{
              position:      'fixed',
              bottom:        'calc(84px + env(safe-area-inset-bottom))',
              left:          '50%',
              transform:     'translateX(-50%)',
              zIndex:         188,
              pointerEvents: 'none',
              textAlign:     'center',
              /* keeps it from bumping into the mini button on narrow screens */
              maxWidth:      'calc(100vw - 96px)',
              width:          'max-content',
            }}
          >
            <AnimatePresence mode="wait">
              {captionText && (
                <motion.div
                  key={captionText}
                  initial={reduced ? { opacity: 0 }        : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced   ? { opacity: 0 }         : { opacity: 0, y: -6 }}
                  transition={{
                    duration: reduced ? 0.15 : 0.38,
                    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
                  }}
                >
                  {/* ── Ribbon card ── */}
                  <div style={{
                    padding:             '7px 16px 10px',
                    background:          'rgba(255,249,240,0.90)',
                    border:              '1px solid rgba(199,164,90,0.42)',
                    borderRadius:         12,
                    boxShadow:           '0 4px 20px rgba(18,61,50,0.08), 0 1px 4px rgba(18,61,50,0.04)',
                    backdropFilter:       'blur(14px)',
                    WebkitBackdropFilter: 'blur(14px)',
                    maxWidth:             320,
                  }}>

                    {/* Decorative gold rule + dot */}
                    <div aria-hidden="true" style={{ textAlign: 'center', marginBottom: 5 }}>
                      <svg width="80" height="8" viewBox="0 0 80 8" fill="none">
                        <line x1="0"  y1="4" x2="34" y2="4" stroke={C.gold} strokeWidth="0.75" strokeLinecap="round" />
                        <circle cx="40" cy="4" r="1.8" fill={C.gold} opacity="0.65" />
                        <line x1="46" y1="4" x2="80" y2="4" stroke={C.gold} strokeWidth="0.75" strokeLinecap="round" />
                      </svg>
                    </div>

                    {/* Caption text */}
                    <p style={{
                      margin:        0,
                      fontFamily:    POPPINS,
                      fontSize:      13,
                      fontStyle:     'italic',
                      fontWeight:    400,
                      lineHeight:    1.55,
                      letterSpacing: '0.01em',
                      color:         C.emerald,
                      whiteSpace:    'normal',
                      wordBreak:     'break-word',
                    }}>
                      {captionText}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mini play / pause button ── */}
      <AnimatePresence>
        {hasStarted && !audioError && (
          <motion.button
            key="mini-btn"
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.75 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            whileTap={{ scale: 0.91 }}
            onClick={handleToggle}
            aria-label={isPlaying ? 'Pause wedding song' : 'Play wedding song'}
            style={{
              position:            'fixed',
              bottom:              'calc(20px + env(safe-area-inset-bottom))',
              right:                18,
              zIndex:               190,
              width:                46,
              height:               46,
              borderRadius:        '50%',
              border:              '1.5px solid rgba(199, 164, 90, 0.5)',
              background:          'rgba(255, 249, 240, 0.95)',
              backdropFilter:       'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              display:             'flex',
              alignItems:          'center',
              justifyContent:      'center',
              cursor:              'pointer',
              outline:             'none',
              boxShadow:           '0 4px 18px rgba(18, 61, 50, 0.14)',
            }}
          >
            {/* Subtle animated gold ring while playing */}
            {isPlaying && !reduced && (
              <motion.span
                aria-hidden="true"
                style={{
                  position:     'absolute',
                  inset:        -3,
                  borderRadius: '50%',
                  border:       '1px solid rgba(199,164,90,0)',
                  pointerEvents:'none',
                }}
                animate={{ borderColor: [
                  'rgba(199,164,90,0)',
                  'rgba(199,164,90,0.5)',
                  'rgba(199,164,90,0)',
                ]}}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Audio unavailable notice ── */}
      <AnimatePresence>
        {audioError && (
          <motion.div
            key="audio-error"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            style={{
              position:      'fixed',
              bottom:        'calc(14px + env(safe-area-inset-bottom))',
              left:          '50%',
              transform:     'translateX(-50%)',
              zIndex:         195,
              pointerEvents: 'none',
            }}
          >
            <span style={{
              display:             'inline-block',
              padding:             '7px 18px',
              background:          'rgba(255, 249, 240, 0.94)',
              border:              '1px solid rgba(199, 164, 90, 0.3)',
              borderRadius:         999,
              fontFamily:           POPPINS,
              fontSize:              11,
              color:               '#9A6060',
              letterSpacing:       '0.04em',
              backdropFilter:      'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}>
              Music is unavailable right now.
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
