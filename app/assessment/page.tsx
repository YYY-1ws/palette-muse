"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { HomeLink } from "@/components/HomeLink";
import { RoundDisplay } from "@/components/RoundDisplay";
import { useAssessmentStore } from "@/lib/store";
import roundsData from "@/lib/rounds.json";
import type { Painting, RoundsData, SelectedPainting } from "@/lib/types";

const data = roundsData as RoundsData;

export default function AssessmentPage() {
  const router = useRouter();
  const { currentRound, selections, selectPainting, goToRound, reset } =
    useAssessmentStore();
  const [hydrated, setHydrated] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [showResumePrompt, setShowResumePrompt] = useState(false);

  const round = data.rounds[Math.min(currentRound, data.rounds.length - 1)];

  const handleSelect = (p: Painting) => {
    if (pendingId) return;
    setPendingId(p.id);
    const painting: SelectedPainting = {
      id: p.id,
      filename: p.filename,
      name: p.name,
      nameEn: p.nameEn,
      artist: p.artist,
      artistEn: p.artistEn,
      personality: p.personality,
      colors: p.colors,
      objectPosition: p.objectPosition,
    };
    // Hold ~800ms so the user sees their selection acknowledged (press +
    // warm highlight) before the round crossfades forward.
    setTimeout(() => {
      const last = currentRound + 1 >= data.rounds.length;
      selectPainting(currentRound, painting);
      if (last) {
        // Keep the card highlighted while navigating away.
        router.push("/result");
      } else {
        // Add a history entry for the new round so the browser Back button
        // (and the ← Back control) steps back a round instead of leaving.
        try {
          window.history.pushState(
            { ...window.history.state, pmRound: currentRound + 1 },
            "",
          );
        } catch {}
        setPendingId(null);
      }
    }, 800);
  };

  // Always-fresh "select by card index" for the keyboard handler.
  const selectByIndexRef = useRef<(i: number) => void>(() => {});
  selectByIndexRef.current = (i: number) => {
    if (pendingId) return;
    const p = round?.paintings?.[i];
    if (p) handleSelect(p);
  };

  useEffect(() => {
    setHydrated(true);
    setShowResumePrompt(
      useAssessmentStore.getState().selections.length >= data.rounds.length,
    );
  }, []);

  // Tag history entries with the round so Back returns to the previous round,
  // and Back from round 1 falls through to the landing page.
  useEffect(() => {
    if (!hydrated || showResumePrompt) return;
    try {
      window.history.replaceState(
        { ...window.history.state, pmRound: useAssessmentStore.getState().currentRound },
        "",
      );
    } catch {}
    const onPop = (e: PopStateEvent) => {
      const r =
        e.state && typeof e.state.pmRound === "number" ? e.state.pmRound : null;
      if (r !== null) {
        setPendingId(null);
        goToRound(r);
      }
      // Otherwise we've navigated to a non-quiz entry (the landing) — let it be.
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [hydrated, showResumePrompt, goToRound]);

  // Power-user shortcut: 1–4 selects the matching card (reading order).
  useEffect(() => {
    if (!hydrated || showResumePrompt) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const n = Number(e.key);
      if (Number.isInteger(n) && n >= 1 && n <= 4) {
        selectByIndexRef.current(n - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hydrated, showResumePrompt]);

  if (!hydrated) {
    return <div className="min-h-screen bg-[#f8f7f6]" />;
  }

  if (showResumePrompt) {
    return (
      <main className="relative flex min-h-screen flex-col items-center justify-center bg-[#f8f7f6] px-6 text-center">
        <div className="absolute left-6 top-6">
          <HomeLink />
        </div>
        <h2 className="text-xl font-medium text-neutral-900">
          You&apos;ve already completed the test
        </h2>
        <p className="mt-2 text-sm text-neutral-600">
          View your previous result, or start over?
        </p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={() => router.push("/result")}
            className="rounded-full bg-neutral-900 px-6 py-2.5 text-sm text-white transition hover:bg-neutral-800"
          >
            View result
          </button>
          <button
            type="button"
            onClick={() => {
              reset();
              setShowResumePrompt(false);
            }}
            className="rounded-full border border-neutral-300 px-6 py-2.5 text-sm text-neutral-700 transition hover:bg-neutral-100"
          >
            Start over
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f8f7f6] py-10">
      {/* A 2.5% wash of the landing-page gallery photo keeps the mood continuous
          from the moody landing into the quiz, without competing with the art. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-cover opacity-[0.025]"
        style={{
          backgroundImage: "url('/black-bg.jpg')",
          backgroundPosition: "center 40%",
        }}
      />
      <div className="relative z-10">
        <div className="px-6">
          <HomeLink />
        </div>
        <RoundDisplay
          roundIndex={currentRound}
          total={data.rounds.length}
          theme={round.themeEn}
          paintings={round.paintings}
          selectedId={pendingId}
          previousId={selections[currentRound]?.id ?? null}
          onSelect={handleSelect}
          onBack={() => window.history.back()}
        />
      </div>
    </main>
  );
}
