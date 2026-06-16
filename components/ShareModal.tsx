"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ShareCard, SHARE_DIM, type ShareCardData } from "./ShareCard";

interface ShareModalProps extends ShareCardData {
  onClose: () => void;
}

export function ShareModal({ onClose, ...data }: ShareModalProps) {
  const [png, setPng] = useState<string | null>(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Close on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Render the hidden 1080px card to a PNG once.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setBusy(true);
      setError(false);
      try {
        await document.fonts.ready;
        // Let the hidden card paint before capture.
        await new Promise((r) => requestAnimationFrame(() => r(null)));
        const node = cardRef.current;
        if (!node) return;
        await Promise.all(
          [...node.querySelectorAll("img")].map((img) =>
            (img as HTMLImageElement).decode().catch(() => {}),
          ),
        );
        const { toPng } = await import("html-to-image");
        const url = await toPng(node, {
          width: SHARE_DIM.w,
          height: SHARE_DIM.h,
          pixelRatio: 1,
          cacheBust: true,
          backgroundColor: "#f6f5f1",
        });
        if (!cancelled) setPng(url);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setBusy(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const supportsShare =
    typeof navigator !== "undefined" && typeof navigator.canShare === "function";

  async function saveOrShare() {
    if (!png) return;
    const slug = data.nameEn.toLowerCase().replace(/\s+/g, "-");
    const fileName = `palette-muse-${slug}.png`;
    try {
      const blob = await (await fetch(png)).blob();
      const file = new File([blob], fileName, { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "My Palette Muse palette",
          text: "I found my color personality on Palette Muse.",
        });
        return;
      }
    } catch (e) {
      // User dismissed the share sheet — not an error, don't fall back.
      if ((e as Error)?.name === "AbortError") return;
    }
    const a = document.createElement("a");
    a.href = png;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  const previewSize = Math.round(SHARE_DIM.w * 0.29);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Share your palette"
        className="flex w-full max-w-sm flex-col items-center rounded-2xl bg-[#faf9f7] p-6 shadow-2xl"
      >
        <h2 className="mb-4 text-sm font-medium tracking-wide text-neutral-500">
          Your palette card
        </h2>

        {/* Preview = the real generated PNG */}
        <div
          className="flex items-center justify-center overflow-hidden rounded-xl bg-neutral-100 ring-1 ring-black/5"
          style={{ width: previewSize, height: previewSize }}
        >
          {busy ? (
            <span className="text-sm text-neutral-400">
              Reading your palette…
            </span>
          ) : error ? (
            <span className="px-6 text-center text-sm text-neutral-500">
              Couldn&apos;t generate the image. Try again.
            </span>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={png ?? undefined}
              alt="Your palette card preview"
              className="h-full w-full object-contain"
            />
          )}
        </div>

        {/* Actions */}
        <div className="mt-5 flex w-full gap-3">
          <button
            type="button"
            onClick={saveOrShare}
            disabled={busy || error}
            className="flex-1 rounded-full bg-[#1d1d1f] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#2c2c2e] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {supportsShare ? "Share" : "Save image"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-neutral-300 px-5 py-2.5 text-sm text-neutral-600 transition hover:bg-neutral-100"
          >
            Close
          </button>
        </div>

        {/* Hidden full-size capture target. */}
        <div
          aria-hidden
          style={{ position: "fixed", left: "-200vw", top: 0, pointerEvents: "none" }}
        >
          <ShareCard ref={cardRef} {...data} />
        </div>
      </motion.div>
    </motion.div>
  );
}
