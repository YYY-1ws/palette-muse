"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";

export interface PaintingCardProps {
  filename: string;
  /** English title — shown as the primary label. */
  nameEn: string;
  /** Chinese title — shown as a smaller subtitle. */
  name?: string;
  /** English artist — shown as the primary artist label. */
  artistEn?: string;
  /** Chinese artist — shown in the smaller subtitle. */
  artist?: string;
  selected?: boolean;
  dimmed?: boolean;
  onClick?: () => void;
  aspectClassName?: string;
  objectPosition?: string;
  /** Set for above-the-fold cards so the LCP image isn't lazy-loaded. */
  eager?: boolean;
  /** 1-based number shown as a faint keyboard-shortcut chip (assessment). */
  shortcut?: number;
  /** Marks the card the user chose last time they were on this round. */
  previouslyPicked?: boolean;
}

export function PaintingCard({
  filename,
  nameEn,
  name,
  artistEn,
  artist,
  selected = false,
  dimmed = false,
  onClick,
  aspectClassName = "aspect-[4/5]",
  objectPosition = "center center",
  eager = false,
  shortcut,
  previouslyPicked = false,
}: PaintingCardProps) {
  const [loaded, setLoaded] = useState(false);
  const src = `/paintings/${filename}`;
  const zhSubtitle = [name, artist].filter(Boolean).join(" · ");
  const interactive = Boolean(onClick);

  return (
    <motion.button
      type="button"
      onClick={onClick}
      // framer owns the transform (hover lift + tap "press"); CSS owns the
      // shadow / dim / selection ring, so the two never fight over `transform`.
      whileHover={interactive ? { scale: 1.02 } : undefined}
      whileTap={interactive ? { scale: 0.98 } : undefined}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`relative ${aspectClassName} w-full overflow-hidden rounded-lg bg-neutral-200 transition-[box-shadow,opacity] duration-200 ease-out ${
        selected
          ? "shadow-[0_14px_36px_rgba(0,0,0,0.20)] ring-2 ring-[#c2884a] ring-offset-2 ring-offset-[#f8f7f6]"
          : previouslyPicked
            ? "ring-2 ring-neutral-400/80 ring-offset-2 ring-offset-[#f8f7f6]"
            : ""
      } ${dimmed ? "opacity-40" : "opacity-100"} ${
        interactive
          ? "cursor-pointer hover:shadow-[0_12px_30px_rgba(0,0,0,0.18)]"
          : "cursor-default"
      }`}
      aria-label={artistEn ? `${nameEn} — ${artistEn}` : nameEn}
    >
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-neutral-200" />
      )}
      {shortcut !== undefined && (
        <span
          aria-hidden
          className="absolute left-2 top-2 z-10 rounded-md bg-black/35 px-1.5 py-0.5 text-xs font-medium leading-none text-white/90 backdrop-blur-sm"
        >
          {shortcut}
        </span>
      )}
      {previouslyPicked && !selected && (
        <span
          aria-hidden
          className="absolute right-2 top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-white/90 text-[11px] text-neutral-700 shadow-sm"
        >
          ✓
        </span>
      )}
      <Image
        src={src}
        alt={nameEn}
        fill
        sizes="(max-width: 768px) 100vw, 25vw"
        className={`object-cover transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ objectPosition }}
        loading={eager ? "eager" : "lazy"}
        onLoad={() => setLoaded(true)}
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-left text-white">
        <div className="text-sm font-medium leading-tight">{nameEn}</div>
        {artistEn && <div className="text-xs opacity-90">{artistEn}</div>}
        {zhSubtitle && (
          <div className="mt-0.5 text-[11px] opacity-70">{zhSubtitle}</div>
        )}
      </div>
    </motion.button>
  );
}
