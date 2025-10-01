import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO, isToday } from 'date-fns';
import { DayNote } from '../types';
import { useEffect, useState, useRef } from 'react';
import { LOCKED_MESSAGES, DEFAULT_LOCKED_MESSAGE } from '../data/notes';
import { NightSkyReveal } from './NightSkyReveal';

// TODO: Set to false to disable the night sky reveal feature
export const ENABLE_NIGHT_SKY_REVEAL = true;

interface TimelineProps {
  notes: DayNote[];
}

export function Timeline({ notes }: TimelineProps) {
  // Use America/New_York timezone
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [lockedToast, setLockedToast] = useState<string | null>(null);
  const [revealingNoteIndex, setRevealingNoteIndex] = useState<number | null>(null);
  const [showNightSky, setShowNightSky] = useState(false);
  const hasScrolled = useRef(false);
  const hasShownNightSky = useRef(false);
  const timelineRef = useRef<HTMLDivElement>(null);
  
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Apply reveal chain logic: if note at index N is unblurred, all before it must be unblurred
  const getEffectiveBlurState = (note: DayNote, index: number): boolean => {
    // If this note's isBlurred is false, return false
    if (note.isBlurred === false) {
      return false;
    }
    
    // Check if any note after this one is unblurred
    for (let i = index + 1; i < notes.length; i++) {
      if (notes[i].isBlurred === false) {
        // A later note is unblurred, so this one must be unblurred too
        return false;
      }
    }
    
    // This note and all after it are blurred
    return true;
  };

  // Find the "today" note - the last unblurred note in the list
  const getTodayNoteIndex = (): number => {
    let lastUnblurredIndex = -1;
    for (let i = 0; i < notes.length; i++) {
      if (!getEffectiveBlurState(notes[i], i)) {
        lastUnblurredIndex = i;
      }
    }
    return lastUnblurredIndex;
  };

  const todayNoteIndex = getTodayNoteIndex();

  const renderMedia = (media: DayNote['media']) => {
    if (!media) return null;

    switch (media.type) {
      case 'image':
        return (
          <img
            src={media.src}
            alt={media.alt || 'Memory'}
            className="w-full rounded-lg shadow-lg"
            loading="lazy"
          />
        );
      case 'youtube':
        return (
          <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg">
            <iframe
              src={media.src}
              className="absolute top-0 left-0 w-full h-full"
              allowFullScreen
              title={media.alt || 'Video'}
            />
          </div>
        );
      case 'spotify':
        return (
          <iframe
            src={media.src}
            className="w-full h-20 rounded-lg"
            allow="encrypted-media"
            title={media.alt || 'Audio'}
          />
        );
      case 'audio':
        return (
          <audio controls className="w-full">
            <source src={media.src} />
            Your browser does not support audio.
          </audio>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    // Check if Oct 21 card is visible (not blurred)
    const oct21Note = notes.find(n => n.date === '2025-10-21');
    const oct21Index = notes.findIndex(n => n.date === '2025-10-21');
    
    if (oct21Note && oct21Index !== -1) {
      const isOct21Visible = !getEffectiveBlurState(oct21Note, oct21Index);
      
      if (isOct21Visible) {
        // Trigger confetti when Oct 21 becomes visible
        const timer = setTimeout(() => {
          setShowConfetti(true);
          // Reset after animation
          setTimeout(() => setShowConfetti(false), 5000);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [notes]);

  useEffect(() => {
    // Auto-scroll to today's note on first load
    if (hasScrolled.current || prefersReducedMotion) return;

    const targetIndex = todayNoteIndex;
    
    if (targetIndex !== -1) {
      hasScrolled.current = true;
      
      // Wait for DOM to be ready
      setTimeout(() => {
        const noteElement = document.getElementById(`note-${notes[targetIndex].date}`);
        if (noteElement) {
          noteElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          
          // Trigger reveal animation
          setRevealingNoteIndex(targetIndex);
          setTimeout(() => setRevealingNoteIndex(null), 1500);
        }
      }, 100);
    } else {
      // Fallback: scroll to first visible (unblurred) note
      const firstVisibleIndex = notes.findIndex((note, index) => !getEffectiveBlurState(note, index));
      
      if (firstVisibleIndex !== -1) {
        hasScrolled.current = true;
        
        setTimeout(() => {
          const noteElement = document.getElementById(`note-${notes[firstVisibleIndex].date}`);
          if (noteElement) {
            noteElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }
    }
  }, [notes, prefersReducedMotion, todayNoteIndex]);

  const handleLockedCardClick = (date: string) => {
    const noteDate = parseISO(date);
    const formattedDate = format(noteDate, 'MMMM d');
    setLockedToast(`This note updates on ${formattedDate} in the morning ✨`);
    setTimeout(() => setLockedToast(null), 2500);
  };

  const handleTodayNoteClick = () => {
    // Trigger night sky reveal effect (once per session)
    if (ENABLE_NIGHT_SKY_REVEAL && !hasShownNightSky.current) {
      hasShownNightSky.current = true;
      setShowNightSky(true);
    }
  };

  const handleNightSkyComplete = () => {
    setShowNightSky(false);
  };

  return (
    <>
      {/* Night Sky Reveal Effect */}
      <NightSkyReveal isActive={showNightSky} onComplete={handleNightSkyComplete} />

      <div className="max-w-3xl mx-auto px-4 py-12" ref={timelineRef}>
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -20, x: Math.random() * window.innerWidth, opacity: 1 }}
              animate={{ 
                y: window.innerHeight + 20, 
                rotate: Math.random() * 360,
                opacity: 0 
              }}
              transition={{ 
                duration: 3 + Math.random() * 2, 
                ease: 'linear',
                delay: Math.random() * 0.5
              }}
              className="absolute text-2xl"
            >
              {['🎉', '🎊', '✨', '💖', '🌟'][Math.floor(Math.random() * 5)]}
            </motion.div>
          ))}
        </div>
      )}

      <h2 className="text-3xl md:text-4xl font-heading text-gold text-center mb-12 text-shadow-glow tracking-wide">
        Through Hamza’s Eyes, Eman ✨
      </h2>

      <div className="space-y-8">
        {notes.map((note, index) => {
          const noteDate = parseISO(note.date);
          const isCurrent = index === todayNoteIndex; // Use boolean-based logic instead of system date
          const isBirthdayCard = note.date === '2025-10-21';
          const isBlurred = getEffectiveBlurState(note, index);
          const isRevealing = revealingNoteIndex === index;

          return (
            <motion.div
              key={note.date}
              id={`note-${note.date}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Timeline line */}
              <div className="absolute left-0 top-0 w-px h-full bg-gradient-to-b from-gold/40 to-rose/40 ml-4 md:ml-8" />

              {/* Timeline dot */}
              <div className={`absolute left-0 top-6 w-3 h-3 rounded-full ml-[10px] md:ml-[26px] ${
                isCurrent ? 'bg-rose animate-pulse' : 'bg-gold'
              }`} />

              {/* Content card */}
              <div className="ml-12 md:ml-20">
                {!isBlurred ? (
                  <motion.div
                    initial={isRevealing ? { opacity: 0.3, filter: 'blur(8px)' } : (isCurrent || isBirthdayCard ? { scale: 0.95, opacity: 0 } : {})}
                    animate={isRevealing ? { opacity: 1, filter: 'blur(0px)' } : (isCurrent || isBirthdayCard ? { scale: 1, opacity: 1 } : {})}
                    transition={{ duration: isRevealing ? 1.5 : 0.5, ease: 'easeOut' }}
                    onClick={isCurrent && ENABLE_NIGHT_SKY_REVEAL ? handleTodayNoteClick : undefined}
                    className={`bg-midnight-800/50 backdrop-blur-sm rounded-lg p-6 border ${
                      isCurrent && ENABLE_NIGHT_SKY_REVEAL ? 'cursor-pointer hover:border-rose/40 transition-colors' : ''
                    } ${
                      isBirthdayCard 
                        ? 'border-rose/60 shadow-2xl shadow-rose/40 md:p-8 md:scale-105' 
                        : isCurrent 
                        ? 'border-rose/50 shadow-lg shadow-rose/20' 
                        : 'border-gold/20'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      {note.emoji && (
                        <span className={isBirthdayCard ? 'text-4xl' : 'text-2xl'}>
                          {note.emoji}
                        </span>
                      )}
                      <div>
                        {note.title && (
                          <h3 className={`font-heading tracking-wide ${isBirthdayCard ? 'text-2xl md:text-3xl text-rose' : 'text-xl text-gold'}`}>
                            {note.title}
                          </h3>
                        )}
                        <p className="text-sm text-gray-400">
                          {format(noteDate, 'MMMM d, yyyy')}
                        </p>
                      </div>
                    </div>

                    <p className={`font-body text-gray-200 whitespace-pre-line leading-relaxed mb-4 ${isBirthdayCard ? 'text-base md:text-lg' : 'text-base'}`}>
                      {note.content}
                    </p>

                    {note.media && (
                      <div className="mt-4">
                        {renderMedia(note.media)}
                      </div>
                    )}

                    {isCurrent && !isBirthdayCard && (
                      <div className="mt-4 text-center">
                        <span className="text-rose text-sm font-medium">✨ Today's message</span>
                      </div>
                    )}
                    
                    {isBirthdayCard && !isBlurred && (
                      <div className="mt-6 text-center">
                        <span className="text-rose text-lg font-medium">🎂 Happy Birthday! 🎂</span>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    onClick={() => handleLockedCardClick(note.date)}
                    whileHover={{ scale: 1.01 }}
                    className="bg-midnight-800/30 backdrop-blur-sm rounded-lg p-6 border border-gold/10 cursor-pointer relative overflow-hidden"
                  >
                    {/* Date area - not blurred */}
                    <div className="flex items-center gap-2 mb-3">
                      {note.emoji && (
                        <span className="text-2xl opacity-40 blur-sm">
                          {note.emoji}
                        </span>
                      )}
                      <div>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <span className="text-sm">🔒</span>
                          {format(noteDate, 'MMMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    
                    {/* Title area - blurred */}
                    <div className="mb-3 blur-sm opacity-40 select-none">
                      {note.title && (
                        <h3 className="text-lg font-heading text-gold tracking-wide">
                          {note.title}
                        </h3>
                      )}
                    </div>
                    
                    {/* Blurred content area */}
                    <div className="relative">
                      <div className="blur-sm select-none opacity-40">
                        <p className="text-gray-300 leading-relaxed">
                          {note.content.substring(0, 150)}...
                        </p>
                      </div>
                      
                      {/* Lock caption - unique message per date */}
                      <p className="text-gray-500 italic text-sm mt-3 flex items-center gap-1">
                        {LOCKED_MESSAGES[note.date] || DEFAULT_LOCKED_MESSAGE}
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Locked card micro-toast */}
      <AnimatePresence>
        {lockedToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-midnight-800/95 backdrop-blur-lg border border-gold/30 rounded-lg px-6 py-3 shadow-lg shadow-gold/20">
              <p className="text-gray-200 text-sm flex items-center gap-2">
                <span>🔒</span>
                {lockedToast}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </>
  );
}
