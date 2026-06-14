"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GeneratedColor, SelectedPainting } from "./types";

interface AssessmentState {
  currentRound: number;
  selections: SelectedPainting[];
  generatedPalette: GeneratedColor[] | null;
  selectPainting: (round: number, painting: SelectedPainting) => void;
  setPalette: (palette: GeneratedColor[]) => void;
  updatePaletteColor: (
    index: number,
    color: { hex: string; name: string },
  ) => void;
  decrementReroll: (index: number) => void;
  reset: () => void;
}

export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set) => ({
      currentRound: 0,
      selections: [],
      generatedPalette: null,
      selectPainting: (round, painting) =>
        set((state) => {
          const next = [...state.selections];
          next[round] = painting;
          return {
            selections: next,
            currentRound: Math.min(round + 1, 5),
            generatedPalette: null,
          };
        }),
      setPalette: (palette) => set({ generatedPalette: palette }),
      updatePaletteColor: (index, color) =>
        set((state) => {
          if (!state.generatedPalette) return state;
          const next = [...state.generatedPalette];
          next[index] = { ...next[index], hex: color.hex, name: color.name };
          return { generatedPalette: next };
        }),
      decrementReroll: (index) =>
        set((state) => {
          if (!state.generatedPalette) return state;
          const next = [...state.generatedPalette];
          next[index] = {
            ...next[index],
            rerollsLeft: Math.max(0, next[index].rerollsLeft - 1),
          };
          return { generatedPalette: next };
        }),
      reset: () =>
        set({ currentRound: 0, selections: [], generatedPalette: null }),
    }),
    { name: "palette-muse-state" },
  ),
);
