"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { projects, type Project, type ProjectScreen } from "@/lib/data";
import {
  DESKTOP_PAGE_WIDTH,
  DESKTOP_RATIO,
  DESKTOP_SIZES,
  MOBILE_PAGE_WIDTH,
  PHONE_RATIO,
  PHONE_SIZES,
  ScrollShot,
  prefetchScreens,
} from "./ProjectShowcase";

/*
 * One component tree for every screen size: a macOS desktop (wallpaper, a Safari
 * and an iPhone window, widgets and a dock) with no frame around it, edge to
 * edge; its menu bar is the site's own (components/MacMenuBar.tsx), fixed above
 * it. From lg up it fills the viewport; below that the same desktop is shown
 * smaller and scrolls with the page. Everything inside it is measured in cqw (a
 * share of the desktop's width) below lg, so the Safari and iPhone windows keep
 * the proportions of the large one at any width.
 */

/* ---------- small pieces ---------- */

function TrafficLights() {
  const dot =
    "block h-[max(4px,1.8cqw)] w-[max(4px,1.8cqw)] rounded-full shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.18)] lg:h-3 lg:w-3";
  return (
    <div className="flex gap-[max(2px,1cqw)] lg:mr-2 lg:gap-2" aria-hidden="true">
      <i className={`${dot} bg-[#ff5f57]`} />
      <i className={`${dot} bg-[#febc2e]`} />
      <i className={`${dot} bg-[#28c840]`} />
    </div>
  );
}

function Widget({ className = "", children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={`min-w-0 rounded-[20px] bg-white/60 shadow-[inset_0_0_0_0.5px_rgba(255,255,255,0.7),0_18px_40px_-16px_rgba(40,50,50,0.4)] backdrop-blur-3xl backdrop-saturate-150 ${className}`}
    >
      {children}
    </div>
  );
}

const LABEL = "text-[11px] font-semibold uppercase tracking-[0.08em] text-black/50";

function Stat({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return (
    <div className={`min-w-0 ${className}`}>
      <p className={LABEL}>{label}</p>
      <p className="mt-0.5 text-[13px] font-semibold leading-snug [overflow-wrap:anywhere]">{value}</p>
    </div>
  );
}

/** Name, counter with arrows, and role / year / stack. */
function InfoCard({
  project,
  index,
  total,
  onPrev,
  onNext,
}: {
  project: Project;
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  const counter = `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
  return (
    <Widget className="flex flex-col justify-center p-4 lg:p-4 xl:p-5">
      <div className="flex items-center justify-between gap-3">
        <p className={`${LABEL} min-w-0 truncate`}>
          <span className="max-sm:hidden">Proyecto </span>
          {counter}
        </p>
        <div className="flex shrink-0 gap-1">
          {(
            [
              ["Proyecto anterior", onPrev, "M8 1 3 6l5 5"],
              ["Siguiente proyecto", onNext, "m4 1 5 5-5 5"],
            ] as const
          ).map(([label, fn, d]) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              onClick={fn}
              data-cursor-hover
              className="flex h-7 w-7 items-center justify-center rounded-full bg-black/[0.06] text-black/60 transition-colors hover:bg-black/10 lg:h-6 lg:w-6"
            >
              <svg width="11" height="12" viewBox="0 0 11 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d={d} />
              </svg>
            </button>
          ))}
        </div>
      </div>
      <h2 className="my-1.5 text-[1.55rem] font-bold leading-[1.05] tracking-tight lg:text-[1.4rem] xl:text-[1.55rem]">
        {project.name}
      </h2>
      <div className="grid grid-cols-3 gap-3 border-t border-black/10 pt-2.5 max-[400px]:grid-cols-2">
        <Stat label="Rol" value={project.role} />
        <Stat label="Año" value={project.year} />
        <Stat label="Stack" value={project.stack} className="max-[400px]:col-span-2" />
      </div>
    </Widget>
  );
}

/** Summary, "Ver sitio" and the ownership note. */
function SummaryCard({ project }: { project: Project }) {
  return (
    <Widget className="flex flex-col justify-center gap-3 p-4 lg:gap-2.5 lg:p-4 xl:gap-3 xl:p-5">
      <p className="text-[13px] leading-relaxed text-black/70 lg:leading-[1.5]">{project.summary}</p>
      <div className="flex items-center gap-4">
        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor-hover
            className="flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-[10px] bg-[#1d1d1f] px-5 text-[13.5px] font-semibold text-white transition-opacity hover:opacity-85"
          >
            Ver sitio <span aria-hidden="true">↗</span>
          </a>
        )}
        {project.note && <p className="text-[11px] leading-snug text-black/55">{project.note}</p>}
      </div>
    </Widget>
  );
}

/* ---------- the windows ---------- */

function SafariWindow({
  screens,
  active,
  onSelect,
  host,
  name,
  pace,
  priority,
  inView,
  onFirstLoaded,
}: {
  screens: ProjectScreen[];
  active: number;
  onSelect: (i: number) => void;
  host: string;
  name: string;
  pace: number;
  priority: boolean;
  inView: boolean;
  onFirstLoaded: () => void;
}) {
  const reduce = useReducedMotion();
  const screen = screens[active];
  const fade = reduce
    ? {}
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.4 },
      };

  return (
    <div className="group/device flex min-h-0 flex-1 flex-col overflow-hidden rounded-[2.2cqw] bg-white shadow-[0_0_0_0.5px_rgba(0,0,0,0.28),0_30px_70px_-18px_rgba(30,40,40,0.55),0_8px_20px_-8px_rgba(30,40,40,0.3)] lg:rounded-[14px]">
      <div className="flex h-[7.2cqw] shrink-0 items-center gap-[1.6cqw] border-b border-black/[0.14] bg-[#f3f1ee] px-[2cqw] lg:h-[52px] lg:gap-3 lg:px-4">
        <TrafficLights />
        <svg width="20" height="16" viewBox="0 0 20 16" fill="none" stroke="currentColor" strokeWidth="1.4" className="text-black/50 max-lg:hidden" aria-hidden="true">
          <rect x="1.5" y="1.5" width="17" height="13" rx="3" />
          <path d="M7 2v12" />
        </svg>
        <svg width="10" height="16" viewBox="0 0 10 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-black/45 max-lg:hidden" aria-hidden="true">
          <path d="M8 2 2 8l6 6" />
        </svg>
        <svg width="10" height="16" viewBox="0 0 10 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-black/25 max-lg:hidden" aria-hidden="true">
          <path d="m2 2 6 6-6 6" />
        </svg>
        <div className="mx-auto flex h-[4.2cqw] w-full min-w-0 items-center justify-center gap-[0.8cqw] rounded-[1.2cqw] bg-black/[0.06] px-[1.4cqw] text-[max(6.5px,2.3cqw)] lg:h-[30px] lg:max-w-[26rem] lg:gap-1.5 lg:rounded-[9px] lg:px-3 lg:text-[13px]">
          <svg viewBox="0 0 9 11" fill="currentColor" className="h-[max(5px,1.8cqw)] w-auto shrink-0 text-black/45 lg:h-[11px]" aria-hidden="true">
            <path d="M4.5 0a2.7 2.7 0 0 0-2.7 2.7V4H1a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-.8V2.7A2.7 2.7 0 0 0 4.5 0Zm-1.5 2.7a1.5 1.5 0 0 1 3 0V4H3V2.7Z" />
          </svg>
          <span className="truncate">
            {host}
            <span className="text-black/45">{screen.path}</span>
          </span>
        </div>
        <svg width="16" height="18" viewBox="0 0 16 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="text-black/50 max-lg:hidden" aria-hidden="true">
          <path d="M8 1v10M4.5 4.5 8 1l3.5 3.5M3 7.5H2.5a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1H13" />
        </svg>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-black/50 max-lg:hidden" aria-hidden="true">
          <path d="M8 2v12M2 8h12" />
        </svg>
      </div>

      {/* Too small to tap below lg: the pill tabs under the windows take over. */}
      <div
        role="tablist"
        aria-label="Pantallas del proyecto"
        className="flex h-[36px] shrink-0 overflow-x-auto border-b border-black/[0.16] bg-[#e6e3df] [scrollbar-width:none] max-lg:hidden"
      >
        {screens.map((s, i) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={i === active}
            onClick={() => onSelect(i)}
            data-cursor-hover
            className={`flex min-w-[88px] flex-1 items-center justify-center gap-1.5 whitespace-nowrap border-r border-black/10 px-3 text-[12.5px] transition-colors ${
              i === active
                ? "bg-[#f7f5f2] font-semibold text-[#1d1d1f]"
                : "text-black/55 hover:bg-black/[0.04]"
            }`}
          >
            <span className="h-[11px] w-[11px] rounded-[3px] bg-[#8aa5a2]" aria-hidden="true" />
            {s.label}
          </button>
        ))}
      </div>

      <div className="relative min-h-0 flex-1 bg-white">
        <AnimatePresence initial={false}>
          <motion.div key={screen.id} {...fade} className="absolute inset-0">
            <ScrollShot
              shot={screen.desktop}
              alt={`${name}: ${screen.label}, en escritorio`}
              viewportRatio={DESKTOP_RATIO}
              pageWidth={DESKTOP_PAGE_WIDTH}
              pace={pace}
              sizes={DESKTOP_SIZES}
              priority={priority && active === 0}
              inView={inView}
              onLoaded={active === 0 ? onFirstLoaded : undefined}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// The side buttons catch the light like the frame does.
const TITANIUM = "bg-gradient-to-b from-[#7d8087] via-[#3a3c41] to-[#6a6d74]";

/**
 * An iPhone 17 Pro Max: a thin titanium rim, a hairline black bezel, side
 * buttons and Camera Control, Dynamic Island, status bar and home indicator.
 * Every measure is in cqw (a share of the phone's own width), so it scales to
 * any size; the box takes its size from its parent (give it a height or a width).
 */
function IPhone17({
  screens,
  active,
  name,
  pace,
  priority,
  inView,
  className = "",
}: {
  screens: ProjectScreen[];
  active: number;
  name: string;
  pace: number;
  priority: boolean;
  inView: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const screen = screens[active];
  const fade = reduce
    ? {}
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.4 },
      };

  return (
    <div
      className={`@container group/device relative aspect-[78/163.4] drop-shadow-[0_28px_36px_rgba(30,40,40,0.45)] ${className}`}
    >
      {/* Action button, volume up / down */}
      <span className={`absolute -left-[0.7cqw] top-[13.5%] h-[3%] w-[1cqw] rounded-l-[0.5cqw] ${TITANIUM}`} aria-hidden="true" />
      <span className={`absolute -left-[0.7cqw] top-[19.5%] h-[6.2%] w-[1cqw] rounded-l-[0.5cqw] ${TITANIUM}`} aria-hidden="true" />
      <span className={`absolute -left-[0.7cqw] top-[27.5%] h-[6.2%] w-[1cqw] rounded-l-[0.5cqw] ${TITANIUM}`} aria-hidden="true" />
      {/* Power and Camera Control */}
      <span className={`absolute -right-[0.7cqw] top-[24%] h-[9.5%] w-[1cqw] rounded-r-[0.5cqw] ${TITANIUM}`} aria-hidden="true" />
      <span className={`absolute -right-[0.7cqw] top-[62%] h-[5.5%] w-[1cqw] rounded-r-[0.5cqw] ${TITANIUM}`} aria-hidden="true" />

      {/* Titanium rim */}
      <div className="absolute inset-0 rounded-[13.6cqw] bg-gradient-to-br from-[#9a9da4] via-[#4a4d53] to-[#868990] p-[max(1px,0.7cqw)] shadow-[inset_0_0_0_0.3cqw_rgba(255,255,255,0.28)]">
        {/* Black bezel, as thin as it gets */}
        <div className="h-full w-full rounded-[12.9cqw] bg-black p-[max(1px,0.45cqw)]">
          {/* Screen */}
          <div className="relative h-full w-full overflow-hidden rounded-[12.4cqw] bg-white">
            <div className="pointer-events-none absolute left-1/2 top-[2.2cqw] z-20 h-[7.8cqw] w-[27.5cqw] -translate-x-1/2 rounded-full bg-black" />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 z-10 flex h-[11.5cqw] items-center justify-between bg-white px-[8cqw] pt-[1.4cqw] text-[3.6cqw] font-semibold text-black"
            >
              <span>9:41</span>
              <span className="flex items-center gap-[1.2cqw]">
                <svg className="h-[2.3cqw] w-auto" viewBox="0 0 15 9" fill="currentColor"><rect x="0" y="6" width="2.4" height="3" rx=".6" /><rect x="4" y="4" width="2.4" height="5" rx=".6" /><rect x="8" y="2" width="2.4" height="7" rx=".6" /><rect x="12" y="0" width="2.4" height="9" rx=".6" /></svg>
                <svg className="h-[2.4cqw] w-auto" viewBox="0 0 22 10" fill="none"><rect x=".5" y=".5" width="18" height="9" rx="2.6" stroke="currentColor" opacity=".4" /><rect x="2" y="2" width="15" height="6" rx="1.4" fill="currentColor" /></svg>
              </span>
            </div>
            <div className="absolute inset-x-0 bottom-0 top-[11.5cqw]">
              <AnimatePresence initial={false}>
                <motion.div key={screen.id} {...fade} className="absolute inset-0">
                  <ScrollShot
                    shot={screen.mobile}
                    alt={`${name}: ${screen.label}, en celular`}
                    viewportRatio={PHONE_RATIO}
                    pageWidth={MOBILE_PAGE_WIDTH}
                    pace={pace}
                    sizes={PHONE_SIZES}
                    priority={priority && active === 0}
                    inView={inView}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="pointer-events-none absolute bottom-[1.6cqw] left-1/2 z-20 h-[1.1cqw] w-[33cqw] -translate-x-1/2 rounded-full bg-black/70" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- dock ---------- */

/**
 * The dock of projects. From lg up it sits on the desktop; below lg it floats
 * over the page, fixed to the bottom of the viewport, and is shown only while
 * this project is the one on screen (`show`).
 */
function Dock({
  index,
  onGoTo,
  show,
  className = "",
}: {
  index: number;
  onGoTo: (i: number) => void;
  show: boolean;
  className?: string;
}) {
  return (
    <nav
      aria-label="Proyectos"
      className={`flex items-end gap-2 rounded-[26px] bg-white/45 px-2.5 pb-2.5 pt-2.5 shadow-[inset_0_0_0_0.5px_rgba(255,255,255,0.8),0_0_0_0.5px_rgba(0,0,0,0.12),0_18px_40px_-12px_rgba(30,40,40,0.45)] backdrop-blur-3xl backdrop-saturate-150 min-[400px]:gap-3 min-[400px]:px-3.5 max-lg:fixed max-lg:bottom-[max(0.75rem,env(safe-area-inset-bottom))] max-lg:left-1/2 max-lg:z-[60] max-lg:-translate-x-1/2 max-lg:bg-white/70 max-lg:shadow-[inset_0_0_0_0.5px_rgba(255,255,255,0.9),0_0_0_0.5px_rgba(0,0,0,0.14),0_16px_36px_-10px_rgba(20,25,25,0.55)] max-lg:transition-[opacity,translate,visibility] max-lg:duration-300 ${
        show ? "" : "max-lg:invisible max-lg:translate-y-6 max-lg:opacity-0"
      } ${className}`}
    >
      {projects.map((p, i) => {
        const on = i === index;
        const dock = p.dock ?? { bg: "#8a8a86", fg: "#ffffff", label: p.name.slice(0, 2).toUpperCase() };
        return (
          <button
            key={p.slug}
            type="button"
            onClick={() => onGoTo(i)}
            aria-label={p.name}
            aria-current={on ? "page" : undefined}
            data-cursor-hover
            className="group/dock relative h-10 w-10 shrink-0 min-[400px]:h-12 min-[400px]:w-12 sm:h-14 sm:w-14 lg:h-11 lg:w-11 xl:h-16 xl:w-16 [@media(max-height:760px)]:xl:h-14 [@media(max-height:760px)]:xl:w-14"
          >
            <span
              className={`absolute inset-0 flex items-center justify-center overflow-hidden rounded-[14px] text-[15px] font-bold tracking-tight shadow-[0_6px_14px_-4px_rgba(0,0,0,0.4),0_0_0_0.5px_rgba(0,0,0,0.18)] transition-transform duration-200 ease-out group-hover/dock:-translate-y-2 group-hover/dock:scale-110 sm:text-[17px] lg:text-[14px] xl:text-[19px] ${
                on ? "-translate-y-1.5 scale-105" : ""
              }`}
              style={{ background: dock.bg, color: dock.fg }}
            >
              {dock.logo ? (
                <Image src={dock.logo} alt="" fill sizes="64px" className="object-contain p-2" />
              ) : (
                dock.label
              )}
            </span>
            {on && (
              <span
                aria-hidden="true"
                className="absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-black/60"
              />
            )}
            <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-neutral-800/90 px-2.5 py-1 text-xs text-white opacity-0 transition-opacity group-hover/dock:opacity-100 group-focus-visible/dock:opacity-100 max-lg:hidden">
              {p.name}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

/** Safari-style tabs below the windows, for the sizes where the real ones are too small. */
function PillTabs({
  screens,
  active,
  onSelect,
}: {
  screens: ProjectScreen[];
  active: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Pantallas del proyecto"
      className="mx-auto flex w-fit max-w-full gap-2 overflow-x-auto py-1 [scrollbar-width:none] lg:hidden"
    >
      {screens.map((s, i) => (
        <button
          key={s.id}
          type="button"
          role="tab"
          aria-selected={i === active}
          onClick={() => onSelect(i)}
          data-cursor-hover
          className={`shrink-0 rounded-full px-4 py-2 text-[13px] transition-colors ${
            i === active
              ? "bg-[#1d1d1f] font-semibold text-white"
              : "bg-white/60 text-black/65 backdrop-blur-xl hover:bg-white/80"
          }`}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}

/* ---------- the whole desktop ---------- */

export default function ProjectMac({
  project,
  screens,
  index,
  total,
  onPrev,
  onNext,
  onGoTo,
  priority,
}: {
  project: Project;
  screens: ProjectScreen[];
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onGoTo: (index: number) => void;
  priority?: boolean;
}) {
  const [active, setActive] = useState(0);
  const pace = project.tourPace ?? 1;
  const host = project.url ? new URL(project.url).hostname.replace(/^www\./, "") : "";
  const wallpaper = project.wallpaper ?? ["#f7f2e8", "#dbe0dc", "#8aa5a2"];
  const first = priority ?? index === 0;

  // The tour and videos run only while most of the two windows are on screen
  // (not the whole page: on a phone the page is taller than the screen); once
  // the first page has loaded, the other tabs' pictures are fetched quietly.
  const stageRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [dockOn, setDockOn] = useState(false);
  const [firstLoaded, setFirstLoaded] = useState(false);
  const markFirstLoaded = useCallback(() => setFirstLoaded(true), []);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.6,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // The floating dock (phones and tablets) shows while this project covers the
  // middle of the screen, so the other slides of the carousel don't stack theirs.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setDockOn(entry.isIntersecting), {
      rootMargin: "0px -40% 0px -40%",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!firstLoaded || !visible) return;
    return prefetchScreens(screens, 0);
  }, [firstLoaded, visible, screens]);

  // ← / → move between projects while this desktop is the one on screen.
  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      const target = e.target;
      if (target instanceof HTMLElement && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, onNext, onPrev]);

  const wallpaperStyle = {
    background: `radial-gradient(900px 600px at 18% 8%, ${wallpaper[0]}, transparent 70%), radial-gradient(1000px 700px at 92% 96%, ${wallpaper[2]}, transparent 65%), radial-gradient(700px 500px at 60% 40%, ${wallpaper[1]}, transparent 70%), linear-gradient(135deg, ${wallpaper[0]}, ${wallpaper[2]})`,
  };

  return (
    <div
      ref={rootRef}
      className="relative min-h-full w-full overflow-hidden text-[#1d1d1f] lg:flex lg:h-screen lg:min-h-[max(700px,100%)] lg:flex-col xl:min-h-[max(660px,100%)]"
      style={wallpaperStyle}
    >
      {/* A size container, so everything below lg scales with its width. */}
      <div className="@container relative mx-auto flex w-full max-w-[44rem] flex-col lg:min-h-0 lg:max-w-none lg:flex-1">
        <div className="flex flex-col gap-[3cqw] px-[4cqw] pb-28 pt-[calc(34px+5cqw)] lg:absolute lg:inset-0 lg:gap-4 lg:p-5 lg:pt-[calc(34px+1.25rem)] xl:p-6 xl:pt-[calc(34px+1.5rem)]">
          {/* Safari and the iPhone, side by side */}
          {/* The Safari window sets the height; the phone is a bit smaller and sits flush with its bottom edge. */}
          <div ref={stageRef} className="flex items-end gap-[3cqw] lg:min-h-0 lg:flex-1 lg:items-stretch lg:gap-6">
            <div className="flex h-[67cqw] min-w-0 flex-1 flex-col lg:h-auto">
              <SafariWindow
                screens={screens}
                active={active}
                onSelect={setActive}
                host={host}
                name={project.name}
                pace={pace}
                priority={first}
                inView={visible}
                onFirstLoaded={markFirstLoaded}
              />
            </div>
            <div className="w-[28cqw] shrink-0 lg:flex lg:w-auto lg:items-end">
              <IPhone17
                screens={screens}
                active={active}
                name={project.name}
                pace={pace}
                priority={first}
                inView={visible}
                className="w-full lg:h-[90%] lg:w-auto"
              />
            </div>
          </div>

          <PillTabs screens={screens} active={active} onSelect={setActive} />

          {/* Information below; from xl the dock sits between the two cards */}
          <div className="grid shrink-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:items-stretch lg:gap-4 xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] xl:gap-5">
            <div className="flex lg:order-1 [&>*]:flex-1">
              <InfoCard project={project} index={index} total={total} onPrev={onPrev} onNext={onNext} />
            </div>
            <div className="flex lg:order-2 xl:order-3 [&>*]:flex-1">
              <SummaryCard project={project} />
            </div>
            <Dock
              index={index}
              onGoTo={onGoTo}
              show={dockOn}
              className="lg:order-3 lg:col-span-2 lg:justify-self-center xl:order-2 xl:col-span-1 xl:self-end"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
