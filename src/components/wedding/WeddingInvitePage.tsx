import { useRef, useState, useEffect } from 'react';
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  type MotionValue,
} from 'framer-motion';

// ─── Palette ──────────────────────────────────────────────────────────────────
const C = {
  ivory:     '#FAF3E8',
  cream:     '#FFF9F0',
  emerald:   '#123D32',
  emerald2:  '#2F5D50',
  forest:    '#083A09',
  sage:      '#9AAE9A',
  gold:      '#C7A45A',
  champagne: '#E8D7AA',
  blush:     '#E7C7BD',
  sand:      '#D8B98C',
  ocean:     '#7EA8A9',
  peach:     '#E8A77C',
} as const;

const PLAYFAIR = 'var(--font-family-playfair)';
const POPPINS  = 'var(--font-family-poppins)';

// ─── Fixed seed data (no Math.random during render) ───────────────────────────
const PARTICLES_GOLD = [
  { x: '11%', y: '18%', s: 4,   dur: 6.5, delay: 0.0 },
  { x: '24%', y: '62%', s: 3,   dur: 7.3, delay: 1.2 },
  { x: '73%', y: '33%', s: 4,   dur: 5.9, delay: 0.6 },
  { x: '84%', y: '72%', s: 3,   dur: 8.0, delay: 2.1 },
  { x: '46%', y: '82%', s: 3.5, dur: 6.8, delay: 0.9 },
  { x: '61%', y: '14%', s: 3,   dur: 7.6, delay: 1.5 },
  { x: '34%', y: '47%', s: 4,   dur: 6.2, delay: 0.3 },
  { x: '89%', y: '27%', s: 3,   dur: 7.9, delay: 1.8 },
];
const PARTICLES_GREEN = [
  { x: '9%',  y: '31%', s: 3,   dur: 7.0, delay: 0.4 },
  { x: '21%', y: '76%', s: 4,   dur: 6.4, delay: 1.0 },
  { x: '67%', y: '22%', s: 3.5, dur: 8.1, delay: 0.7 },
  { x: '81%', y: '58%', s: 3,   dur: 6.7, delay: 1.6 },
  { x: '41%', y: '86%', s: 4,   dur: 5.8, delay: 0.2 },
  { x: '56%', y: '41%', s: 3,   dur: 7.4, delay: 2.2 },
  { x: '16%', y: '54%', s: 3.5, dur: 6.9, delay: 0.8 },
  { x: '93%', y: '44%', s: 3,   dur: 7.7, delay: 1.3 },
];
const PETALS_DATA = [
  { x: '7%',  y: '22%', w: 14, h: 9,  col: '#E7C7BD' },
  { x: '21%', y: '63%', w: 12, h: 7,  col: '#E8D7AA' },
  { x: '79%', y: '17%', w: 10, h: 6,  col: '#9AAE9A' },
  { x: '87%', y: '54%', w: 13, h: 8,  col: '#E7C7BD' },
  { x: '51%', y: '79%', w: 11, h: 7,  col: '#E8D7AA' },
  { x: '64%', y: '39%', w: 10, h: 6,  col: '#9AAE9A' },
];
const DUAS_PARTICLES = [
  { x: '18%', y: '65%', s: 3.5, offset:   0 },
  { x: '28%', y: '42%', s: 2.5, offset:  -8 },
  { x: '38%', y: '73%', s: 3.0, offset:   4 },
  { x: '48%', y: '55%', s: 2.5, offset: -12 },
  { x: '58%', y: '38%', s: 3.5, offset:   6 },
  { x: '68%', y: '68%', s: 2.5, offset:  -4 },
  { x: '75%', y: '50%', s: 3.0, offset:   8 },
  { x: '82%', y: '35%', s: 2.5, offset: -16 },
  { x: '52%', y: '80%', s: 4.0, offset:   2 },
  { x: '42%', y: '25%', s: 3.0, offset:  -6 },
];

// ─── FadeUp ────────────────────────────────────────────────────────────────────
function FadeUp({
  children, delay = 0, className = '', style,
}: {
  children: React.ReactNode; delay?: number; className?: string; style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay }}
      className={className} style={style}>
      {children}
    </motion.div>
  );
}

// ─── OrnDivider ───────────────────────────────────────────────────────────────
function OrnDivider({ className = '', style, forest = false }: {
  className?: string; style?: React.CSSProperties; forest?: boolean;
}) {
  const lineCol = forest ? C.forest : C.champagne;
  const dotCol  = forest ? C.forest : C.gold;
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} style={style}>
      <div style={{ width: 52, height: 1, background: lineCol, opacity: forest ? 0.4 : 1 }} />
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
        <circle cx="5" cy="5" r="2.2" fill={dotCol} opacity={forest ? 0.55 : 0.7} />
        <line x1="5" y1="0" x2="5" y2="2.5"   stroke={dotCol} strokeWidth="0.7" opacity="0.4" />
        <line x1="5" y1="7.5" x2="5" y2="10"  stroke={dotCol} strokeWidth="0.7" opacity="0.4" />
        <line x1="0" y1="5" x2="2.5" y2="5"   stroke={dotCol} strokeWidth="0.7" opacity="0.4" />
        <line x1="7.5" y1="5" x2="10" y2="5"  stroke={dotCol} strokeWidth="0.7" opacity="0.4" />
      </svg>
      <div style={{ width: 52, height: 1, background: lineCol, opacity: forest ? 0.4 : 1 }} />
    </div>
  );
}

// ─── FadeFrom ─────────────────────────────────────────────────────────────────
function FadeFrom({
  children, direction = 'up', delay = 0, style,
}: {
  children: React.ReactNode; direction?: 'up' | 'left' | 'right';
  delay?: number; style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const reduced = useReducedMotion();
  const ix = reduced ? 0 : direction === 'left' ? -26 : direction === 'right' ? 26 : 0;
  const iy = reduced ? 0 : direction === 'up' ? 28 : 0;
  return (
    <motion.div ref={ref}
      initial={{ opacity: reduced ? 1 : 0, x: ix, y: iy }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: reduced ? 0 : delay }}
      style={style}>
      {children}
    </motion.div>
  );
}

// ─── StaggerItem ──────────────────────────────────────────────────────────────
function StaggerItem({ children, index }: { children: React.ReactNode; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20px' });
  const reduced = useReducedMotion();
  return (
    <motion.div ref={ref}
      initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 14 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: reduced ? 0 : index * 0.055 }}>
      {children}
    </motion.div>
  );
}

// ─── InvitationCardShell ──────────────────────────────────────────────────────
function InvitationCardShell({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  const corners: Array<{ cs: React.CSSProperties; d: string }> = [
    { cs: { top: 0, left: 0 },    d: 'M 2,22 L 2,5 Q 2,2 5,2 L 22,2' },
    { cs: { top: 0, right: 0 },   d: 'M 22,2 L 39,2 Q 42,2 42,5 L 42,22' },
    { cs: { bottom: 0, left: 0 }, d: 'M 2,22 L 2,39 Q 2,42 5,42 L 22,42' },
    { cs: { bottom: 0, right: 0}, d: 'M 22,42 L 39,42 Q 42,42 42,39 L 42,22' },
  ];
  return (
    <motion.div
      initial={reduced ? undefined : { opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      style={{
        position: 'relative',
        background: 'rgba(255,249,240,0.96)',
        border: `1px solid ${C.champagne}`,
        borderRadius: 24,
        padding: 'clamp(2rem,5vw,3rem) clamp(1.75rem,5vw,2.75rem)',
        maxWidth: 560, width: '100%',
        boxShadow: '0 8px 60px rgba(199,164,90,0.12), 0 2px 16px rgba(8,58,9,0.04), inset 0 0 0 1px rgba(255,255,255,0.6)',
        overflow: 'hidden', zIndex: 10,
      }}>
      {corners.map(({ cs, d }, i) => (
        <svg key={i} aria-hidden="true" width="44" height="44" viewBox="0 0 44 44" fill="none"
          style={{ position: 'absolute', pointerEvents: 'none', ...cs }}>
          <path d={d} stroke={C.forest} strokeWidth="1.3" opacity="0.32" />
          <circle
            cx={cs.left !== undefined ? 2 : 42}
            cy={cs.top  !== undefined ? 2 : 42}
            r="2.5" fill={C.gold} opacity="0.45" />
        </svg>
      ))}
      {/* Arch watermark inside card */}
      <svg aria-hidden="true"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        viewBox="0 0 400 500" preserveAspectRatio="xMidYMid meet">
        <path d="M 70,490 L 70,250 Q 70,60 200,38 Q 330,60 330,250 L 330,490"
          fill="none" stroke={C.gold} strokeWidth="1.5" opacity="0.045" />
        <path d="M 95,490 L 95,265 Q 95,92 200,72 Q 305,92 305,265 L 305,490"
          fill="none" stroke={C.forest} strokeWidth="0.8" opacity="0.035" />
      </svg>
      {children}
    </motion.div>
  );
}

// ─── AnimatedSunLine ──────────────────────────────────────────────────────────
function AnimatedSunLine({ progress }: { progress?: MotionValue<number> }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const fallback = useMotionValue(0);
  const src = progress ?? fallback;
  const rotate = useTransform(src, [0, 1], [0, 20]);

  return (
    <div ref={ref} aria-hidden="true"
      style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
      <motion.svg width="46" height="46" viewBox="0 0 46 46" fill="none"
        style={reduced ? undefined : { rotate }}>
        <motion.circle cx="23" cy="23" r="7.5" stroke={C.gold} strokeWidth="1.2"
          initial={reduced ? undefined : { opacity: 0, scale: 0.4 }}
          animate={inView ? { opacity: 0.65, scale: 1 } : (reduced ? { opacity: 0.65 } : {})}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ transformOrigin: '23px 23px' }} />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <motion.line key={angle}
            x1="23" y1="9.5" x2="23" y2="6"
            stroke={i % 2 === 0 ? C.gold : C.peach} strokeWidth="1.1" strokeLinecap="round"
            transform={`rotate(${angle} 23 23)`}
            initial={reduced ? undefined : { opacity: 0 }}
            animate={inView ? { opacity: 0.4 } : (reduced ? { opacity: 0.4 } : {})}
            transition={{ duration: 0.45, delay: reduced ? 0 : 0.45 + i * 0.04 }} />
        ))}
      </motion.svg>
    </div>
  );
}

// ─── BotanicalTL ──────────────────────────────────────────────────────────────
function BotanicalTL() {
  return (
    <svg aria-hidden="true"
      style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', userSelect: 'none' }}
      width="210" height="210" viewBox="0 0 210 210" xmlns="http://www.w3.org/2000/svg">
      <path d="M 8,8 Q 48,58 80,116 Q 98,152 100,196"
        fill="none" stroke={C.forest} strokeWidth="1.2" opacity="0.28" />
      <path d="M 8,8 Q 48,58 80,116 Q 98,152 100,196"
        fill="none" stroke={C.gold} strokeWidth="0.8" opacity="0.2" strokeDasharray="5 7" />
      <path d="M 26,40 Q 62,20 70,50 Q 44,62 26,40 Z" fill={C.sage} opacity="0.28" />
      <path d="M 48,74 Q 82,52 88,82 Q 62,92 48,74 Z" fill={C.gold} opacity="0.18" />
      <path d="M 68,110 Q 102,89 106,118 Q 80,128 68,110 Z" fill={C.sage} opacity="0.26" />
      <path d="M 82,144 Q 116,124 118,154 Q 92,162 82,144 Z" fill={C.champagne} opacity="0.35" />
      <circle cx="30" cy="36" r="3"   fill={C.gold}   opacity="0.32" />
      <circle cx="57" cy="68" r="2.5" fill={C.blush}  opacity="0.42" />
      <circle cx="78" cy="105" r="2"  fill={C.forest} opacity="0.28" />
    </svg>
  );
}

// ─── BotanicalBR ──────────────────────────────────────────────────────────────
function BotanicalBR() {
  return (
    <svg aria-hidden="true"
      style={{ position: 'absolute', bottom: 0, right: 0, pointerEvents: 'none', userSelect: 'none', transform: 'rotate(180deg)' }}
      width="210" height="210" viewBox="0 0 210 210" xmlns="http://www.w3.org/2000/svg">
      <path d="M 8,8 Q 48,58 80,116 Q 98,152 100,196"
        fill="none" stroke={C.forest} strokeWidth="1.2" opacity="0.28" />
      <path d="M 8,8 Q 48,58 80,116 Q 98,152 100,196"
        fill="none" stroke={C.gold} strokeWidth="0.8" opacity="0.2" strokeDasharray="5 7" />
      <path d="M 26,40 Q 62,20 70,50 Q 44,62 26,40 Z" fill={C.sage} opacity="0.28" />
      <path d="M 48,74 Q 82,52 88,82 Q 62,92 48,74 Z" fill={C.gold} opacity="0.18" />
      <path d="M 68,110 Q 102,89 106,118 Q 80,128 68,110 Z" fill={C.sage} opacity="0.26" />
      <path d="M 82,144 Q 116,124 118,154 Q 92,162 82,144 Z" fill={C.champagne} opacity="0.35" />
      <circle cx="30" cy="36" r="3"   fill={C.gold}   opacity="0.32" />
      <circle cx="57" cy="68" r="2.5" fill={C.blush}  opacity="0.42" />
      <circle cx="78" cy="105" r="2"  fill={C.forest} opacity="0.28" />
    </svg>
  );
}

// ─── IslamicPattern ───────────────────────────────────────────────────────────
function IslamicPattern({ opacity }: { opacity?: MotionValue<number> }) {
  return (
    <motion.svg aria-hidden="true"
      style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        pointerEvents: 'none', userSelect: 'none',
        opacity: opacity ?? 0.065,
      } as React.CSSProperties}
      xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="islamic-geo" x="0" y="0" width="56" height="56" patternUnits="userSpaceOnUse">
          <g fill="none" stroke={C.gold} strokeWidth="0.7">
            <polygon points="28,4 32,16 44,12 36,22 48,28 36,34 44,44 32,40 28,52 24,40 12,44 20,34 8,28 20,22 12,12 24,16" />
            <rect x="18" y="18" width="20" height="20" transform="rotate(45,28,28)" />
            <circle cx="28" cy="28" r="7" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#islamic-geo)" />
    </motion.svg>
  );
}

// ─── SacredWindow — centered arch + kaabah composition ───────────────────────
function SacredWindow({
  archScale,
  archOpacity,
  glowScale,
  glowOpacity,
}: {
  archScale?:   MotionValue<number>;
  archOpacity?: MotionValue<number>;
  glowScale?:   MotionValue<number>;
  glowOpacity?: MotionValue<number>;
}) {
  const reduced = useReducedMotion();
  return (
    <>
      {/* Gold radial glow */}
      <motion.div aria-hidden="true"
        style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: 'clamp(320px,65vw,640px)', height: 'clamp(320px,65vw,640px)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(199,164,90,0.13) 0%, rgba(199,164,90,0.05) 45%, transparent 70%)',
          pointerEvents: 'none', zIndex: 0,
          scale: (reduced ? 1 : glowScale) as MotionValue<number> | number,
          opacity: (reduced ? 0.13 : glowOpacity) as MotionValue<number> | number,
        } as React.CSSProperties} />

      {/* Arch + Kaabah SVG */}
      <motion.div aria-hidden="true"
        style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none', zIndex: 1,
          scale: (reduced ? 1 : archScale) as MotionValue<number> | number,
          opacity: (reduced ? 0.14 : archOpacity) as MotionValue<number> | number,
        } as React.CSSProperties}>
        <svg viewBox="0 0 500 620" preserveAspectRatio="xMidYMid meet"
          style={{ width: 'clamp(280px,82vw,520px)', height: 'auto' }}
          fill="none" xmlns="http://www.w3.org/2000/svg">

          {/* Outer arch */}
          <path d="M 68,610 L 68,295 Q 68,58 250,36 Q 432,58 432,295 L 432,610"
            stroke={C.gold} strokeWidth="2" />
          {/* Inner arch */}
          <path d="M 105,610 L 105,308 Q 105,104 250,84 Q 395,104 395,308 L 395,610"
            stroke={C.forest} strokeWidth="1.3" opacity="0.75" />
          {/* Third arch */}
          <path d="M 148,610 L 148,326 Q 148,162 250,144 Q 352,162 352,326 L 352,610"
            stroke={C.champagne} strokeWidth="1" opacity="0.55" />

          {/* Horizontal arch detail lines */}
          <path d="M 68,210 Q 159,168 250,152 Q 341,168 432,210"
            stroke={C.forest} strokeWidth="0.9" opacity="0.4" />
          <path d="M 105,270 Q 178,240 250,228 Q 322,240 395,270"
            stroke={C.gold} strokeWidth="0.8" opacity="0.35" />

          {/* Kaabah silhouette */}
          <g opacity="0.75">
            <rect x="186" y="368" width="128" height="106" rx="2"
              stroke={C.emerald} strokeWidth="1.6" />
            {/* Gold kiswa band */}
            <rect x="186" y="386" width="128" height="15" fill={C.champagne} opacity="0.35" />
            <line x1="186" y1="386" x2="314" y2="386" stroke={C.gold} strokeWidth="1.2" />
            <line x1="186" y1="401" x2="314" y2="401" stroke={C.gold} strokeWidth="1.2" />
            {/* Door */}
            <rect x="220" y="426" width="60" height="48" rx="3"
              stroke={C.gold} strokeWidth="1.4" />
            <path d="M 220,426 Q 250,413 280,426"
              fill="none" stroke={C.gold} strokeWidth="1" opacity="0.7" />
            {/* Minarets */}
            <rect x="162" y="312" width="16" height="162" rx="2"
              stroke={C.forest} strokeWidth="1.2" opacity="0.75" />
            <path d="M 162,312 Q 170,298 178,312 Z" fill={C.champagne} opacity="0.5" />
            <rect x="322" y="312" width="16" height="162" rx="2"
              stroke={C.forest} strokeWidth="1.2" opacity="0.75" />
            <path d="M 322,312 Q 330,298 338,312 Z" fill={C.champagne} opacity="0.5" />
          </g>

          {/* Crescent at apex */}
          <path d="M 250,22 A 16,16 0 1 1 268,35 A 11,11 0 1 0 250,22 Z"
            fill={C.gold} opacity="0.75" />
          <circle cx="274" cy="17" r="3.5" fill={C.gold} opacity="0.6" />

          {/* Keyhole ornament at arch keystone */}
          <g transform="translate(250,84)" opacity="0.52">
            {[0,30,60,90,120,150].map(a => (
              <line key={a} x1="0" y1="-12" x2="0" y2="12"
                stroke={C.gold} strokeWidth="1" transform={`rotate(${a})`} />
            ))}
            <circle cx="0" cy="0" r="7" fill="none" stroke={C.gold} strokeWidth="1" />
            <circle cx="0" cy="0" r="2.8" fill={C.gold} opacity="0.8" />
          </g>
        </svg>
      </motion.div>
    </>
  );
}

// ─── ScrollDuasParticles ──────────────────────────────────────────────────────
function ScrollDuasParticles({ progress }: { progress: MotionValue<number> }) {
  const reduced = useReducedMotion();
  // 10 individual transforms — no conditional hooks
  const y0 = useTransform(progress, [0, 1], [50 + DUAS_PARTICLES[0].offset, -120 + DUAS_PARTICLES[0].offset]);
  const y1 = useTransform(progress, [0, 1], [50 + DUAS_PARTICLES[1].offset, -120 + DUAS_PARTICLES[1].offset]);
  const y2 = useTransform(progress, [0, 1], [50 + DUAS_PARTICLES[2].offset, -120 + DUAS_PARTICLES[2].offset]);
  const y3 = useTransform(progress, [0, 1], [50 + DUAS_PARTICLES[3].offset, -120 + DUAS_PARTICLES[3].offset]);
  const y4 = useTransform(progress, [0, 1], [50 + DUAS_PARTICLES[4].offset, -120 + DUAS_PARTICLES[4].offset]);
  const y5 = useTransform(progress, [0, 1], [50 + DUAS_PARTICLES[5].offset, -120 + DUAS_PARTICLES[5].offset]);
  const y6 = useTransform(progress, [0, 1], [50 + DUAS_PARTICLES[6].offset, -120 + DUAS_PARTICLES[6].offset]);
  const y7 = useTransform(progress, [0, 1], [50 + DUAS_PARTICLES[7].offset, -120 + DUAS_PARTICLES[7].offset]);
  const y8 = useTransform(progress, [0, 1], [50 + DUAS_PARTICLES[8].offset, -120 + DUAS_PARTICLES[8].offset]);
  const y9 = useTransform(progress, [0, 1], [50 + DUAS_PARTICLES[9].offset, -120 + DUAS_PARTICLES[9].offset]);
  const yVals = [y0,y1,y2,y3,y4,y5,y6,y7,y8,y9];
  const baseOpacity = useTransform(progress, [0, 0.25, 0.8, 1], [0, 0.35, 0.25, 0]);

  if (reduced) return null;
  return (
    <div aria-hidden="true"
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 2 }}>
      {DUAS_PARTICLES.map((p, i) => (
        <motion.span key={i}
          style={{
            position: 'absolute', left: p.x, top: p.y,
            width: p.s, height: p.s,
            borderRadius: 999,
            background: i % 3 === 0 ? C.forest : i % 3 === 1 ? C.gold : C.sage,
            y: yVals[i],
            opacity: baseOpacity,
          }} />
      ))}
    </div>
  );
}

// ─── AnimatedArchGlow ─────────────────────────────────────────────────────────
function AnimatedArchGlow({ variant = 'gold' }: { variant?: 'gold' | 'green' }) {
  const reduced = useReducedMotion();
  const stroke = variant === 'gold' ? C.gold : C.emerald2;
  const glowBg = variant === 'gold'
    ? 'radial-gradient(ellipse at 50% 30%, rgba(199,164,90,0.09), transparent 65%)'
    : 'radial-gradient(ellipse at 50% 30%, rgba(8,58,9,0.06), transparent 65%)';
  const outer = 'M 90,575 L 90,290 Q 90,70 250,44 Q 410,70 410,290 L 410,575';
  const inner = 'M 125,575 L 125,305 Q 125,115 250,92 Q 375,115 375,305 L 375,575';
  return (
    <>
      <div aria-hidden="true"
        style={{ position: 'absolute', inset: 0, background: glowBg, pointerEvents: 'none' }} />
      <svg aria-hidden="true"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', userSelect: 'none' }}
        viewBox="0 0 500 580" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
        {reduced ? (
          <>
            <path d={outer} fill="none" stroke={stroke} strokeWidth="1.5" opacity="0.11" />
            <path d={inner} fill="none" stroke={C.forest} strokeWidth="0.8" opacity="0.08" />
          </>
        ) : (
          <>
            <motion.path d={outer} fill="none" stroke={stroke} strokeWidth="1.5"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.14 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 2.2, ease: 'easeOut' }} />
            <motion.path d={inner} fill="none" stroke={C.forest} strokeWidth="0.9"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 2.6, ease: 'easeOut', delay: 0.35 }} />
          </>
        )}
        <g opacity="0.1" transform="translate(250,44)">
          {[0,30,60,90,120,150].map(a => (
            <line key={a} x1="0" y1="-11" x2="0" y2="11"
              stroke={stroke} strokeWidth="0.8" transform={`rotate(${a})`} />
          ))}
          <circle cx="0" cy="0" r="6" fill="none" stroke={stroke} strokeWidth="0.8" />
          <circle cx="0" cy="0" r="2.5" fill={stroke} opacity="0.6" />
        </g>
      </svg>
    </>
  );
}

// ─── FloatingParticles ────────────────────────────────────────────────────────
function FloatingParticles({ tone = 'gold' }: { tone?: 'gold' | 'green' }) {
  const reduced = useReducedMotion();
  const particles = tone === 'gold' ? PARTICLES_GOLD : PARTICLES_GREEN;
  const baseColor = tone === 'gold' ? C.gold : C.sage;
  if (reduced) return null;
  return (
    <div aria-hidden="true"
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
      {particles.map((p, i) => (
        <motion.span key={i} aria-hidden="true"
          animate={{ y: [0, -14, 0], opacity: [0.1, 0.26, 0.1] }}
          transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
          style={{
            position: 'absolute', left: p.x, top: p.y,
            width: p.s, height: p.s, borderRadius: 999,
            background: i % 5 === 0 ? C.forest : baseColor,
          }} />
      ))}
    </div>
  );
}

// ─── ScrollWaveBand ───────────────────────────────────────────────────────────
function ScrollWaveBand({ progress }: { progress: MotionValue<number> }) {
  const reduced = useReducedMotion();
  const waveX  = useTransform(progress, [0, 1], [0, -48]);
  const waveY  = useTransform(progress, [0, 1], [26, -18]);
  const waveOp = useTransform(progress, [0, 0.35, 1], [0.12, 0.35, 0.28]);
  const w1 = 'M0,55 C360,88 720,22 1080,55 C1260,72 1380,48 1440,55 L1440,120 L0,120 Z';
  const w2 = 'M0,75 C240,98 480,52 720,75 C960,98 1200,58 1440,75 L1440,120 L0,120 Z';
  const w3 = 'M0,92 C360,108 720,76 1080,92 C1260,100 1380,86 1440,92 L1440,120 L0,120 Z';
  return (
    <div aria-hidden="true"
      style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, pointerEvents: 'none', overflow: 'hidden', zIndex: 1 }}>
      <motion.svg viewBox="0 0 1440 120" preserveAspectRatio="none"
        style={{
          width: '100%', height: '100%', display: 'block',
          ...(reduced ? { opacity: 0.22 } : { x: waveX, y: waveY, opacity: waveOp }),
        } as React.CSSProperties}
        xmlns="http://www.w3.org/2000/svg">
        <path d={w1} fill={C.ocean}     opacity="0.72" />
        <path d={w2} fill={C.champagne} opacity="0.82" />
        <path d={w3} fill={C.peach}     opacity="0.58" />
      </motion.svg>
    </div>
  );
}

// ─── ScrollFloatingPetals ─────────────────────────────────────────────────────
function ScrollFloatingPetals({
  petalX, petalY, petalRotate,
}: { petalX: MotionValue<number>; petalY: MotionValue<number>; petalRotate?: MotionValue<number> }) {
  const reduced = useReducedMotion();
  if (reduced) return null;
  return (
    <div aria-hidden="true"
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
      {PETALS_DATA.map((p, i) => (
        <motion.span key={i} aria-hidden="true"
          style={{
            position: 'absolute', left: p.x, top: p.y,
            width: p.w, height: p.h,
            borderRadius: '60% 40% 60% 40%',
            background: p.col,
            opacity: 0.18,
            x: petalX,
            y: petalY,
            rotate: petalRotate ?? (i * 18),
          }} />
      ))}
    </div>
  );
}

// ─── SunsetOrb ────────────────────────────────────────────────────────────────
function SunsetOrb({
  scale, opacity,
}: { scale?: MotionValue<number>; opacity?: MotionValue<number> }) {
  return (
    <motion.div aria-hidden="true"
      style={{
        position: 'absolute', top: '3.5rem', right: '7%',
        width: 'clamp(150px,22vw,270px)', height: 'clamp(150px,22vw,270px)',
        borderRadius: 999,
        background: 'radial-gradient(circle, rgba(232,167,124,0.2), rgba(199,164,90,0.09), transparent 68%)',
        filter: 'blur(3px)', pointerEvents: 'none', zIndex: 1,
        scale:   (scale   ?? 1)    as MotionValue<number> | number,
        opacity: (opacity ?? 0.18) as MotionValue<number> | number,
      } as React.CSSProperties} />
  );
}

// ─── WaveDivider ──────────────────────────────────────────────────────────────
function WaveDivider() {
  return (
    <div style={{ lineHeight: 0, marginBottom: '-2px' }}>
      <svg viewBox="0 0 1440 72" preserveAspectRatio="none"
        style={{ display: 'block', width: '100%', height: 72 }}
        xmlns="http://www.w3.org/2000/svg">
        <path d="M0,36 C240,72 480,4 720,36 C960,68 1200,8 1440,36 L1440,0 L0,0 Z" fill={C.ivory} />
      </svg>
    </div>
  );
}

// ─── Icons (thin line) ────────────────────────────────────────────────────────
const CameraIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);
const CrescentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);
const CutleryIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" />
    <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" />
  </svg>
);
const WaveIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
    <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
    <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
  </svg>
);

// ─── MomentCard ───────────────────────────────────────────────────────────────
function MomentCard({ icon, title, desc, iconColor = C.gold }: {
  icon: React.ReactNode; title: string; desc: string; iconColor?: string;
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 14,
      padding: '18px 20px', borderRadius: 16,
      background: C.cream,
      border: `1px solid rgba(232,215,170,0.5)`,
      boxShadow: `0 2px 12px rgba(199,164,90,0.07)`,
    }}>
      <div style={{ color: iconColor, flexShrink: 0, marginTop: 2 }}>{icon}</div>
      <div>
        <p style={{ fontFamily: POPPINS, fontWeight: 600, fontSize: 13, color: C.emerald, marginBottom: 3 }}>{title}</p>
        <p style={{ fontFamily: POPPINS, fontSize: 12, color: C.emerald2, lineHeight: 1.6 }}>{desc}</p>
      </div>
    </div>
  );
}

// ─── CeremonyLineMakkah — scroll-reactive connector between Sacred Moments ────
// Desktop: horizontal line + dots at card centers
// Mobile: vertical thread on the left + circular dot badges per card
function CeremonyLineMakkah({ scale }: { scale: MotionValue<number> }) {
  const reduced = useReducedMotion();
  if (reduced) return null;
  const hDots = ['16.7%', '50%', '83.3%'] as const;
  const vDots = ['14%', '50%', '86%'] as const;
  return (
    <div aria-hidden="true"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>

      {/* ── DESKTOP: horizontal line (hidden on mobile via CSS) ── */}
      <motion.div className="ceremony-line-h"
        style={{
          position: 'absolute', top: 44, left: '8%', right: '8%', height: 1,
          background: `linear-gradient(90deg, transparent 0%, ${C.champagne} 18%, ${C.gold} 50%, ${C.champagne} 82%, transparent 100%)`,
          transformOrigin: 'left center',
          scaleX: scale,
          opacity: 0.55,
        }} />
      {hDots.map((left, i) => (
        <motion.div key={`h${i}`} className="ceremony-dot-h"
          style={{
            position: 'absolute', top: 38, left,
            width: i === 1 ? 7 : 5, height: i === 1 ? 7 : 5,
            borderRadius: '50%',
            background: i === 1 ? C.gold : C.champagne,
            transform: 'translateX(-50%)',
            opacity: scale,
            boxShadow: i === 1 ? `0 0 8px ${C.gold}66` : 'none',
          }} />
      ))}

      {/* ── MOBILE: vertical thread (hidden on desktop via CSS) ── */}
      <motion.div className="ceremony-line-v"
        style={{
          position: 'absolute', top: 12, bottom: 12, left: 20, width: 1.5,
          background: `linear-gradient(180deg, transparent 0%, ${C.gold} 20%, ${C.forest} 55%, ${C.champagne} 88%, transparent 100%)`,
          transformOrigin: 'top center',
          scaleY: scale,
          opacity: 0.7,
        }} />
      {vDots.map((top, i) => (
        <motion.div key={`v${i}`} className="ceremony-dot-v"
          style={{
            position: 'absolute', top, left: 14,
            width: 13, height: 13, borderRadius: '50%',
            background: C.ivory,
            border: `1.5px solid ${i === 1 ? C.gold : C.champagne}`,
            opacity: scale,
            boxShadow: i === 1 ? `0 0 6px ${C.gold}44` : 'none',
          }}>
          <span style={{
            width: 5, height: 5, borderRadius: '50%',
            background: i === 1 ? C.gold : C.forest,
            opacity: 0.9,
          }} />
        </motion.div>
      ))}
    </div>
  );
}

// ─── RingRipple — subtle oval ripples behind Jeddah date card ─────────────────
function RingRipple({
  rippleScale, rippleOpacity,
}: { rippleScale: MotionValue<number>; rippleOpacity: MotionValue<number> }) {
  const reduced = useReducedMotion();
  return (
    <motion.div aria-hidden="true"
      style={{
        position: 'absolute',
        top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 'clamp(290px, 92vw, 440px)', height: 'clamp(170px, 54vw, 270px)',
        pointerEvents: 'none', zIndex: 0,
        scale: (reduced ? 1 : rippleScale) as MotionValue<number> | number,
        opacity: (reduced ? 0.10 : rippleOpacity) as MotionValue<number> | number,
      } as React.CSSProperties}>
      <svg viewBox="0 0 440 270" width="100%" height="100%" fill="none">
        <ellipse cx="220" cy="135" rx="200" ry="118" stroke={C.gold}  strokeWidth="1.5" opacity="1.0" />
        <ellipse cx="220" cy="135" rx="156" ry="90"  stroke={C.ocean} strokeWidth="1.2" opacity="0.85" />
        <ellipse cx="220" cy="135" rx="110" ry="62"  stroke={C.peach} strokeWidth="0.9" opacity="0.70" />
      </svg>
    </motion.div>
  );
}

// ─── FloatingNav — journey tracker ────────────────────────────────────────────
function FloatingNav() {
  const [visible, setVisible] = useState(false);
  const [active, setActive]   = useState('beginning');
  const [pct, setPct]         = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 100);
      const ids = ['beginning','hearts','nikaah','journey','jeddah'];
      for (const id of [...ids].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 220) { setActive(id); break; }
      }
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setPct(docH > 0 ? window.scrollY / docH : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { id: 'beginning', label: 'Beginning', short: 'Start'  },
    { id: 'hearts',    label: 'Hearts',    short: 'Hearts' },
    { id: 'nikaah',    label: 'Nikaah',    short: 'Nikaah' },
    { id: 'journey',   label: 'Journey',   short: 'Path'   },
    { id: 'jeddah',    label: 'Jeddah',    short: 'Sea'    },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -16 }}
      transition={{ duration: 0.35 }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        display: 'flex', justifyContent: 'center', padding: '10px 16px',
        pointerEvents: visible ? 'auto' : 'none',
      }}>
      <div className="nav-pill" style={{
        position: 'relative',
        display: 'flex', alignItems: 'center',
        padding: '5px 12px', borderRadius: 999,
        background: 'rgba(255,249,240,0.82)', backdropFilter: 'blur(16px)',
        border: `1px solid rgba(232,215,170,0.55)`,
        boxShadow: `0 2px 16px rgba(199,164,90,0.10)`,
        overflow: 'hidden', gap: 0,
      }}>
        {/* Progress fill at bottom */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, height: 1.5,
          width: `${pct * 100}%`,
          background: `linear-gradient(90deg, ${C.forest}, ${C.gold})`,
          borderRadius: 1, pointerEvents: 'none',
          transition: 'width 0.12s linear',
          opacity: 0.7,
        }} />
        {links.map(({ id, label, short }, idx) => {
          const isActive = active === id;
          return (
            <div key={id} style={{ display: 'flex', alignItems: 'center' }}>
              <button className="nav-link-btn"
                onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
                style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  padding: '3px 7px', borderRadius: 999,
                  background: 'transparent',
                  border: 'none', cursor: 'pointer',
                  transition: 'opacity 0.2s',
                }}>
                <span style={{
                  display: 'inline-block', width: 5, height: 5, borderRadius: '50%', flexShrink: 0,
                  background: isActive ? C.forest : 'rgba(199,164,90,0.35)',
                  transition: 'background 0.22s',
                }} />
                <span style={{
                  fontSize: 9, letterSpacing: '0.10em', textTransform: 'uppercase',
                  fontFamily: POPPINS,
                  color: isActive ? C.forest : C.emerald2,
                  fontWeight: isActive ? 600 : 400,
                  opacity: isActive ? 1 : 0.65,
                  transition: 'color 0.22s, opacity 0.22s',
                  whiteSpace: 'nowrap',
                }}>
                  <span className="hidden sm:inline">{label}</span>
                  <span className="inline sm:hidden">{short}</span>
                </span>
              </button>
              {idx < links.length - 1 && (
                <div style={{ width: 6, height: 1, background: C.champagne, opacity: 0.4, flexShrink: 0 }} />
              )}
            </div>
          );
        })}
      </div>
    </motion.nav>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 1 — HERO
// ═══════════════════════════════════════════════════════════════════════════════
function HeroSection() {
  return (
    <section id="beginning" style={{
      position: 'relative', background: C.ivory, overflow: 'hidden',
      minHeight: '100svh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '6rem 1.5rem',
    }}>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex',
        alignItems: 'center', justifyContent: 'center', pointerEvents: 'none',
      }}>
        <div style={{ width: '100%', maxWidth: 460, height: '100%', position: 'relative' }}>
          <AnimatedArchGlow variant="gold" />
        </div>
      </div>

      <FloatingParticles tone="gold" />
      <BotanicalTL />
      <BotanicalBR />

      <div style={{ position: 'relative', zIndex: 10, width: '100%', display: 'flex', justifyContent: 'center' }}>
        <InvitationCardShell>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22,1,0.36,1], delay: 0.62 }}
              style={{ fontFamily: POPPINS, fontSize: 11, letterSpacing: '0.35em', textTransform: 'uppercase', color: C.gold, marginBottom: '1.5rem', fontWeight: 500 }}>
              Wedding Invitation
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.22,1,0.36,1], delay: 0.78 }}
              style={{ fontFamily: PLAYFAIR, fontWeight: 700, color: C.emerald, fontSize: 'clamp(2.4rem,9vw,4.8rem)', lineHeight: 1.1, marginBottom: '0.85rem', letterSpacing: '-0.01em' }}>
              Hamza &amp; Eman
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: [0.22,1,0.36,1], delay: 0.94 }}
              style={{ fontFamily: PLAYFAIR, fontStyle: 'italic', color: C.gold, fontSize: 'clamp(1rem,3vw,1.2rem)', marginBottom: '0.6rem' }}>
              A Sacred Beginning
            </motion.p>

            {/* Thin subtitle line */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.55, delay: 1.0 }}
              style={{ marginBottom: '1.5rem' }}>
              <svg width="80" height="6" viewBox="0 0 80 6" fill="none" aria-hidden="true">
                <path d="M0,3 Q20,0 40,3 Q60,6 80,3" stroke={C.champagne} strokeWidth="1" fill="none" />
                <circle cx="40" cy="3" r="1.8" fill={C.gold} opacity="0.55" />
              </svg>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: [0.22,1,0.36,1], delay: 1.06 }}
              style={{ fontFamily: POPPINS, color: C.emerald2, lineHeight: 1.9, fontSize: '0.88rem', maxWidth: 340, marginBottom: '1.75rem' }}>
              With love and duas,<br />
              we invite you to celebrate the Nikaah of<br />
              <span style={{ color: C.emerald, fontWeight: 500 }}>Hamza &amp; Eman.</span>
              <br /><br />
              From Makkah to Jeddah,<br />
              a weekend of barakah, family, and joy.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.22,1,0.36,1], delay: 1.18 }}
              style={{
                background: 'rgba(250,243,232,0.55)',
                border: `1px solid ${C.champagne}`,
                borderRadius: 14, padding: '1.1rem 1.4rem',
                width: '100%', marginBottom: '1.6rem',
              }}>
              <p style={{ fontFamily: PLAYFAIR, fontStyle: 'italic', color: C.emerald, fontSize: '0.93rem', lineHeight: 1.7, marginBottom: 5 }}>
                "And He placed between you affection and mercy."
              </p>
              <p style={{ fontFamily: POPPINS, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.gold }}>
                Qur'an 30:21
              </p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.22,1,0.36,1], delay: 1.30 }}
              style={{ fontFamily: PLAYFAIR, fontWeight: 600, color: C.gold, fontSize: '1.1rem', marginBottom: '0.35rem' }}>
              June 18–20, 2026
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.22,1,0.36,1], delay: 1.40 }}
              style={{ fontFamily: POPPINS, fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.emerald, marginBottom: '1.5rem' }}>
              Makkah &bull; Jeddah
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.7, delay: 1.50 }}>
              <OrnDivider forest />
            </motion.div>
          </div>
        </InvitationCardShell>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 2 — TWO HEARTS
// ═══════════════════════════════════════════════════════════════════════════════
function HeartsSection() {
  return (
    <section id="hearts" style={{ background: C.cream, padding: '6rem 1.5rem', position: 'relative', overflow: 'hidden' }}>
      {/* Overlapping circles — two homes motif */}
      <svg aria-hidden="true"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        xmlns="http://www.w3.org/2000/svg">
        <circle cx="15%" cy="35%" r="190" fill="none" stroke={C.champagne} strokeWidth="1"   opacity="0.32" />
        <circle cx="15%" cy="35%" r="120" fill="none" stroke={C.gold}      strokeWidth="0.7" opacity="0.14" />
        <circle cx="85%" cy="65%" r="210" fill="none" stroke={C.blush}     strokeWidth="1"   opacity="0.28" />
        <circle cx="85%" cy="65%" r="135" fill="none" stroke={C.forest}    strokeWidth="0.6" opacity="0.12" />
        <circle cx="50%" cy="50%" r="280" fill="none" stroke={C.champagne} strokeWidth="0.5" opacity="0.10" />
      </svg>

      <div style={{ maxWidth: 780, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <FadeUp style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <p style={{ fontFamily: POPPINS, fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.forest, marginBottom: 12, opacity: 0.75 }}>
            The Couple
          </p>
          <h2 style={{ fontFamily: PLAYFAIR, fontWeight: 700, color: C.emerald, fontSize: 'clamp(2rem,6vw,3rem)', marginBottom: 12 }}>
            Two Hearts, One Dua
          </h2>
          <p style={{ fontFamily: PLAYFAIR, fontStyle: 'italic', color: C.gold, fontSize: '1rem' }}>
            Two homes, one prayer, one beautiful beginning.
          </p>
        </FadeUp>

        {/* Gold vine divider */}
        <FadeUp delay={0.08} style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
          <svg width="240" height="30" viewBox="0 0 240 30" fill="none" aria-hidden="true">
            <path d="M10,15 Q30,5 58,15 Q85,25 110,15 Q135,5 162,15 Q189,25 210,15 Q225,8 230,15"
              stroke={C.champagne} strokeWidth="1.1" fill="none" />
            <path d="M56,15 Q60,9 64,15"  stroke={C.gold}   strokeWidth="0.9" fill="none" opacity="0.65" />
            <path d="M158,15 Q162,9 166,15" stroke={C.gold} strokeWidth="0.9" fill="none" opacity="0.65" />
            <circle cx="120" cy="15" r="2.8" fill={C.gold} opacity="0.45" />
            <circle cx="58"  cy="15" r="1.7" fill={C.champagne} />
            <circle cx="162" cy="15" r="1.7" fill={C.champagne} />
            <ellipse cx="86"  cy="11" rx="5" ry="2.4" fill={C.sage}  opacity="0.26" transform="rotate(-14,86,11)" />
            <ellipse cx="152" cy="19" rx="5" ry="2.4" fill={C.forest} opacity="0.18" transform="rotate(14,152,19)" />
          </svg>
        </FadeUp>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.75rem', marginBottom: '2.5rem' }}>
          <FadeFrom direction="left" delay={0.1}>
            <div className="hearts-card-inner" style={{
              background: C.ivory, borderRadius: 24, padding: '2rem 2rem 1.75rem',
              border: `1px solid rgba(232,215,170,0.55)`,
              boxShadow: `0 4px 32px rgba(199,164,90,0.08)`,
              height: '100%', position: 'relative', overflow: 'hidden',
            }}>
              {/* Small forest corner accent */}
              <svg aria-hidden="true" width="28" height="28" viewBox="0 0 28 28" fill="none"
                style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
                <path d="M 1,14 L 1,4 Q 1,1 4,1 L 14,1" stroke={C.forest} strokeWidth="1" opacity="0.28" />
              </svg>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 22, height: 1.5, borderRadius: 2, background: C.gold, opacity: 0.7 }} />
                <h3 style={{ fontFamily: PLAYFAIR, fontWeight: 700, color: C.emerald, fontSize: '1.5rem' }}>Hamza</h3>
              </div>
              <p style={{ fontFamily: POPPINS, color: C.emerald2, lineHeight: 1.8, fontSize: '0.925rem' }}>
                Driven, thoughtful, and full of dreams.
              </p>
              <p style={{ fontFamily: POPPINS, color: C.emerald2, lineHeight: 1.8, fontSize: '0.925rem', marginTop: 6 }}>
                A heart that finds joy in the little things.
              </p>
              <svg width="68" height="18" viewBox="0 0 68 18" fill="none" style={{ marginTop: 20 }}>
                <path d="M0,14 Q17,4 34,10 Q51,16 68,8" stroke={C.sage} strokeWidth="1.3" fill="none" opacity="0.45" />
                <ellipse cx="17"  cy="7"  rx="6" ry="2.8" fill={C.sage}   opacity="0.28" transform="rotate(-18,17,7)" />
                <ellipse cx="46"  cy="13" rx="6" ry="2.8" fill={C.forest} opacity="0.16" transform="rotate(12,46,13)" />
              </svg>
            </div>
          </FadeFrom>

          <FadeFrom direction="right" delay={0.1}>
            <div className="hearts-card-inner" style={{
              background: C.ivory, borderRadius: 24, padding: '2rem 2rem 1.75rem',
              border: `1px solid rgba(231,199,189,0.55)`,
              boxShadow: `0 4px 32px rgba(231,199,189,0.12)`,
              height: '100%', position: 'relative', overflow: 'hidden',
            }}>
              <svg aria-hidden="true" width="28" height="28" viewBox="0 0 28 28" fill="none"
                style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
                <path d="M 1,14 L 1,4 Q 1,1 4,1 L 14,1" stroke={C.forest} strokeWidth="1" opacity="0.28" />
              </svg>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 22, height: 1.5, borderRadius: 2, background: C.blush, opacity: 0.8 }} />
                <h3 style={{ fontFamily: PLAYFAIR, fontWeight: 700, color: C.emerald, fontSize: '1.5rem' }}>Eman</h3>
              </div>
              <p style={{ fontFamily: POPPINS, color: C.emerald2, lineHeight: 1.8, fontSize: '0.925rem' }}>
                Gentle, sweet-hearted, and graceful.
              </p>
              <p style={{ fontFamily: POPPINS, color: C.emerald2, lineHeight: 1.8, fontSize: '0.925rem', marginTop: 6 }}>
                A presence full of warmth and light.
              </p>
              <svg width="68" height="18" viewBox="0 0 68 18" fill="none" style={{ marginTop: 20 }}>
                <path d="M0,12 Q17,3 34,9 Q51,15 68,7" stroke={C.blush} strokeWidth="1.3" fill="none" opacity="0.45" />
                <ellipse cx="17"  cy="6"  rx="6" ry="2.8" fill={C.blush}  opacity="0.32" transform="rotate(-12,17,6)" />
                <ellipse cx="46"  cy="12" rx="6" ry="2.8" fill={C.forest} opacity="0.16" transform="rotate(14,46,12)" />
              </svg>
            </div>
          </FadeFrom>
        </div>

        {/* Together block */}
        <FadeUp delay={0.12}>
          <div style={{
            textAlign: 'center', background: C.ivory, borderRadius: 28, padding: '2.25rem 2rem',
            border: `1px solid ${C.champagne}`,
            boxShadow: `0 4px 24px rgba(8,58,9,0.04)`,
            maxWidth: 480, margin: '0 auto',
          }}>
            <p style={{ fontFamily: POPPINS, fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase', color: C.forest, marginBottom: 12, opacity: 0.65 }}>
              Together
            </p>
            <p style={{ fontFamily: POPPINS, color: C.emerald2, lineHeight: 1.8, fontSize: '0.925rem', marginBottom: 14 }}>
              Two hearts, two homes, brought together through love, family, and duas.
            </p>
            <p style={{ fontFamily: PLAYFAIR, fontStyle: 'italic', color: C.gold, fontSize: '1rem' }}>
              May Allah bless their beautiful beginning.
            </p>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 3 — NIKAAH / MAKKAH
// ═══════════════════════════════════════════════════════════════════════════════
function NikaahSection() {
  const reduced     = useReducedMotion();
  const nikaahRef   = useRef<HTMLElement>(null);
  const { scrollYProgress: nikaahProgress } = useScroll({
    target: nikaahRef,
    offset: ['start end', 'end start'],
  });

  // Raw transforms — bumped peaks for mobile visibility
  const rawArchScale   = useTransform(nikaahProgress, [0, 0.45, 1], [0.92, 1.05, 1.1]);
  const archOpacity    = useTransform(nikaahProgress, [0, 0.3, 0.85, 1], [0.04, 0.30, 0.22, 0.06]);
  const geoOpacity     = useTransform(nikaahProgress, [0, 0.35, 0.8, 1], [0.02, 0.10, 0.07, 0.02]);
  const rawGlowScale   = useTransform(nikaahProgress, [0, 0.45, 1], [0.75, 1.15, 1.25]);
  const glowOpacity    = useTransform(nikaahProgress, [0, 0.35, 0.8, 1], [0.06, 0.28, 0.20, 0.06]);
  const detailY        = useTransform(nikaahProgress, [0, 0.5, 1], [20, -8, -20]);
  const rawCeremonyScale = useTransform(nikaahProgress, [0.35, 0.75], [0, 1]);

  // Smoothed with spring
  const archScale        = useSpring(rawArchScale,      { stiffness: 70, damping: 22 });
  const glowScale        = useSpring(rawGlowScale,      { stiffness: 70, damping: 22 });
  const ceremonyLineScale = useSpring(rawCeremonyScale, { stiffness: 80, damping: 25 });

  return (
    <section ref={nikaahRef} id="nikaah" className="nikaah-section"
      style={{ position: 'relative', background: C.ivory, padding: '6rem 1.5rem', overflow: 'hidden' }}>

      <IslamicPattern opacity={reduced ? undefined : geoOpacity} />

      <SacredWindow
        archScale={reduced ? undefined : archScale}
        archOpacity={reduced ? undefined : archOpacity}
        glowScale={reduced ? undefined : glowScale}
        glowOpacity={reduced ? undefined : glowOpacity}
      />

      <ScrollDuasParticles progress={nikaahProgress} />
      <FloatingParticles tone="green" />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: 680, margin: '0 auto' }}>

        <FadeUp style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ fontFamily: POPPINS, fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.forest, marginBottom: 12, opacity: 0.7 }}>
            The Nikaah
          </p>
          <h2 style={{ fontFamily: PLAYFAIR, fontWeight: 700, color: C.emerald, fontSize: 'clamp(1.9rem,5.5vw,2.8rem)', marginBottom: 12 }}>
            Under the Mercy of Makkah
          </h2>
          <p style={{ fontFamily: PLAYFAIR, fontStyle: 'italic', color: C.gold, fontSize: '1rem', marginBottom: 16 }}>
            The Nikaah of Hamza &amp; Eman
          </p>
          <OrnDivider forest />
        </FadeUp>

        {/* Details block — scroll-reactive y */}
        <motion.div style={{ y: reduced ? 0 : detailY }}>
          <FadeUp delay={0.1}>
            <div style={{
              textAlign: 'center', background: C.cream, borderRadius: 20,
              padding: '1.75rem 2rem',
              border: `1px solid rgba(232,215,170,0.6)`,
              boxShadow: `0 4px 28px rgba(199,164,90,0.08)`,
              maxWidth: 400, margin: '0 auto 1.75rem',
            }}>
              <p style={{ fontFamily: PLAYFAIR, fontWeight: 600, color: C.emerald, fontSize: '1.05rem', marginBottom: 4 }}>
                Thursday, June 18, 2026
              </p>
              <p style={{ fontFamily: POPPINS, color: C.gold, fontSize: 13, marginBottom: 14 }}>After Zuhr</p>
              <div style={{ height: 1, background: C.champagne, marginBottom: 14 }} />
              <p style={{ fontFamily: POPPINS, fontWeight: 500, color: C.emerald2, fontSize: 14 }}>Clock Tower, Makkah</p>
              <p style={{ fontFamily: POPPINS, fontStyle: 'italic', color: C.sage, fontSize: 13, marginTop: 3 }}>
                Overlooking the Holy Kaabah
              </p>
            </div>
          </FadeUp>
        </motion.div>

        <FadeUp delay={0.12}>
          <p style={{ textAlign: 'center', fontFamily: POPPINS, color: C.emerald2, lineHeight: 1.8, fontSize: '0.925rem', maxWidth: 420, margin: '0 auto 0.5rem' }}>
            A blessed Nikaah afternoon, surrounded by family, love, and duas.
          </p>
        </FadeUp>

        {/* Sacred Moments */}
        <div style={{ marginTop: '2.5rem' }}>
          <FadeUp delay={0.18}>
            <h3 style={{ fontFamily: PLAYFAIR, fontWeight: 600, color: C.emerald, fontSize: '1.2rem', textAlign: 'center', marginBottom: '1.25rem' }}>
              Sacred Moments
            </h3>
          </FadeUp>
          <div style={{ position: 'relative' }}>
            <CeremonyLineMakkah scale={ceremonyLineScale} />
            <div className="sacred-moments-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', position: 'relative', zIndex: 1 }}>
              <FadeUp delay={0.28}><MomentCard icon={<CameraIcon />}  title="After Nikaah"      desc="Family photography" /></FadeUp>
              <FadeUp delay={0.40}><MomentCard icon={<CrescentIcon />} title="Evening at Haram"  desc="Ibadah · Tawaf · Personal duas" iconColor={C.forest} /></FadeUp>
              <FadeUp delay={0.52}><MomentCard icon={<CutleryIcon />} title="Dinner"             desc="Hosted by Eman's father and family" /></FadeUp>
            </div>
          </div>
        </div>

        <FadeUp delay={0.1} style={{ textAlign: 'center', marginTop: '3rem' }}>
          <p style={{ fontFamily: PLAYFAIR, fontStyle: 'italic', color: C.gold, fontSize: '1rem' }}>
            Where duas become forever.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// JOURNEY TRANSITION
// ═══════════════════════════════════════════════════════════════════════════════
function JourneyTransitionSection() {
  const reduced = useReducedMotion();
  const journeyRef = useRef<HTMLElement>(null);
  const { scrollYProgress: journeyProgress } = useScroll({
    target: journeyRef,
    offset: ['start 85%', 'end 35%'],
  });

  const pathLength    = useTransform(journeyProgress, [0.08, 0.58], [0, 1]);
  const waveOpacity   = useTransform(journeyProgress, [0.45, 0.75], [0, 0.45]);
  const waveY         = useTransform(journeyProgress, [0.45, 0.85], [24, 0]);
  const geoOpacity    = useTransform(journeyProgress, [0, 0.35],    [0.09, 0]);
  const textOpacity   = useTransform(journeyProgress, [0.08, 0.25, 0.75, 0.95], [0, 1, 1, 0.55]);
  const textY         = useTransform(journeyProgress, [0.08, 0.35, 0.95], [20, 0, -10]);
  // Dot tracks path in SVG coordinates
  const dotCx         = useTransform(journeyProgress, [0.08, 0.22, 0.38, 0.58], [80, 240, 380, 620]);
  const dotCy         = useTransform(journeyProgress, [0.08, 0.22, 0.38, 0.58], [165, 112, 100, 108]);
  const dotOpacity    = useTransform(journeyProgress, [0.05, 0.18, 0.62, 0.78], [0, 1, 1, 0]);

  // Label fade-ins
  const makkahFade  = useTransform(journeyProgress, [0.03, 0.18], [0, 1]);
  const jeddahFade  = useTransform(journeyProgress, [0.35, 0.58], [0, 1]);

  return (
    <section ref={journeyRef} id="journey"
      style={{
        position: 'relative', overflow: 'hidden',
        background: `linear-gradient(180deg, ${C.ivory} 0%, ${C.cream} 100%)`,
        minHeight: 'clamp(300px, 58svh, 520px)',
        padding: '2.75rem 1.5rem 2rem',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>

      {/* Fading Islamic geo at top */}
      <motion.svg aria-hidden="true"
        style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '45%',
          pointerEvents: 'none',
          opacity: reduced ? 0.07 : geoOpacity,
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1), transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1), transparent)',
        } as React.CSSProperties}
        xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="jt-geo" x="0" y="0" width="56" height="56" patternUnits="userSpaceOnUse">
            <g fill="none" stroke={C.gold} strokeWidth="0.65">
              <polygon points="28,4 32,16 44,12 36,22 48,28 36,34 44,44 32,40 28,52 24,40 12,44 20,34 8,28 20,22 12,12 24,16" />
              <circle cx="28" cy="28" r="7" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#jt-geo)" />
      </motion.svg>

      {/* Path container */}
      <div style={{ position: 'relative', width: '100%', maxWidth: 700, margin: '0 auto', flexShrink: 0 }}>
        {/* Makkah label */}
        <motion.div
          style={{
            position: 'absolute', top: '18%', left: '2%',
            opacity: reduced ? 1 : makkahFade,
          } as React.CSSProperties}>
          <p style={{ fontFamily: POPPINS, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.emerald2, opacity: 0.55, marginBottom: 2 }}>From</p>
          <p style={{ fontFamily: PLAYFAIR, fontWeight: 600, color: C.emerald, fontSize: '0.9rem' }}>Makkah</p>
        </motion.div>

        {/* Jeddah label */}
        <motion.div
          style={{
            position: 'absolute', bottom: '18%', right: '2%', textAlign: 'right',
            opacity: reduced ? 1 : jeddahFade,
          } as React.CSSProperties}>
          <p style={{ fontFamily: PLAYFAIR, fontWeight: 600, color: C.emerald, fontSize: '0.9rem', marginBottom: 2 }}>Jeddah</p>
          <p style={{ fontFamily: POPPINS, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.emerald2, opacity: 0.55 }}>To the Sea</p>
        </motion.div>

        {/* Journey SVG path — dot is inside SVG for perfect alignment */}
        <svg viewBox="0 0 700 220"
          style={{ width: '100%', height: 'auto', display: 'block', padding: '1.25rem 0' }}
          fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">

          {/* Champagne shadow underpath */}
          <path d="M 80,165 C 190,165 275,62 370,100 C 455,135 545,78 620,108"
            stroke={C.champagne} strokeWidth="3" opacity="0.3" strokeLinecap="round" />

          {/* Main gold path */}
          {reduced ? (
            <path d="M 80,165 C 190,165 275,62 370,100 C 455,135 545,78 620,108"
              stroke={C.gold} strokeWidth="2.5" opacity="0.5" strokeLinecap="round" strokeDasharray="7 4" />
          ) : (
            <motion.path
              d="M 80,165 C 190,165 275,62 370,100 C 455,135 545,78 620,108"
              stroke={C.gold} strokeWidth="2.5" strokeLinecap="round" strokeDasharray="7 4"
              style={{ pathLength, opacity: 0.58 }} />
          )}

          {/* Forest green shadow on first half */}
          {reduced ? (
            <path d="M 80,165 C 190,165 275,62 370,100"
              stroke={C.forest} strokeWidth="1" opacity="0.18" strokeLinecap="round" />
          ) : (
            <motion.path
              d="M 80,165 C 190,165 275,62 370,100"
              stroke={C.forest} strokeWidth="1" strokeLinecap="round"
              style={{ pathLength, opacity: 0.2 }} />
          )}

          {/* Crescent at Makkah start */}
          <path d="M 80,165 A 11,11 0 1 1 92,156 A 7.5,7.5 0 1 0 80,165 Z"
            fill={C.gold} opacity="0.6" />

          {/* Wave at Jeddah end */}
          <path d="M 606,108 Q 613,102 620,108 Q 627,114 634,108"
            stroke={C.ocean} strokeWidth="2" strokeLinecap="round" opacity="0.65" />

          {/* Traveling dot — in SVG coords for perfect path alignment */}
          {!reduced && (
            <>
              <motion.circle r="8" fill={C.gold} opacity="0.18"
                cx={dotCx} cy={dotCy} style={{ opacity: dotOpacity }} />
              <motion.circle r="4.5" fill={C.gold}
                cx={dotCx} cy={dotCy} style={{ opacity: dotOpacity }} />
            </>
          )}
        </svg>
      </div>

      {/* Poetry text */}
      <motion.div
        style={{
          textAlign: 'center', maxWidth: 320, position: 'relative', zIndex: 2,
          opacity: reduced ? 1 : textOpacity,
          y:       reduced ? 0 : textY,
        } as React.CSSProperties}>
        <p style={{
          fontFamily: PLAYFAIR, fontStyle: 'italic',
          color: C.emerald2, fontSize: 'clamp(1rem,3vw,1.15rem)',
          lineHeight: 2.2, letterSpacing: '0.01em',
        }}>
          From Makkah<br />
          to the sea —<br />
          <em style={{ color: C.forest, fontStyle: 'italic', opacity: 0.85 }}>a sacred promise,</em><br />
          then a golden celebration.
        </p>
      </motion.div>

      {/* Wave shapes at bottom — fades in as you scroll */}
      <motion.div aria-hidden="true"
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: 64, pointerEvents: 'none',
          opacity: reduced ? 0.35 : waveOpacity,
          y: reduced ? 0 : waveY,
        } as React.CSSProperties}>
        <svg viewBox="0 0 1440 64" preserveAspectRatio="none"
          style={{ width: '100%', height: '100%', display: 'block' }}
          xmlns="http://www.w3.org/2000/svg">
          <path d="M0,32 C360,58 720,6 1080,32 C1260,44 1380,20 1440,32 L1440,64 L0,64 Z"
            fill={C.cream} opacity="0.9" />
          <path d="M0,44 C240,60 480,28 720,44 C960,60 1200,32 1440,44 L1440,64 L0,64 Z"
            fill={C.ocean} opacity="0.06" />
        </svg>
      </motion.div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 4 — JEDDAH / RING CEREMONY
// ═══════════════════════════════════════════════════════════════════════════════
function JeddahSection() {
  const reduced   = useReducedMotion();
  const jeddahRef = useRef<HTMLElement>(null);
  const { scrollYProgress: jeddahProgress } = useScroll({
    target: jeddahRef,
    offset: ['start end', 'end start'],
  });

  const rawSunScale      = useTransform(jeddahProgress, [0, 0.45, 1], [0.85, 1.12, 1.22]);
  const rawSunOpacity    = useTransform(jeddahProgress, [0, 0.35, 0.85, 1], [0.05, 0.24, 0.18, 0.10]);
  const rawRippleScale   = useTransform(jeddahProgress, [0.15, 0.55, 1], [0.75, 1.15, 1.35]);
  const rawRippleOpacity = useTransform(jeddahProgress, [0.1, 0.35, 0.75, 1], [0, 0.34, 0.22, 0.06]);
  const sunScale         = useSpring(rawSunScale,      { stiffness: 60, damping: 20 });
  const sunOpacity       = useSpring(rawSunOpacity,    { stiffness: 60, damping: 20 });
  const rippleScale      = useSpring(rawRippleScale,   { stiffness: 65, damping: 22 });
  const rippleOpacity    = useSpring(rawRippleOpacity, { stiffness: 65, damping: 22 });
  const petalX           = useTransform(jeddahProgress, [0, 1], [-20, 36]);
  const petalY           = useTransform(jeddahProgress, [0, 1], [40, -90]);
  const petalRotate      = useTransform(jeddahProgress, [0, 1], [-8, 16]);
  const detailsY         = useTransform(jeddahProgress, [0, 0.5, 1], [20, -6, -14]);
  const scheduleWaveOp   = useTransform(jeddahProgress, [0.45, 0.85], [0, 0.30]);

  const schedule = [
    { day: 'Wed Night',      event: 'Arrival in Makkah'           },
    { day: 'Thu Morning',    event: 'Rest and prepare'             },
    { day: 'Thu After Zuhr', event: 'Nikaah at Clock Tower'        },
    { day: 'Thu Evening',    event: 'Haram visit and family dinner' },
    { day: 'Fri Noon',       event: 'Depart for Jeddah'            },
    { day: 'On the Way',     event: "Jumu'ah prayer and lunch"     },
    { day: 'Fri Afternoon',  event: 'Arrive at Durrat Al-Arus'     },
    { day: 'Before Sunset',  event: 'Ring Ceremony by the Sea'     },
    { day: 'Fri Night',      event: 'Dinner and family time'       },
    { day: 'Saturday',       event: 'Farewell and departures'      },
  ];

  return (
    <section ref={jeddahRef} id="jeddah"
      style={{ position: 'relative', background: C.cream, overflow: 'hidden', paddingBottom: '5rem' }}>

      <SunsetOrb
        scale={reduced ? undefined : sunScale}
        opacity={reduced ? undefined : sunOpacity}
      />
      <ScrollFloatingPetals petalX={petalX} petalY={petalY} petalRotate={reduced ? undefined : petalRotate} />
      <WaveDivider />

      {/* Blush botanical corner (bottom-left) */}
      <svg aria-hidden="true"
        style={{ position: 'absolute', bottom: 0, left: 0, pointerEvents: 'none', userSelect: 'none' }}
        width="170" height="170" viewBox="0 0 170 170" xmlns="http://www.w3.org/2000/svg">
        <path d="M 5,165 Q 32,118 65,75 Q 98,35 140,8"
          fill="none" stroke={C.forest} strokeWidth="1.1" opacity="0.22" />
        <path d="M 5,165 Q 32,118 65,75 Q 98,35 140,8"
          fill="none" stroke={C.blush} strokeWidth="0.8" opacity="0.3" strokeDasharray="4 6" />
        <path d="M 22,142 Q 52,124 56,148 Q 32,156 22,142 Z" fill={C.blush}  opacity="0.26" />
        <path d="M 48,107 Q 78,88  82,113 Q 58,122 48,107 Z" fill={C.sage}   opacity="0.26" />
        <path d="M 78,70  Q 108,52 110,77 Q 86,86  78,70  Z" fill={C.blush}  opacity="0.2" />
        <circle cx="24"  cy="140" r="3"   fill={C.peach}  opacity="0.36" />
        <circle cx="52"  cy="104" r="2.5" fill={C.blush}  opacity="0.42" />
        <circle cx="82"  cy="66"  r="2"   fill={C.forest} opacity="0.25" />
      </svg>

      <div className="jeddah-inner" style={{ position: 'relative', zIndex: 10, maxWidth: 680, margin: '0 auto', padding: '2rem 1.5rem 0' }}>

        <FadeUp style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <AnimatedSunLine progress={jeddahProgress} />
          <p style={{ fontFamily: POPPINS, fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.ocean, marginBottom: 12 }}>
            The Ring Ceremony
          </p>
          <h2 style={{ fontFamily: PLAYFAIR, fontWeight: 700, color: C.emerald, fontSize: 'clamp(1.9rem,5.5vw,2.8rem)', marginBottom: 12 }}>
            By the Sea, With Love
          </h2>
          <p style={{ fontFamily: PLAYFAIR, fontStyle: 'italic', color: C.gold, fontSize: '1rem', marginBottom: 10 }}>
            Ring Ceremony by the Shore
          </p>
          {/* Shore identity ornament — sun arc + wave line */}
          <div aria-hidden="true" style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <svg width="88" height="36" viewBox="0 0 88 36" fill="none">
              <path d="M 18,30 A 22,22 0 0 1 70,30" stroke={C.gold} strokeWidth="1.4" fill="none" opacity="0.58" />
              <line x1="44" y1="5"  x2="44" y2="10" stroke={C.gold}  strokeWidth="1.1" opacity="0.45" />
              <line x1="28" y1="10" x2="31" y2="14" stroke={C.gold}  strokeWidth="1.1" opacity="0.36" />
              <line x1="60" y1="10" x2="57" y2="14" stroke={C.gold}  strokeWidth="1.1" opacity="0.36" />
              <line x1="19" y1="19" x2="15" y2="19" stroke={C.peach} strokeWidth="1"   opacity="0.32" />
              <line x1="69" y1="19" x2="73" y2="19" stroke={C.peach} strokeWidth="1"   opacity="0.32" />
              <path d="M 4,30 Q 18,25 32,30 Q 46,35 60,30 Q 74,25 84,30" stroke={C.ocean} strokeWidth="1.2" fill="none" opacity="0.50" />
              <circle cx="44" cy="30" r="3" fill={C.gold} opacity="0.38" />
            </svg>
          </div>
          <OrnDivider />
        </FadeUp>

        {/* Details — scroll-reactive y */}
        <motion.div style={{ y: reduced ? 0 : detailsY }}>
          <FadeUp delay={0.1}>
            <div style={{ position: 'relative', maxWidth: 400, margin: '0 auto 1.75rem' }}>
              <RingRipple rippleScale={rippleScale} rippleOpacity={rippleOpacity} />
              <div style={{
                position: 'relative', zIndex: 1,
                textAlign: 'center', background: C.ivory, borderRadius: 20,
                padding: '1.75rem 2rem',
                border: `1px solid ${C.champagne}`,
                boxShadow: `0 4px 28px rgba(126,168,169,0.08)`,
              }}>
              <p style={{ fontFamily: PLAYFAIR, fontWeight: 600, color: C.emerald, fontSize: '1.05rem', marginBottom: 4 }}>
                Friday, June 19, 2026
              </p>
              <p style={{ fontFamily: POPPINS, color: C.peach, fontSize: 13, marginBottom: 14 }}>Before Sunset</p>
              <div style={{ height: 1, background: C.champagne, marginBottom: 14 }} />
              <p style={{ fontFamily: POPPINS, fontWeight: 500, color: C.emerald2, fontSize: 14 }}>
                Beach Villa, Durrat Al-Arus
              </p>
              <p style={{ fontFamily: POPPINS, fontStyle: 'italic', color: C.ocean, fontSize: 13, marginTop: 3 }}>
                Jeddah, Saudi Arabia
              </p>
              </div>
            </div>
          </FadeUp>
        </motion.div>

        <FadeUp delay={0.12}>
          <p style={{ textAlign: 'center', fontFamily: POPPINS, color: C.emerald2, lineHeight: 1.8, fontSize: '0.925rem', maxWidth: 420, margin: '0 auto 0.5rem' }}>
            A golden-hour celebration by the sea, with flowers, family, and joy.
          </p>
        </FadeUp>

        {/* Hosted Moments */}
        <FadeUp delay={0.2} style={{ marginTop: '2.5rem' }}>
          <h3 style={{ fontFamily: PLAYFAIR, fontWeight: 600, color: C.emerald, fontSize: '1.2rem', textAlign: 'center', marginBottom: '1.25rem' }}>
            Hosted Moments
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
            <div style={{
              background: C.ivory, borderRadius: 18, padding: '1.25rem 1.5rem',
              border: `1px solid ${C.champagne}`,
              boxShadow: `0 4px 20px rgba(8,58,9,0.05)`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, color: C.gold }}>
                <CutleryIcon />
                <span style={{ fontFamily: POPPINS, fontWeight: 600, fontSize: 13, color: C.emerald }}>Dinner</span>
              </div>
              <p style={{ fontFamily: POPPINS, fontSize: 12, color: C.emerald2 }}>Hosted by Hamza's family</p>
            </div>
            <div style={{
              background: C.ivory, borderRadius: 18, padding: '1.25rem 1.5rem',
              border: `1px solid ${C.blush}`,
              boxShadow: `0 4px 20px rgba(126,168,169,0.07)`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, color: C.ocean }}>
                <WaveIcon />
                <span style={{ fontFamily: POPPINS, fontWeight: 600, fontSize: 13, color: C.emerald }}>The Evening</span>
              </div>
              <p style={{ fontFamily: POPPINS, fontSize: 12, color: C.emerald2 }}>Laughter, stories, and memories by the sea</p>
            </div>
          </div>
        </FadeUp>

        {/* Schedule */}
        <FadeUp delay={0.08}>
          <h3 style={{ fontFamily: PLAYFAIR, fontWeight: 600, color: C.emerald, fontSize: '1.2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
            The Days Ahead
          </h3>
          <div style={{ position: 'relative' }}>
            {/* Faint shoreline wave behind schedule */}
            <motion.svg aria-hidden="true"
              viewBox="0 0 700 60" preserveAspectRatio="none"
              style={{
                position: 'absolute', bottom: -8, left: 0, right: 0,
                width: '100%', height: 60, pointerEvents: 'none', zIndex: 0,
                opacity: reduced ? 0 : scheduleWaveOp,
              } as React.CSSProperties}
              fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,30 C116,50 233,10 350,30 C466,50 583,10 700,30" stroke={C.ocean} strokeWidth="1" opacity="0.8" />
              <path d="M0,42 C116,58 233,22 350,42 C466,58 583,22 700,42" stroke={C.champagne} strokeWidth="0.7" opacity="0.7" />
            </motion.svg>
          <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.55rem' }}>
            {schedule.map(({ day, event }, index) => (
              <StaggerItem key={day} index={index}>
                <div style={{
                  display: 'flex', alignItems: 'flex-start', gap: 12,
                  background: C.ivory, borderRadius: 14, padding: '0.75rem 1rem',
                  border: `1px solid rgba(232,215,170,0.45)`,
                }}>
                  <span style={{ flexShrink: 0, paddingTop: 5 }}>
                    <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
                      <circle cx="3" cy="3" r="3" fill={C.forest} opacity="0.55" />
                    </svg>
                  </span>
                  <span style={{ fontFamily: POPPINS, fontWeight: 700, fontSize: 11, color: C.gold, letterSpacing: '0.04em', flexShrink: 0, minWidth: 94, paddingTop: 1 }}>
                    {day}
                  </span>
                  <span style={{ fontFamily: POPPINS, fontSize: 12, color: C.emerald2, lineHeight: 1.5 }}>
                    {event}
                  </span>
                </div>
              </StaggerItem>
            ))}
          </div>
          </div>
        </FadeUp>

        {/* Closing */}
        <FadeUp delay={0.1} style={{ textAlign: 'center', marginTop: '4rem' }}>
          <OrnDivider forest style={{ marginBottom: '1.5rem' }} />
          <p style={{ fontFamily: POPPINS, color: C.emerald2, lineHeight: 1.8, fontSize: '0.925rem', maxWidth: 400, margin: '0 auto 1rem' }}>
            May Allah bless Hamza and Eman with barakah, mercy, and lifelong happiness.
          </p>
          <p style={{ fontFamily: PLAYFAIR, fontStyle: 'italic', color: C.gold, fontSize: '1rem' }}>
            With love, honor, and duas.
          </p>
          <svg width="130" height="28" viewBox="0 0 130 28" fill="none" style={{ marginTop: 28, display: 'inline-block' }}>
            <path d="M0,14 Q20,4 40,14 Q60,24 80,14 Q100,4 130,14"
              stroke={C.champagne} strokeWidth="1.2" fill="none" />
            <circle cx="65" cy="14" r="3.5" fill={C.gold}   opacity="0.45" />
            <circle cx="40" cy="14" r="2"   fill={C.forest} opacity="0.3" />
            <circle cx="90" cy="14" r="2"   fill={C.forest} opacity="0.3" />
          </svg>
        </FadeUp>
      </div>

      <ScrollWaveBand progress={jeddahProgress} />
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT EXPORT
// ═══════════════════════════════════════════════════════════════════════════════
export default function WeddingInvitePage() {
  return (
    <div style={{ background: C.ivory, color: C.emerald, fontFamily: POPPINS }}>
      <FloatingNav />
      <HeroSection />
      <HeartsSection />
      <NikaahSection />
      <JourneyTransitionSection />
      <JeddahSection />
    </div>
  );
}
