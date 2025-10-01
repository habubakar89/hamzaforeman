export type DayNote = {
  date: string; // YYYY-MM-DD format
  title?: string;
  content: string;
  emoji?: string;
  isBlurred?: boolean; // If true, card renders blurred
  media?: {
    type: "image" | "audio" | "youtube" | "spotify";
    src: string;
    alt?: string;
  };
};
