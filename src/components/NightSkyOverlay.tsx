import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';

// Debug flag - set to true to enable detailed logging
const DEV_OVERLAY_DEBUG = false;

interface NightSkyOverlayProps {
  visible: boolean;
  revealKey?: number; // Forces fresh mount when changed
  onAutoDismiss?: () => void;
}

export function NightSkyOverlay({ visible, revealKey, onAutoDismiss }: NightSkyOverlayProps) {
  const [stars, setStars] = useState<Array<{ x: number; y: number; size: number; delay: number }>>([]);
  const [isMobile, setIsMobile] = useState(false);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Internal mount state - controls actual portal rendering
  const [mounted, setMounted] = useState(false);
  
  // Timer refs
  const teardownTimerRef = useRef<number | null>(null);
  const failsafeTimerRef = useRef<number | null>(null);
  
  // StrictMode guard - prevents double-initialization
  const didInitRef = useRef(false);
  const mountTimeRef = useRef<number>(0);

  const clearTimers = useCallback(() => {
    if (teardownTimerRef.current !== null) {
      clearTimeout(teardownTimerRef.current);
      teardownTimerRef.current = null;
    }
    if (failsafeTimerRef.current !== null) {
      clearTimeout(failsafeTimerRef.current);
      failsafeTimerRef.current = null;
    }
  }, []);

  const unmountOverlay = useCallback((reason: string) => {
    if (DEV_OVERLAY_DEBUG) {
      console.log(`[NightSky] Unmounting - reason: ${reason}, elapsed: ${Date.now() - mountTimeRef.current}ms`);
    }
    setMounted(false);
    document.body.classList.remove('night-sky-active');
    clearTimers();
    onAutoDismiss?.();
  }, [clearTimers, onAutoDismiss]);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => window.innerWidth < 768;
    setIsMobile(checkMobile());
    
    const handleResize = () => setIsMobile(checkMobile());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Generate stars on mobile change
  useEffect(() => {
    const starCount = isMobile ? 28 : 60;
    const newStars = Array.from({ length: starCount }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: isMobile ? Math.random() * 1.5 + 0.5 : Math.random() * 2 + 1,
      delay: Math.random() * 2
    }));
    setStars(newStars);
  }, [isMobile]);

  // Main visibility effect - mount/schedule teardown
  useEffect(() => {
    if (!visible) {
      // Parent says hidden → unmount
      unmountOverlay('parent-hidden');
      didInitRef.current = false;
      return;
    }

    // StrictMode guard - only init once per visible=true cycle
    if (didInitRef.current) {
      if (DEV_OVERLAY_DEBUG) {
        console.log('[NightSky] StrictMode double-mount blocked');
      }
      return;
    }
    didInitRef.current = true;

    // Mount overlay
    mountTimeRef.current = Date.now();
    if (DEV_OVERLAY_DEBUG) {
      console.log(`[NightSky] Mounting - key: ${revealKey}, mobile: ${isMobile}, reducedMotion: ${prefersReducedMotion}`);
    }
    
    setMounted(true);
    document.body.classList.add('night-sky-active');
    clearTimers();

    // Calculate timings based on device and motion preferences
    const total = prefersReducedMotion ? 2000 : (isMobile ? 3200 : 3800);
    
    // Primary teardown timer
    teardownTimerRef.current = window.setTimeout(() => {
      if (DEV_OVERLAY_DEBUG) {
        console.log(`[NightSky] Primary timer fired at ${total}ms`);
      }
      unmountOverlay('timer-complete');
    }, total);

    // Failsafe - guards against throttled timers (mobile/background tabs)
    const failsafeDelay = Math.max(total + 1500, 5000);
    failsafeTimerRef.current = window.setTimeout(() => {
      if (DEV_OVERLAY_DEBUG) {
        console.log(`[NightSky] Failsafe triggered at ${failsafeDelay}ms`);
      }
      unmountOverlay('failsafe');
    }, failsafeDelay);

    return () => {
      if (DEV_OVERLAY_DEBUG) {
        console.log('[NightSky] Effect cleanup');
      }
      clearTimers();
      document.body.classList.remove('night-sky-active');
      didInitRef.current = false;
    };
  }, [visible, revealKey, isMobile, prefersReducedMotion, clearTimers, unmountOverlay]);

  // Cancel handlers - Escape, scroll, visibility, navigation
  useEffect(() => {
    if (!mounted) return;

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (DEV_OVERLAY_DEBUG) {
          console.log('[NightSky] Escape pressed');
        }
        unmountOverlay('escape');
      }
    };

    const handleScroll = () => {
      if (DEV_OVERLAY_DEBUG) {
        console.log('[NightSky] Scroll detected');
      }
      unmountOverlay('scroll');
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (DEV_OVERLAY_DEBUG) {
          console.log('[NightSky] Tab hidden');
        }
        unmountOverlay('visibility-hidden');
      }
    };

    const handleNavigation = () => {
      if (DEV_OVERLAY_DEBUG) {
        console.log('[NightSky] Navigation detected');
      }
      unmountOverlay('navigation');
    };

    window.addEventListener('keydown', handleKeydown);
    window.addEventListener('scroll', handleScroll, { once: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('popstate', handleNavigation);
    window.addEventListener('hashchange', handleNavigation);

    return () => {
      window.removeEventListener('keydown', handleKeydown);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('popstate', handleNavigation);
      window.removeEventListener('hashchange', handleNavigation);
    };
  }, [mounted, unmountOverlay]);

  // Simplified constellation points for "E + H"
  const constellationPoints = isMobile ? [
    // E shape (left) - 4 nodes
    { x: 35, y: 45 },
    { x: 35, y: 55 },
    { x: 40, y: 45 },
    { x: 40, y: 55 },
    
    // + symbol (center) - 1 node
    { x: 50, y: 50 },
    
    // H shape (right) - 4 nodes
    { x: 60, y: 45 },
    { x: 60, y: 55 },
    { x: 65, y: 45 },
    { x: 65, y: 55 },
  ] : [
    // E shape (left) - 4 nodes
    { x: 35, y: 42 },
    { x: 35, y: 50 },
    { x: 35, y: 58 },
    { x: 40, y: 50 },
    
    // + symbol (center) - 1 node
    { x: 50, y: 50 },
    
    // H shape (right) - 4 nodes
    { x: 60, y: 42 },
    { x: 60, y: 50 },
    { x: 60, y: 58 },
    { x: 65, y: 50 },
  ];

  // Lines connecting constellation points
  const constellationLines = isMobile ? [
    // E lines - 3 segments
    { x1: 35, y1: 45, x2: 40, y2: 45 },
    { x1: 35, y1: 55, x2: 40, y2: 55 },
    { x1: 35, y1: 45, x2: 35, y2: 55 },
    
    // + lines - 2 segments
    { x1: 46, y1: 50, x2: 54, y2: 50 },
    { x1: 50, y1: 46, x2: 50, y2: 54 },
    
    // H lines - 3 segments
    { x1: 60, y1: 45, x2: 60, y2: 55 },
    { x1: 65, y1: 45, x2: 65, y2: 55 },
    { x1: 60, y1: 50, x2: 65, y2: 50 },
  ] : [
    // E lines - 4 segments
    { x1: 35, y1: 42, x2: 40, y2: 42 },
    { x1: 35, y1: 50, x2: 40, y2: 50 },
    { x1: 35, y1: 58, x2: 40, y2: 58 },
    { x1: 35, y1: 42, x2: 35, y2: 58 },
    
    // + lines - 2 segments
    { x1: 46, y1: 50, x2: 54, y2: 50 },
    { x1: 50, y1: 46, x2: 50, y2: 54 },
    
    // H lines - 3 segments
    { x1: 60, y1: 42, x2: 60, y2: 58 },
    { x1: 65, y1: 42, x2: 65, y2: 58 },
    { x1: 60, y1: 50, x2: 65, y2: 50 },
  ];

  // Responsive sizing - thicker on mobile (per spec: ≈2.5px stroke, ≈3.5 dot radius)
  const starRadius = isMobile ? 3.5 : 2.5;
  const lineStrokeWidth = isMobile ? 2.5 : 1.5;

  return createPortal(
    <AnimatePresence mode="wait">
      {mounted && (
        <motion.div
          data-portal-overlay="night-sky"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: prefersReducedMotion ? 0.5 : 1 
          }}
          className="fixed inset-0 z-20 pointer-events-none"
          aria-hidden="true"
        >
          {/* Starry background */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a1128] via-[#1a1f3a] to-[#0b0f19]">
            {/* Stars */}
            {!prefersReducedMotion && stars.map((star, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0, 1, 0.5, 1],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 2 + star.delay,
                  repeat: Infinity,
                  delay: star.delay
                }}
                className="absolute rounded-full bg-white"
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, 0.8)`
                }}
              />
            ))}

            {/* Constellation E + H - responsive sizing per spec */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg 
                className={isMobile 
                  ? "w-[min(80vw,340px)] h-[min(40vh,240px)]"
                  : "w-[min(60vw,900px)] h-[min(60vh,600px)]"
                }
                viewBox="0 0 100 100"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Lines */}
                {!prefersReducedMotion && constellationLines.map((line, i) => (
                  <motion.line
                    key={`line-${i}`}
                    className="constellation-line"
                    x1={`${line.x1}%`}
                    y1={`${line.y1}%`}
                    x2={`${line.x2}%`}
                    y2={`${line.y2}%`}
                    stroke="#f5e6c4"
                    strokeWidth={lineStrokeWidth}
                    opacity="0.4"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.4 }}
                    transition={{ duration: 1, delay: 0.3 + i * 0.08 }}
                  />
                ))}

                {/* Points */}
                {constellationPoints.map((point, i) => (
                  <motion.circle
                    key={`point-${i}`}
                    className="constellation-dot"
                    cx={`${point.x}%`}
                    cy={`${point.y}%`}
                    r={starRadius}
                    fill="#f5e6c4"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: prefersReducedMotion ? 1 : [0, 1, 1, 0.8, 1],
                      scale: prefersReducedMotion ? 1 : [0, 1, 1.2, 1, 1.2, 1]
                    }}
                    transition={{
                      duration: prefersReducedMotion ? 0.3 : 1.5,
                      delay: prefersReducedMotion ? 0 : 0.2 + i * 0.04,
                      repeat: prefersReducedMotion ? 0 : Infinity,
                      repeatDelay: 1
                    }}
                    style={{
                      filter: 'drop-shadow(0 0 4px rgba(245, 230, 196, 0.8))'
                    }}
                  />
                ))}
              </svg>
            </div>

            {/* Reduced motion fallback - static image (≤2s per spec) */}
            {prefersReducedMotion && (
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-4xl sm:text-6xl md:text-8xl font-heading text-gold text-center"
                  style={{
                    textShadow: '0 0 20px rgba(245, 230, 196, 0.8)',
                    maxWidth: '70vw'
                  }}
                >
                  E + H ✨
                </motion.div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

// Dev helper for checking overlay state (remove before production)
if (DEV_OVERLAY_DEBUG && typeof window !== 'undefined') {
  (window as any).__checkOverlay = () => {
    const overlays = document.querySelectorAll('[data-portal-overlay]').length;
    const bodyClass = document.body.classList.contains('night-sky-active');
    console.log('Overlay check:', { overlays, bodyClass });
    return { overlays, bodyClass };
  };
}
