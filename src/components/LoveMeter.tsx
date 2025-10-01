import { motion } from 'framer-motion';
import { NOTES } from '../data/notes';

export function LoveMeter() {
  // Count visible (unblurred) notes to determine progress
  const totalNotes = NOTES.length;
  const visibleNotes = NOTES.filter(note => note.isBlurred === false).length;
  
  // Calculate percentage based on manually revealed notes (minimum 5% when at least 1 note visible)
  const basePercentage = ((visibleNotes - 1) / (totalNotes - 1)) * 95; // Scale from 0-95%
  const percentage = Math.round(basePercentage + 5); // Add 5% minimum
  
  // Display day count based on visible notes
  const currentDay = visibleNotes;

  return (
    <div className="fixed top-4 right-4 z-50 md:block">
      <div className="bg-midnight-800/80 backdrop-blur-sm rounded-lg p-3 md:p-4 border border-gold/20 w-40 md:w-48">
        <div className="text-center mb-3">
          <p className="font-body text-xs text-gray-400 mb-1">love level</p>
          <p className="text-2xl font-heading text-rose">{percentage}%</p>
          <p className="font-body text-xs text-gray-500">full</p>
        </div>

        <div className="relative h-40 bg-midnight-900/50 rounded-full overflow-hidden border border-gold/20">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${percentage}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="absolute bottom-0 w-full bg-gradient-to-t from-rose via-rose/70 to-gold/50"
          />
          
          {/* Animated sparkles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [40, -40],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 3,
                  delay: i * 1,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="absolute left-1/2 transform -translate-x-1/2 text-gold text-xs"
                style={{ bottom: `${percentage}%` }}
              >
                ✨
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-3 text-center">
          <p className="font-body text-xs text-gray-500">
            day {currentDay} of {totalNotes}
          </p>
        </div>
      </div>
    </div>
  );
}
