"use client";

import { motion } from "framer-motion";
import type { VideoClip } from "@/lib/data";

export default function VideoClipCard({
  clip,
  tilt,
  zIndex,
  onOpen,
}: {
  clip: VideoClip;
  tilt: number;
  zIndex: number;
  onOpen: () => void;
}) {
  const flungTilt = tilt === 0 ? -45 : tilt * 3;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, rotateX: flungTilt, y: -60 }}
      animate={{ opacity: 1, rotateX: tilt, y: 0 }}
      exit={{ opacity: 0, rotateX: flungTilt, y: 60 }}
      transition={{ duration: 0.7, ease: [0.16, 0.84, 0.44, 1] }}
      style={{ transformStyle: "preserve-3d", zIndex }}
      className="relative w-[260px] md:w-[380px] aspect-[16/10] -mt-6 md:-mt-10 first:mt-0 shrink-0"
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Ver ${clip.title}`}
        className="group absolute inset-0 overflow-hidden shadow-xl"
        style={{ background: clip.color }}
      >
        {clip.vimeoId && (
          <iframe
            src={`https://player.vimeo.com/video/${clip.vimeoId}?background=1&autoplay=1&loop=1&muted=1&byline=0&title=0&portrait=0&badge=0`}
            className="absolute top-1/2 left-1/2 w-auto pointer-events-none -translate-x-1/2 -translate-y-1/2"
            style={{ height: "300%", aspectRatio: "9 / 16" }}
            allow="autoplay; fullscreen"
            title={clip.title}
          />
        )}
        <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/25" />
        <span className="absolute inset-0 m-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/70 text-white opacity-0 transition-opacity group-hover:opacity-100">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M4 2.5l7 4.5-7 4.5v-9Z" fill="currentColor" />
          </svg>
        </span>
        <span className="absolute bottom-3 left-4 right-4 text-[11px] font-medium uppercase tracking-[0.05em] text-white opacity-0 transition-opacity group-hover:opacity-100 [text-shadow:0_1px_3px_rgba(0,0,0,0.6)]">
          {clip.title}
        </span>
      </button>
    </motion.div>
  );
}
