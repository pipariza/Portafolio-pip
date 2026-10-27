"use client";

import { useEffect, useRef, useState } from "react";
import Image, { getImageProps } from "next/image";
import { useReducedMotion } from "framer-motion";
import { useLocale } from "@/components/LocaleProvider";
import type { DemoId } from "@/lib/data";
import { DEMO_DISCLAIMER, DEMO_STEPS, DEMO_UI } from "@/lib/i18n/app-demos";
import { SCREEN, type DemoFrame } from "@/lib/visual-frames";

const SIZES = "330px";
const QUALITY = 75;

type Tour = Extract<DemoFrame, { kind: "tour" }>;

/** How long a frame stays: a still for its `hold`; a tall page for as long as its scroll takes. */
function tourSeconds(f: Tour) {
  const area = SCREEN.h - (f.top?.h ?? 0) - (f.bottom?.h ?? 0);
  return Math.min(15, Math.max(7, (f.h - area) / 65 + 2));
}
const frameSeconds = (f: DemoFrame) => (f.kind === "still" ? f.hold : tourSeconds(f));

/** Loads the pictures of a step ahead of time (holds back on data saver and slow connections). */
function prefetchFrames(frames: DemoFrame[]) {
  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }
  ).connection;
  if (connection?.saveData) return;
  if (connection?.effectiveType && /^(slow-2g|2g|3g)$/.test(connection.effectiveType)) return;
  const sources: [string, number][] = [];
  for (const f of frames) {
    if (f.kind === "still") sources.push([f.src, SCREEN.h * 2]);
    else {
      sources.push([f.src, f.h * 2]);
      if (f.top) sources.push([f.top.src, f.top.h * 2]);
      if (f.bottom) sources.push([f.bottom.src, f.bottom.h * 2]);
    }
  }
  for (const [src, height] of sources) {
    const { props } = getImageProps({ src, alt: "", width: SCREEN.w * 2, height, sizes: SIZES, quality: QUALITY });
    const img = new window.Image();
    img.sizes = props.sizes ?? "";
    if (props.srcSet) img.srcset = props.srcSet;
    img.src = props.src ?? src;
  }
}

/** One frame of a step on the phone's screen. Every frame of the step is stacked; only the active one shows. */
function FrameView({
  frame,
  active,
  cycle,
  running,
  reduce,
  alt,
  priority,
  onEnd,
}: {
  frame: DemoFrame;
  active: boolean;
  /** Changes every time the sequence moves on, so the active frame's animation starts over. */
  cycle: number;
  running: boolean;
  reduce: boolean;
  alt: string;
  priority: boolean;
  onEnd: () => void;
}) {
  const state = running ? "running" : "paused";
  const fade = `absolute inset-0 ${reduce ? "" : "transition-opacity duration-300"} ${
    active ? "opacity-100" : "pointer-events-none opacity-0"
  }`;

  if (frame.kind === "still") {
    return (
      <div className={fade}>
        <Image
          src={frame.src}
          alt={active ? alt : ""}
          aria-hidden={active ? undefined : true}
          fill
          sizes={SIZES}
          quality={QUALITY}
          priority={priority}
          className="object-cover object-top"
        />
        {active && !reduce && (
          // The hold timer: when it ends, the demo moves on to the next frame.
          <span
            key={cycle}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ animation: `demo-hold ${frame.hold}s linear forwards`, animationPlayState: state }}
            onAnimationEnd={onEnd}
          />
        )}
      </div>
    );
  }

  const topPct = ((frame.top?.h ?? 0) / SCREEN.h) * 100;
  const bottomPct = ((frame.bottom?.h ?? 0) / SCREEN.h) * 100;
  return (
    <div className={fade}>
      {frame.top && (
        <Image
          src={frame.top.src}
          alt=""
          aria-hidden="true"
          width={SCREEN.w * 2}
          height={frame.top.h * 2}
          sizes={SIZES}
          quality={QUALITY}
          className="absolute inset-x-0 top-0 z-10 h-auto w-full"
        />
      )}
      {/* The page: it scrolls slowly under the pinned bars (by hand with "reduce motion"). */}
      <div
        className={`absolute inset-x-0 [container-type:size] ${reduce ? "overflow-y-auto" : "overflow-hidden"}`}
        style={{ top: `${topPct}%`, bottom: `${bottomPct}%` }}
      >
        <div
          key={cycle}
          style={
            active && !reduce
              ? { animation: `demo-scroll ${tourSeconds(frame)}s ease-in-out forwards`, animationPlayState: state }
              : undefined
          }
          onAnimationEnd={active ? onEnd : undefined}
        >
          <Image
            src={frame.src}
            alt={active ? alt : ""}
            aria-hidden={active ? undefined : true}
            width={SCREEN.w * 2}
            height={frame.h * 2}
            sizes={SIZES}
            quality={QUALITY}
            priority={priority}
            className="block h-auto w-full"
          />
        </div>
      </div>
      {frame.bottom && (
        <Image
          src={frame.bottom.src}
          alt=""
          aria-hidden="true"
          width={SCREEN.w * 2}
          height={frame.bottom.h * 2}
          sizes={SIZES}
          quality={QUALITY}
          className="absolute inset-x-0 bottom-0 z-10 h-auto w-full"
        />
      )}
    </div>
  );
}

/**
 * "How it works" of an app: a list of steps and, next to it, a phone playing the screens of the
 * REAL platform for that step (captured on made-up data, with a blue ring on what to look at):
 * frames of an action (typing, tapping, dragging) or a full page that scrolls slowly, like the
 * projects of Work. The sequence of a step moves from frame to frame by itself, and when it ends
 * the demo goes on to the next step; the progress bar of the step shows how long it takes.
 * Picking a step stops the advance to the next one (its sequence repeats). It pauses while a mouse
 * is over it or focus is inside, can be paused with the button, runs only while on screen, and with
 * "reduce motion" nothing moves: each step shows its final screen.
 */
export default function AppDemo({ demo }: { demo: DemoId }) {
  const { lang } = useLocale();
  const reduce = useReducedMotion() === true;
  const steps = DEMO_STEPS[demo];

  const [step, setStep] = useState(0);
  const [frame, setFrame] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [auto, setAuto] = useState(true); // moves on to the next step by itself
  const [frozen, setFrozen] = useState(false); // the Pause button
  const [inView, setInView] = useState(false);
  const [engaged, setEngaged] = useState(false); // mouse over it or focus inside
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // While a step plays, quietly load the pictures of the next one.
  useEffect(() => {
    if (!inView) return;
    const next = steps[(step + 1) % steps.length];
    const id = window.setTimeout(() => prefetchFrames(next.frames), 600);
    return () => window.clearTimeout(id);
  }, [inView, step, steps]);

  const current = steps[step];
  const shown = reduce ? current.frames.length - 1 : frame;
  const running = inView && !frozen && !engaged && !reduce;
  const total = current.frames.reduce((sum, f) => sum + frameSeconds(f), 0);

  const pick = (i: number) => {
    setStep(i);
    setFrame(0);
    setCycle((c) => c + 1);
    setAuto(false);
    setFrozen(false);
  };
  // A frame ended: the next frame; after the last one, the next step (or the same sequence again
  // when the visitor picked a step).
  const advance = () => {
    setCycle((c) => c + 1);
    if (frame < current.frames.length - 1) setFrame(frame + 1);
    else if (auto) {
      setStep((step + 1) % steps.length);
      setFrame(0);
    } else setFrame(0);
  };

  return (
    <div
      ref={rootRef}
      onPointerEnter={(e) => e.pointerType === "mouse" && setEngaged(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setEngaged(false)}
      onFocusCapture={() => setEngaged(true)}
      onBlurCapture={() => setEngaged(false)}
      className="grid gap-8 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-10"
    >
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink/60">
            {DEMO_UI.heading[lang]}
          </h2>
          {!reduce && (
            <button
              type="button"
              onClick={() => setFrozen((f) => !f)}
              data-cursor-hover
              className="inline-flex min-h-11 items-center px-1 text-[11px] font-medium uppercase tracking-[0.08em] text-ink/70 underline-offset-4 hover:underline"
            >
              {frozen ? DEMO_UI.play[lang] : DEMO_UI.pause[lang]}
            </button>
          )}
        </div>
        <ol className="space-y-1">
          {steps.map((s, i) => {
            const active = i === step;
            return (
              <li key={s.title.es}>
                <button
                  type="button"
                  onClick={() => pick(i)}
                  aria-current={active ? "step" : undefined}
                  data-cursor-hover
                  className={`w-full rounded-lg px-3 py-3 text-left transition-colors ${
                    active ? "bg-black/[0.06]" : "hover:bg-black/[0.03]"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                        active ? "bg-ink text-bone" : "border border-ink/30 text-ink/70"
                      }`}
                      aria-hidden="true"
                    >
                      {i + 1}
                    </span>
                    <span className="sr-only">
                      {DEMO_UI.step[lang]} {i + 1} {DEMO_UI.of[lang]} {steps.length}:
                    </span>
                    <span className={`text-sm ${active ? "font-bold" : "font-medium text-ink/75"}`}>
                      {s.title[lang]}
                    </span>
                  </span>
                  {active && (
                    <>
                      <span className="mt-2 block pl-9 text-[13px] leading-relaxed text-ink/70">
                        {s.text[lang]}
                      </span>
                      {!reduce && (
                        <span className="mt-3 ml-9 block h-[3px] overflow-hidden rounded-full bg-black/10">
                          <span
                            key={`${step}-${auto}`}
                            className="block h-full origin-left rounded-full bg-ink"
                            style={
                              auto
                                ? {
                                    animation: `demo-progress ${total}s linear forwards`,
                                    animationPlayState: running ? "running" : "paused",
                                  }
                                : { transform: "scaleX(1)", opacity: 0.25 }
                            }
                          />
                        </span>
                      )}
                    </>
                  )}
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <div>
        <div className="mx-auto w-[min(100%,330px)] rounded-[2.6rem] bg-[#161618] p-2 shadow-[0_30px_70px_-25px_rgba(0,0,0,0.55)] ring-1 ring-black/40">
          <div className="relative aspect-[390/800] overflow-hidden rounded-[2.1rem] bg-white">
            {current.frames.map((f, i) => (
              <FrameView
                key={`${step}-${i}`}
                frame={f}
                active={i === shown}
                cycle={cycle}
                running={running}
                reduce={reduce}
                alt={`${DEMO_UI.screen[lang]}: ${current.title[lang]}`}
                priority={step === 0 && i === 0}
                onEnd={advance}
              />
            ))}
          </div>
        </div>
        <p className="mx-auto mt-4 max-w-[330px] text-center text-[11px] leading-snug text-ink/60">
          {DEMO_DISCLAIMER[lang]}
        </p>
      </div>
    </div>
  );
}
