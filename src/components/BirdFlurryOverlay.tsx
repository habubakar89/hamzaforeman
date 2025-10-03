import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';

// Debug flag - set to true to enable console logs
const DEV_OVERLAY_DEBUG = false;

interface BirdFlurryOverlayProps {
  visible: boolean;
  flurryKey: number;
  onAutoDismiss?: () => void;
  originElement?: HTMLElement | null;
}

interface Particle {
  id: string;
  x: number;
  y: number;
  delay: number;
  duration: number;
  type: 'bird' | 'heart' | 'text';
  content?: string;
  color?: string;
  angle?: number;
  distance?: number;
}

export function BirdFlurryOverlay({ visible, flurryKey, onAutoDismiss, originElement }: BirdFlurryOverlayProps) {
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const mountTimeRef = useRef<number>(0);
  const didInitRef = useRef(false);
  const timersRef = useRef<{ primary: number | null; failsafe: number | null }>({
    primary: null,
    failsafe: null,
  });

  const isMobile = window.innerWidth < 768;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Particle counts
  const BIRD_COUNT = prefersReducedMotion ? 1 : (isMobile ? 4 : 6);
  const HEART_COUNT = prefersReducedMotion ? 2 : (isMobile ? 10 : 15);
  const TEXT_COUNT = prefersReducedMotion ? 1 : (isMobile ? 4 : 6);

  // Durations in ms
  const TOTAL_DURATION = prefersReducedMotion ? 700 : (isMobile ? 2000 : 2400);
  const FAILSAFE_DELAY = 4500;

  const clearTimers = () => {
    if (timersRef.current.primary) clearTimeout(timersRef.current.primary);
    if (timersRef.current.failsafe) clearTimeout(timersRef.current.failsafe);
    timersRef.current = { primary: null, failsafe: null };
  };

  const unmount = (reason: string) => {
    if (DEV_OVERLAY_DEBUG) {
      console.log(`[BirdFlurry] Unmounting - reason: ${reason}, elapsed: ${Date.now() - mountTimeRef.current}ms`);
    }
    setMounted(false);
    clearTimers();
    onAutoDismiss?.();
  };

  useEffect(() => {
    if (!visible) {
      if (mounted) {
        unmount('visible=false');
      }
      return;
    }

    // Prevent double-mount in StrictMode
    if (didInitRef.current) {
      if (DEV_OVERLAY_DEBUG) {
        console.log('[BirdFlurry] StrictMode double-mount blocked');
      }
      return;
    }

    didInitRef.current = true;
    mountTimeRef.current = Date.now();

    if (DEV_OVERLAY_DEBUG) {
      console.log(`[BirdFlurry] Mounting - key: ${flurryKey}, mobile: ${isMobile}, reducedMotion: ${prefersReducedMotion}`);
    }

    setMounted(true);

    // Get origin position
    let originX = window.innerWidth / 2;
    let originY = window.innerHeight / 2;

    if (originElement) {
      const rect = originElement.getBoundingClientRect();
      originX = rect.left + rect.width / 2;
      originY = rect.top + rect.height / 2;
    }

    // Generate particles
    const newParticles: Particle[] = [];

    // Birds
    for (let i = 0; i < BIRD_COUNT; i++) {
      const angle = (Math.PI / 3) + (Math.random() - 0.5) * (Math.PI / 2);
      const distance = isMobile ? 200 + Math.random() * 100 : 280 + Math.random() * 120;
      
      newParticles.push({
        id: `bird-${i}`,
        x: originX + (Math.random() - 0.5) * 24,
        y: originY + (Math.random() - 0.5) * 24,
        delay: prefersReducedMotion ? 0 : i * 100,
        duration: prefersReducedMotion ? 700 : (isMobile ? 1800 : 2200),
        type: 'bird',
        color: i % 2 === 0 ? '#e7f5ff' : '#c8e7ff',
        angle,
        distance,
      });
    }

    // Hearts
    const heartColors = ['#f5e6c4', '#ff8fa3', '#ffd0d8'];
    for (let i = 0; i < HEART_COUNT; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * (Math.PI / 3);
      const distance = isMobile ? 180 + Math.random() * 100 : 220 + Math.random() * 80;
      
      newParticles.push({
        id: `heart-${i}`,
        x: originX + (Math.random() - 0.5) * 24,
        y: originY + (Math.random() - 0.5) * 24,
        delay: prefersReducedMotion ? 0 : 50 + i * (Math.random() * 70 + 50),
        duration: prefersReducedMotion ? 700 : (isMobile ? 1800 : 2200),
        type: 'heart',
        color: heartColors[Math.floor(Math.random() * heartColors.length)],
        angle,
        distance,
      });
    }

    // Text sprites
    const textOptions = ['i love you', 'love you', 'ily'];
    for (let i = 0; i < TEXT_COUNT; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.4;
      const distance = isMobile ? 140 + Math.random() * 60 : 170 + Math.random() * 50;
      
      newParticles.push({
        id: `text-${i}`,
        x: originX + (Math.random() - 0.5) * 24,
        y: originY + (Math.random() - 0.5) * 24,
        delay: prefersReducedMotion ? 0 : 80 + i * (Math.random() * 40 + 80),
        duration: prefersReducedMotion ? 700 : (isMobile ? 1600 : 2000),
        type: 'text',
        content: textOptions[Math.floor(Math.random() * textOptions.length)],
        color: '#f5e6c4',
        angle,
        distance,
      });
    }

    setParticles(newParticles);

    // Set timers
    timersRef.current.primary = setTimeout(() => {
      if (DEV_OVERLAY_DEBUG) {
        console.log(`[BirdFlurry] Primary timer fired at ${TOTAL_DURATION}ms`);
      }
      unmount('primary-timer');
    }, TOTAL_DURATION);

    timersRef.current.failsafe = setTimeout(() => {
      if (DEV_OVERLAY_DEBUG) {
        console.log(`[BirdFlurry] Failsafe triggered at ${FAILSAFE_DELAY}ms`);
      }
      unmount('failsafe');
    }, FAILSAFE_DELAY);

    return () => {
      if (DEV_OVERLAY_DEBUG) {
        console.log('[BirdFlurry] Effect cleanup');
      }
      clearTimers();
      didInitRef.current = false;
    };
  }, [visible, flurryKey]);

  if (!mounted || !visible) {
    return null;
  }

  const renderBird = (particle: Particle) => {
    const endX = particle.x + Math.cos(particle.angle!) * particle.distance!;
    const endY = particle.y + Math.sin(particle.angle!) * particle.distance!;

    return (
      <motion.div
        key={particle.id}
        initial={{
          x: particle.x,
          y: particle.y,
          opacity: 1,
          scale: 0.8,
          rotate: 0,
        }}
        animate={{
          x: endX,
          y: endY,
          opacity: prefersReducedMotion ? [1, 1, 0] : [1, 1, 1, 0],
          scale: prefersReducedMotion ? 1 : [0.8, 1, 0.95],
          rotate: prefersReducedMotion ? 0 : [0, -8, 6],
        }}
        transition={{
          duration: particle.duration / 1000,
          delay: particle.delay / 1000,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="absolute pointer-events-none"
        style={{
          filter: `drop-shadow(0 0 ${prefersReducedMotion ? 0 : 6}px rgba(245, 230, 196, 0.55))`,
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill={particle.color}>
          <path d="M12 2C9 2 7 4 7 6.5c0 1.5.5 2.5 1 3.5-.5.5-1 1.5-1 3 0 2.5 2 4 4 4h2c2 0 4-1.5 4-4 0-1.5-.5-2.5-1-3 .5-1 1-2 1-3.5C17 4 15 2 12 2z" />
          <motion.ellipse
            cx="12"
            cy="14"
            rx="6"
            ry="2"
            opacity="0.7"
            animate={prefersReducedMotion ? {} : {
              scaleY: [1, 0.96, 1.04, 1],
            }}
            transition={{
              duration: 0.24,
              repeat: prefersReducedMotion ? 0 : 3,
              ease: 'easeInOut',
            }}
          />
        </svg>
      </motion.div>
    );
  };

  const renderHeart = (particle: Particle) => {
    const endX = particle.x + Math.cos(particle.angle!) * particle.distance!;
    const endY = particle.y + Math.sin(particle.angle!) * particle.distance!;
    const swayX = prefersReducedMotion ? 0 : Math.sin((particle.x + particle.y) / 100) * 30;

    return (
      <motion.div
        key={particle.id}
        initial={{
          x: particle.x,
          y: particle.y,
          opacity: 1,
          scale: 0.85,
        }}
        animate={{
          x: endX + swayX,
          y: endY,
          opacity: prefersReducedMotion ? [1, 1, 0] : [1, 1, 1, 0],
          scale: prefersReducedMotion ? 1 : [0.85, 1.1, 1.0],
        }}
        transition={{
          duration: particle.duration / 1000,
          delay: particle.delay / 1000,
          ease: 'easeOut',
        }}
        className="absolute pointer-events-none text-2xl"
        style={{
          filter: `drop-shadow(0 0 8px rgba(245, 230, 196, 0.55))`,
          color: particle.color,
        }}
      >
        ❤️
      </motion.div>
    );
  };

  const renderText = (particle: Particle) => {
    const endX = particle.x;
    const endY = particle.y - particle.distance!;
    const swayX = prefersReducedMotion ? 0 : Math.sin((particle.y / 50) * Math.PI) * 40;

    return (
      <motion.div
        key={particle.id}
        initial={{
          x: particle.x,
          y: particle.y,
          opacity: 0.75,
          filter: 'blur(0px)',
        }}
        animate={{
          x: endX + swayX,
          y: endY,
          opacity: prefersReducedMotion ? [0.75, 0.75, 0] : [0.75, 0.75, 0.5, 0],
          filter: prefersReducedMotion ? 'blur(0px)' : ['blur(0px)', 'blur(1px)', 'blur(2px)'],
        }}
        transition={{
          duration: particle.duration / 1000,
          delay: particle.delay / 1000,
          ease: 'easeOut',
        }}
        className="absolute pointer-events-none font-heading text-sm whitespace-nowrap"
        style={{
          color: particle.color,
          filter: `drop-shadow(0 0 8px rgba(245, 230, 196, 0.55))`,
        }}
      >
        {particle.content}
      </motion.div>
    );
  };

  return createPortal(
    <div
      data-portal-overlay="bird-flurry"
      className="fixed inset-0 z-20 pointer-events-none"
      role="presentation"
      aria-hidden="true"
    >
      {particles.map((particle) => {
        if (particle.type === 'bird') return renderBird(particle);
        if (particle.type === 'heart') return renderHeart(particle);
        if (particle.type === 'text') return renderText(particle);
        return null;
      })}
    </div>,
    document.body
  );
}
