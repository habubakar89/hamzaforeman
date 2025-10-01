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
// Line 11: Customize your riddle/question
const RIDDLE = "Where were we first gonna meet?";

// Line 9: Replace with your SHA-256 hash (current: "turkey")
const CORRECT_HASH = 'your-new-hash-here';
```

**To generate the SHA-256 hash of your answer:**

Open your browser console and run:
```javascript
await crypto.subtle.digest('SHA-256', new TextEncoder().encode('your answer'))
  .then(h => Array.from(new Uint8Array(h))
  .map(b => b.toString(16).padStart(2, '0')).join(''))
```

Or use an online SHA-256 generator: https://emn178.github.io/online-tools/sha256.html

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

The love meter now **never shows 0%**:
- On **October 1**: Shows at least **5%**
- Scales smoothly to **100% on October 21**

This ensures the love level is always visible and meaningful from day one!

### 7. Timeline Blurring

Each note in `NOTES` has a boolean `isBlurred` property:
- If `isBlurred: true`, the card renders blurred (title + content)
- If `isBlurred: false`, the card is fully visible
- **Reveal chain logic**: Once one note is unblurred, all notes before it are automatically unblurred
- To control which days unlock, set that day's `isBlurred` to `false` and keep future ones `true`

Example in `src/data/notes.ts`:
```typescript
{
  date: '2025-10-01',
  title: 'When I first saw you',
  content: 'Your message here',
  isBlurred: false, // Visible
},
{
  date: '2025-10-02',
  title: 'title for oct 2',
  content: 'TODO: Add your message',
  isBlurred: true, // Blurred until you change this
},
```

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
