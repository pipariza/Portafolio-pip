"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useLocale } from "@/components/LocaleProvider";
import type { DemoId } from "@/lib/data";
import { DEMO_DISCLAIMER, DEMO_STEPS, DEMO_UI } from "@/lib/i18n/app-demos";
import AsistenteMock from "./AsistenteMock";
import CronogramasMock from "./CronogramasMock";
import TareasMock from "./TareasMock";

const MOCKS = { tareas: TareasMock, cronogramas: CronogramasMock, asistente: AsistenteMock };

/**
 * "How it works" of an app: a list of steps and, next to it, the screen that step is about
 * (drawn with made-up data). It advances by itself while it is on screen, and the progress bar
 * of the current step is the timer: its animation ending moves to the next step, so pausing the
 * animation pauses everything. It stops for good when someone picks a step or presses Pause,
 * pauses while a mouse is over it or focus is inside, and does not autoplay with reduced motion.
 */
export default function AppDemo({ demo }: { demo: DemoId }) {
  const { lang } = useLocale();
  const reduce = useReducedMotion() === true;
  const steps = DEMO_STEPS[demo];
  const Mock = MOCKS[demo];

  const [step, setStep] = useState(0);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);
  const [engaged, setEngaged] = useState(false); // mouse over it or focus inside
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const running = inView && !paused && !engaged && !reduce;
  const pick = (i: number) => {
    setStep(i);
    setPaused(true);
  };

  return (
    <div
      ref={rootRef}
      onPointerEnter={(e) => e.pointerType === "mouse" && setEngaged(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setEngaged(false)}
      onFocusCapture={() => setEngaged(true)}
      onBlurCapture={() => setEngaged(false)}
      className="grid gap-8 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-10"
    >
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink/60">
            {DEMO_UI.heading[lang]}
          </h2>
          {!reduce && (
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              data-cursor-hover
              className="inline-flex min-h-11 items-center px-1 text-[11px] font-medium uppercase tracking-[0.08em] text-ink/70 underline-offset-4 hover:underline"
            >
              {paused ? DEMO_UI.play[lang] : DEMO_UI.pause[lang]}
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
                            key={`${step}-${paused ? "p" : "r"}`}
                            className="block h-full origin-left rounded-full bg-ink"
                            style={
                              paused
                                ? { transform: "scaleX(1)", opacity: 0.25 }
                                : {
                                    animation: "demo-progress 7s linear forwards",
                                    animationPlayState: running ? "running" : "paused",
                                  }
                            }
                            onAnimationEnd={() => setStep((n) => (n + 1) % steps.length)}
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
        <Mock step={step} />
        <p className="mt-3 text-[11px] leading-snug text-ink/60">{DEMO_DISCLAIMER[lang]}</p>
      </div>
    </div>
  );
}
