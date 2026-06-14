"use client";

import { motion } from "framer-motion";
import type { PersonalityInfo } from "@/lib/types";

export function PersonalityResult({ info }: { info: PersonalityInfo }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="text-center"
    >
      <div className="text-5xl">{info.icon}</div>
      <h1 className="mt-4 text-3xl font-semibold text-neutral-900">
        {info.nameEn}
      </h1>
      <div className="mt-1 text-sm text-neutral-400">{info.name}</div>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-neutral-600">
        {info.descriptionEn}
      </p>
    </motion.div>
  );
}
