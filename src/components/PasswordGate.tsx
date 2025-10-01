import { useState, FormEvent, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Heart } from 'lucide-react';

interface PasswordGateProps {
  onUnlock: () => void;
}

// SHA-256 hash of "turkey" (case insensitive)
const CORRECT_HASH = '8d7d5397f8842b4181d38bc57b85b9ff1860456f92872c43f991a904c45062d5';

const RIDDLE = "Where were we first gonna meet (or second)?";

// TODO: Add/remove lines in WRONG_NOTES to tune voice later
const WRONG_NOTES = [
  "almost there, starlight ✨",
  "hmm… close, try that other thought 🌙",
  "the heart says you're near 💫",
  "one more nudge, wonder-girl 🌸",
  "not this one, beautiful—another guess?",
  "i believe in you, okay? 🌟",
  "the lock is giggling… try again",
  "it's on the tip of your smile ☺️",
  "tiny detour—love is patient",
  "nearly kissed the answer 💋",
  "the key is a memory, not a password",
  "listen to your sparkle ✨",
  "your month is waiting… one more guess",
  "wrong door, right girl 💛",
  "soft no—gentle yes next time?",
  "close enough to count as cute",
  "the universe just winked; try again 😉",
  "a miss, but you still glow",
  "psst… think of us, not words",
  "the right answer loves morning light 🌤️"
];

// TODO: Add/remove lines in WRONG_EMOJI_SETS to tune visuals later
const WRONG_EMOJI_SETS = [
  ['🥺', '✨'],
  ['🙈', '💫'],
  ['😅', '🌙'],
  ['🤍', '🔒'],
  ['🤞🏻', '⭐'],
  ['🤍', '🌸'],
  ['😌', '🍃'],
  ['😉', '✨'],
  ['🤍', '🗝️'],
  ['😳', '🌟'],
  ['🤍', '🌙'],
  ['😇', '✨'],
  ['💭', '💫'],
  ['🤍', '🌼'],
  ['😯', '⭐'],
  ['🫣', '🌙'],
  ['🤍', '🌺'],
  ['🙂', '✨'],
  ['🤍', '🪄'],
  ['☺️', '🌠']
];

interface FloatingEmoji {
  id: number;
  emoji: string;
  x: number;
  y: number;
}

export function PasswordGate({ onUnlock }: PasswordGateProps) {
  const [answer, setAnswer] = useState('');
  const [isWrong, setIsWrong] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [microNote, setMicroNote] = useState<string | null>(null);
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);
  const lastWrongTimeRef = useRef<number>(0);
  const lastNoteIndexRef = useRef<number>(-1);
  const lastEmojiSetIndexRef = useRef<number>(-1);
  
  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const hashString = async (str: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(str.toLowerCase().trim());
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsWrong(false);

    const hash = await hashString(answer);
    
    if (hash === CORRECT_HASH) {
      setIsUnlocking(true);
      setTimeout(() => {
        onUnlock();
      }, 1500);
    } else {
      const now = Date.now();
      const timeSinceLastWrong = now - lastWrongTimeRef.current;
      
      // Throttle: Only show new effects if 800ms has passed
      if (timeSinceLastWrong >= 800) {
        lastWrongTimeRef.current = now;
        
        // Pick random note (avoid repeating last one)
        let noteIndex = Math.floor(Math.random() * WRONG_NOTES.length);
        if (noteIndex === lastNoteIndexRef.current && WRONG_NOTES.length > 1) {
          noteIndex = (noteIndex + 1) % WRONG_NOTES.length;
        }
        lastNoteIndexRef.current = noteIndex;
        setMicroNote(WRONG_NOTES[noteIndex]);
        
        // Pick random emoji set (avoid repeating last one)
        let emojiSetIndex = Math.floor(Math.random() * WRONG_EMOJI_SETS.length);
        if (emojiSetIndex === lastEmojiSetIndexRef.current && WRONG_EMOJI_SETS.length > 1) {
          emojiSetIndex = (emojiSetIndex + 1) % WRONG_EMOJI_SETS.length;
        }
        lastEmojiSetIndexRef.current = emojiSetIndex;
        
        // Spawn 2-4 floating emojis (only if not reduced motion)
        if (!prefersReducedMotion) {
          const emojiSet = WRONG_EMOJI_SETS[emojiSetIndex];
          const count = Math.floor(Math.random() * 3) + 2; // 2-4 emojis
          const newEmojis: FloatingEmoji[] = [];
          
          for (let i = 0; i < count; i++) {
            newEmojis.push({
              id: now + i,
              emoji: emojiSet[Math.floor(Math.random() * emojiSet.length)] || '❤',
              x: Math.random() * 60 - 30, // -30 to 30px offset
              y: 0
            });
          }
          
          setFloatingEmojis(newEmojis);
          
          // Remove emojis after animation
          setTimeout(() => {
            setFloatingEmojis([]);
          }, 1200);
        }
        
        // Clear micro-note after delay
        const noteDuration = 1600 + Math.random() * 600; // 1.6-2.2s
        setTimeout(() => {
          setMicroNote(null);
        }, noteDuration);
      }
      
      setIsWrong(true);
      setTimeout(() => setIsWrong(false), 500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          x: isWrong ? [0, -10, 10, -10, 10, 0] : 0
        }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: isUnlocking ? 360 : 0 }}
            transition={{ duration: 1 }}
            className="inline-block mb-4"
          >
            {isUnlocking ? (
              <Heart className="w-16 h-16 text-rose mx-auto" fill="currentColor" />
            ) : (
              <Lock className="w-16 h-16 text-gold mx-auto" />
            )}
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-heading text-gold mb-2 text-shadow-glow tracking-wide">
            Hamza for Eman
          </h1>
          <p className="font-body text-gray-300 text-sm">
            one little question before the magic opens ✨
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 relative">
          {/* Micro-note */}
          <AnimatePresence>
            {microNote && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
                className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-20"
                aria-live="polite"
              >
                <div className="bg-midnight-800/95 backdrop-blur-lg border border-gold/40 rounded-full px-4 py-1.5 shadow-lg shadow-gold/20 whitespace-nowrap">
                  <p className="text-xs text-gray-200 text-center">
                    {microNote}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating emojis */}
          {!prefersReducedMotion && (
            <div className="absolute inset-0 pointer-events-none overflow-visible z-10">
              <AnimatePresence>
                {floatingEmojis.map((emoji) => (
                  <motion.div
                    key={emoji.id}
                    initial={{ 
                      opacity: 0.75, 
                      y: 20, 
                      x: emoji.x,
                      scale: 0.5 
                    }}
                    animate={{ 
                      opacity: 0, 
                      y: -60, 
                      x: emoji.x + (Math.random() * 20 - 10),
                      scale: 1
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ 
                      duration: 0.9 + Math.random() * 0.3,
                      ease: 'easeOut'
                    }}
                    className="absolute left-1/2 top-1/2 text-xl md:text-2xl"
                    style={{
                      filter: 'drop-shadow(0 0 8px rgba(245, 230, 196, 0.3))',
                    }}
                  >
                    {emoji.emoji}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
          <div className="bg-midnight-800/50 backdrop-blur-sm rounded-lg p-6 border border-gold/20">
            <p className="font-heading text-gray-200 mb-2 text-center">
              {RIDDLE}
            </p>
            <p className="font-body text-white/70 text-xs italic text-center mb-4">
              A daily dose of 'us' question to make you smile, everyday.
            </p>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Your answer..."
              className="w-full px-4 py-3 bg-midnight-900/50 border border-gold/30 rounded-lg 
                       text-gray-100 placeholder-gray-500 focus:outline-none focus:border-gold/60
                       transition-colors"
              autoFocus
            />
          </div>

          {/* TODO: replace this note-box text with your own description later */}
          <div className="bg-midnight-800/40 backdrop-blur-sm rounded-lg p-5 border border-gold/10 shadow-lg shadow-gold/5">
            <p className="font-body text-gray-300 text-sm leading-relaxed text-center">
              Hi baby! This is something that took months in the making. For the most special one in my life; for now and forever, I want to forever document us. From the moment I first saw you, to where we are: This is the story of us. A very Happy Birthday to my cutie patootie pie! This is not simply a website, this is a window to what I have felt about us, at different times of our relationship. It includes notes from God Knows When, how I felt, and just the idea of how I will feel when I first see you. I can only try writing what and how I feel for you. I love you so much, and I hope you love this gift as much as I loved making it for you. <p>{"\u2665"}</p>
            </p>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-gradient-to-r from-gold/20 to-rose/20 
                     border border-gold/40 rounded-lg text-gold font-medium
                     hover:from-gold/30 hover:to-rose/30 transition-all"
          >
            {isUnlocking ? '✨ Unlocking...' : 'Unlock'}
          </motion.button>
        </form>

        {isUnlocking && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-4 text-rose text-sm"
          >
            ✨ Welcome to your month, your world baby ✨
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
