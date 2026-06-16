"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import { PaintingCard } from "./PaintingCard";
import type { Painting } from "@/lib/types";

interface RoundDisplayProps {
  roundIndex: number;
  total: number;
  theme: string;
  paintings: Painting[];
  selectedId: string | null;
  onSelect: (painting: Painting) => void;
  /** Step back one round (hidden on the first round). */
  onBack?: () => void;
  /** Id of the painting chosen here previously, when revisiting a round. */
  previousId?: string | null;
}

// Each round's four cards fade + slide up with a ~100ms stagger, so a new round
// feels like a fresh moment rather than a static swap.
const gridVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.08 },
  },
  exit: { opacity: 0, transition: { duration: 0.28, ease: "easeOut" } },
};
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export function RoundDisplay({
  roundIndex,
  total,
  theme,
  paintings,
  selectedId,
  onSelect,
  onBack,
  previousId,
}: RoundDisplayProps) {
  const progress = ((roundIndex + 1) / total) * 100;

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-8">
      <div className="relative mb-8">
        {onBack && roundIndex > 0 && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to previous round"
            className="absolute left-0 top-0.5 inline-flex items-center gap-1 text-sm text-neutral-400 transition hover:text-neutral-700"
          >
            <span aria-hidden>←</span> Back
          </button>
        )}
        <header className="text-center">
          <div className="text-sm">
          <span className="tracking-wider text-neutral-400">
            {roundIndex + 1} / {total}
          </span>
          <span className="mx-2 text-neutral-300">·</span>
          <span className="font-semibold uppercase tracking-[0.22em] text-neutral-700">
            {theme}
          </span>
        </div>

        {/* Progress bar — advances 20% per round (1/5 → 5/5). */}
        <div className="mx-auto mt-3 h-1 w-full max-w-sm overflow-hidden rounded-full bg-[#e7e5e4]">
          <motion.div
            className="h-full rounded-full bg-[#1d1d1f]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>

          <h2 className="mt-5 text-2xl font-medium text-neutral-900">
            Choose your favorite
          </h2>
        </header>
      </div>

      {/* Crossfade between rounds: the old grid fades out, then the new one
          staggers in (mode="wait"). */}
      <AnimatePresence mode="wait">
        <motion.div
          key={roundIndex}
          variants={gridVariants}
          initial="hidden"
          animate="show"
          exit="exit"
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          {paintings.map((p, i) => (
            <motion.div key={p.id} variants={cardVariants}>
              <PaintingCard
                filename={p.filename}
                nameEn={p.nameEn}
                name={p.name}
                artistEn={p.artistEn}
                artist={p.artist}
                selected={selectedId === p.id}
                dimmed={selectedId !== null && selectedId !== p.id}
                previouslyPicked={!selectedId && p.id === previousId}
                shortcut={i + 1}
                onClick={selectedId ? undefined : () => onSelect(p)}
                aspectClassName="aspect-[4/3]"
                objectPosition={p.objectPosition}
                eager
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
