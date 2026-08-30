"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import VimeoEmbed from "./VimeoEmbed";
import type { VideoClip } from "@/lib/data";

export default function VideoModal({
  clip,
  onClose,
}: {
  clip: VideoClip | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!clip) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [clip, onClose]);

  return (
    <AnimatePresence>
      {clip && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-void/90 backdrop-blur-sm px-6 py-16"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.3, ease: [0.16, 0.84, 0.44, 1] }}
            className="relative w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="absolute -top-10 right-0 text-bone/70 hover:text-bone text-sm uppercase tracking-[0.08em]"
            >
              Cerrar ✕
            </button>
            <VimeoEmbed vimeoId={clip.vimeoId} title={clip.title} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
