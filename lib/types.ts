export type Personality = "fresh" | "dark" | "warm" | "east";

export interface Color {
  hex: string;
  weight: number;
  name: string;
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
  icon: string;
  description: string;
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
  artist: string;
  personality: Personality;
  colors: Color[];
  objectPosition?: string;
}

export interface GeneratedColor {
  hex: string;
  name: string;
  fromPainting: string;
  fromArtist: string;
  rerollsLeft: number;
}
