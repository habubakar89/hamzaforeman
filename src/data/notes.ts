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
    title: 'Urmm...when we fight',
    emoji: '🌺',
    content: 'Every time we fight, I am soon enough reminded of how much I already miss you and every time, how much I love you. Yeah, it has been a dreadful long distance, and I do not believe there is every anything between us that would cause us to fight. Even if we do, baby know that nothing matters than each of us, and the two of us together. \n\n We are not perfect for each other, just like everyone else. However, I do believe that we are right for one another. Right to keep the other above all our anger, our frustrations, and our misundestandings. \n\n And I know for sure that once we meet, we finally will see each other for who we really are, and not a chat or a 2D video on the phone. It will be special, it will be real, and it will be us. \n\n For every fight, I will keep you ahead, and I will love you more. I know you are the sweetest, cutest and most loving creatuer to walk the earth, and you deserve more love than one could every imagine, and that is only the beginining. I will show you, I will tell you, and I will make you feel every ounce of it. \n\n And right now, I am in your heart, so much so that wou will again message me something cute hehe. Love you baby 💕',
    isBlurred: false,
  },
  {
    date: '2025-10-07',
    title: 'A special day for the both of us',
    emoji: '💖',
    content: 'It is a typical morning. Wind bustling through the leaves, birds chirping, and people getting along their usual day. Amidst all the hustle and bustle, there is a cry. The cry of a baby who would bring forth the most amazing smile, the most innocent love, and all the more precious presence. \n\n Little do mama and baba know, that this baby would grow up to be a lady who exhibits love, who preaches kindness, and who spreads laughs. Little did a year old kid near Makkah know that this girl who would mean so much to him, would even then make his heart skip a beat. \n\n Two weeks to go to your birthday meri jaan, and I can not wait to see you, kiss you, and wish you the happiest birthday, yet. I am so happy to be the one to spend it with you. Look at you, tell you how beautifully gorgeaous you always look, and that every minute I waited to see you, has been worth it. \n\n I am almost there baby, and I know my words can not express a cent percent of what my eyes will\' on your day, on our day 💖 💕 💞',
    isBlurred: false,
  },
  {
    date: '2025-10-08',
    title: 'What makes you, you!',
    emoji: '🌼',
    content: 'You are just another girl, one our of a billion others. What really does make you special? What is it that has you stand out in a crowd that has a million others? It is your smile. They say, a smile is a window to one\'s soul, and I couldn\'t agree more. \n\n It is pure, it is authentic, and it is a testament to your heart, to all that you stand for. Just like how easy it can fade away, it is as easy to win it back. I know it is not easy. Smiling and being yourself in a world that truly doesn\'t appreciate very moment you breathe. Every step you take, and every word you say. Yet, despite all that you see and endure, you still smile. You still love. For yourself, and for those around you. While it must seem all I have talked about is a single word today, believe me: It is what I so genuinely think of, all the time. I pray to Allah you never lose that smile, only that it grows brighter. \n\n Eman, I wish with every step I take, I can be the reason behind that. To every word I say, I make you laugh. Just like you would smile everyday, and just like I made you smile right now 💕',
    isBlurred: false,
  },
  {
    date: '2025-10-09',
    title: 'How\'d it feel touching you for the first time?',
    emoji: '💗',
    content: 'Gori Pakori! That\'s how I think you look. A milky smooth skin, a face as pure as the moonlight, and skin as sof as silk. Yaar, I am not even sure how you would feel with these big, rugged hands of mine touching yours. Bahot carefully cheezen krni hogi Eman! \n\n But jokes apart, kind of a week to go. I can not wait to feel your touch baby. How you would look when you just took a shower, how you would you look having just woke up, and how amazing you\'d go with morning coffee 💝. I truly believe that soft skin of yours is a testament to who you are as a person love. Maybe you\'re even better, softer than the steps you take, more heart than the smile you have, and more so full of life that you already seem. I know you speak less, but I want to thread through every word, every letter to uncover the story written beneath! 8 days to go, see you soon hottie 😘',
    isBlurred: false,
  },
  {
    date: '2025-10-10',
    title: 'Turning a dream into a reality :)',
    emoji: '🌷',
    content: 'Turning a dream into a reality :) \n\nAs I embark on my journey to you, it feels different. Unlike every other time, it’s not just a destination I have in mind. Hurdles, fights, long days and longer night: they’re all a part of the journey I think had just begun. It’s different, it’s special, it’s scary even.\n\nBut we’ve come all the way here, and it’s only fitting we go right ahead. I’m no longer going to have to ask you to believe. I’m no longer going to have to ask you to wait or hope for the best. \n\nYaar Eman, kya nahi kiya nahi humne? Saudi fair, Turkey fair and so much. Funnily enough, humara aapke hi shehr Mei milna likha tha. Alhamdulillah, no matter the time, I do get to meet you my love :) \n\nAnd for the scary part, baby it’s just me. Pookie :) I’m gonna be calm, a cutie and yours just like always am. So don’t put too much thought into this. It’s natural, it’s us :) ',
    isBlurred: false,
  },
  {
    date: '2025-10-11',
    title: 'Kaun hai vo?',
    emoji: '💓',
    content: 'Hmm, what do we talk about today? Let’s talk about Eman. Eman Faiz, a girl who’s shy and innocent, and one who’s always the sweetest little human in the room. \n\nYes, the Eman who always puts others ahead of her own. The girl who lets things go, who gets hurt by the smallest things yet finds it in her heart to love like no one else. She is light, she is love, and she is life. \n\nAnd the little smile she gives when she’s happy. She doesn’t laugh like mad, she doesn’t cry loud when she’s sad. And maybe she doesn’t know this much, but she’s the perfect portrayal of a lady. What I absolutely love about her is how much she loves her family. In a world full of material, she’s one who believes in family. ',
    isBlurred: false,
  },
  {
    date: '2025-10-12',
    title: 'What a cute little dream baby!!',
    emoji: '🌻',
    content: 'I honestly now love this ritual we have, and the fact that you open this everyday and are so invested in what I have so say about you, about us :)\n\n Okay so maybe you deserve to know what I dream of! I honestly felt so real, it all felt so magical baby!\n\nSothe most important thing I dreamt of was how close we were. In the life, in the lobby and all of it, I literally pulled you towards me every time I had a chance. I kissed you and you only had your eyes set on me. Just looking into my eyes, filled with passion and smiles. We got married even, and we got married in such a hurry that I even forgot to even invite so many friends. \n\n More than anything, the idea, the mood and the setting behind the dream was how it is all just about you and me, alone. Even with so many people around us, so much happening, it was just us. I absoltely love it how I am getting such strong feeling right when I am going to meet you for the first time! I will tell you more actually, gonna save some content for when we meet lol. Maybe I will get more content tonight :p.\n\n4 days for me to catch my flight, 96 more hours to see you, and 5760 minutes to hold you in my arms. I can not wait baby, I can not wait 💕!',
    isBlurred: false,
  },
  {
    date: '2025-10-13',
    title: 'Life without you? Not for long cutie, In Sha Allah',
    emoji: '💞',
    content: 'Hi my love,\n\nThis is an amalgamation of all the days I have missed you. I probably do not share it much, but it breaks me seeing my right half all the way in the other part of the world. \n\nI miss you so so damn much, even when I might be the busiest. I wanna have you right next to me, so that I can share all the stories, and all about my entire days. Let it be me climbing the half dome, or my smallest tussles at work. I absolutely love it when you listen to me, every detail, every single thing. And I know Mei apple annoy karta hu kabhi kabhi asking you the same questions, but baby I love to know every detail of your day :) Aapko sach batau na, it makes me feel closer to you. And my love, itna lamba time distance hoagya, I just want to live my life not just share those deets with you. \n\nAnd pata hai, it is not just this: everything I do. Love, I am not the guy who stays out late, or is out with friends a lot or much, mujhe sab aapke saath karna hai. It hurts my so damn much, ki I go to the gym and you go there. I wish jaldi saath ho. Mujhe aapko sab pyaar se sikhana hai. I actually stare at the gym. Not girls but couples who look so cute together. It only reminds me of how cute and hot we would look! \n\nAnd every place I visit, ab pata hai I feel less excited. As I get closer to you every day, I feel the urge to see all these with you. I think I am coming to an end to these trips without you. My first trip will be to Riyadh with you baby Jaan, and that will be our beginning. Eman; Norway, Greece, Yellowstone, Italy, Paris, and so much more, this is just the beginning. And yeh sab to Mei definitely akele nahi kar rha. I dream of the days when you have no idea where we are going. Aap bas pyaari lag rhi ho, baaki trip and the planning is all on me. In Sha Allah I will soon be able to show this side of mine to you. \n\nYou make me happy, you make me more of myself. And with you and you alone, all these places, they will be a tad more special :)',
    isBlurred: false,
  },
  {
    date: '2025-10-14',
    title: 'Making up for the lost time, In Sha Allah',
    emoji: '🌹',
    content: 'Okay I am just a guy haa, I make mistakes baby...But yes I do have to do better. \n\n First reason, mujhe bahut dar lagta inn madam se. Second maybe because she is just the most wonderful girl ever! Anyway, Eman ofc I love to tell you about my day, always. From the moment I open my eyes in the morning to the one I sleep at night. I want to tell you everything, and I want to hear everything about you 💕. \n\n Even if it is me ranting about anyone at work, or my smallest wins to the biggest ones, you are the first and mostly the only one I wanna share it with. I have always felt like I was the best listener, but you always outdo me. Better than me, you listen to me with love, respect and admiration. And I love that about you. My baby, my honey bloom and my cutie, I love youuuuuu so much. And soon enough not only do I wanna share stories with you, but end up living them together!',
    isBlurred: false,
  },
  {
    date: '2025-10-15',
    title: 'Less than 24 hours to go 🤩!!',
    emoji: '💝',
    content: 'Two days before I meet my love…\nMy heart’s already packed and above.\nThe suitcase? Maybe half a mess—\nBut my feelings? Oh, no less!\n\nI\’ve triple-checked my flight, my shoes,\nStill can\’t believe it\’s finally you.\nEvery hour feels twice as long,\nEven coffee hums a waiting song.\n\nTomorrow I leave, all nerves and glee,\nButterflies booked the seat with me.\nWill I trip? Probably. Forget to breathe? For sure.\nBut your smile\’s the cure I\’m waiting for.\n\nFrom texts to calls to hearts that knew,\nIt\’s time the world sees me and you.\nSo here\’s to hugs, to sparks, to fate—\nJust one more sleep… I can\’t wait! 💕✈️',
    isBlurred: false,
  },
  {
    date: '2025-10-16',
    title: 'Almost there, my love!',
    emoji: '🌸',
    content: 'Less than two days before I see my baby, \nI know she’s gonna be the most beautiful lady \n\nSomeone whose presence I’ve wanted to feel for so long \nEven from a thousand miles away, every word of her feels like a song\n\nShe’s peace to my eyes, music to my ears, calm to my presence \nShe doesn’t realize how much everything she’s stands for is of essence \n\nThey say you’ve got to wait for something that truly deserves you \nHad I known it’ll be this girl, I’d know \n\nEman, my love. My baby and my life\nI’m coming for you. It’s now time, I’ve waited enough for all my life :) ',
    isBlurred: false,
  },
  {
    date: '2025-10-17',
    title: 'After Six Moons Apart',
    emoji: '💕',
    content: 'Six moons have passed, yet you stayed in my heart,\nMiles tried their best, but couldn’t keep us apart.\nFrom Turkey’s skies to Riyadh’s glow,\nIn hours, I’ll see the love I know.\n\nYour face — my calm, your voice — my peace,\nAll waiting moments now find release.\nThe wait is done, the distance ends,\nToday I meet my love, my heart, my friend. 🤍',
    isBlurred: false,
  },
  {
    date: '2025-10-18',
    title: 'We meet, fianlly ❤️',
    emoji: '🌺',
    content: `Seconds, minutes, hours, days and months. That’s the metric of how much we’ve waited and envisioned ourselves with each other. 

Tears of joy, those of sorrow, the laughs and the anger, the frustration and everything that came along, we’ve endured it all. 

Eman, you turned out to be 10x the lady I envisioned I would meet. You’re so soft baby, and I’m not talking just about the touch here. Your presence is healing. Concealing of the noise in the streets around us. Your voice is soothing to my ears, and to my heart. I’m so happy we waited. Waited so long for a moment that sure feels like one beautiful song ❤️. 

I’ll be honest with you baby. I didn’t get you my 100% yet. I’ve made mistakes, I’ve hurt you, and I’ve been way off about the person you are. Baby, from today and especially now on, you’re gonna have more of me. And I’ll tell you, it will never be a 100%. Not through my efforts, but how much love I strive to give you, and how much more you deserve it 💕. 

There’s this breeze moving around, one that reinstates everything I’ve asked for, everything I’ve believed in. My life, at this exact moment, has come to a freeze. Suddenly everything is so beautiful, I have a special smile that soothes my existence down. I’m at peace in a way I’ve never been. Maybe the way I slept on your arms already showed you how I now feel. 

Baby, love had always been my downfall. I’m not talking about my relationships, but life in general. Trust me, I’ve been through so much hurt, and that’s why you didn’t see that side of me before. But look at you, how can I be around you and not be full of love, life and laughter? It’s realistically straight impossible. With you, my love is always going to be my biggest strength. 

I’m 100x the man you still know. Eman, with you by my side I have no idea the man I can be, In Sha Allah. The job I’ve been talking about? The move? Now I’ll do it, dil se. Just delkhte jaao ab, In Sha Allah. I wanna give you a better life than I have lived, and what’s even written for me, In Sha Allah. I can honestly write a 1000 more words right now. But I’ll keep it short. More of these things; my eyes will speak to you, more than my words ever can. 

I love you, H.`,
    isBlurred: false,
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
