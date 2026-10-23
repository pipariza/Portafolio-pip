"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { VideoClip } from "@/lib/data";

const VIMEO_ORIGIN = "https://player.vimeo.com";

/**
 * Full player for one clip. The poster covers it until the player is ready
 * (the slow part: player + config download), and if the browser only allows
 * muted autoplay a button lets the viewer turn the sound on.
 */
function ModalPlayer({
  clip,
  wantsSound,
  onSoundOn,
}: {
  clip: VideoClip;
  /** The viewer already turned the sound on once; keep it on for every clip. */
  wantsSound: boolean;
  onSoundOn: () => void;
}) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  // Set when the first `playing` arrives so that only that first answer to
  // getMuted turns the sound on by itself (never after the viewer mutes it).
  const checkingStart = useRef(false);

  const send = useCallback((method: string, value?: unknown) => {
    ref.current?.contentWindow?.postMessage(
      JSON.stringify(value === undefined ? { method } : { method, value }),
      VIMEO_ORIGIN,
    );
  }, []);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== VIMEO_ORIGIN || e.source !== ref.current?.contentWindow) return;
      let data;
      try {
        data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
      } catch {
        return;
      }
      if (data?.event === "ready") {
        setReady(true);
      } else if (data?.event === "playing") {
        setReady(true);
        setPlaying(true);
        checkingStart.current = true;
        send("getMuted");
      } else if (data?.event === "volumechange") {
        send("getMuted");
      } else if (data?.method === "getMuted") {
        const isMuted = Boolean(data.value);
        setMuted(isMuted);
        if (checkingStart.current) {
          checkingStart.current = false;
          if (isMuted && wantsSound) {
            send("setMuted", false);
            send("setVolume", 1);
            // If the browser refuses, the button comes back.
            window.setTimeout(() => send("getMuted"), 500);
          }
        }
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [send, wantsSound]);

  const unmute = () => {
    send("setMuted", false);
    send("setVolume", 1);
    send("play");
    setMuted(false);
    onSoundOn();
    // If the browser refuses, the player stays muted and the button comes back.
    window.setTimeout(() => send("getMuted"), 500);
  };

  if (!clip.vimeoId) {
    return (
      <div className="absolute inset-0 flex items-center justify-center text-white/50 text-xs uppercase tracking-[0.08em]">
        Video próximamente
      </div>
    );
  }

  return (
    <>
      <iframe
        ref={ref}
        src={`${VIMEO_ORIGIN}/video/${clip.vimeoId}?autoplay=1&loop=1&title=0&byline=0&portrait=0&badge=0`}
        onLoad={() => {
          send("addEventListener", "playing");
          send("addEventListener", "volumechange");
        }}
        className="absolute inset-0 h-full w-full"
        allow="autoplay; fullscreen; picture-in-picture"
        title={clip.title}
      />
      {clip.poster && (
        <div
          className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
            ready ? "opacity-0" : "opacity-100"
          }`}
        >
          <Image
            src={clip.poster}
            alt=""
            fill
            unoptimized
            sizes="(min-width: 768px) 50vh, 80vw"
            className="object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/25">
            <span className="h-8 w-8 rounded-full border-2 border-white/30 border-t-white motion-safe:animate-spin" />
          </div>
        </div>
      )}
      {playing && muted && (
        <button
          type="button"
          onClick={unmute}
          data-cursor-hover
          className="absolute left-3 top-3 z-10 flex items-center gap-2 rounded-full bg-black/60 px-3.5 py-2 text-[11px] font-medium uppercase tracking-[0.05em] text-white backdrop-blur-sm transition-colors hover:bg-black/80"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2 6v4h3l4 3V3L5 6H2Z" fill="currentColor" />
            <path d="M11.5 5.5a3.5 3.5 0 0 1 0 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          Activar sonido
        </button>
      )}
    </>
  );
}

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
  // Lives as long as the page, so one tap on "Activar sonido" covers every clip.
  const [soundOn, setSoundOn] = useState(false);

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
              <ModalPlayer
                clip={clip}
                wantsSound={soundOn}
                onSoundOn={() => setSoundOn(true)}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
