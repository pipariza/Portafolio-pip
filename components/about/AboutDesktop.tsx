"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  TrafficLights,
  WINDOW_FX,
  WINDOW_FX_REDUCED,
  useMacWindow,
} from "@/components/mac/window";
import { useLocale } from "@/components/LocaleProvider";
import { NAME } from "@/lib/config";
import { DesktopShortcut, DockTile, MiniDock } from "@/components/mac/dock";
import { wallpaperStyle } from "@/components/mac/wallpaper";

/*
 * About as a macOS desktop, like the rest of the site: a light wallpaper (the
 * same stack of radial glows as the Work projects), the site's own menu bar above
 * it and a Notes window with the text. "Saber más" opens the CV note of the Apps
 * page. The traffic lights work: close leaves the Notes icon on the desktop,
 * minimize sends the window to a small dock (the green one stays grey: a note
 * does not need to be enlarged).
 */

const STATS = [
  { value: "3+", es: "Años de experiencia", en: "Years of experience" },
  { value: "20+", es: "Proyectos entregados", en: "Projects delivered" },
  { value: "IA", es: "Foco en aplicativos", en: "Focus on apps" },
];

const WALLPAPER_STYLE = wallpaperStyle(["#f3efe6", "#dcd6e6", "#9aa3c4"]);

export default function AboutDesktop() {
  const { lang, tr, href } = useLocale();
  const reduce = useReducedMotion();
  const deskRef = useRef<HTMLDivElement>(null);
  const shortcutRef = useRef<HTMLButtonElement>(null);
  const tileRef = useRef<HTMLButtonElement>(null);

  // A minimized window flies to the bottom middle of the screen, where the dock slides up.
  const {
    win,
    fx,
    ref: windowRef,
    close,
    minimize,
    open,
  } = useMacWindow(() => {
    const desk = deskRef.current?.getBoundingClientRect();
    if (!desk) return null;
    return { x: desk.left + desk.width / 2, y: Math.min(desk.bottom, window.innerHeight) - 48 };
  });

  // Keyboard users lose their place when the window disappears: hand the focus to what replaces it.
  useEffect(() => {
    if (win === "closed") shortcutRef.current?.focus({ preventScroll: true });
    if (win === "minimized") tileRef.current?.focus({ preventScroll: true });
  }, [win]);

  return (
    <div
      ref={deskRef}
      className="relative w-full overflow-hidden text-[#1d1d1f] lg:h-screen lg:min-h-[640px]"
      style={WALLPAPER_STYLE}
    >
      <div className="flex flex-col items-center px-3 pb-24 pt-[calc(34px+14px)] lg:absolute lg:inset-0 lg:justify-center lg:px-10 lg:pb-0 lg:pt-[34px]">
        {/* The slot keeps its size when the window is closed or minimized, so nothing shifts. */}
        <div className="relative flex min-h-[9rem] w-full items-center lg:min-h-[480px] lg:w-[min(840px,66vw)] 2xl:min-h-[560px] 2xl:w-[1000px]">
          <AnimatePresence initial={false} custom={fx}>
            {win === "open" && (
              <motion.div
                key="note"
                ref={windowRef}
                variants={reduce ? WINDOW_FX_REDUCED : WINDOW_FX}
                custom={fx}
                initial="hidden"
                animate="shown"
                exit="gone"
                className="w-full overflow-hidden rounded-[14px] bg-white/70 shadow-[0_0_0_0.5px_rgba(0,0,0,0.2),0_40px_80px_-24px_rgba(30,40,40,0.5),0_12px_28px_-10px_rgba(30,40,40,0.3)] backdrop-blur-[40px] backdrop-saturate-[1.6]"
              >
                <div className="relative flex h-[52px] items-center border-b border-black/[0.12] bg-[#f3f1ee]/90 px-4">
                  <TrafficLights
                    fixedSize
                    canZoom={false}
                    onClose={close}
                    onMinimize={minimize}
                    onZoom={() => {}}
                  />
                  <p className="pointer-events-none absolute inset-x-0 text-center text-[13px] font-semibold text-black/60">
                    {tr("Notas", "Notes")}
                  </p>
                </div>

                <div className="px-6 py-9 md:px-14 md:py-14">
                  <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.08em] text-black/60">
                    About
                  </p>
                  <h1 className="mb-4 text-3xl font-medium leading-tight tracking-tight md:text-5xl">
                    {tr(
                      "Diseño y desarrollo web con foco en aplicativos con IA — la edición de video, como diferencial.",
                      "Web design and development focused on AI-powered apps — video editing as a differentiator.",
                    )}
                  </h1>
                  <p className="mb-12 text-[15px] text-black/60">
                    {tr(
                      `${NAME.alias} es el nombre con el que trabajo. Mi nombre completo es ${NAME.full}.`,
                      `${NAME.alias} is the name I work under. My full name is ${NAME.full}.`,
                    )}
                  </p>

                  <div className="grid max-w-lg grid-cols-3 gap-3 min-[400px]:gap-6">
                    {STATS.map((stat) => (
                      <div key={stat.es}>
                        <p className="mb-2 text-3xl font-medium md:text-4xl">{stat.value}</p>
                        <p className="break-words text-[10px] uppercase leading-snug tracking-[0.03em] text-black/60 min-[400px]:text-xs min-[400px]:tracking-[0.05em]">
                          {stat[lang]}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Link
                    href={href("/apps#cv")}
                    data-cursor-hover
                    className="mt-12 inline-flex h-11 items-center justify-center gap-2 rounded-[10px] bg-[#1d1d1f] px-6 text-[14px] font-semibold text-white outline-none transition-opacity hover:opacity-85 focus-visible:ring-2 focus-visible:ring-[#0a84ff] focus-visible:ring-offset-2 md:h-10"
                  >
                    {tr("Saber más", "Learn more")} <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence initial={false}>
            {win === "closed" && (
              <DesktopShortcut key="shortcut" label={tr("Notas", "Notes")} aria={tr("Abrir Notas: About", "Open Notes: About")} onOpen={open} buttonRef={shortcutRef}>
                <Image
                  src="/dock/notas.avif"
                  alt=""
                  width={152}
                  height={152}
                  className="h-full w-full object-contain drop-shadow-[0_8px_14px_rgba(30,40,40,0.35)]"
                />
              </DesktopShortcut>
            )}
          </AnimatePresence>
        </div>
      </div>

      <MiniDock tone="light" show={win === "minimized"}>
        <DockTile tone="light" title={tr("Notas: About", "Notes: About")} onRestore={open} buttonRef={tileRef}>
          <span className="absolute inset-x-[12%] top-[36%] h-[8%] rounded-full bg-black/25" />
          <span className="absolute inset-x-[12%] top-[52%] h-[8%] rounded-full bg-black/15" />
          <span className="absolute left-[12%] top-[68%] h-[8%] w-[45%] rounded-full bg-black/15" />
        </DockTile>
      </MiniDock>
    </div>
  );
}
