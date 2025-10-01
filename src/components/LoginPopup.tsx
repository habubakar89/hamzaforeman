import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface LoginPopupProps {
  onClose: () => void;
}

export function LoginPopup({ onClose }: LoginPopupProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="relative max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl border-2 border-rose/40 shadow-2xl shadow-rose/20 p-6 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close popup"
        >
          <X size={20} />
        </button>

        {/* Image area */}
        <div className="mb-6 flex justify-center">
          {/* TODO: replace placeholder image src in /public/popup.jpg */}
          <div className="relative w-48 h-48 rounded-2xl overflow-hidden border-2 border-gold/30 shadow-lg">
            <img
              src="/popup.jpg"
              alt="Romantic popup"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback if image doesn't exist
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-midnight-800/50 text-gray-400 text-sm">Add popup.jpg</div>';
              }}
            />
          </div>
        </div>

        {/* Description area */}
        <div className="mb-6 text-center">
          {/* TODO: replace with your romantic text here */}
          <p className="font-body text-gray-200 leading-relaxed text-base">
            Welcome to a journey through our story, one day at a time. 
            Each note holds a piece of my heart, written just for you. 
            Let the music play, and let's relive every beautiful moment together. ✨
          </p>
        </div>

        {/* Button */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-gradient-to-r from-rose/30 to-gold/30 hover:from-rose/40 hover:to-gold/40 
                   border border-rose/40 rounded-lg text-white font-medium transition-all
                   flex items-center justify-center gap-2"
        >
          Got it 💖
        </button>
      </motion.div>
    </motion.div>
  );
}
