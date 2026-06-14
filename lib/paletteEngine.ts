import type {
  Color,
  GeneratedColor,
  Personality,
  SelectedPainting,
} from "./types";

interface Hsl {
  h: number;
  s: number;
  l: number;
}

function hexToHsl(hex: string): Hsl {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
        break;
      case g:
        h = ((b - r) / d + 2) * 60;
        break;
      case b:
        h = ((r - g) / d + 4) * 60;
        break;
    }
  }
  return { h, s, l };
}

function conflicts(a: Color, b: Color): boolean {
  const hslA = hexToHsl(a.hex);
  const hslB = hexToHsl(b.hex);
  if (hslA.s < 0.15 || hslB.s < 0.15) return false;
  const diff = Math.min(
    Math.abs(hslA.h - hslB.h),
    360 - Math.abs(hslA.h - hslB.h),
  );
  return diff < 15;
}

export function weightedRandomPick(colors: Color[]): Color {
  const totalWeight = colors.reduce((sum, c) => sum + c.weight, 0);
  let r = Math.random() * totalWeight;
  for (const color of colors) {
    r -= color.weight;
    if (r <= 0) return color;
  }
  return colors[colors.length - 1];
}

interface PaletteSlot {
  color: Color;
  source: SelectedPainting;
}

function checkHarmony(slots: PaletteSlot[]): PaletteSlot[] {
  for (let pass = 0; pass < 3; pass++) {
    let changed = false;
    for (let i = 0; i < slots.length; i++) {
      for (let j = i + 1; j < slots.length; j++) {
        if (conflicts(slots[i].color, slots[j].color)) {
          const targetIdx =
            slots[i].color.weight <= slots[j].color.weight ? i : j;
          const target = slots[targetIdx];
          const candidates = target.source.colors.filter(
            (c) => c.hex !== target.color.hex,
          );
          if (candidates.length > 0) {
            target.color = weightedRandomPick(candidates);
            changed = true;
          }
        }
      }
    }
    if (!changed) break;
  }
  return slots;
}

export function generatePalette(
  selections: SelectedPainting[],
  maxRerolls = 3,
): GeneratedColor[] {
  let slots: PaletteSlot[] = selections.map((s) => ({
    color: weightedRandomPick(s.colors),
    source: s,
  }));
  slots = checkHarmony(slots);
  return slots.map((s) => ({
    hex: s.color.hex,
    name: s.color.name,
    nameEn: s.color.nameEn ?? s.color.name,
    fromPainting: s.source.name,
    fromPaintingEn: s.source.nameEn ?? s.source.name,
    fromArtist: s.source.artist,
    fromArtistEn: s.source.artistEn ?? s.source.artist,
    rerollsLeft: maxRerolls,
  }));
}

export function rerollColor(
  paintingColors: Color[],
  currentHex: string,
  otherPaletteColors: Color[],
): Color {
  const available = paintingColors.filter((c) => c.hex !== currentHex);
  if (available.length === 0) {
    return paintingColors[0];
  }
  for (let attempt = 0; attempt < 3; attempt++) {
    const candidate = weightedRandomPick(available);
    const hasConflict = otherPaletteColors.some((other) =>
      conflicts(candidate, other),
    );
    if (!hasConflict) return candidate;
  }
  return [...available].sort((a, b) => b.weight - a.weight)[0];
}

export function determinePersonality(
  selections: SelectedPainting[],
): Personality {
  const counts: Record<Personality, number> = {
    fresh: 0,
    dark: 0,
    warm: 0,
    east: 0,
  };
  for (const s of selections) counts[s.personality]++;

  const maxCount = Math.max(...Object.values(counts));
  const winners = (Object.entries(counts) as [Personality, number][])
    .filter(([, c]) => c === maxCount)
    .map(([p]) => p);

  if (winners.length === 1) return winners[0];

  for (let i = selections.length - 1; i >= 0; i--) {
    if (winners.includes(selections[i].personality)) {
      return selections[i].personality;
    }
  }
  return winners[0];
}
