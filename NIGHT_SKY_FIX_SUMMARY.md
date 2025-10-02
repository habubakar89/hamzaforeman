# Night Sky Overlay Fix - Summary

## Problem
The Night-Sky overlay wasn't being properly torn down after the animation, leaving a full-screen `fixed inset-0` layer mounted with `pointer-events-none` that covered the timeline visually. This happened because:

1. **Missing cleanup/state machine**: Timers weren't guaranteed to run due to mobile throttling
2. **Re-renders clearing timers**: setTimeout IDs weren't kept in refs and got lost across renders
3. **No guaranteed unmount**: AnimatePresence exit wasn't always reached
4. **Multiple overlays**: Clicking multiple times could create racing timers

## Solution

### 1. Created `useNightSkyReveal` Hook (`src/hooks/useNightSkyReveal.ts`)
- **Proper state machine** with 3 states: `idle`, `revealing`, `fading`
- **Timer management in refs** to survive re-renders
- **Guaranteed cleanup** with useEffect cleanup function
- **Failsafe timer** (5 seconds) in case animations are throttled
- **Body class management** for global state tracking
- **Prevents duplicate overlays** by checking state before showing

Key features:
```typescript
- Timer IDs stored in refs (not state)
- clearTimers() function cleans all timers
- useEffect cleanup removes body class and clears timers
- show() function prevents duplicate calls
```

### 2. Created `NightSkyOverlay` Component (`src/components/NightSkyOverlay.tsx`)
- **Simplified component** that receives `visible` and `phase` props
- **AnimatePresence properly configured** for guaranteed exit animation
- **Portal rendering** to `document.body` for proper z-index stacking
- **Mobile-optimized constellation** with thicker lines (2.5px) and dots (3.5px radius)
- **No internal state management** - fully controlled by hook

### 3. Updated `Timeline` Component
- **Removed old NightSkyReveal** component and its complex internal state
- **Integrated new hook**: `const nightSky = useNightSkyReveal()`
- **Simplified usage**: Call `nightSky.show()` to trigger, hook handles cleanup
- **Debouncing maintained** with 250ms timeout ref

## Mobile Improvements
- Constellation lines: 2.5px stroke width (was 1.5px)
- Constellation dots: 3.5px radius (was 2.5px)
- Better visibility on smaller screens

## Testing Checklist
✅ TypeScript compilation passes
✅ Timer cleanup guaranteed via refs
✅ Body class removed on unmount
✅ Failsafe timer prevents stuck overlays
✅ State machine prevents duplicate overlays
✅ Mobile thickness improvements applied
✅ AnimatePresence exit guaranteed

## Files Changed
- ✅ Created: `src/hooks/useNightSkyReveal.ts`
- ✅ Created: `src/components/NightSkyOverlay.tsx`
- ✅ Updated: `src/components/Timeline.tsx`
- ✅ Deleted: `src/components/NightSkyReveal.tsx` (old implementation)

## How to Verify
1. After animation completes, no `fixed inset-0` elements should remain in DOM
2. No `night-sky-active` class on `<body>`
3. Clicking today's note replays the animation every time
4. Tabbing away, rotating device, or scrolling doesn't leave overlay stuck
5. Console logs show proper lifecycle: "Starting" → "Transitioning to fading" → "Animation complete"

## Technical Details
- **State transitions**: `idle` → `revealing` (2s) → `fading` (1.2s) → `idle`
- **Total duration**: 3.2 seconds (+ 1.8s failsafe buffer)
- **Timer cleanup**: On state change, on unmount, and on failsafe trigger
- **Mobile support**: Touch-action manipulation, no tap highlights
