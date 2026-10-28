import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // WebP only: AVIF takes seconds to encode the very tall page captures on
    // the first request, which is what made them slow to appear.
    formats: ["image/webp"],
    qualities: [60, 75, 90],
    // Keep optimized images for a week instead of 4 hours.
    minimumCacheTTL: 60 * 60 * 24 * 7,
  },
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // The browser must trust the declared type of each file.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Nobody can frame the site (clickjacking); the CSP twin is for modern browsers.
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
          // Outgoing links only learn the origin of the site, never the full path.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // The site uses none of these sensors; fullscreen and autoplay stay allowed for the Vimeo player.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
