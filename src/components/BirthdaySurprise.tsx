import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { BIRTHDAY_MESSAGE } from '../data/notes';

interface BirthdaySurpriseProps {
  show: boolean;
}

export function BirthdaySurprise({ show }: BirthdaySurpriseProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (show) {
      setShowConfetti(true);
      // Stop confetti after 10 seconds
      setTimeout(() => setShowConfetti(false), 10000);
    }
  }, [show]);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!show) return null;

  return (
    <>
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          colors={['#f5e6c4', '#ff8fa3', '#ffd700', '#ff69b4', '#ffffff']}
        />
      )}

      <div className="max-w-4xl mx-auto px-4 py-16">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="text-center mb-12">
            <motion.h2
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="text-5xl md:text-7xl font-playfair text-gold mb-4 text-shadow-glow"
            >
              {BIRTHDAY_MESSAGE.title}
            </motion.h2>
            <div className="text-4xl mb-8">🎂🎉✨🎈💖</div>
          </div>

          <div className="bg-midnight-800/60 backdrop-blur-sm rounded-2xl p-8 md:p-12 border-2 border-gold/40 shadow-2xl shadow-rose/20">
            <div className="prose prose-invert prose-lg max-w-none">
              <p className="text-gray-200 leading-relaxed whitespace-pre-line font-poppins">
                {BIRTHDAY_MESSAGE.content}
              </p>
            </div>

            {BIRTHDAY_MESSAGE.media && BIRTHDAY_MESSAGE.media.length > 0 && (
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {BIRTHDAY_MESSAGE.media.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="rounded-lg overflow-hidden shadow-lg"
                  >
                    {item.type === 'image' ? (
                      <img
                        src={item.src}
                        alt={item.alt || `Birthday memory ${index + 1}`}
                        className="w-full h-auto"
                        loading="lazy"
                      />
                    ) : item.type === 'youtube' ? (
                      <div className="relative pb-[56.25%] h-0">
                        <iframe
                          src={item.src}
                          className="absolute top-0 left-0 w-full h-full"
                          allowFullScreen
                          title={item.alt || 'Birthday video'}
                        />
                      </div>
                    ) : null}
                  </motion.div>
                ))}
              </div>
            )}

            <div className="mt-12 text-center">
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="text-6xl mb-4"
              >
                💝
              </motion.div>
              <p className="text-rose font-playfair text-2xl">
                Forever yours, Hamza
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
