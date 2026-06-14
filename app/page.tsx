"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#f5ecd7] via-[#e8d4a8] to-[#a7c5bd]">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center"
      >
        <h1 className="text-5xl font-light tracking-tight text-neutral-900 md:text-6xl">
          Palette Muse
        </h1>
        <p className="mt-4 text-base text-neutral-700 md:text-lg">
          Discover your colors through masterpieces
        </p>
        <p className="mt-1 text-sm text-neutral-500">从名画中发现你的色彩</p>

        <Link
          href="/assessment"
          className="mt-12 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-8 py-4 text-sm text-white shadow-lg transition hover:scale-[1.03] hover:bg-neutral-800"
        >
          🎨 Discover my style
        </Link>
      </motion.div>
    </main>
  );
}
