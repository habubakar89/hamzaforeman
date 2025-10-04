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
    title: 'The day I realized it was forever',
    emoji: '✨',
    content: 'Baby, this is from one of my notes I wrote during the summer:\n\nEman, a man says he loved you. He promises a lot of things, and he does a lot of them as well\n\nHowever, there is a day, there is a moment, when he thinks, \"This is it, this is forever, and she is the one!\" Truly, today is the day I have. Today is some day in the summer, but I will not write the date down, because starting today, it is every day I will want to marry you. Give you what I have and everything I will ever be. You keep me grounded, make me want to be a better man, and are truly my home 💕\n\nToday is nothing special, but when I think of a glimpse into our future: When I envision my wife with my kids, my partner with her lazy mornings, and my safe haven in the strongest tides, I see you there. You were right, and I trust you to always protect my heart.\n\nEman, I know I am not perfect, and I don\'t deserve you, but to me, I will always strive to be a better man, a better partner, and a better Muslim because of you. No matter what I have to endure, it all is nothing compared to what you mean to me! \n\nI am not sure, maybe I will give you this note, or I will save it for a special occasion. Either way, the day you meet me, you will see it in my eyes how much I mean all of this. In Sha Allah <3\n\nNow, tap on this box love, hope you like it!',
    isBlurred: false,
  },
  {
    date: '2025-10-04',
    title: 'Notes from when I told my mom about you!',
    emoji: '🌸',
    content: ' Today, I discussed you with my mom. For the first time. Wow, how was that even? I had the courage to talk to my parents about a girl? How?\n\nTwo things I’ve realized. It’s easy when you know you’re going to marry this person, and that person is more than worthy of being yours for lifetime. \n\nBut as I went on to tell you how you are, it suddenly seemed so easy. I have never done this, and this still fella so easy so right. And Eman, where do I begin? I told her about how you value family, how I see a lot of inherent qualities in you which are just like hers. How you are like a girl I’ve never met, a person I’ve never seen yet I just know. How I trust you more than I do myself, and how you’re plain beautiful Mashallah. And these are not understatements baby, look at yourself? I mean, you’re a 100 times more than all the Hoors combined!\n\nMy mom has already asked for your mom’s number haha! But I’ll wait until I meet you. In Sha Allah ❤️',
    isBlurred: false,
  },
  {
    date: '2025-10-05',
    title: 'The day that we dreamt of?',
    emoji: '💕',
    content: 'While I did have something else in mind, I wanted to share this with you baby. For the months we have been together, for days we have fought, for nights we\'ve lived with uncertainties, there now is a day that will counter them on end. It was never easy loving someone and not seeing them, not feeling their presence, not able to appreciate their presence, and just not look into their eyes, and tell them, you love them. \n\nAlhamdulillah, whatever we went through, we will finally be meeting each other, In Sha Allah. I know you and I have been waiting for so long for this to come, it almost feels unreal. But here it is, less than two weeks, maybe in this very moment, I might be reminding you this same thing ❤️.\n\nMeri jaan, my love, just pray for us that it is all over soon, and we get to be together the way we were destined. In Sha Allah. And love, don\'t worry too much, what will happen, what if something goes wrong, and what else. Just think of it as an innocent and pure testament to our relationship that we went through this so far from each other, and that we finally get to hold each other the way we deserve 😊! It will be perfect, it will be right, and In Sha Allah, it will be the two of us. I simply can not wait now, bas jaldi se yeh din nikal jaaye. My baby, my love, my cutie, we did it!!!! Kisses inbond 😘😘😘',
    isBlurred: false,
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
