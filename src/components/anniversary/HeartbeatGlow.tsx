import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface HeartbeatGlowProps {
  children: ReactNode;
  enabled: boolean;
  intensity?: 'subtle' | 'medium' | 'intense';
  color?: string;
  className?: string;
}

export function HeartbeatGlow({
  children,
  enabled,
  intensity = 'subtle',
  color = '#ff4da6',
  className = '',
}: HeartbeatGlowProps) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const shouldAnimate = enabled && !prefersReducedMotion;

  const glowIntensity = {
    subtle: { min: 0.1, max: 0.25 },
    medium: { min: 0.2, max: 0.45 },
    intense: { min: 0.3, max: 0.6 },
  };

  const { min, max } = glowIntensity[intensity];

  // Heartbeat timing: fast pulse, slight pause, fast pulse, longer pause
  const heartbeatKeyframes = [min, max, min, max * 0.8, min];
  const heartbeatTimes = [0, 0.15, 0.3, 0.45, 1];

  return (
    <div className={`relative ${className}`}>
      {/* Glow layer */}
      {shouldAnimate && (
        <motion.div
          className="absolute inset-0 rounded-inherit pointer-events-none"
          style={{
            borderRadius: 'inherit',
            boxShadow: `0 0 30px ${color}`,
          }}
          animate={{
            opacity: heartbeatKeyframes,
          }}
          transition={{
            duration: 2,
            times: heartbeatTimes,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          aria-hidden="true"
        />
      )}
      {children}
    </div>
  );
}

// Heartbeat border glow for cards/modals
interface HeartbeatBorderProps {
  enabled: boolean;
  intensity?: 'subtle' | 'medium' | 'intense';
  color?: string;
  isActive?: boolean; // For intensified state on letter open
}

export function useHeartbeatStyle({
  enabled,
  intensity = 'subtle',
  color = '#ff4da6',
  isActive = false,
}: HeartbeatBorderProps) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!enabled || prefersReducedMotion) {
    return {
      style: {},
      animate: {},
      transition: {},
    };
  }

  const glowIntensity = {
    subtle: isActive ? 25 : 15,
    medium: isActive ? 40 : 25,
    intense: isActive ? 60 : 40,
  };

  const spread = glowIntensity[intensity];

  return {
    animate: {
      boxShadow: [
        `0 0 ${spread * 0.5}px ${color}40`,
        `0 0 ${spread}px ${color}60`,
        `0 0 ${spread * 0.5}px ${color}40`,
        `0 0 ${spread * 0.8}px ${color}50`,
        `0 0 ${spread * 0.5}px ${color}40`,
      ],
    },
    transition: {
      duration: 2,
      times: [0, 0.15, 0.3, 0.45, 1],
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  };
}
