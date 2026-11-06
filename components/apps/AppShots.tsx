"use client";

import { useEffect, useRef, useState } from "react";
import Image, { getImageProps } from "next/image";
import { useReducedMotion } from "framer-motion";
import { useLocale } from "@/components/LocaleProvider";
import { SHOTS_UI, type Shot } from "@/lib/i18n/app-demos";

const QUALITY = 80;
const WINDOW_SIZES = "(min-width: 920px) 896px, 92vw";
const PHONE_SIZES = "330px";

const sizesOf = (shot: Shot) => (shot.frame === "phone" ? PHONE_SIZES : WINDOW_SIZES);
const widthOf = (shot: Shot) => (shot.frame === "phone" ? 780 : 2048);
const heightOf = (shot: Shot) => (shot.frame === "phone" ? 1688 : 1536);

/** Loads the other screens quietly once the section is on screen (holds back on data saver and slow connections). */
function prefetch(shots: Shot[]) {
  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }
  ).connection;
  if (connection?.saveData) return;
  if (connection?.effectiveType && /^(slow-2g|2g|3g)$/.test(connection.effectiveType)) return;
  for (const shot of shots) {
    const { props } = getImageProps({
      src: shot.src,
      alt: "",
      width: widthOf(shot),
      height: heightOf(shot),
      sizes: sizesOf(shot),
      quality: QUALITY,
    });
    const img = new window.Image();
    img.sizes = props.sizes ?? "";
    if (props.srcSet) img.srcset = props.srcSet;
    img.src = props.src ?? shot.src;
  }
}

/** A desktop window around a capture: the title bar says what the screen is. */
function WindowFrame({ shot, alt, priority }: { shot: Shot; alt: string; priority: boolean }) {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-[0_30px_70px_-30px_rgba(0,0,0,0.45)] ring-1 ring-black/15">
      <div className="flex h-9 items-center gap-1.5 border-b border-black/10 bg-[#f1efea] px-3">
        <i className="block h-2.5 w-2.5 rounded-full bg-[#ff5f57]" aria-hidden="true" />
        <i className="block h-2.5 w-2.5 rounded-full bg-[#febc2e]" aria-hidden="true" />
        <i className="block h-2.5 w-2.5 rounded-full bg-[#28c840]" aria-hidden="true" />
        <span className="mx-auto max-w-[70%] truncate pr-10 text-[11px] text-ink/55">{shot.label}</span>
      </div>
      <div className="relative aspect-[4/3] bg-white">
        <Image
          src={shot.src}
          alt={alt}
          fill
          sizes={WINDOW_SIZES}
          quality={QUALITY}
          priority={priority}
          className="object-cover object-top"
        />
      </div>
    </div>
  );
}

/** The same phone as the demos of the other apps. */
function PhoneFrame({ shot, alt }: { shot: Shot; alt: string }) {
  return (
    <div className="mx-auto w-[min(100%,330px)] rounded-[2.6rem] bg-[#161618] p-2 shadow-[0_30px_70px_-25px_rgba(0,0,0,0.55)] ring-1 ring-black/40">
      <div className="relative aspect-[390/844] overflow-hidden rounded-[2.1rem] bg-white">
        <Image
          src={shot.src}
          alt={alt}
          fill
          sizes={PHONE_SIZES}
          quality={QUALITY}
          className="object-cover object-top"
        />
      </div>
    </div>
  );
}

/**
 * "How it looks" of an app without a step-by-step demo: its screens, one at a time, each inside a
 * window (or a phone) with a short caption. The tabs pick the screen; the admin ones are captures
 * of the real app, the store ones come from an example store (see SHOTS_UI.disclaimer).
 */
export default function AppShots({ shots }: { shots: Shot[] }) {
  const { lang } = useLocale();
  const reduce = useReducedMotion() === true;
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let timer: number | undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        timer = window.setTimeout(() => prefetch(shots), 600);
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, [shots]);

  const current = shots[active];
  const groups = (["panel", "store"] as const).filter((g) => shots.some((s) => s.group === g));
  const caption = (
    <div className="max-w-xl">
      <h3 className="text-sm font-bold">{current.title[lang]}</h3>
      <p className="mt-1.5 text-[13px] leading-relaxed text-ink/70">{current.text[lang]}</p>
    </div>
  );

  return (
    <div ref={rootRef}>
      <h2 className="mb-5 text-[11px] font-medium uppercase tracking-[0.08em] text-ink/60">{SHOTS_UI.heading[lang]}</h2>

      <div className="mb-6 flex flex-wrap gap-x-8 gap-y-4">
        {groups.map((group) => (
          <div key={group}>
            <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.08em] text-ink/45">{SHOTS_UI[group][lang]}</p>
            <ul className="flex flex-wrap gap-2">
              {shots.map((shot, i) =>
                shot.group !== group ? null : (
                  <li key={shot.src}>
                    <button
                      type="button"
                      onClick={() => setActive(i)}
                      aria-current={i === active ? "true" : undefined}
                      data-cursor-hover
                      className={`min-h-11 rounded-full border px-4 text-[13px] transition-colors ${
                        i === active
                          ? "border-ink bg-ink font-bold text-bone"
                          : "border-ink/20 font-medium text-ink/75 hover:border-ink/50"
                      }`}
                    >
                      {shot.title[lang]}
                    </button>
                  </li>
                ),
              )}
            </ul>
          </div>
        ))}
      </div>

      <div key={current.src} className={reduce ? undefined : "animate-[app-shot-in_0.35s_ease-out]"}>
        {current.frame === "phone" ? (
          <div className="grid items-center gap-8 md:grid-cols-[330px_minmax(0,1fr)] md:gap-12">
            <PhoneFrame shot={current} alt={current.alt[lang]} />
            {caption}
          </div>
        ) : (
          <>
            <WindowFrame shot={current} alt={current.alt[lang]} priority={active === 0} />
            <div className="mt-5">{caption}</div>
          </>
        )}
      </div>

      <p className="mt-6 max-w-2xl text-[11px] leading-snug text-ink/60">{SHOTS_UI.disclaimer[lang]}</p>
    </div>
  );
}
