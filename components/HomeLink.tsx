"use client";

import Link from "next/link";
import { Cormorant_Garamond } from "next/font/google";

const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["600"] });

const DOTS = ["#B8432F", "#C9A830", "#5E8C6A", "#4A6B8A", "#8B2E3B"];

// Quiet brand mark that returns to the landing page from any screen.
export function HomeLink() {
  return (
    <Link
      href="/"
      aria-label="Back to home"
      className="group inline-flex items-center gap-2 text-neutral-500 transition hover:text-neutral-800"
    >
      <svg
        width="34"
        height="17"
        viewBox="0 0 86 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        className="opacity-80 transition group-hover:opacity-100"
      >
        {[
          [10, 30],
          [28, 18],
          [43, 12],
          [58, 18],
          [76, 30],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="8" fill={DOTS[i]} />
        ))}
      </svg>
      <span
        className={`${cormorant.className} hidden text-lg font-semibold tracking-tight sm:inline`}
      >
        Palette Muse
      </span>
    </Link>
  );
}
