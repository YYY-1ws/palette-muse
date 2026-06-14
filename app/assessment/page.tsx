"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RoundDisplay } from "@/components/RoundDisplay";
import { useAssessmentStore } from "@/lib/store";
import roundsData from "@/lib/rounds.json";
import type { Painting, RoundsData, SelectedPainting } from "@/lib/types";

const data = roundsData as RoundsData;

export default function AssessmentPage() {
  const router = useRouter();
  const { currentRound, selectPainting, reset } = useAssessmentStore();
  const [hydrated, setHydrated] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [showResumePrompt, setShowResumePrompt] = useState(false);

  // The "already completed" prompt only applies when arriving on this page
  // with a finished assessment — decide once at hydration so completing round 5
  // in-session doesn't flash it while navigating to /result.
  useEffect(() => {
    setHydrated(true);
    setShowResumePrompt(
      useAssessmentStore.getState().selections.length >= data.rounds.length,
    );
  }, []);

  if (!hydrated) {
    return <div className="min-h-screen bg-neutral-50" />;
  }

  if (showResumePrompt) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-6 text-center">
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
    setTimeout(() => {
      selectPainting(currentRound, painting);
      if (currentRound + 1 >= data.rounds.length) {
        // Keep the card highlighted while navigating away.
        router.push("/result");
      } else {
        setPendingId(null);
      }
    }, 420);
  };

  return (
    <main className="min-h-screen bg-neutral-50 py-10">
      <RoundDisplay
        roundIndex={currentRound}
        total={data.rounds.length}
        theme={round.themeEn}
        paintings={round.paintings}
        selectedId={pendingId}
        onSelect={handleSelect}
      />
    </main>
  );
}
