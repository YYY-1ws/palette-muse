import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Paintings are pre-processed by scripts/preprocess-images.mjs and served
  // as-is — skip Next.js image optimization entirely.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
