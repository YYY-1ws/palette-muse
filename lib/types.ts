export type Personality = "fresh" | "dark" | "warm" | "east";

export interface Color {
  hex: string;
  weight: number;
  name: string;
  /**
   * English color name. Optional only because a couple of components build
   * lightweight Color-shaped literals (e.g. re-roll candidates) without it;
   * every color in rounds.json carries one.
   */
  nameEn?: string;
}

export interface Painting {
  id: string;
  filename: string;
  name: string;
  nameEn: string;
  artist: string;
  artistEn: string;
  year: string;
  personality: Personality;
  colors: Color[];
  objectPosition?: string;
}

export interface Round {
  round: number;
  theme: string;
  themeEn: string;
  paintings: Painting[];
}

export interface PersonalityInfo {
  name: string;
  nameEn: string;
  icon: string;
  description: string;
  descriptionEn: string;
}

export interface RoundsData {
  rounds: Round[];
  personalities: Record<Personality, PersonalityInfo>;
  config: {
    roundsTotal: number;
    choicesPerRound: number;
    colorsPerPalette: number;
    maxRerollsPerColor: number;
    harmonyCheck: { minHueDifference: number };
    personalityResolution: { method: string; tiebreaker: string };
  };
}

export interface SelectedPainting {
  id: string;
  filename: string;
  name: string;
  /**
   * English title/artist. Optional for now because the assessment page still
   * constructs SelectedPainting without them; the component step will populate
   * these (and they can be tightened to required then).
   */
  nameEn?: string;
  artist: string;
  artistEn?: string;
  personality: Personality;
  colors: Color[];
  objectPosition?: string;
}

export interface GeneratedColor {
  hex: string;
  name: string;
  nameEn: string;
  fromPainting: string;
  fromPaintingEn: string;
  fromArtist: string;
  fromArtistEn: string;
  rerollsLeft: number;
}
