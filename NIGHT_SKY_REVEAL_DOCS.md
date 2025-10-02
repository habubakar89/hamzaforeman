# Night Sky Reveal - Technical Documentation

## Overview

The Night Sky Reveal is a special animation that plays when the user taps/clicks on "Today's" note card in the Timeline. It displays a full-screen starry night overlay with an animated "E + H" constellation pattern.

This implementation has been hardened to ensure the overlay **never sticks** on screen and works reliably across desktop and mobile devices.

---

## Architecture

### Components

1. **`NightSkyOverlay.tsx`** - The main overlay component
   - Renders a full-screen portal with stars and constellation
   - Self-managing: handles its own mount/unmount lifecycle
   - Includes multiple failsafes and cancel handlers

2. **`useNightSkyReveal.ts`** - One-shot trigger hook
   - Provides `show()` function for triggering the reveal
   - Uses `revealVisible` + `revealKey` pattern for one-shot reveals
   - Includes debouncing to prevent double-fires
   - Callback system for coordinating with overlay

3. **`Timeline.tsx`** - Parent component
   - Detects "Today's" note and makes it tappable
   - Uses `useNightSkyReveal()` to trigger overlay
   - Passes `onAutoDismiss` callback to overlay

---

## How Triggering Works

### One-Shot Pattern

The overlay uses a **one-shot pattern** to ensure clean state:

```tsx
// Hook manages one-shot state
const nightSky = useNightSkyReveal();

// Parent triggers reveal
<div onPointerUp={nightSky.show}>Today's Note</div>

// Overlay receives props
<NightSkyOverlay 
  visible={nightSky.revealVisible}    // boolean
  revealKey={nightSky.revealKey}       // increments on each show()
  onAutoDismiss={nightSky.onAutoDismiss} // callback when done
/>
```

**Key Principles:**
- `revealVisible` is one-shot: set to `true` on trigger, reset to `false` by overlay
- `revealKey` increments on each `show()` call, forcing React to treat it as a fresh mount
- This decouples the overlay lifecycle from persistent parent state
- Prevents the overlay from re-mounting immediately after auto-dismiss

### Debouncing

The hook includes 250ms debouncing to prevent double-fires from pointer events:

```tsx
const lastTapTime = useRef(0);
const now = Date.now();
if (now - lastTapTime.current < 250) return; // Ignore
lastTapTime.current = now;
```

---

## Timing & Responsiveness

### Duration by Device

| Context | Duration | Notes |
|---------|----------|-------|
| **Desktop** | 3.8s | More time for reading |
| **Mobile** | 3.2s | Faster for smaller screens |
| **Reduced Motion** | 2.0s | Static display, faster exit |

### Mobile Optimizations

- **Thicker visual elements** for better visibility:
  - Constellation lines: 2.5px (vs 1.5px desktop)
  - Constellation dots: radius 3.5px (vs 2.5px desktop)
  
- **Responsive sizing**:
  - Mobile: `min(80vw, 340px) × min(40vh, 240px)`
  - Desktop: `min(60vw, 900px) × min(60vh, 600px)`

- **Fewer stars** for performance:
  - Mobile: 28 stars
  - Desktop: 60 stars

### Touch Reliability

Uses Pointer Events for better mobile support:

```tsx
<div 
  onPointerUp={handleTodayNoteClick}
  style={{ touchAction: 'manipulation' }}
  role="button"
  tabIndex={0}
>
```

---

## Self-Teardown & Failsafes

### Primary Timer

The overlay sets a primary timer based on device/motion preference:

```tsx
const total = prefersReducedMotion ? 2000 : (isMobile ? 3200 : 3800);

teardownTimerRef.current = window.setTimeout(() => {
  unmountOverlay('timer-complete');
}, total);
```

### Failsafe Timer

A second timer guards against throttled timers (mobile/backgrounded tabs):

```tsx
const failsafeDelay = Math.max(total + 1500, 5000);

failsafeTimerRef.current = window.setTimeout(() => {
  unmountOverlay('failsafe');
}, failsafeDelay);
```

This ensures the overlay **always** unmounts, even if browser throttles timers.

---

## Cancel Handlers

The overlay can be cancelled by:

### 1. Escape Key
```tsx
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') unmountOverlay('escape');
});
```

### 2. Scroll
```tsx
window.addEventListener('scroll', () => {
  unmountOverlay('scroll');
}, { once: true }); // First scroll only
```

### 3. Tab Hidden (Visibility Change)
```tsx
document.addEventListener('visibilitychange', () => {
  if (document.hidden) unmountOverlay('visibility-hidden');
});
```

### 4. Navigation (Route Change)
```tsx
window.addEventListener('popstate', () => unmountOverlay('navigation'));
window.addEventListener('hashchange', () => unmountOverlay('navigation'));
```

All cancel handlers call `unmountOverlay()` which:
1. Sets `mounted = false` (removes portal)
2. Removes `night-sky-active` class from `<body>`
3. Clears all timers
4. Calls `onAutoDismiss()` to notify parent

---

## Defensive Coding Patterns

### StrictMode Guard

Prevents double-initialization in React StrictMode:

```tsx
const didInitRef = useRef(false);

useEffect(() => {
  if (!visible) {
    didInitRef.current = false; // Reset on hide
    return;
  }
  
  if (didInitRef.current) return; // Block double-mount
  didInitRef.current = true;
  
  // ... initialize overlay
}, [visible]);
```

### Stable Callbacks

All event handlers use `useCallback` to prevent unnecessary re-renders:

```tsx
const unmountOverlay = useCallback((reason: string) => {
  // ...
}, [clearTimers, onAutoDismiss]);
```

### Comprehensive Cleanup

Every effect returns a cleanup function:

```tsx
useEffect(() => {
  // ... setup event listeners
  
  return () => {
    // Remove ALL event listeners
    // Clear ALL timers
    // Remove body class
  };
}, [deps]);
```

---

## Z-Index Layering

```
Overlay (z-20, pointer-events-none)
  └─ Never intercepts clicks
  
Timeline cards (z-10)
  └─ Normal interaction layer

Floating panels/toggles (z-30)
  └─ Above overlay

Modals/banners (z-40)
  └─ Top priority
```

The overlay uses `pointer-events-none` so it never blocks other UI elements.

---

## Debug Mode

Set `DEV_OVERLAY_DEBUG = true` in `NightSkyOverlay.tsx` to enable console logging:

```tsx
const DEV_OVERLAY_DEBUG = true; // Enable logging
```

Logs include:
- Mount/unmount events with timestamps
- Reason for each unmount (timer, escape, scroll, etc.)
- Elapsed time since mount
- StrictMode double-mount blocks

Also provides `window.__checkOverlay()` helper:

```js
__checkOverlay()
// Returns: { overlays: 0, bodyClass: false }
```

**Remember to set `DEV_OVERLAY_DEBUG = false` before production build!**

---

## Testing

### Unit Tests

Run with Vitest:

```bash
npm run test              # Watch mode
npm run check:overlay     # Single run, verbose
```

Tests verify:
- Portal mounts when `visible=true`
- Body class added/removed correctly
- Auto-teardown after duration
- Failsafe timer fires
- Escape/scroll/visibility cancels work
- Clean unmount on parent `visible=false`
- `revealKey` forces fresh mount

### Manual Verification

Run the verification checklist:

```bash
node scripts/verify-overlay.js
```

This provides a 10-point checklist covering:
- Desktop & mobile reveal
- ESC, scroll, visibility cancels
- Debouncing
- Reduced motion
- Failsafe behavior
- UI interference checks
- Multiple playthroughs

---

## Acceptance Criteria

✅ **All must pass:**

1. Overlay never persists after completion/cancel
2. No fixed `inset-0` overlay in DOM after teardown
3. `document.body` has no `night-sky-active` class after teardown
4. Reveal can be retriggered immediately on every tap
5. ESC/scroll/visibilitychange all cancel immediately
6. Mobile + desktop timings respected
7. Thicker E+H on mobile (≈2.5px stroke, ≈3.5px dots)
8. No pointer-event interference with other UI

---

## Troubleshooting

### Overlay Sticks on Screen

**Symptoms:** Overlay remains visible indefinitely

**Likely causes:**
1. Parent keeps `visible=true` after overlay auto-dismisses
   - **Fix:** Ensure parent calls `onAutoDismiss` callback
2. Timers not firing (browser throttling)
   - **Fix:** Failsafe timer (5s) should catch this
3. Body class not removed
   - **Fix:** Check all unmount paths call cleanup

### Can't Replay Immediately

**Symptoms:** Clicking "Today's" note does nothing after first reveal

**Likely causes:**
1. Parent state still `true` from previous reveal
   - **Fix:** Use one-shot `revealVisible` pattern
2. Debounce blocking too long
   - **Fix:** Reduce debounce delay (currently 250ms)

### Overlay Appears Multiple Times

**Symptoms:** Multiple overlays stack on screen

**Likely causes:**
1. `revealKey` not incrementing
   - **Fix:** Ensure `setRevealKey(k => k + 1)` on each show
2. Rapid clicking bypassing debounce
   - **Fix:** Check `lastTapTime` ref is working

---

## Performance Considerations

- **Canvas-free:** Uses SVG instead of canvas for better mobile performance
- **Conditional animation:** Reduced stars on mobile (28 vs 60)
- **GPU-accelerated:** framer-motion uses CSS transforms
- **Portal rendering:** Overlay rendered outside main React tree
- **Memoized callbacks:** All handlers use `useCallback`

---

## Future Enhancements

Potential improvements (not currently implemented):

1. **Preload stars:** Generate star positions on component mount instead of on-demand
2. **Web Workers:** Offload star generation to worker thread
3. **Intersection Observer:** Only mount overlay when Timeline is in viewport
4. **localStorage:** Remember if user has seen reveal, show less frequently
5. **A/B testing:** Test different timings/animations for engagement

---

## Files Modified

```
src/
├── components/
│   ├── NightSkyOverlay.tsx        ← Hardened overlay with failsafes
│   ├── Timeline.tsx                ← One-shot trigger integration
│   └── __tests__/
│       └── NightSkyOverlay.test.tsx ← Unit tests
├── hooks/
│   └── useNightSkyReveal.ts       ← One-shot reveal hook
└── test/
    └── setup.ts                    ← Vitest test setup

scripts/
└── verify-overlay.js               ← Manual verification checklist

vitest.config.ts                    ← Vitest configuration
package.json                        ← Added test dependencies
```

---

## Summary

The Night Sky Reveal is now bulletproof with:

✅ **One-shot trigger pattern** - Clean state on every reveal  
✅ **Self-managing lifecycle** - Overlay controls its own unmount  
✅ **Multiple failsafes** - Primary timer + 5s failsafe  
✅ **Comprehensive cancels** - ESC, scroll, visibility, navigation  
✅ **Mobile optimizations** - Responsive sizing, thicker visuals, fewer stars  
✅ **Defensive coding** - StrictMode guards, stable callbacks, cleanup  
✅ **Full test coverage** - Unit tests + manual verification  

The overlay will never stick again! 🌟
