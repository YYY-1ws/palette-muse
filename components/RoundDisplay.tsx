"use client";

import { AnimatePresence, motion } from "framer-motion";
import { PaintingCard } from "./PaintingCard";
import type { Painting } from "@/lib/types";

interface RoundDisplayProps {
  roundIndex: number;
  total: number;
  theme: string;
  paintings: Painting[];
  selectedId: string | null;
  onSelect: (painting: Painting) => void;
}

export function RoundDisplay({
  roundIndex,
  total,
  theme,
  paintings,
  selectedId,
  onSelect,
}: RoundDisplayProps) {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-8">
      <header className="mb-6 text-center">
        <div className="text-xs uppercase tracking-widest text-neutral-400">
          {roundIndex + 1} / {total} · {theme}
        </div>
        <h2 className="mt-2 text-2xl font-medium text-neutral-900">
          选一幅你最喜欢的
        </h2>
      </header>

      <AnimatePresence mode="wait">
        <motion.div
          key={roundIndex}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.32, ease: "easeOut" }}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          {paintings.map((p) => (
            <PaintingCard
              key={p.id}
              filename={p.filename}
              name={p.name}
              artist={p.artist}
              selected={selectedId === p.id}
              dimmed={selectedId !== null && selectedId !== p.id}
              onClick={selectedId ? undefined : () => onSelect(p)}
              aspectClassName="aspect-[4/3]"
              objectPosition={p.objectPosition}
              eager
            />
          ))}
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex justify-center gap-2">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-1 w-8 rounded-full transition-colors ${
              i < roundIndex
                ? "bg-neutral-800"
                : i === roundIndex
                  ? "bg-neutral-500"
                  : "bg-neutral-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
