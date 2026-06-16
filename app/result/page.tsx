"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { PaletteDisplay } from "@/components/PaletteDisplay";
import { PersonalityResult } from "@/components/PersonalityResult";
import { Toast } from "@/components/Toast";
import { useAssessmentStore } from "@/lib/store";
import {
  buildPersonalityDescription,
  determinePersonality,
  generatePalette,
  rerollColor,
} from "@/lib/paletteEngine";
import roundsData from "@/lib/rounds.json";
import type { RoundsData } from "@/lib/types";

const data = roundsData as RoundsData;

export default function ResultPage() {
  const router = useRouter();
  const {
    selections,
    generatedPalette,
    setPalette,
    updatePaletteColor,
    decrementReroll,
    reset,
  } = useAssessmentStore();
  const [hydrated, setHydrated] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (selections.length < data.rounds.length) {
      router.replace("/assessment");
      return;
    }
    if (!generatedPalette) {
      setPalette(generatePalette(selections, data.config.maxRerollsPerColor));
    }
  }, [hydrated, selections, generatedPalette, setPalette, router]);

  const personality = useMemo(() => {
    if (selections.length < data.rounds.length) return null;
    return determinePersonality(selections);
  }, [selections]);

  if (!hydrated || !generatedPalette || !personality) {
    return <div className="min-h-screen bg-neutral-50" />;
  }

  const personalityInfo = data.personalities[personality];
  // Built from the user's actual selected artists — never names a painter they
  // didn't choose (fixes the hardcoded-description trust issue).
  const description = buildPersonalityDescription(personality, selections);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1600);
  };

  const handleCopy = async (hex: string) => {
    let copied = false;
    try {
      await navigator.clipboard.writeText(hex);
      copied = true;
    } catch {
      // Async clipboard API is unavailable on insecure origins (e.g. dev
      // server opened via LAN IP) — fall back to a hidden textarea.
      const ta = document.createElement("textarea");
      ta.value = hex;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        copied = document.execCommand("copy");
      } catch {
        copied = false;
      }
      ta.remove();
    }
    showToast(copied ? `Copied ${hex.toUpperCase()}` : "Copy failed");
  };

  const handleReroll = (index: number) => {
    const slot = generatedPalette[index];
    if (slot.rerollsLeft === 0) return;
    const sourcePainting = selections[index];
    const others = generatedPalette
      .filter((_, i) => i !== index)
      .map((c) => ({ hex: c.hex, weight: 1, name: c.name }));
    const newColor = rerollColor(sourcePainting.colors, slot.hex, others);
    updatePaletteColor(index, {
      hex: newColor.hex,
      name: newColor.name,
      nameEn: newColor.nameEn,
    });
    decrementReroll(index);
  };

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <PersonalityResult
          personality={personality}
          nameEn={personalityInfo.nameEn}
          name={personalityInfo.name}
          description={description}
        />

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
          className="mt-12"
        >
          <h3 className="mb-5 text-center text-xs uppercase tracking-widest text-neutral-400">
            Your selected paintings
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {selections.map((s) => (
              <div key={s.id} className="w-28 text-center sm:w-32">
                {/* White-bordered, shadowed frame — a hung gallery print. */}
                <div className="rounded-md bg-white p-1.5 shadow-[0_10px_28px_-8px_rgba(40,38,58,0.28)] ring-1 ring-black/[0.05]">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[3px] bg-neutral-200">
                    <Image
                      src={`/paintings/${s.filename}`}
                      alt={s.nameEn ?? s.name}
                      fill
                      sizes="140px"
                      className="object-cover"
                      style={{
                        objectPosition: s.objectPosition ?? "center center",
                      }}
                    />
                  </div>
                </div>
                <div className="mt-2 text-[11px] font-medium leading-tight text-neutral-700">
                  {s.nameEn ?? s.name}
                </div>
                <div className="text-[10px] leading-tight text-neutral-400">
                  {s.name}
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.55, ease: "easeOut" }}
          className="mt-14"
        >
          <h3 className="mb-1 text-center text-xs uppercase tracking-widest text-neutral-400">
            Your personal palette
          </h3>
          <p className="mb-6 text-center text-xs text-neutral-500">
            Tap a swatch to copy its HEX · 🎲 to re-roll (up to 3 per color)
          </p>
          <PaletteDisplay
            palette={generatedPalette}
            onCopy={handleCopy}
            onReroll={handleReroll}
          />
        </motion.section>

        <div className="mt-14 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => showToast("Share cards are coming soon")}
            className="rounded-full bg-[#1d1d1f] px-6 py-2.5 text-sm font-medium text-white shadow-[0_2px_10px_rgba(0,0,0,0.12)] transition hover:bg-[#2c2c2e]"
          >
            Share my palette
          </button>
          <button
            type="button"
            onClick={() => {
              reset();
              router.push("/assessment");
            }}
            className="rounded-full border border-neutral-300 bg-white px-6 py-2.5 text-sm text-neutral-700 transition hover:bg-neutral-100"
          >
            Retake test
          </button>
        </div>
      </div>

      <Toast message={toast} />
    </main>
  );
}
