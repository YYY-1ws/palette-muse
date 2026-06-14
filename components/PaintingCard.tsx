"use client";

import Image from "next/image";
import { useState } from "react";

export interface PaintingCardProps {
  filename: string;
  name: string;
  artist?: string;
  selected?: boolean;
  dimmed?: boolean;
  onClick?: () => void;
  aspectClassName?: string;
  objectPosition?: string;
  /** Set for above-the-fold cards so the LCP image isn't lazy-loaded. */
  eager?: boolean;
}

export function PaintingCard({
  filename,
  name,
  artist,
  selected = false,
  dimmed = false,
  onClick,
  aspectClassName = "aspect-[4/5]",
  objectPosition = "center center",
  eager = false,
}: PaintingCardProps) {
  const [loaded, setLoaded] = useState(false);
  const src = `/paintings/${filename}`;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative ${aspectClassName} w-full overflow-hidden rounded-lg bg-neutral-200 transition-all duration-300 ${
        selected ? "ring-2 ring-neutral-900 ring-offset-2" : ""
      } ${dimmed ? "opacity-40" : "opacity-100"} ${
        onClick ? "cursor-pointer hover:scale-[1.02]" : "cursor-default"
      }`}
      aria-label={artist ? `${name} — ${artist}` : name}
    >
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-neutral-200" />
      )}
      <Image
        src={src}
        alt={name}
        fill
        sizes="(max-width: 768px) 100vw, 25vw"
        className={`object-cover transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ objectPosition }}
        loading={eager ? "eager" : "lazy"}
        onLoad={() => setLoaded(true)}
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-left text-white">
        <div className="text-sm font-medium">{name}</div>
        {artist && <div className="text-xs opacity-80">{artist}</div>}
      </div>
    </button>
  );
}
