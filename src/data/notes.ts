import { DayNote } from '../types';

// Unique locked messages for each day (Oct 2 → Oct 21)
// TODO: Customize these romantic lines for each locked date
export const LOCKED_MESSAGES: Record<string, string> = {
  "2025-10-02": "tomorrow morning holds your next surprise ✨",
  "2025-10-03": "your next chapter arrives with the sunrise 🌅",
  "2025-10-04": "a new piece of us unlocks in the morning 💕",
  "2025-10-05": "the dawn brings your next note 🌙✨",
  "2025-10-06": "tomorrow's sunrise carries your next story 🌸",
  "2025-10-07": "at dawn, another page of us appears 🌌",
  "2025-10-08": "when the morning light breaks, so does the next secret ✨",
  "2025-10-09": "the next memory waits for the morning sun 🌞",
  "2025-10-10": "daylight will unlock your next note 🌤️",
  "2025-10-11": "the morning whispers our next chapter 💫",
  "2025-10-12": "pinky promise — tomorrow morning's yours 💖",
  "2025-10-13": "no peeking, see you in the morning 😉",
  "2025-10-14": "tomorrow's sunrise has something sweet for you ☀️",
  "2025-10-15": "your next smile loads in the morning 💕",
  "2025-10-16": "morning brings more love, just wait ✨",
  "2025-10-17": "a soft secret waits for the sun 🌹",
  "2025-10-18": "love's next note arrives at dawn 💌",
  "2025-10-19": "the stars will rest, and your note will rise 🌠",
  "2025-10-20": "the night keeps it safe, the morning gives it back 🌙",
  "2025-10-21": "your final birthday surprise blossoms with the sunrise 🎉"
};

// Default fallback message if date not found in LOCKED_MESSAGES
export const DEFAULT_LOCKED_MESSAGE = "this note updates in the morning ✨";

// TODO: add your real messages for each date here
// TODO: replace placeholder titles for Oct 2–Oct 21 with real titles later
export const NOTES: DayNote[] = [
  {
    date: '2025-10-01',
    title: 'When I first saw you',
    emoji: '🌹',
    content: 'More than a year ago, I saw you for the first time. It was never the usual way people look at the one they\'ll forever love. Hidden beneath the blurred picture was a face that would forever capture my heart. \n\nEman, Wallahi, the moment I actually saw you, my mouth was wide open in awe and disbelief. I literally said the exact words: "Omg she\'s beautiful". There has never been a day where you do not look more angelic than the night before. I will never not be enchanted by you, drawn to you, and in love with you ♥. \n\nFunnily enough, your heart has captured me even more. But that\'s for the next time, see you tomorrow love :)',
    isBlurred: false, // First note is visible by default
  },
  {
    date: '2025-10-02',
    title: 'April 8, 2025 - When you said "I love you more Hamza"',
    emoji: '💝',
    content: 'The day you first told me you love me. You said you love me more, but you could not be wrong. If you love me a 100, at minimum I will love you 1 more than that. That\'s how it is always gonna be.\n\nEvery day, every time you talk to me, every time you text me, send me a snap, anything: It is your "I love you" to me. Eman, I can not tell you the number of times i go back and read your chats, look at your pictures, and just smile at your smile.\n\nIt means the world to me, that you chose me. More than anything or anyone, you love me. And while it mind sound cheezy, it is an honor. What makes me even happier is that your love is not about just feelings in the moment, it is also about what you think of me. What you want to be to me, and everything you want to do for me.\n\nEvery time you say that, it makes me want to be a better man. Every day, every waking moment.\n\nI love you, Eman Faiz 💕 Always one more than you 😉',
    isBlurred: false, // Set as "today" - will be the current active note
  },
  {
    date: '2025-10-03',
    title: 'title for oct 3',
    emoji: '✨',
    content: 'TODO: Add your message for day 3.',
    isBlurred: false,
  },
  {
    date: '2025-10-04',
    title: 'title for oct 4',
    emoji: '🌸',
    content: 'TODO: Add your message for day 4.',
    isBlurred: true,
  },
  {
    date: '2025-10-05',
    title: 'title for oct 5',
    emoji: '💕',
    content: 'TODO: Add your message for day 5.',
    isBlurred: true,
  },
  {
    date: '2025-10-06',
    title: 'title for oct 6',
    emoji: '🌺',
    content: 'TODO: Add your message for day 6.',
    isBlurred: true,
  },
  {
    date: '2025-10-07',
    title: 'title for oct 7',
    emoji: '💖',
    content: 'TODO: Add your message for day 7.',
    isBlurred: true,
  },
  {
    date: '2025-10-08',
    title: 'title for oct 8',
    emoji: '🌼',
    content: 'TODO: Add your message for day 8.',
    isBlurred: true,
  },
  {
    date: '2025-10-09',
    title: 'title for oct 9',
    emoji: '💗',
    content: 'TODO: Add your message for day 9.',
    isBlurred: true,
  },
  {
    date: '2025-10-10',
    title: 'title for oct 10',
    emoji: '🌷',
    content: 'TODO: Add your message for day 10.',
    isBlurred: true,
  },
  {
    date: '2025-10-11',
    title: 'title for oct 11',
    emoji: '💓',
    content: 'TODO: Add your message for day 11.',
    isBlurred: true,
  },
  {
    date: '2025-10-12',
    title: 'title for oct 12',
    emoji: '🌻',
    content: 'TODO: Add your message for day 12.',
    isBlurred: true,
  },
  {
    date: '2025-10-13',
    title: 'title for oct 13',
    emoji: '💞',
    content: 'TODO: Add your message for day 13.',
    isBlurred: true,
  },
  {
    date: '2025-10-14',
    title: 'title for oct 14',
    emoji: '🌹',
    content: 'TODO: Add your message for day 14.',
    isBlurred: true,
  },
  {
    date: '2025-10-15',
    title: 'title for oct 15',
    emoji: '💝',
    content: 'TODO: Add your message for day 15.',
    isBlurred: true,
  },
  {
    date: '2025-10-16',
    title: 'title for oct 16',
    emoji: '🌸',
    content: 'TODO: Add your message for day 16.',
    isBlurred: true,
  },
  {
    date: '2025-10-17',
    title: 'title for oct 17',
    emoji: '💕',
    content: 'TODO: Add your message for day 17.',
    isBlurred: true,
  },
  {
    date: '2025-10-18',
    title: 'title for oct 18',
    emoji: '🌺',
    content: 'TODO: Add your message for day 18.',
    isBlurred: true,
  },
  {
    date: '2025-10-19',
    title: 'title for oct 19',
    emoji: '💖',
    content: 'TODO: Add your message for day 19.',
    isBlurred: true,
  },
  {
    date: '2025-10-20',
    title: 'title for oct 20',
    emoji: '🌼',
    content: 'TODO: Add your message for day 20.',
    isBlurred: true,
  },
  // TODO: insert final birthday letter and media on Oct 21
  {
    date: '2025-10-21',
    title: '🎂 The Special Day',
    emoji: '🎉',
    isBlurred: true,
    content: `TODO: This is your final birthday message. Make it extra special and heartfelt.
    
Write multiple paragraphs here expressing your deepest feelings.
Tell her everything you want her to know on her birthday.
    
This card will display larger with special effects, so make it memorable!`,
    // TODO: Add special birthday media (image/video)
    // media: {
    //   type: 'image',
    //   src: '/images/birthday-special.jpg',
    //   alt: 'Happy Birthday'
    // }
  },
];

// Music ribbon messages that appear next to the audio player
// TODO: add your daily ribbon messages in MUSIC_NOTES_BY_DAY (optional)
export const MUSIC_NOTES_BY_DAY: Record<string, string> = {
  '2025-10-01': 'Every day, a different song will play, depicting the many different ways I love you.',
  // Add entries for other days if desired, e.g.:
  // '2025-10-02': 'Your custom message for day 2',
  // '2025-10-03': 'Your custom message for day 3',
};

// Default message if no specific day entry exists
export const DEFAULT_MUSIC_NOTE = 'Every day, a different song will play, depicting the many different ways I love you.';

// TODO: Customize the birthday surprise message
export const BIRTHDAY_MESSAGE = {
  title: 'Happy Birthday, Eman! 🎂',
  content: `
    TODO: Replace this with your personalized birthday message.
    
    This is the special message that will appear on her birthday (October 21, 2025).
    Make it heartfelt, romantic, and memorable!
    
    You can write multiple paragraphs here.
    Tell her how much she means to you.
  `,
  // TODO: Add images/videos for the birthday surprise
  media: [
    // Example:
    // { type: 'image', src: '/images/birthday1.jpg', alt: 'Special moment' },
    // { type: 'image', src: '/images/birthday2.jpg', alt: 'Another memory' },
  ] as Array<{ type: 'image' | 'youtube'; src: string; alt?: string }>,
};
