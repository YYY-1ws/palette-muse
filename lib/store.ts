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
    color: { hex: string; name: string; nameEn?: string },
  ) => void;
  decrementReroll: (index: number) => void;
  reset: () => void;
}

// Only the data is persisted (methods come from the initializer on rehydrate).
type PersistedAssessment = Pick<
  AssessmentState,
  "currentRound" | "selections" | "generatedPalette"
>;

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
          next[index] = {
            ...next[index],
            hex: color.hex,
            name: color.name,
            // Only overwrite the English name when the caller supplies it, so
            // the existing { hex, name } call site stays valid until the
            // component step starts passing nameEn through on re-roll.
            ...(color.nameEn !== undefined ? { nameEn: color.nameEn } : {}),
          };
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
    {
      name: "palette-muse-state",
      // v1 added English text fields to selections and the generated palette.
      version: 1,
      partialize: (state): PersistedAssessment => ({
        currentRound: state.currentRound,
        selections: state.selections,
        generatedPalette: state.generatedPalette,
      }),
      migrate: (persisted, version): PersistedAssessment => {
        if (version < 1) {
          // Older Chinese-only state lacks the English fields — discard it so
          // nothing rehydrates half-populated.
          return { currentRound: 0, selections: [], generatedPalette: null };
        }
        return persisted as PersistedAssessment;
      },
    },
  ),
);
