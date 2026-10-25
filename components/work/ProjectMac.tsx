"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
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

/* ---------- small pieces ---------- */

function TrafficLights({ className = "" }: { className?: string }) {
  return (
    <div className={`flex gap-2 ${className}`} aria-hidden="true">
      <i className="block h-3 w-3 rounded-full bg-[#ff5f57] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.18)]" />
      <i className="block h-3 w-3 rounded-full bg-[#febc2e] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.18)]" />
      <i className="block h-3 w-3 rounded-full bg-[#28c840] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.18)]" />
    </div>
  );
}

function AppleLogo() {
  return (
    <svg width="14" height="17" viewBox="0 0 24 24" aria-hidden="true" className="-mt-0.5">
      <path
        fill="currentColor"
        d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
      />
    </svg>
  );
}

// The clock is the visitor's own: their date, their time, their language and
// 12/24-hour format, ticking in real time ("dom 25 oct 8:32 a. m.").
function subscribeClock(onChange: () => void) {
  const id = window.setInterval(onChange, 1000);
  return () => window.clearInterval(id);
}
function clockSnapshot() {
  return new Date()
    .toLocaleString(undefined, {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    })
    .replace(/,/g, "");
}

function MenuBar() {
  // The snapshot is a string that only changes with the minute, so the bar
  // re-renders once a minute even though the clock is checked every second.
  const clock = useSyncExternalStore(subscribeClock, clockSnapshot, () => "");
  return (
    <div className="absolute inset-x-0 top-0 z-40 flex h-[34px] items-center gap-5 bg-white/55 px-5 text-[13px] text-[#1d1d1f] backdrop-blur-2xl">
      <AppleLogo />
      <b className="font-bold">Work</b>
      <span className="max-xl:hidden">Archivo</span>
      <span className="max-xl:hidden">Edición</span>
      <span className="max-xl:hidden">Ver</span>
      <span className="max-xl:hidden">Ventana</span>
      <span className="max-xl:hidden">Ayuda</span>
      <span className="ml-auto flex items-center gap-4 text-[12.5px]">
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor" aria-hidden="true">
          <path d="M8 2.2c2 0 3.8.8 5.1 2.1l1.1-1.2A8.9 8.9 0 0 0 8 .6a8.9 8.9 0 0 0-6.2 2.5l1.1 1.2A7.2 7.2 0 0 1 8 2.2Zm0 3.4c1.1 0 2.1.4 2.9 1.2l1.1-1.2A6 6 0 0 0 8 4a6 6 0 0 0-4 1.6l1.1 1.2c.8-.8 1.8-1.2 2.9-1.2Zm0 3.3c.5 0 1 .2 1.4.6L8 11.1 6.6 9.5c.4-.4.9-.6 1.4-.6Z" />
        </svg>
        <span className="tabular-nums">{clock}</span>
      </span>
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className={LABEL}>{label}</p>
      <p className="mt-0.5 text-[13px] font-semibold leading-snug [overflow-wrap:anywhere] [@media(max-height:800px)]:lg:text-[12px] [@media(max-height:800px)]:lg:leading-tight">{value}</p>
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
    <Widget className="p-4 sm:p-5 lg:p-4 xl:p-5 [@media(max-height:800px)]:lg:p-3">
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
              className="flex h-6 w-6 items-center justify-center rounded-full bg-black/[0.06] text-black/60 transition-colors hover:bg-black/10"
            >
              <svg width="11" height="12" viewBox="0 0 11 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d={d} />
              </svg>
            </button>
          ))}
        </div>
      </div>
      <h2 className="my-1.5 text-[1.55rem] font-bold leading-[1.05] tracking-tight [@media(max-height:800px)]:lg:my-1 [@media(max-height:800px)]:lg:text-[1.3rem]">{project.name}</h2>
      <div className="grid grid-cols-3 gap-3 border-t border-black/10 pt-2.5 [@media(max-height:800px)]:lg:gap-2 [@media(max-height:800px)]:lg:pt-1.5">
        <Stat label="Rol" value={project.role} />
        <Stat label="Año" value={project.year} />
        <Stat label="Stack" value={project.stack} />
      </div>
    </Widget>
  );
}

/** Summary, "Ver sitio" and the ownership note. */
function SummaryCard({
  project,
  className = "",
  summaryClassName = "",
}: {
  project: Project;
  className?: string;
  summaryClassName?: string;
}) {
  return (
    <Widget className={`flex flex-col justify-center gap-3 p-4 sm:p-5 lg:p-4 xl:p-5 [@media(max-height:800px)]:lg:p-3 ${className}`}>
      <p className={`text-[13px] leading-relaxed text-black/70 ${summaryClassName}`}>{project.summary}</p>
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
    <div className="group/device flex h-full min-h-0 flex-col overflow-hidden rounded-[14px] bg-white shadow-[0_0_0_0.5px_rgba(0,0,0,0.28),0_30px_70px_-18px_rgba(30,40,40,0.55),0_8px_20px_-8px_rgba(30,40,40,0.3)]">
      <div className="flex h-[52px] shrink-0 items-center gap-3 border-b border-black/[0.14] bg-[#f3f1ee] px-4">
        <TrafficLights className="mr-2" />
        <svg width="20" height="16" viewBox="0 0 20 16" fill="none" stroke="currentColor" strokeWidth="1.4" className="text-black/50" aria-hidden="true">
          <rect x="1.5" y="1.5" width="17" height="13" rx="3" />
          <path d="M7 2v12" />
        </svg>
        <svg width="10" height="16" viewBox="0 0 10 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-black/45" aria-hidden="true">
          <path d="M8 2 2 8l6 6" />
        </svg>
        <svg width="10" height="16" viewBox="0 0 10 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-black/25" aria-hidden="true">
          <path d="m2 2 6 6-6 6" />
        </svg>
        <div className="mx-auto flex h-[30px] w-full min-w-0 max-w-[26rem] items-center justify-center gap-1.5 rounded-[9px] bg-black/[0.06] px-3 text-[13px]">
          <svg width="9" height="11" viewBox="0 0 9 11" fill="currentColor" className="shrink-0 text-black/45" aria-hidden="true">
            <path d="M4.5 0a2.7 2.7 0 0 0-2.7 2.7V4H1a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-.8V2.7A2.7 2.7 0 0 0 4.5 0Zm-1.5 2.7a1.5 1.5 0 0 1 3 0V4H3V2.7Z" />
          </svg>
          <span className="truncate">
            {host}
            <span className="text-black/45">{screen.path}</span>
          </span>
        </div>
        <svg width="16" height="18" viewBox="0 0 16 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="text-black/50" aria-hidden="true">
          <path d="M8 1v10M4.5 4.5 8 1l3.5 3.5M3 7.5H2.5a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1H13" />
        </svg>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-black/50" aria-hidden="true">
          <path d="M8 2v12M2 8h12" />
        </svg>
      </div>

      <div
        role="tablist"
        aria-label="Pantallas del proyecto"
        className="flex h-[36px] shrink-0 overflow-x-auto border-b border-black/[0.16] bg-[#e6e3df] [scrollbar-width:none]"
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

// Side buttons share the titanium of the frame.
const TITANIUM = "bg-gradient-to-b from-[#5a5d64] via-[#2d2f34] to-[#4b4e55]";

/**
 * An iPhone 17 Pro Max: titanium frame, side buttons and Camera Control, thin
 * bezels, Dynamic Island, status bar and home indicator. Every measure is in
 * cqw (a share of the phone's own width), so it scales to any size; the box
 * takes its size from its parent (give it a height or a width).
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
      <span className={`absolute -left-[0.9cqw] top-[13.5%] h-[3%] w-[1.2cqw] rounded-l-[0.5cqw] ${TITANIUM}`} aria-hidden="true" />
      <span className={`absolute -left-[0.9cqw] top-[19.5%] h-[6.2%] w-[1.2cqw] rounded-l-[0.5cqw] ${TITANIUM}`} aria-hidden="true" />
      <span className={`absolute -left-[0.9cqw] top-[27.5%] h-[6.2%] w-[1.2cqw] rounded-l-[0.5cqw] ${TITANIUM}`} aria-hidden="true" />
      {/* Power and Camera Control */}
      <span className={`absolute -right-[0.9cqw] top-[24%] h-[9.5%] w-[1.2cqw] rounded-r-[0.5cqw] ${TITANIUM}`} aria-hidden="true" />
      <span className={`absolute -right-[0.9cqw] top-[62%] h-[5.5%] w-[1.2cqw] rounded-r-[0.5cqw] ${TITANIUM}`} aria-hidden="true" />

      {/* Titanium frame */}
      <div className="absolute inset-0 rounded-[14cqw] bg-gradient-to-br from-[#62656c] via-[#2a2c31] to-[#4d5057] p-[1.3cqw] shadow-[inset_0_0_0_0.35cqw_rgba(255,255,255,0.16)]">
        {/* Black bezel */}
        <div className="h-full w-full rounded-[12.8cqw] bg-black p-[1.1cqw]">
          {/* Screen */}
          <div className="relative h-full w-full overflow-hidden rounded-[11.8cqw] bg-white">
            <div className="pointer-events-none absolute left-1/2 top-[2.6cqw] z-20 h-[8.4cqw] w-[29cqw] -translate-x-1/2 rounded-full bg-black" />
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex h-[13cqw] items-center justify-between bg-white px-[9cqw] pt-[1.6cqw] text-[3.7cqw] font-semibold text-black">
              <span>9:41</span>
              <span className="flex items-center gap-[1.2cqw]" aria-hidden="true">
                <svg className="h-[2.3cqw] w-auto" viewBox="0 0 15 9" fill="currentColor"><rect x="0" y="6" width="2.4" height="3" rx=".6" /><rect x="4" y="4" width="2.4" height="5" rx=".6" /><rect x="8" y="2" width="2.4" height="7" rx=".6" /><rect x="12" y="0" width="2.4" height="9" rx=".6" /></svg>
                <svg className="h-[2.4cqw] w-auto" viewBox="0 0 22 10" fill="none"><rect x=".5" y=".5" width="18" height="9" rx="2.6" stroke="currentColor" opacity=".4" /><rect x="2" y="2" width="15" height="6" rx="1.4" fill="currentColor" /></svg>
              </span>
            </div>
            <div className="absolute inset-x-0 bottom-0 top-[13cqw]">
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
            <div className="pointer-events-none absolute bottom-[1.8cqw] left-1/2 z-20 h-[1.2cqw] w-[34cqw] -translate-x-1/2 rounded-full bg-black/70" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- dock ---------- */

function Dock({
  index,
  onGoTo,
  className = "",
}: {
  index: number;
  onGoTo: (i: number) => void;
  className?: string;
}) {
  return (
    <nav
      aria-label="Proyectos"
      className={`flex items-end gap-2 rounded-[26px] bg-white/45 px-2.5 pb-2.5 pt-2.5 shadow-[inset_0_0_0_0.5px_rgba(255,255,255,0.8),0_0_0_0.5px_rgba(0,0,0,0.12),0_18px_40px_-12px_rgba(30,40,40,0.45)] backdrop-blur-3xl backdrop-saturate-150 min-[400px]:gap-3 min-[400px]:px-3.5 ${className}`}
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

/** Safari-style tabs for the phone-only layout. */
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
      className="flex gap-2 overflow-x-auto py-1 [scrollbar-width:none]"
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

  // The tour and videos run only while most of the desktop is on screen; once
  // the first page has loaded, the other tabs' pictures are fetched quietly.
  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [firstLoaded, setFirstLoaded] = useState(false);
  const markFirstLoaded = useCallback(() => setFirstLoaded(true), []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.6,
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

  const info = (
    <InfoCard project={project} index={index} total={total} onPrev={onPrev} onNext={onNext} />
  );

  return (
    <div
      ref={rootRef}
      className="relative w-full bg-[#ecebe7] px-3 pb-6 pt-24 text-[#1d1d1f] sm:px-6 lg:flex lg:h-screen lg:min-h-[640px] lg:flex-col lg:px-8 lg:pb-5"
    >
      {/* ===== Desktop (lg and up): a MacBook ===== */}
      <div className="hidden min-h-0 flex-1 flex-col lg:flex">
        <div className="relative mx-auto flex min-h-0 w-full max-w-[1760px] flex-1 flex-col rounded-t-[1.6rem] rounded-b-md bg-[#0c0c0d] p-3.5 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.45)]">
          <div className="pointer-events-none absolute left-1/2 top-3.5 z-50 h-8 w-44 -translate-x-1/2 rounded-b-2xl bg-[#0c0c0d]">
            <span className="absolute left-1/2 top-[11px] h-2 w-2 -translate-x-1/2 rounded-full bg-[#1b2230] shadow-[0_0_0_2px_#14161c]" />
          </div>
          <div className="relative min-h-0 flex-1 overflow-hidden rounded-[14px]" style={wallpaperStyle}>
            <MenuBar />
            <div className="absolute inset-x-0 bottom-0 top-[34px] flex flex-col gap-4 p-5">
              {/* Safari and the iPhone, side by side */}
              <div className="flex min-h-0 flex-1 gap-6">
                <div className="min-w-0 flex-1">
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
                <div className="flex shrink-0 items-center py-2">
                  <IPhone17
                    screens={screens}
                    active={active}
                    name={project.name}
                    pace={pace}
                    priority={first}
                    inView={visible}
                    className="h-full max-h-full"
                  />
                </div>
              </div>

              {/* Information below; at xl the dock sits between the two cards */}
              <div className="grid shrink-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-end gap-4 xl:gap-5">
                <div className="order-1">{info}</div>
                <SummaryCard
                  project={project}
                  className="order-3"
                  summaryClassName="max-xl:hidden [@media(max-height:760px)]:hidden"
                />
                <Dock index={index} onGoTo={onGoTo} className="order-2" />
              </div>
            </div>
          </div>
        </div>
        <div className="relative mx-auto h-[18px] w-[calc(100%+3rem)] max-w-[min(1840px,100%)] rounded-b-[1.4rem] bg-gradient-to-b from-[#d9dadc] to-[#b8babe] shadow-[0_18px_30px_-12px_rgba(0,0,0,0.35)]">
          <span className="absolute left-1/2 top-0 h-[7px] w-52 -translate-x-1/2 rounded-b-xl bg-[#a4a6aa]" />
        </div>
      </div>

      {/* ===== Tablet and phone: an iPhone 17 Pro Max with the information below ===== */}
      <div className="mx-auto max-w-[34rem] rounded-[1.6rem] p-4 sm:p-6 lg:hidden" style={wallpaperStyle}>
        <div className="mx-auto w-[min(72vw,19rem)] sm:w-[min(52vw,21rem)]">
          <IPhone17
            screens={screens}
            active={active}
            name={project.name}
            pace={pace}
            priority={first}
            inView={visible}
            className="w-full"
          />
        </div>
        <div className="mt-5">
          <PillTabs screens={screens} active={active} onSelect={setActive} />
        </div>
        <div className="mt-3 flex flex-col gap-3">
          {info}
          <SummaryCard project={project} />
        </div>
        <div className="mt-5 flex justify-center pb-1">
          <Dock index={index} onGoTo={onGoTo} />
        </div>
      </div>
    </div>
  );
}
