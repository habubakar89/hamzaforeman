import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface WelcomePopupProps {
  onClose: () => void;
}

export function WelcomePopup({ onClose }: WelcomePopupProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show popup immediately after component mounts
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Wait for animation to complete before calling onClose
    setTimeout(onClose, 300);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="relative max-w-xl w-full bg-white/10 backdrop-blur-lg rounded-3xl border-2 border-pink-300/40 shadow-2xl shadow-pink-400/30 p-8 md:p-12"
            style={{
              boxShadow: '0 0 40px rgba(251, 113, 133, 0.3), 0 0 80px rgba(251, 113, 133, 0.15)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Romantic welcome message */}
            <div className="mb-8">
              <p className="font-heading text-2xl md:text-3xl text-white/90 leading-relaxed text-center tracking-wide">
                To a girl who wrongly thinks she doesn't deserve me, she couldn't be more wrong. She has no idea what she means to me, this is a window to my heart that is full of her. For now and ever ✨ <br></br>I love you baby 💕
              </p>
            </div>

            {/* Close button */}
            <div className="flex justify-center">
              <button
                onClick={handleClose}
                className="bg-gradient-to-r from-pink-500 to-rose-400 text-white rounded-full px-8 py-3 shadow-lg hover:scale-105 transition-transform duration-300 font-medium text-lg"
                style={{
                  boxShadow: '0 4px 20px rgba(251, 113, 133, 0.4)'
                }}
              >
                Let's go 💖
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
