// Timestamp map for /audio/audio.mp3.
// Manually aligned via vocal-band RMS energy + onset detection (scipy/ffmpeg).
// Audio duration: 239.49s — vocal content ends at ~232s, then fadeout.
// All timings derived from spectral analysis of the vocal frequency band (300–3500 Hz).
// Key section anchors: Verse 1 @ 7.3s, Chorus 1 @ 58.7s, Verse 2 @ 93.5s,
// Pre-Chorus 2 @ 126.0s, Chorus 2 @ 145.0s, Bridge @ 178.0s,
// Pre-Chorus 3 @ 200.5s, Final Chorus @ 213.0s.

export const WEDDING_AUDIO_SRC = '/audio/audio.mp3';

export type WeddingAudioCaption = {
  start: number;
  end: number;
  arabicSection: string;
  english: string;
};

export const weddingAudioCaptions: WeddingAudioCaption[] = [
  // ── Verse 1 — first vocals enter at ~7.3s after a brief instrumental intro ──
  {
    start: 7.3,
    end: 14.5,
    arabicSection: 'Verse 1',
    english: 'Your presence changed me in the most beautiful way.',
  },
  {
    start: 14.5,
    end: 20.0,
    arabicSection: 'Verse 1',
    english: 'Your love taught my heart to dream and rise.',
  },
  {
    start: 20.0,
    end: 23.0,
    arabicSection: 'Verse 1',
    english: 'You gave my days meaning, strength, and comfort.',
  },
  {
    start: 23.0,
    end: 28.5,
    arabicSection: 'Verse 1',
    english: 'You and I were brought together by Allah — may He complete it with goodness.',
  },

  // ── Pre-Chorus 1 ──────────────────────────────────────────────────────────
  {
    start: 28.5,
    end: 36.0,
    arabicSection: 'Pre-Chorus',
    english: 'You are the one who understands me.',
  },
  {
    start: 36.0,
    end: 42.5,
    arabicSection: 'Pre-Chorus',
    english: 'A star that came into my life and lit it up.',
  },
  {
    start: 42.5,
    end: 49.5,
    arabicSection: 'Pre-Chorus',
    english: 'The joy my heart once dreamed of is now in my hands.',
  },
  {
    start: 49.5,
    end: 58.7,
    arabicSection: 'Pre-Chorus',
    english: 'You are the one who understands me, the light my heart was waiting for.',
  },

  // ── Chorus 1 — strong onset at 58.7s ─────────────────────────────────────
  {
    start: 58.7,
    end: 67.5,
    arabicSection: 'Chorus',
    english: 'You and I are a beautiful story.',
  },
  {
    start: 67.5,
    end: 77.5,
    arabicSection: 'Chorus',
    english: 'Between us are memories, closeness, and a life being built together.',
  },
  {
    start: 77.5,
    end: 85.5,
    arabicSection: 'Chorus',
    english: 'InshaAllah, many beautiful years are ahead of us.',
  },
  {
    start: 85.5,
    end: 93.5,
    arabicSection: 'Chorus',
    english: 'With you, life becomes sweeter.',
  },

  // ── Verse 2 — strong onset at 93.5s ──────────────────────────────────────
  {
    start: 93.5,
    end: 99.5,
    arabicSection: 'Verse 2',
    english: 'For you, nothing feels too much.',
  },
  {
    start: 99.5,
    end: 107.1,
    arabicSection: 'Verse 2',
    english: 'You deserve the world, held gently in your hands.',
  },
  {
    start: 107.1,
    end: 115.0,
    arabicSection: 'Verse 2',
    english: 'With you, I began — and with you, I continue.',
  },
  {
    start: 115.0,
    end: 119.5,
    arabicSection: 'Verse 2',
    english: 'For you, I will be patient, strong, and present.',
  },
  {
    start: 119.5,
    end: 126.0,
    arabicSection: 'Verse 2',
    english: 'My eyes will always see you as the most beautiful — may Allah protect you.',
  },

  // ── Pre-Chorus 2 — onset at 126.0s ───────────────────────────────────────
  {
    start: 126.0,
    end: 133.0,
    arabicSection: 'Pre-Chorus',
    english: 'You are the one who understands me.',
  },
  {
    start: 133.0,
    end: 139.5,
    arabicSection: 'Pre-Chorus',
    english: 'A star that came into my life and lit it up.',
  },
  {
    start: 139.5,
    end: 145.0,
    arabicSection: 'Pre-Chorus',
    english: 'The joy my heart once dreamed of is now in my hands.',
  },

  // ── Chorus 2 — onset at 145.0s ───────────────────────────────────────────
  {
    start: 145.0,
    end: 155.0,
    arabicSection: 'Chorus',
    english: 'You and I are a beautiful story.',
  },
  {
    start: 155.0,
    end: 164.5,
    arabicSection: 'Chorus',
    english: 'Between us are memories, closeness, and a life being built together.',
  },
  {
    start: 164.5,
    end: 173.0,
    arabicSection: 'Chorus',
    english: 'InshaAllah, many beautiful years are ahead of us.',
  },
  {
    start: 173.0,
    end: 178.0,
    arabicSection: 'Chorus',
    english: 'With you, life becomes sweeter.',
  },

  // ── Bridge — energy peak at 176–178s then sectional dip at 180s ──────────
  {
    start: 178.0,
    end: 185.5,
    arabicSection: 'Bridge',
    english: 'Where were you all this time, my source of tenderness?',
  },
  {
    start: 185.5,
    end: 191.5,
    arabicSection: 'Bridge',
    english: 'In your embrace, there is safety and peace.',
  },
  {
    start: 191.5,
    end: 196.5,
    arabicSection: 'Bridge',
    english: 'May this joy last, and may every worry fade away.',
  },
  {
    start: 196.5,
    end: 200.5,
    arabicSection: 'Bridge',
    english: 'May I see you every day, with love.',
  },

  // ── Pre-Chorus 3 (final) — compressed delivery ───────────────────────────
  {
    start: 200.5,
    end: 204.5,
    arabicSection: 'Pre-Chorus',
    english: 'You are the one who understands me.',
  },
  {
    start: 204.5,
    end: 209.5,
    arabicSection: 'Pre-Chorus',
    english: 'A star that came into my life and lit it up.',
  },
  {
    start: 209.5,
    end: 213.0,
    arabicSection: 'Pre-Chorus',
    english: 'The joy my heart once dreamed of is now in my hands.',
  },

  // ── Final Chorus — energetic, rapid delivery; peaks at 213.5s and 217.0s ─
  {
    start: 213.0,
    end: 216.7,
    arabicSection: 'Final Chorus',
    english: 'You and I are a beautiful story.',
  },
  {
    start: 216.7,
    end: 220.7,
    arabicSection: 'Final Chorus',
    english: 'Between us are memories, closeness, and a life being built together.',
  },
  {
    start: 220.7,
    end: 225.8,
    arabicSection: 'Final Chorus',
    english: 'InshaAllah, many beautiful years are ahead of us.',
  },
  {
    start: 225.8,
    end: 229.8,
    arabicSection: 'Final Chorus',
    english: 'With you, life becomes sweeter.',
  },

  // ── Outro — vocals fade; content ends ~232s ───────────────────────────────
  {
    start: 229.8,
    end: 232.0,
    arabicSection: 'Outro',
    english: 'Life becomes sweeter with you.',
  },
];

export function getActiveWeddingCaption(currentTime: number): WeddingAudioCaption | null {
  return (
    weddingAudioCaptions.find(
      (caption) => currentTime >= caption.start && currentTime < caption.end
    ) ?? null
  );
}

export function getWeddingCaptionIndex(currentTime: number): number {
  return weddingAudioCaptions.findIndex(
    (caption) => currentTime >= caption.start && currentTime < caption.end
  );
}

export function getWeddingAudioDurationFromCaptions(): number {
  return weddingAudioCaptions[weddingAudioCaptions.length - 1]?.end ?? 0;
}
