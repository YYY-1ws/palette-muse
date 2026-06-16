"use client";

import { forwardRef } from "react";
import { Cormorant_Garamond } from "next/font/google";
import type { Personality } from "@/lib/types";
import { PersonalityIcon } from "./PersonalityResult";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
});

// Single 1:1 format — universal (feed post + Stories with padding), and a
// palette reads naturally as a square.
export const SHARE_DIM = { w: 1080, h: 1080 };

// Neutral base with a subtle personality-tinted gradient, so the real palette
// swatches stay the visual hero rather than fighting a saturated wash.
const SHARE_THEME: Record<Personality, { accent: string; bg: string }> = {
  fresh: { accent: "#4a6b5a", bg: "linear-gradient(165deg,#eef2ee 0%,#f7f6f1 60%)" },
  dark: { accent: "#3a4a62", bg: "linear-gradient(165deg,#eaedf2 0%,#f5f5f4 60%)" },
  warm: { accent: "#8a6a30", bg: "linear-gradient(165deg,#f4eede 0%,#f8f5ef 60%)" },
  east: { accent: "#3a6a5a", bg: "linear-gradient(165deg,#e9f1ed 0%,#f5f6f3 60%)" },
};

const MARK_DOTS = ["#B8432F", "#C9A830", "#5E8C6A", "#4A6B8A", "#8B2E3B"];

function ColoredMark({ scale = 1 }: { scale?: number }) {
  const pts = [
    [10, 30],
    [28, 18],
    [43, 12],
    [58, 18],
    [76, 30],
  ];
  return (
    <svg
      width={86 * scale}
      height={42 * scale}
      viewBox="0 0 86 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {pts.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="8" fill={MARK_DOTS[i]} />
      ))}
    </svg>
  );
}

export interface ShareCardData {
  personality: Personality;
  nameEn: string;
  name: string;
  selections: { filename: string; objectPosition?: string }[];
  palette: { hex: string; nameEn: string }[];
}

export const ShareCard = forwardRef<HTMLDivElement, ShareCardData>(
  function ShareCard({ personality, nameEn, name, selections, palette }, ref) {
    const theme = SHARE_THEME[personality];
    const { w, h } = SHARE_DIM;

    return (
      <div
        ref={ref}
        style={{
          width: w,
          height: h,
          boxSizing: "border-box",
          padding: 64,
          background: theme.bg,
          color: "#1d1d1f",
          fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header: brand mark + wordmark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
          }}
        >
          <ColoredMark scale={0.64} />
          <span
            className={cormorant.className}
            style={{ fontSize: 40, fontWeight: 600, letterSpacing: "0.01em" }}
          >
            Palette Muse
          </span>
        </div>

        {/* Personality */}
        <div style={{ textAlign: "center", marginTop: 34 }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <PersonalityIcon personality={personality} size={66} />
          </div>
          <div
            className={cormorant.className}
            style={{
              fontSize: 64,
              fontWeight: 600,
              lineHeight: 1.04,
              marginTop: 8,
            }}
          >
            {nameEn}
          </div>
          <div
            style={{
              fontSize: 23,
              color: "#8a8a8e",
              letterSpacing: "0.1em",
              marginTop: 8,
            }}
          >
            {name}
          </div>
        </div>

        {/* Selected paintings — supporting strip of framed prints */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 14,
            marginTop: 36,
          }}
        >
          {selections.map((s) => (
            <div
              key={s.filename}
              style={{
                background: "#fff",
                padding: 6,
                borderRadius: 8,
                boxShadow: "0 12px 28px -10px rgba(40,38,58,0.32)",
              }}
            >
              <div
                style={{
                  width: 108,
                  height: 135,
                  borderRadius: 4,
                  overflow: "hidden",
                  background: "#e6e4e1",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/paintings/${s.filename}`}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: s.objectPosition ?? "center center",
                    display: "block",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Palette — the hero. Color blocks live in their own row (so every
            block is the same height no matter how a label wraps); labels sit
            in a separate row beneath, aligned to the blocks. */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            marginTop: 40,
          }}
        >
          <div style={{ display: "flex", gap: 14, flex: 1, minHeight: 0 }}>
            {palette.map((c, i) => (
              <div
                key={i}
                style={{ flex: 1, background: c.hex, borderRadius: 14 }}
              />
            ))}
          </div>
          <div style={{ display: "flex", gap: 14, marginTop: 18 }}>
            {palette.map((c, i) => (
              <div key={i} style={{ flex: 1 }}>
                <div style={{ fontSize: 19, fontWeight: 600, lineHeight: 1.15 }}>
                  {c.nameEn}
                </div>
                <div
                  style={{
                    fontSize: 16,
                    color: "#8a8a8e",
                    fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
                    letterSpacing: "0.04em",
                    marginTop: 4,
                  }}
                >
                  {c.hex.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            marginTop: 30,
            fontSize: 18,
            color: "#9a9a9e",
            letterSpacing: "0.06em",
          }}
        >
          <span style={{ color: theme.accent, fontWeight: 600 }}>
            palette-muse-opal.vercel.app
          </span>
          {"  ·  Discover yours"}
        </div>
      </div>
    );
  },
);
