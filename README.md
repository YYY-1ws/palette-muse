# Palette Muse

Discover your color personality through art. Pick the paintings you're drawn to across five rounds, and Palette Muse builds a personal color palette from the ones you chose.

**Live demo:** [palette-muse-opal.vercel.app](https://palette-muse-opal.vercel.app)

## How it works

1. **Choose** — Five rounds of four paintings each (Flowers, Landscape, Figures, Interior, Still Life). Pick your favorite in each.
2. **Discover** — Your choices map to one of four color personalities: Natural Poetic, Deep Romantic, Vintage Warmth, or Eastern Reverie.
3. **Keep** — Get a five-color palette pulled from your chosen paintings. Tap a swatch to copy its HEX, re-roll any color, or save the palette as a card.

## Features

- 20 masterpieces from Monet to Hokusai, each tagged with its signature colors
- Palette generation with a harmony check so the five colors sit well together
- Re-roll any color up to three times
- Shareable 1080×1080 palette card (Web Share on mobile, download on desktop)
- Progress is saved locally, so you can close the tab and resume later
- English-primary, Chinese-secondary throughout

## Tech

- [Next.js 16](https://nextjs.org) (App Router) · React 19 · TypeScript
- Tailwind CSS v4 · Framer Motion
- Zustand (persisted store) for assessment state
- `html-to-image` for the share card · `sharp` for image preprocessing

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The processed painting images are committed under `public/paintings/`, so the app runs out of the box. To regenerate them from full-resolution sources placed in `raw-images/` (gitignored):

```bash
npm run preprocess-images
```

## Project structure

```
app/          routes: landing, /assessment, /result
components/   PaintingCard, RoundDisplay, PersonalityResult, ShareCard…
lib/          rounds.json (paintings + colors), palette engine, Zustand store
scripts/      image preprocessing
public/       processed painting images
```
