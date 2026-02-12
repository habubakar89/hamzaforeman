export interface Letter {
  id: number;
  title: string;
  body: string[];
}

export const LETTERS: Letter[] = [
  {
    id: 0,
    title: "For when we fight",
    body: [
      "Baby, we are and will be a couple. We are two very different people, but always remember - We chose each other. We choose each other and will continue to do so.",
      "Nothing else matters. Not the problem, not our anger, no ego, nothing. Remember, if we are together, we can do anything. You trust me to lead the family, I trust you to make one.",
      "There is affection, there is attraction, and there is love. With love between each other and for each other, don't you think we can battle even the strongest blows we face?",
      "My heart in yours, your hand in mine, and our trust in us - All that ever matter."
    ]
  },
  {
    id: 1,
    title: "The long distance paradigm",
    body: [
      "Eman - We have been in long distance for a year now. Yet it seems like we might have to wait another one.",
      "I know it is tough, I know we hate it, and the distance kills us - But can anything break us? You tell me baby, I do not think so.",
      "I believe that this distance only speaks more towards our love, and it strengthens our feelings for one another.",
      "More so, it makes us truly appreciate what we value about one another. For now, and for the rest of our lives."
    ]
  },
  {
    id: 2,
    title: "Welcome to the family",
    body: [
      "For the first time, welcome to the family, my love. You now have a pair of parents, a sister who will annoy you to hell, and a partner who loves you more than you know.",
      "I know time and again, you will miss your family. Thousands of miles away, yet not one day will pass by when you will miss home.",
      "My baby, home will be where we are. And with this, you don't lose, you only have gained the number of people who love you, pray for you, and want to see you happier than they ever have been.",
      "In particular, mom will be the one who will love you more than you could've thought. She loves me yes, but I already feel her allegiance shifting towards you :p"
    ]
  },
  {
    id: 3,
    title: "You think I do not miss you?",
    body: [
      "When we have even one small fight, my whole day goes up in shackles. It is not anger I ever feel, but every such time, I miss you even more.",
      "I know that in the same situation - You in front of me, everything would have been different.",
      "Just know that I miss you, in the good in the bad, in the happy and the sad, and in everything I have ever had.",
      "The touch of your skin, the calm of your presence, and the smile on those cheeks, are way too valuable to me. I have missed them enough, it is now time I get to see them every single day."
    ]
  },
  {
    id: 4,
    title: "What do we have up next?",
    body: [
      "We have so much to do baby. For the time we become one, to you coming here, and everything we do after, iA.",
      "I want to consult you on the house I rent, to the clothes I choose, to the car we soon buy, to everything else and counting.",
      "I want to take you to the tallest mountains in the Yosemite, to the beautiful city of Boston. I want you to immerse yourself in the fall of the east, the beaches of the west, and everywhere in between. All of them - With me by your side.",
      "I cannot fathom how much we will do soon enough, together. Our first Europe trip Eman, I cannot be anymore excited love!"
    ]
  }
];

export const VOWS: string[] = [
  "To the girl who wakes up at the faintest of sounds - Know that I will give you peace.",
  "To the girl who cannot sleep without me on call - Know that I will be there, right next to you.",
  "To the girl who is the most shy of them all - Know that I will be there every time you need someone to talk to.",
  "To the girl who has dreamt of love and life - Know that I am here to make your dreams come true.",
  "To the girl who has always believed, and never gave up - Know that it is time, our time for the rest of our lives, and more. iA!"
];

export const FINAL_NOTE = `Eman, I wish you a very very happy anniversary my love! I absolutely adore you. My cutie patootie, my lovely cotton fur ball, and my 400 grams of pure grace. I love you Eman, and I miss you more than you ever will know. But soon, I won't iA. It will be our time Eman, all our time!`;

// Constellation star positions (percentage-based for responsive layout)
// Arranged in a heart-like constellation pattern
export const STAR_POSITIONS = [
  { x: 50, y: 25 },  // Top center
  { x: 25, y: 45 },  // Left
  { x: 75, y: 45 },  // Right
  { x: 35, y: 70 },  // Bottom left
  { x: 65, y: 70 },  // Bottom right
];

// Lines connecting the stars (indices)
export const CONSTELLATION_LINES = [
  [0, 1], // Top to left
  [0, 2], // Top to right
  [1, 3], // Left to bottom left
  [2, 4], // Right to bottom right
  [3, 4], // Bottom left to bottom right
];
