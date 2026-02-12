export interface Photo {
  id: number;
  src: string;
  alt: string;
  caption?: string;
}

// Your photos in /public/photos/
export const PHOTOS: Photo[] = [
  { id: 1, src: '/photos/IMG_6983.JPG', alt: 'Memory 01', caption: 'Our beginning' },
  { id: 2, src: '/photos/IMG_6985.JPG', alt: 'Memory 02', caption: 'Together' },
  { id: 3, src: '/photos/IMG_6998.JPG', alt: 'Memory 03', caption: 'Precious moment' },
  { id: 4, src: '/photos/IMG_7001.JPG', alt: 'Memory 04', caption: 'Smiles' },
  { id: 5, src: '/photos/IMG_7081.JPG', alt: 'Memory 05', caption: 'Adventure' },
  { id: 6, src: '/photos/IMG_7086.JPG', alt: 'Memory 06', caption: 'Always us' },
  { id: 7, src: '/photos/IMG_7090.JPG', alt: 'Memory 07', caption: 'Laughter' },
  { id: 8, src: '/photos/IMG_7463.JPG', alt: 'Memory 08', caption: 'Forever' },
  { id: 9, src: '/photos/IMG_8012.JPG', alt: 'Memory 09', caption: 'Our story' },
  { id: 10, src: '/photos/IMG_6964.JPG', alt: 'Memory 10', caption: 'To infinity' },
];

// Number of photos unlocked per letter opened
export const PHOTOS_PER_LETTER = 2;
