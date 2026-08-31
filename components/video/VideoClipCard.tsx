"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { VideoClip } from "@/lib/data";

export default function VideoClipCard({
  clip,
  index,
  onOpen,
}: {
  clip: VideoClip;
  index: number;
  onOpen: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px -15% 0px" });
  const restTilt = index % 2 === 0 ? -7 : 7;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, rotateX: restTilt * 6, y: 50 }}
      animate={inView ? { opacity: 1, rotateX: restTilt, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 0.84, 0.44, 1] }}
      style={{ transformStyle: "preserve-3d" }}
      className="relative w-[260px] md:w-[380px] aspect-[16/10] -mt-6 md:-mt-10 first:mt-0 shrink-0"
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Ver ${clip.title}`}
        className="group absolute inset-0 overflow-hidden shadow-xl"
        style={{ background: clip.color }}
      >
        {inView && clip.vimeoId && (
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
