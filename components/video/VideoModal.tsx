"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import type { VideoClip } from "@/lib/data";

export default function VideoModal({
  clip,
  onClose,
  onPrev,
  onNext,
}: {
  clip: VideoClip | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  useEffect(() => {
    if (!clip) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [clip, onClose, onPrev, onNext]);

  return (
    <AnimatePresence>
      {clip && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] bg-black"
          onClick={onClose}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            data-cursor-hover
            className="absolute top-5 right-5 md:top-8 md:right-8 z-10 flex h-11 w-11 items-center justify-center text-white hover:opacity-70 transition-opacity"
          >
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
              <path d="M5 5l16 16M21 5L5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            aria-label="Video anterior"
            data-cursor-hover
            className="absolute left-3 md:left-8 top-1/2 -translate-y-1/2 z-10 flex h-11 w-11 md:h-12 md:w-12 items-center justify-center rounded-full border border-white/30 text-white hover:border-white/70 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M13 8H3m0 0l4-4m-4 4l4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            aria-label="Siguiente video"
            data-cursor-hover
            className="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 z-10 flex h-11 w-11 md:h-12 md:w-12 items-center justify-center rounded-full border border-white/30 text-white hover:border-white/70 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <motion.div
            key={clip.id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.16, 0.84, 0.44, 1] }}
            className="absolute inset-0 flex items-center justify-center px-16 py-16 md:px-28"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-full max-h-[88vh] aspect-[9/16] bg-black">
              {clip.vimeoId ? (
                <iframe
                  src={`https://player.vimeo.com/video/${clip.vimeoId}?autoplay=1&loop=1&title=0&byline=0&portrait=0&badge=0`}
                  className="absolute inset-0 h-full w-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  title={clip.title}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-white/50 text-xs uppercase tracking-[0.08em]">
                  Video próximamente
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
