"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { Cormorant_Garamond } from "next/font/google";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
});

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function HomePage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#f5f4f8] px-6 py-20">
      {/* B&W gallery photograph as a full-page cover background, positioned to
          keep the floor / perspective lines in frame. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-cover"
        style={{
          backgroundImage: "url('/black-bg.jpg')",
          backgroundPosition: "center 40%",
        }}
      />

      {/* Lighter, slightly-tinted overlay → the B&W gallery reads as atmospheric
          texture; it doesn't clash with the UI, so we let more show through. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[rgba(245,244,248,0.62)]"
      />

      {/* Center wash → a soft bright panel that (a) guarantees consistent text
          contrast over the variable photo and (b) pulls focus to the content
          column. Taller/stronger than before so it covers title → footer line;
          the gallery still reads at the edges and corners. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_64%_74%_at_50%_48%,rgba(245,244,248,0.82)_0%,rgba(245,244,248,0.5)_46%,rgba(245,244,248,0)_82%)]"
      />

      {/* Hero */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 flex flex-col items-center text-center"
      >
        <motion.div variants={item} aria-hidden>
          <PaletteMark />
        </motion.div>

        <motion.h1
          variants={item}
          className={`${cormorant.className} mt-8 text-7xl font-medium tracking-[0.03em] text-[#1d1d1f] md:text-8xl`}
        >
          Palette Muse
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-6 text-lg font-medium tracking-[0.04em] text-[#1d1d1f] md:text-xl"
        >
          Discover your color personality through art
        </motion.p>

        <motion.p
          variants={item}
          className="mt-5 text-sm tracking-[0.03em] text-[#6e6e73]"
        >
          Five rounds · Twenty masterpieces · From Monet to Hokusai
        </motion.p>

        <motion.div variants={item}>
          <Link
            href="/assessment"
            className="mt-14 inline-flex items-center rounded-full bg-[#1d1d1f] px-10 py-4 text-sm font-medium tracking-[0.04em] text-white shadow-[0_8px_24px_rgba(29,29,31,0.28)] transition hover:bg-[#2c2c2e] hover:shadow-[0_10px_30px_rgba(29,29,31,0.34)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d1d1f] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4f3f8]"
          >
            Discover my style
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}

// Small palette mark: an arc of five paint wells. A deliberate burst of color
// against the monochrome page — the one accent, hinting at the color that the
// quiz reveals inside.
function PaletteMark() {
  const dots = [
    { cx: 10, cy: 30, fill: "#B8432F" },
    { cx: 28, cy: 18, fill: "#C9A830" },
    { cx: 43, cy: 12, fill: "#5E8C6A" },
    { cx: 58, cy: 18, fill: "#4A6B8A" },
    { cx: 76, cy: 30, fill: "#8B2E3B" },
  ];
  return (
    <svg
      width="72"
      height="38"
      viewBox="0 0 86 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {dots.map((d) => (
        <circle key={d.cx} cx={d.cx} cy={d.cy} r="8" fill={d.fill} />
      ))}
    </svg>
  );
}
