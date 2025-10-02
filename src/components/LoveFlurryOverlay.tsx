import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';

interface LoveFlurryOverlayProps {
  visible: boolean;
  flurryKey: number;
  onAutoDismiss: () => void;
  originElement?: HTMLElement | null;
}

type ParticleType = 'heart' | 'bird' | 'text';

interface Particle {
  id: string;
  type: ParticleType;
  x: number;
  y: number;
  delay: number;
  duration: number;
  rotation: number;
  scale: number;
  xOffset: number;
  yOffset: number;
  text?: string;
}

const HEART_COLORS = ['#f5e6c4', '#ff8fa3', '#ffd0d8'];
const BIRD_COLORS = ['#e7f5ff', '#c8e7ff'];
const TEXT_OPTIONS = ['i love you', 'love you', 'ily'];

const isMobile = () => window.innerWidth < 768;
const prefersReducedMotion = () => 
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function LoveFlurryOverlay({ 
  visible, 
  flurryKey, 
  onAutoDismiss,
  originElement 
}: LoveFlurryOverlayProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [state, setState] = useState<'idle' | 'playing' | 'fading' | 'removed'>('idle');
  const failsafeTimeout = useRef<number>();
  const playingTimeout = useRef<number>();

  useEffect(() => {
    if (!visible) {
      setState('idle');
      setParticles([]);
      return;
    }

    // Get origin coordinates
    const rect = originElement?.getBoundingClientRect();
    const originX = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const originY = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;

    const mobile = isMobile();
    const reduced = prefersReducedMotion();

    if (reduced) {
      // Reduced motion: show 3 static hearts + 1 dove + "i love you" with quick fade
      const simpleParticles: Particle[] = [
        {
          id: `heart-1-${flurryKey}`,
          type: 'heart',
          x: originX - 30,
          y: originY,
          delay: 0,
          duration: 0.7,
          rotation: 0,
          scale: 1,
          xOffset: 0,
          yOffset: -50,
        },
        {
          id: `heart-2-${flurryKey}`,
          type: 'heart',
          x: originX,
          y: originY,
          delay: 0.1,
          duration: 0.7,
          rotation: 0,
          scale: 1,
          xOffset: 0,
          yOffset: -50,
        },
        {
          id: `heart-3-${flurryKey}`,
          type: 'heart',
          x: originX + 30,
          y: originY,
          delay: 0.2,
          duration: 0.7,
          rotation: 0,
          scale: 1,
          xOffset: 0,
          yOffset: -50,
        },
        {
          id: `bird-1-${flurryKey}`,
          type: 'bird',
          x: originX,
          y: originY - 20,
          delay: 0.15,
          duration: 0.7,
          rotation: -5,
          scale: 1,
          xOffset: 40,
          yOffset: -60,
        },
        {
          id: `text-1-${flurryKey}`,
          type: 'text',
          x: originX,
          y: originY + 10,
          delay: 0.05,
          duration: 0.7,
          rotation: 0,
          scale: 1,
          xOffset: 0,
          yOffset: -70,
          text: 'i love you',
        },
      ];

      setParticles(simpleParticles);
      setState('playing');

      playingTimeout.current = setTimeout(() => {
        setState('fading');
        setTimeout(() => {
          setState('removed');
          onAutoDismiss();
        }, 200);
      }, 700);

      return;
    }

    // Full animation
    const heartCount = mobile ? 12 : 18;
    const birdCount = mobile ? 4 : 6;
    const textCount = mobile ? 5 : 7;
    const maxDuration = mobile ? 1.9 : 2.4;

    const newParticles: Particle[] = [];

    // Generate hearts
    for (let i = 0; i < heartCount; i++) {
      newParticles.push({
        id: `heart-${i}-${flurryKey}`,
        type: 'heart',
        x: originX + (Math.random() - 0.5) * 24,
        y: originY + (Math.random() - 0.5) * 24,
        delay: Math.random() * 0.18,
        duration: 1.8 + Math.random() * 0.6,
        rotation: Math.random() * 360,
        scale: 0.8 + Math.random() * 0.3,
        xOffset: (Math.random() - 0.5) * 240,
        yOffset: -220 - Math.random() * 80,
      });
    }

    // Generate birds
    for (let i = 0; i < birdCount; i++) {
      newParticles.push({
        id: `bird-${i}-${flurryKey}`,
        type: 'bird',
        x: originX + (Math.random() - 0.5) * 24,
        y: originY + (Math.random() - 0.5) * 24,
        delay: Math.random() * 0.18,
        duration: 1.9 + Math.random() * 0.5,
        rotation: -8 + Math.random() * 14,
        scale: 0.85 + Math.random() * 0.3,
        xOffset: (Math.random() - 0.5) * 200,
        yOffset: -200 - Math.random() * 100,
      });
    }

    // Generate text
    for (let i = 0; i < textCount; i++) {
      newParticles.push({
        id: `text-${i}-${flurryKey}`,
        type: 'text',
        x: originX + (Math.random() - 0.5) * 24,
        y: originY + (Math.random() - 0.5) * 24,
        delay: Math.random() * 0.18,
        duration: 1.7 + Math.random() * 0.5,
        rotation: 0,
        scale: 0.9 + Math.random() * 0.2,
        xOffset: (Math.random() - 0.5) * 100,
        yOffset: -140 - Math.random() * 60,
        text: TEXT_OPTIONS[Math.floor(Math.random() * TEXT_OPTIONS.length)],
      });
    }

    setParticles(newParticles);
    setState('playing');

    // Schedule teardown
    playingTimeout.current = setTimeout(() => {
      setState('fading');
      setTimeout(() => {
        setState('removed');
        onAutoDismiss();
      }, 400);
    }, maxDuration * 1000);

    // Failsafe
    failsafeTimeout.current = setTimeout(() => {
      setState('removed');
      onAutoDismiss();
    }, 4500);

    return () => {
      if (playingTimeout.current) clearTimeout(playingTimeout.current);
      if (failsafeTimeout.current) clearTimeout(failsafeTimeout.current);
    };
  }, [visible, flurryKey, originElement, onAutoDismiss]);

  if (state === 'idle' || state === 'removed') {
    return null;
  }

  const renderParticle = (particle: Particle) => {
    const baseStyle = {
      left: particle.x,
      top: particle.y,
      zIndex: Math.floor(Math.random() * 100),
    };

    const animateProps = {
      x: particle.xOffset,
      y: particle.yOffset,
      opacity: [0, 1, 1, 0],
      scale: [particle.scale, particle.scale * 1.1, particle.scale],
      rotate: particle.rotation,
    };

    const transition = {
      duration: particle.duration,
      delay: particle.delay,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      opacity: {
        times: [0, 0.1, 0.7, 1],
      },
    };

    switch (particle.type) {
      case 'heart':
        const heartColor = HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];
        return (
          <motion.div
            key={particle.id}
            className="absolute pointer-events-none"
            style={baseStyle}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={animateProps}
            transition={transition}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill={heartColor}
              style={{
                filter: `drop-shadow(0 0 10px ${heartColor}90)`,
              }}
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </motion.div>
        );

      case 'bird':
        const birdColor = BIRD_COLORS[Math.floor(Math.random() * BIRD_COLORS.length)];
        return (
          <motion.div
            key={particle.id}
            className="absolute pointer-events-none"
            style={baseStyle}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              ...animateProps,
              rotate: [particle.rotation - 8, particle.rotation + 6],
              scaleY: [0.96, 1.04, 0.96],
            }}
            transition={{
              ...transition,
              rotate: {
                duration: particle.duration,
                repeat: Infinity,
                ease: 'easeInOut',
              },
              scaleY: {
                duration: 0.3,
                repeat: Infinity,
                ease: 'easeInOut',
              },
            }}
          >
            <svg
              width="28"
              height="20"
              viewBox="0 0 28 20"
              fill={birdColor}
              style={{
                filter: `drop-shadow(0 0 6px ${birdColor}80)`,
              }}
            >
              <path d="M14 0c-3 0-5 2-6 4-2 0-4 1-5 3-1 1-1 3 0 4 2 2 5 2 7 1 0 2 1 4 3 5 1 1 3 1 4 0 2-1 3-3 3-5 2 1 5 1 7-1 1-1 1-3 0-4-1-2-3-3-5-3-1-2-3-4-6-4z"/>
            </svg>
          </motion.div>
        );

      case 'text':
        return (
          <motion.div
            key={particle.id}
            className="absolute pointer-events-none font-heading text-[#f5e6c4] text-sm whitespace-nowrap"
            style={{
              ...baseStyle,
              textShadow: '0 0 12px rgba(245,230,196,0.6)',
              opacity: 0.75,
            }}
            initial={{ opacity: 0, scale: 0.8, filter: 'blur(0px)' }}
            animate={{
              x: particle.xOffset + Math.sin(Date.now() / 1000 + particle.delay) * 20,
              y: particle.yOffset,
              opacity: [0, 1, 1, 0],
              scale: [particle.scale, particle.scale * 1.05, particle.scale],
              filter: ['blur(0px)', 'blur(1px)', 'blur(2px)'],
            }}
            transition={{
              ...transition,
              x: {
                duration: particle.duration,
                ease: 'easeOut',
              },
              opacity: {
                times: [0, 0.2, 0.7, 1],
              },
            }}
          >
            {particle.text}
          </motion.div>
        );

      default:
        return null;
    }
  };

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-20 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: state === 'fading' ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        aria-hidden="true"
        role="presentation"
      >
        {particles.map(renderParticle)}
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
