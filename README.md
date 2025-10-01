# 🎁 Hamza for Eman - Romantic Countdown Website

A beautiful, romantic single-page application built with React, TypeScript, TailwindCSS, and Framer Motion. This website features a daily surprise countdown leading up to Eman's birthday on October 21, 2025.

## ✨ Features

- 🔒 **Password Gate**: Secure entry with a romantic riddle
- 📜 **Daily Timeline**: Unlock new messages each day
- 💗 **Love Meter**: Visual progress from Oct 1 to Oct 21
- ❤️ **Floating Hearts**: Subtle animated hearts follow the cursor
- 🌸 **Parallax Petals**: Beautiful background animations
- 🎂 **Birthday Surprise**: Special section with confetti on Oct 21
- 🎵 **Audio Player**: Optional background music
- 🔑 **Easter Egg**: Press 'H' key to reveal a hidden slideshow
- 📱 **Fully Responsive**: Works beautifully on all devices

## 🚀 Quick Start

### Prerequisites

- **Node.js v18 or higher** (REQUIRED - v16 will not work)
- npm or yarn

> ⚠️ **Important**: This project uses Vite 7.x which requires Node.js 18+. If you're on Node 16, please upgrade Node.js first:
> - Using nvm: `nvm install 20 && nvm use 20`
> - Or download from: https://nodejs.org/

### Installation

1. Navigate to the project directory:
```bash
cd hamza-for-eman
```

2. Install dependencies (already done if you see `node_modules`):
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit: `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder, ready to deploy to Vercel, Netlify, or any static hosting service.

## 📝 Customization Guide

Before deploying, you need to customize several parts of the application:

### 🚨 IMPORTANT: Password Required Every Visit

**The password is now required on every page reload/visit** - there is no persistence between sessions. This ensures privacy and creates a fresh experience each time. The user must enter the password each time they visit the site.

### 💕 Login Popup (Toggleable)

When the password gate loads, a romantic popup modal appears automatically with:
- A picture area (expects `/public/popup.jpg`)
- A romantic description text
- A "Got it 💖" button to close

**To enable/disable:**
- Edit `src/components/PasswordGate.tsx`
- Set `SHOW_LOGIN_POPUP = true` (enabled) or `false` (disabled)

**To customize:**
1. Add your image as `/public/popup.jpg`
2. Look for the TODO comments in `src/components/LoginPopup.tsx`:
   - `// TODO: replace placeholder image src in /public/popup.jpg`
   - `// TODO: replace with your romantic text here`

### 💖 Post-Login Welcome Popup

A romantic welcome popup appears **immediately after successful login** (after the entry banner fades), overlaying the main site with:
- Romantic welcome message with dreamy styling
- "Let's go 💖" button to dismiss
- Closeable by clicking outside the modal

**To enable/disable:**
- Edit `src/App.tsx`
- Set `SHOW_POST_LOGIN_POPUP = true` (enabled) or `false` (disabled)

**Default message:**
"Welcome to a journey through our story, one day at a time. Each note holds a piece of my heart, written just for you. Let the music play, and let's relive every beautiful moment together. ✨"

**To customize:**
- Edit `src/components/WelcomePopup.tsx`
- Replace the text in the `<p>` tag with your own romantic message
- The popup features:
  - Semi-transparent glowing background with rose-gold border
  - Centered modal with soft glow effects
  - Elegant typography (font-heading with letter-spacing)
  - Gradient button with hover scale effect

### 📦 Instruction Box (Toggleable)

A helpful instruction box appears on the main site (after login) with:
- "How to use ✨" title
- Bullet points explaining features
- A "?" toggle button in bottom-right corner
- Default state: open (visible)

**To enable/disable:**
- Edit `src/components/InstructionBox.tsx`
- Set `SHOW_INSTRUCTION_BOX = true` (enabled) or `false` (disabled)

**To customize instructions:**
- Look for the TODO comment: `// TODO: replace with real instructions`
- Update the bullet points with your own text

### 1. Background Music Setup

**⚠️ REQUIRED: Add your audio file first!**

1. Create the folder: `/public/audio/` (if it doesn't exist)
2. Add your MP3 file as: `/public/audio/bg-music.mp3`
3. Reload the page to enable music

**To change the default volume:**
Edit `src/components/AudioPlayer.tsx` - look for the TODO comment:
```typescript
// TODO: change default volume here (0.0–1.0) if desired
audioRef.current.volume = 0.3; // Change 0.3 to your preferred volume
```

The music toggle button appears in the bottom-right corner. Music is paused by default and only plays for the current session.

### 2. Password Gate & Note Box

**Set the password question and answer** (`src/components/PasswordGate.tsx`):

```typescript
// Set your plain text answer (used for underscore hints)
const CORRECT_ANSWER = 'Baby Jaan';

// SHA-256 hash of the answer above
const CORRECT_HASH = '8d7d5397f8842b4181d38bc57b85b9ff1860456f92872c43f991a904c45062d5';

// Customize your riddle/question
const RIDDLE = "Where were we first gonna meet?";
```

**To generate the SHA-256 hash of your answer:**

Open your browser console and run:
```javascript
await crypto.subtle.digest('SHA-256', new TextEncoder().encode('your answer'))
  .then(h => Array.from(new Uint8Array(h))
  .map(b => b.toString(16).padStart(2, '0')).join(''))
```

Or use an online SHA-256 generator: https://emn178.github.io/online-tools/sha256.html

### 2.5. Riddle Helper Slots

**Interactive letter slots appear inside the question card:**
- Shows the number of words & letters in the correct answer as individual slots
- Typed letters appear **on top of their corresponding blank** (live fill)
- Backspace removes letters from the last filled slot
- Example: Answer `"turkey"` → shows 6 empty slots
- Example: Answer `"new york"` → shows 3 slots, gap, 4 slots
- Punctuation in the answer is ignored (only letters/digits create slots)

**How it works:**
- The `CORRECT_ANSWER` constant is parsed to extract fillable slots (letters/digits only)
- Each word is separated with a visible gap (no underline in the gap)
- As you type in the input, letters fill the slots in order
- Extra characters beyond the total slot count are ignored
- Controlled by `parseAnswerSlots()` function

**To update:**
1. Change `CORRECT_ANSWER` to your new plain text answer
2. Generate new SHA-256 hash for `CORRECT_HASH`
3. Slots are recalculated automatically

**Visual design:**
- Monospace font for clean alignment
- Each slot: gold underline (1.5-2px) with soft glow
- Empty slots: dim underline
- Filled slots: bright underline + letter appears above with text shadow
- Active slot: gentle pulse animation
- Word gaps: fixed 10px spacing (configurable via `SLOT_GAP_SIZE`)
- Staggered fade-in animation (50ms per slot)
- Respects `prefers-reduced-motion`

**Example behavior:**
- User types "t" → first slot fills with "T"
- User types "u" → second slot fills with "U"
- User presses backspace → "U" disappears from second slot
- Multi-word answer: "new york" shows as `N E W    Y O R K` (with gap)

**Edit the note box text** (appears under the password question):

Look for the TODO comment in `src/components/PasswordGate.tsx`:
```typescript
// TODO: replace this note-box text with your own description later
```
Replace the placeholder lorem ipsum with your own description of what the experience is about.

### 3. Daily Timeline Messages (`src/data/notes.ts`)

**All dates from Oct 1-21, 2025 are already included.** Look for the TODO comments:

```typescript
// TODO: add your real messages for each date here
```

**Add your personalized messages for each day:**

```typescript
export const NOTES: DayNote[] = [
  {
    date: '2025-10-01',
    title: 'Day 1',
    emoji: '🌹',
    content: 'TODO: Add your first message here.',
  },
  {
    date: '2025-10-02',
    emoji: '💝',
    content: 'TODO: Add your message for day 2.',
    // Optional: Add media
    media: {
      type: 'image',
      src: '/images/photo1.jpg',
      alt: 'Our memory'
    }
  },
  // ... continues through Oct 20
];
```

**Future dates** (beyond today) will show: *"this note unlocks at midnight ✨"*

**Media types supported:**
- `image`: Local images (put in `/public/images/`) or URLs
- `youtube`: Embed YouTube videos
- `spotify`: Embed Spotify tracks
- `audio`: Local audio files

### 4. Special October 21 Birthday Card (`src/data/notes.ts`)

**The Oct 21 card is SPECIAL** - it displays larger with a luminous border, soft glow, and confetti animation!

Look for the TODO comment:
```typescript
// TODO: insert final birthday letter and media on Oct 21
{
  date: '2025-10-21',
  title: '🎂 The Special Day',
  emoji: '🎉',
  content: `TODO: This is your final birthday message...
  
Write multiple paragraphs here expressing your deepest feelings.
Tell her everything you want her to know on her birthday.
  
This card will display larger with special effects, so make it memorable!`,
  // TODO: Add special birthday media (image/video)
  media: {
    type: 'image',
    src: '/images/birthday-special.jpg',
    alt: 'Happy Birthday'
  }
}
```

The Oct 21 card features:
- Larger size with enhanced styling
- Luminous rose-colored border with glow effect
- Confetti animation when it becomes visible
- Extra padding for longer content

### 5. Easter Egg - Hidden Feature (`src/components/EasterEgg.tsx`)

**Press the 'H' key** anywhere in the app to reveal a slideshow of personal habits you love!

The title has been updated to: **"the little habits i can't stop loving"**

Look for the TODO comment:
```typescript
// TODO: replace the 3 placeholder habits with personal ones
const HABITS: Habit[] = [
  {
    text: 'TODO: Add the first little habit you can\'t stop loving',
    image: '/images/habit1.jpg' // optional
  },
  {
    text: 'TODO: Add the second little habit you can\'t stop loving',
    image: '/images/habit2.jpg'
  },
  {
    text: 'TODO: Add the third little habit you can\'t stop loving',
    image: '/images/habit3.jpg'
  },
];
```

### 6. Love Meter Behavior

The love meter is **synced with manually revealed timeline notes**:
- Shows **5%** when 1 note is visible (Oct 1)
- Shows **~10%** when 2 notes are visible (Oct 1-2)
- Shows **~14%** when 3 notes are visible (Oct 1-3)
- Scales smoothly to **100%** when all 21 notes are visible
- Day counter shows "day X of 21" based on visible notes count

**Important**: The love meter uses the `isBlurred` boolean from notes.ts, NOT the system date. When you flip `isBlurred: false` on a note, the love meter automatically updates!

This ensures the love level always matches your manual timeline progression.

### 7. Timeline Reveal (Boolean-based)

**Timeline visibility is manually controlled** - no automatic date-based unlocking.

Each note in `NOTES` has a boolean `isBlurred` property:
- If `isBlurred: false`, the card is **fully visible**
- If `isBlurred: true`, the card is **blurred** (title + content hidden)
- **Reveal chain logic**: Once one note is unblurred, all notes before it are automatically unblurred
- **You control which notes are visible** by flipping the `isBlurred` flag

Example in `src/data/notes.ts`:
```typescript
{
  date: '2025-10-01',
  title: 'When I first saw you',
  content: 'Your message here',
  isBlurred: false, // Fully visible
},
{
  date: '2025-10-02',
  title: 'When you first confessed your love for me',
  content: 'TODO: Add your message',
  isBlurred: true, // Blurred - flip to false to reveal
},
```

**To reveal a note:**
1. Edit `src/data/notes.ts`
2. Find the note you want to reveal
3. Change `isBlurred: true` to `isBlurred: false`
4. Save and reload the page

**No date checks** - You have full control over which notes are visible at any time!

### 7.5. Locked Note Messages

Each locked note (Oct 2 → Oct 21) shows a **unique romantic line** instead of a generic message:

**How it works:**
- The `LOCKED_MESSAGES` object in `src/data/notes.ts` maps each date to a unique poetic line
- When a note is locked/blurred, it displays its specific message from this object
- If a date has no entry in `LOCKED_MESSAGES`, the fallback is: *"this note updates in the morning ✨"*

**Example from the code:**
```typescript
export const LOCKED_MESSAGES: Record<string, string> = {
  "2025-10-02": "tomorrow morning holds your next surprise ✨",
  "2025-10-03": "your next chapter arrives with the sunrise 🌅",
  "2025-10-04": "a new piece of us unlocks in the morning 💕",
  // ... and so on for each day
};
```

**To customize:**
1. Edit `src/data/notes.ts`
2. Look for the `LOCKED_MESSAGES` object (with TODO comment)
3. Change the text for any date you want
4. Keep the same format: date string → romantic line

Each locked card will show its unique message, making the waiting experience more poetic and personal!

### 8. Auto-Scroll & Reveal Animation

On unlock (after entry banner), the page automatically:
- Scrolls smoothly to today's note
- That note transitions from blurred → clear with a fade animation
- If today's note isn't found, scrolls to the first visible note
- **Respects `prefers-reduced-motion`**: If set, skips auto-scroll and shows instantly

### 9. Entry Banner

After correct password entry, a grand entry banner displays:
- **Text**: "To the Happiest 25th" / "(almost hehe)"
- **Duration**: ~2 seconds total (quick and seamless)
- **Background**: Blur overlay (12px) on top of actual page content + gradient overlay
- **Transition**: As banner text fades out, blur clears at the same speed, revealing the site
- **Design option**: See `// TODO: confirm design choice` in code to toggle between gradient+blur or pure blur

The site content is always rendering behind the blur, creating a smooth reveal effect.

The banner styling can be customized in `src/components/EntryBanner.tsx`.

### 10. Audio Autoplay

After password unlock, background music starts playing immediately:
- Plays automatically after successful password entry (1.5s delay)
- Respects `prefers-reduced-motion`: If set, does NOT autoplay
- User can pause/resume with the floating music button
- Session-only: Music stops on reload until password is re-entered

### 11. Password Gate Subtitle

Below the password question, a subtitle appears:
- **Text**: "A daily dose of 'us' question to make you smile, everyday."
- Styled in italic, muted white color (text-white/70)
- Centered below the question for a warm, inviting feel

### 12. Night Sky Reveal Surprise

A special interactive surprise effect for today's unlocked note:

**How it works:**
- When today's note is clicked, the background fades into a starry night sky
- A glowing constellation forms "E + H" in the center
- Effect lasts ~4 seconds (fade in → display → fade out)
- Runs **once per session only** - reloading resets it

**Visual details:**
- Starfield with 80 twinkling stars (soft white/blue dots)
- Constellation: 5-6 larger glowing golden points connected by faint lines
- Pulse effect on constellation letters before fade-out
- Today's note becomes clickable with hover effect

**Accessibility:**
- Respects `prefers-reduced-motion`: Shows static "E + H ✨" text instead of animation
- Non-blocking: Doesn't prevent site interaction

**To enable/disable:**
- Edit `src/components/Timeline.tsx`
- Set `ENABLE_NIGHT_SKY_REVEAL = true` (enabled) or `false` (disabled)

**Instruction box hint:**
- When enabled, instruction box shows: "Psst… try clicking today's note 🌙"
- Hint automatically hides if feature is disabled

### 6. Adding Images/Media

Place all media files in the `/public` folder:

```
public/
  ├── images/
  │   ├── day1.jpg
  │   ├── day2.jpg
  │   ├── birthday1.jpg
  │   └── ...
  ├── audio/
  │   └── background-music.mp3
  └── heart.svg (optional favicon)
```

Then reference them in your data files without `/public`:
```typescript
src: '/images/day1.jpg'  // ✅ Correct
src: '/public/images/day1.jpg'  // ❌ Wrong
```

## 🎨 Customizing Theme

### Typography

The site uses a carefully paired font system for elegant, romantic typography:

- **Headings** (titles, hero text, card titles): **Playfair Display** (`font-heading`)
  - Weight: 600-700
  - Tracking: `tracking-wide` for a dreamier feel
  - Used for: "Our Journey Together", entry banner, note titles, etc.

- **Body text** (paragraphs, notes, subtitles): **Lora** (`font-body`)
  - Weight: 400-500
  - Line height: `leading-relaxed` for comfortable reading
  - Used for: Daily messages, descriptions, captions

**To change fonts:**
1. Update `tailwind.config.js`:
```javascript
fontFamily: {
  heading: ['"Your Heading Font"', 'serif'],
  body: ['Your Body Font', 'serif'],
}
```
2. Update the Google Fonts link in `index.html`
3. Search/replace `font-heading` and `font-body` classes if needed

### Colors

Edit `tailwind.config.js` to change the color scheme:

```javascript
theme: {
  extend: {
    colors: {
      midnight: {
        900: '#0b0f19',  // Dark background
        800: '#111827',
      },
      gold: '#f5e6c4',    // Accent color
      rose: '#ff8fa3',    // Secondary accent
    },
  },
}
```

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Vercel will auto-detect Vite and deploy

### Deploy to Netlify

1. Build the project: `npm run build`
2. Drag and drop the `dist` folder to [netlify.com/drop](https://app.netlify.com/drop)

Or connect your GitHub repository for automatic deployments.

## 🔧 Project Structure

```
hamza-for-eman/
├── src/
│   ├── components/
│   │   ├── PasswordGate.tsx      # Entry password screen
│   │   ├── Timeline.tsx          # Daily messages display
│   │   ├── LoveMeter.tsx         # Progress indicator
│   │   ├── FloatingHeartCursor.tsx
│   │   ├── ParallaxPetals.tsx    # Background animation
│   │   ├── BirthdaySurprise.tsx  # Oct 21 special section
│   │   ├── EasterEgg.tsx         # Hidden H-key feature
│   │   └── AudioPlayer.tsx       # Music controls
│   ├── data/
│   │   └── notes.ts              # Your messages & content
│   ├── types.ts                   # TypeScript types
│   ├── App.tsx                    # Main app component
│   ├── main.tsx                   # Entry point
│   └── index.css                  # Global styles
├── public/                        # Static assets (images, audio)
├── index.html
├── package.json
└── README.md
```

## 💡 Tips

1. **Add audio first**: The site will work without audio, but you'll see a console warning. Add `/public/audio/bg-music.mp3` to enable music.
2. **Test the password**: Make sure to test your password after setting it up
3. **Password always required**: The password will be asked on every visit/reload - no persistence
4. **Date format**: Always use `YYYY-MM-DD` format for dates
5. **Image optimization**: Compress images before adding to keep site fast
6. **Preview before deploy**: Run `npm run build && npm run preview` to test production build
7. **Local testing**: Change dates in `notes.ts` to today's date to see unlocked content
8. **Oct 21 is special**: The final card has enhanced styling and triggers confetti

## 📱 Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🐛 Troubleshooting

**Images not showing:**
- Check file paths (should start with `/` not `/public/`)
- Verify files are in the `public` folder

**Audio not playing:**
- Some browsers require user interaction before audio plays
- Check audio file format (MP3 is most compatible)

**Audio not loading:**
- Verify the file is at `/public/audio/bg-music.mp3`
- Check the browser console for the warning message
- Try a different MP3 file if the current one has issues

**Password not working:**
- Verify you correctly generated and copied the SHA-256 hash
- Check that the answer matches exactly (case-insensitive)
- Remember: password is required on every visit (no persistence)

**Build errors:**
- Run `npm install` to ensure all dependencies are installed
- Check Node.js version (should be v18+)

## ❤️ Made with Love

Built with React, TypeScript, TailwindCSS, and Framer Motion.

Special touches include:
- Smooth animations respecting `prefers-reduced-motion`
- Accessible with ARIA labels and keyboard navigation
- SEO blocked with `noindex` meta tag for privacy
- Password required every visit for privacy
- Background music with session-only playback
- Special Oct 21 card with confetti animation
- Easter egg slideshow (press 'H' key)
- Love meter that never shows 0%

---

**For Eman, with all my love 💕**
