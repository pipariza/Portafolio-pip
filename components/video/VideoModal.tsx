"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
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

/** Round gray button of a Quick Look toolbar. */
const TOOL_BUTTON =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white/85 outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#0a84ff]";

/**
 * The viewer drawn like macOS's Quick Look window: a dark glass window with a
 * toolbar (close, the clip's name, previous / next) over a dimmed page, and the
 * video inside it with rounded corners. The page's title sits above the window.
 */
export default function VideoModal({
  clip,
  index,
  total,
  onClose,
  onPrev,
  onNext,
}: {
  clip: VideoClip | null;
  /** Position of the clip in the list (0-based) and the list's length. */
  index: number;
  total: number;
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
          role="dialog"
          aria-modal="true"
          aria-label="Edición de video"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          // --reserve: the height the title, the toolbar and the margins take; the video gets the rest.
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-3 bg-black/35 px-3 backdrop-blur-md [--reserve:9rem] [@media(max-height:520px)]:[--reserve:6rem]"
          onClick={onClose}
        >
          <h2 className="text-[15px] font-extrabold uppercase leading-none tracking-[0.04em] text-white md:text-[20px] [@media(max-height:520px)]:hidden">
            Edición de video
          </h2>

          <motion.div
            key={clip.id}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.3, ease: [0.16, 0.84, 0.44, 1] }}
            // --vw: width of the video (the biggest 9:16 box that fits under the title); the window is that plus its margins,
            // never narrower than a toolbar needs, so a long clip name is cut with an ellipsis instead of widening it.
            style={
              {
                "--vw": "min(calc((100dvh - var(--reserve)) * 9 / 16), calc(100vw - 3.5rem))",
                width: "max(calc(var(--vw) + 1.5rem), min(300px, calc(100vw - 1.5rem)))",
              } as CSSProperties
            }
            className="flex flex-col overflow-hidden rounded-[14px] bg-[rgba(34,34,38,0.5)] shadow-[0_0_0_0.5px_rgba(255,255,255,0.28),0_40px_90px_-20px_rgba(0,0,0,0.7)] backdrop-blur-[40px] backdrop-saturate-[1.8]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-[52px] shrink-0 items-center gap-1 pl-1 pr-1">
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar"
                data-cursor-hover
                className={TOOL_BUTTON}
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-white/15">
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="m2 2 8 8M10 2 2 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </span>
              </button>
              <p className="min-w-0 flex-1 truncate px-1 text-[15px] font-semibold text-white">
                {clip.title}
              </p>
              <span className="shrink-0 px-1 text-[12px] tabular-nums text-white/50" aria-hidden="true">
                {index + 1} / {total}
              </span>
              <button
                type="button"
                onClick={onPrev}
                aria-label="Video anterior"
                data-cursor-hover
                className={TOOL_BUTTON}
              >
                <svg width="9" height="14" viewBox="0 0 9 14" fill="none" aria-hidden="true">
                  <path d="M7.5 1.5 2 7l5.5 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                onClick={onNext}
                aria-label="Siguiente video"
                data-cursor-hover
                className={TOOL_BUTTON}
              >
                <svg width="9" height="14" viewBox="0 0 9 14" fill="none" aria-hidden="true">
                  <path d="M1.5 1.5 7 7l-5.5 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div
              className="relative mx-3 mb-3 shrink-0 self-center overflow-hidden rounded-[10px] bg-black"
              style={{ width: "var(--vw)", aspectRatio: "9 / 16" }}
            >
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
