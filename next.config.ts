import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // WebP only: AVIF takes seconds to encode the very tall page captures on
    // the first request, which is what made them slow to appear.
    formats: ["image/webp"],
    qualities: [60, 75],
    // Keep optimized images for a week instead of 4 hours.
    minimumCacheTTL: 60 * 60 * 24 * 7,
  },
  poweredByHeader: false,
};

export default nextConfig;
