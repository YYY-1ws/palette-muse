"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import type { Personality } from "@/lib/types";

// Minimal line-art icons per personality, subtly tinted toward each palette so
// they sit with the refined, gallery-like aesthetic (no more emoji).
const iconStroke: Record<Personality, string> = {
  fresh: "#4a6b5a", // muted green — a leaf
  dark: "#3a4a62", // muted navy — a crescent moon
  warm: "#8a6a30", // muted bronze — a sun
  east: "#3a6a5a", // muted teal — a mountain
};

function IconFrame({ stroke, children }: { stroke: string; children: ReactNode }) {
  return (
    <svg
      width="46"
      height="46"
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {children}
    </svg>
  );
}

function PersonalityIcon({ personality }: { personality: Personality }) {
  const stroke = iconStroke[personality];
  switch (personality) {
    case "fresh": // leaf
      return (
        <IconFrame stroke={stroke}>
          <path d="M12 2.5C16 6.5 16 14.5 12 21.5C8 14.5 8 6.5 12 2.5Z" />
          <path d="M12 4.8V19.2" />
        </IconFrame>
      );
    case "dark": // crescent moon
      return (
        <IconFrame stroke={stroke}>
          <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" />
        </IconFrame>
      );
    case "warm": // sun
      return (
        <IconFrame stroke={stroke}>
          <circle cx="12" cy="12" r="4.3" />
          <path d="M12 2.5V5M12 19V21.5M2.5 12H5M19 12H21.5M5.1 5.1l1.8 1.8M17.1 17.1l1.8 1.8M5.1 18.9l1.8-1.8M17.1 6.9l1.8-1.8" />
        </IconFrame>
      );
    case "east": // mountain
      return (
        <IconFrame stroke={stroke}>
          <path d="M2.5 18.5 9 8.5l4 5.5 4.5-7 4 11.5" />
        </IconFrame>
      );
  }
}

interface PersonalityResultProps {
  personality: Personality;
  nameEn: string;
  /** Chinese name shown as a small secondary label. */
  name: string;
  description: string;
}

export function PersonalityResult({
  personality,
  nameEn,
  name,
  description,
}: PersonalityResultProps) {
  return (
    <div className="text-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="flex justify-center">
          <PersonalityIcon personality={personality} />
        </div>
        <h1 className="mt-4 text-3xl font-semibold text-neutral-900">
          {nameEn}
        </h1>
        <div className="mt-1 text-sm text-neutral-400">{name}</div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5, ease: "easeOut" }}
        className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-neutral-600"
      >
        {description}
      </motion.p>
    </div>
  );
}
