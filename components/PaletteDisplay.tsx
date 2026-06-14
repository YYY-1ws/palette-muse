"use client";

import { motion } from "framer-motion";
import type { GeneratedColor } from "@/lib/types";

interface PaletteDisplayProps {
  palette: GeneratedColor[];
  onCopy: (hex: string) => void;
  onReroll: (index: number) => void;
}

function isLight(hex: string): boolean {
  const c = hex.replace("#", "");
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 150;
}

export function PaletteDisplay({
  palette,
  onCopy,
  onReroll,
}: PaletteDisplayProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-5">
      {palette.map((color, i) => {
        const light = isLight(color.hex);
        const textColor = light ? "text-neutral-900" : "text-white";
        const subText = light ? "text-neutral-700" : "text-white/80";
        const rerollDisabled = color.rerollsLeft === 0;
        return (
          <motion.div
            key={`${i}-${color.hex}`}
            initial={{ opacity: 0, rotateY: -12 }}
            animate={{ opacity: 1, rotateY: 0 }}
            transition={{ duration: 0.35, delay: i * 0.04 }}
            className="group relative aspect-square overflow-hidden rounded-xl"
            style={{ backgroundColor: color.hex }}
          >
            <button
              type="button"
              onClick={() => onCopy(color.hex)}
              className="absolute inset-0 flex flex-col justify-end p-4 text-left"
              aria-label={`Copy ${color.hex}`}
            >
              <div className={`text-base font-medium leading-tight ${textColor}`}>
                {color.nameEn}
              </div>
              <div className={`text-xs ${subText}`}>{color.name}</div>
              <div
                className={`mt-1 font-mono text-xs uppercase tracking-wider ${subText}`}
              >
                {color.hex}
              </div>
              <div className={`mt-2 text-[11px] leading-tight ${subText}`}>
                {color.fromPaintingEn} · {color.fromArtistEn}
              </div>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (!rerollDisabled) onReroll(i);
              }}
              disabled={rerollDisabled}
              title={
                rerollDisabled
                  ? "No re-rolls left (3 used)"
                  : `${color.rerollsLeft} re-roll${
                      color.rerollsLeft === 1 ? "" : "s"
                    } left`
              }
              className={`absolute right-2 top-2 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs backdrop-blur transition ${
                rerollDisabled
                  ? "cursor-not-allowed bg-black/15 text-white/40"
                  : light
                    ? "bg-black/15 text-white hover:bg-black/30"
                    : "bg-white/20 text-white hover:bg-white/30"
              }`}
              aria-label="Re-roll this color"
            >
              <span aria-hidden>🎲</span>
              <span>×{color.rerollsLeft}</span>
            </button>
          </motion.div>
        );
      })}
    </div>
  );
}
