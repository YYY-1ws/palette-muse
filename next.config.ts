import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Paintings are pre-processed by scripts/preprocess-images.mjs and served
  // as-is — skip Next.js image optimization entirely.
  images: {
    unoptimized: true,
  },
  // Hide the on-screen dev indicator (it never ships to production anyway).
  devIndicators: false,
};

export default nextConfig;
