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

// The clock is the visitor's own, formatted like macOS ("vie 24 oct 3:41 p. m.").
function subscribeMinute(onChange: () => void) {
  const id = window.setInterval(onChange, 15000);
  return () => window.clearInterval(id);
}
function minuteSnapshot() {
  const now = new Date();
  const date = now.toLocaleDateString("es", { weekday: "short", day: "numeric", month: "short" });
  const time = now.toLocaleTimeString("es", { hour: "numeric", minute: "2-digit" });
  return `${date.replace(/\./g, "")}  ${time}`;
}

function MenuBar() {
  const clock = useSyncExternalStore(subscribeMinute, minuteSnapshot, () => "");
  return (
    <div className="absolute inset-x-0 top-0 z-40 flex h-[34px] items-center gap-5 bg-white/55 px-5 text-[13px] text-[#1d1d1f] backdrop-blur-2xl max-lg:hidden">
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

function Widget({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`min-w-0 rounded-[20px] bg-white/60 p-5 shadow-[inset_0_0_0_0.5px_rgba(255,255,255,0.7),0_18px_40px_-16px_rgba(40,50,50,0.4)] backdrop-blur-3xl backdrop-saturate-150 [@media(max-height:900px)]:lg:px-3.5 [@media(max-height:900px)]:lg:py-3 ${className}`}
    >
      {children}
    </div>
  );
}

const WIDGET_LABEL = "text-[11px] font-semibold uppercase tracking-[0.08em] text-black/50";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-t border-black/10 py-2 text-[13px] [@media(max-height:900px)]:lg:py-1">
      <span className="shrink-0 text-black/50">{label}</span>
      <b className="min-w-0 text-right font-semibold [overflow-wrap:anywhere]">{value}</b>
    </div>
  );
}

/* ---------- the three windows ---------- */

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
        <svg width="20" height="16" viewBox="0 0 20 16" fill="none" stroke="currentColor" strokeWidth="1.4" className="text-black/50 max-sm:hidden" aria-hidden="true">
          <rect x="1.5" y="1.5" width="17" height="13" rx="3" />
          <path d="M7 2v12" />
        </svg>
        <svg width="10" height="16" viewBox="0 0 10 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-black/45 max-sm:hidden" aria-hidden="true">
          <path d="M8 2 2 8l6 6" />
        </svg>
        <svg width="10" height="16" viewBox="0 0 10 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-black/25 max-sm:hidden" aria-hidden="true">
          <path d="m2 2 6 6-6 6" />
        </svg>
        <div className="mx-auto flex h-[30px] w-full max-w-[26rem] min-w-0 items-center justify-center gap-1.5 rounded-[9px] bg-black/[0.06] px-3 text-[13px]">
          <svg width="9" height="11" viewBox="0 0 9 11" fill="currentColor" className="shrink-0 text-black/45" aria-hidden="true">
            <path d="M4.5 0a2.7 2.7 0 0 0-2.7 2.7V4H1a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-.8V2.7A2.7 2.7 0 0 0 4.5 0Zm-1.5 2.7a1.5 1.5 0 0 1 3 0V4H3V2.7Z" />
          </svg>
          <span className="truncate">
            {host}
            <span className="text-black/45">{screen.path}</span>
          </span>
        </div>
        <svg width="16" height="18" viewBox="0 0 16 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="text-black/50 max-md:hidden" aria-hidden="true">
          <path d="M8 1v10M4.5 4.5 8 1l3.5 3.5M3 7.5H2.5a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1H13" />
        </svg>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-black/50 max-md:hidden" aria-hidden="true">
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

function IPhoneWindow({
  screens,
  active,
  name,
  pace,
  priority,
  inView,
}: {
  screens: ProjectScreen[];
  active: number;
  name: string;
  pace: number;
  priority: boolean;
  inView: boolean;
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
    <div className="group/device flex h-full min-h-0 flex-col overflow-hidden rounded-[14px] bg-[#ebe8e4] shadow-[0_0_0_0.5px_rgba(0,0,0,0.28),0_30px_70px_-18px_rgba(30,40,40,0.55),0_8px_20px_-8px_rgba(30,40,40,0.3)]">
      <div className="flex h-[38px] shrink-0 items-center px-3.5">
        <TrafficLights />
      </div>
      <div className="flex min-h-0 flex-1 items-center justify-center px-3 pb-3">
        <div className="relative h-full max-h-full aspect-[390/844] overflow-hidden rounded-[2.4rem] bg-white shadow-[0_0_0_7px_#1c1c1e,0_0_0_8px_#3a3a3c]">
          <div className="pointer-events-none absolute left-1/2 top-2.5 z-10 h-6 w-[5.4rem] -translate-x-1/2 rounded-full bg-black" />
          <div className="pointer-events-none absolute inset-x-0 top-0 z-[5] flex h-10 items-center justify-between bg-white px-7 text-[11px] font-semibold text-black">
            <span>9:41</span>
            <span className="flex items-center gap-1" aria-hidden="true">
              <svg width="15" height="9" viewBox="0 0 15 9" fill="currentColor"><rect x="0" y="6" width="2.4" height="3" rx=".6"/><rect x="4" y="4" width="2.4" height="5" rx=".6"/><rect x="8" y="2" width="2.4" height="7" rx=".6"/><rect x="12" y="0" width="2.4" height="9" rx=".6"/></svg>
              <svg width="22" height="10" viewBox="0 0 22 10" fill="none"><rect x=".5" y=".5" width="18" height="9" rx="2.6" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="15" height="6" rx="1.4" fill="currentColor"/></svg>
            </span>
          </div>
          <AnimatePresence initial={false}>
            <motion.div key={screen.id} {...fade} className="absolute inset-x-0 bottom-0 top-10">
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
          <div className="pointer-events-none absolute bottom-2 left-1/2 z-10 h-1 w-24 -translate-x-1/2 rounded-full bg-black/60" />
        </div>
      </div>
    </div>
  );
}

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
      className={`flex items-end gap-2 rounded-[26px] bg-white/45 px-2.5 pb-2.5 pt-2.5 min-[400px]:gap-3 min-[400px]:px-3.5 shadow-[inset_0_0_0_0.5px_rgba(255,255,255,0.8),0_0_0_0.5px_rgba(0,0,0,0.12),0_18px_40px_-12px_rgba(30,40,40,0.45)] backdrop-blur-3xl backdrop-saturate-150 ${className}`}
    >
      {projects.map((p, i) => {
        const on = i === index;
        return (
          <button
            key={p.slug}
            type="button"
            onClick={() => onGoTo(i)}
            aria-label={p.name}
            aria-current={on ? "page" : undefined}
            data-cursor-hover
            className="group/dock relative h-10 w-10 shrink-0 min-[400px]:h-12 min-[400px]:w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 [@media(max-height:760px)]:lg:h-14 [@media(max-height:760px)]:lg:w-14"
          >
            <span
              className={`absolute inset-0 overflow-hidden rounded-[14px] bg-white shadow-[0_6px_14px_-4px_rgba(0,0,0,0.4),0_0_0_0.5px_rgba(0,0,0,0.18)] transition-transform duration-200 ease-out group-hover/dock:-translate-y-2 group-hover/dock:scale-110 ${
                on ? "-translate-y-1.5 scale-105" : ""
              }`}
            >
              {p.screens?.[0] && (
                <Image
                  src={p.screens[0].desktop.src}
                  alt=""
                  fill
                  sizes="64px"
                  quality={60}
                  className="object-cover object-top"
                />
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

  const counter = `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
  const wallpaperStyle = {
    background: `radial-gradient(900px 600px at 18% 8%, ${wallpaper[0]}, transparent 70%), radial-gradient(1000px 700px at 92% 96%, ${wallpaper[2]}, transparent 65%), radial-gradient(700px 500px at 60% 40%, ${wallpaper[1]}, transparent 70%), linear-gradient(135deg, ${wallpaper[0]}, ${wallpaper[2]})`,
  };

  const info = (
    <Widget>
      <div className="mb-2 flex items-center justify-between [@media(max-height:900px)]:lg:mb-1">
        <p className={`${WIDGET_LABEL} min-w-0 truncate`}>
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
      <h2 className="mb-3 text-[1.7rem] font-bold leading-[1.05] tracking-tight [@media(max-height:900px)]:lg:mb-1.5 [@media(max-height:900px)]:lg:text-[1.35rem]">{project.name}</h2>
      <Row label="Rol" value={project.role} />
      <Row label="Año" value={project.year} />
      <Row label="Stack" value={project.stack} />
    </Widget>
  );

  const summary = (
    <Widget>
      <p className={`${WIDGET_LABEL} mb-2 [@media(max-height:900px)]:lg:mb-1`}>Resumen</p>
      <p className="text-[13px] leading-relaxed text-black/70 [@media(max-height:900px)]:lg:text-[12px] [@media(max-height:900px)]:lg:leading-snug">{project.summary}</p>
    </Widget>
  );

  const cta = (
    <Widget className="p-4 [@media(max-height:900px)]:lg:p-3">
      {project.url && (
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor-hover
          className="mb-2.5 flex h-9 items-center justify-center gap-1.5 rounded-[10px] bg-[#1d1d1f] [@media(max-height:900px)]:lg:mb-1.5 [@media(max-height:900px)]:lg:h-8 text-[13.5px] font-semibold text-white transition-opacity hover:opacity-85"
        >
          Ver sitio <span aria-hidden="true">↗</span>
        </a>
      )}
      {project.note && <p className="text-[11px] leading-snug text-black/55">{project.note}</p>}
    </Widget>
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
            <div className="absolute inset-x-0 bottom-[96px] top-[34px] [@media(max-height:760px)]:bottom-[84px] grid grid-rows-[minmax(0,1fr)] gap-5 p-5 xl:grid-cols-[minmax(0,1fr)_17rem_17.5rem] max-xl:grid-cols-[minmax(0,1fr)_17.5rem]">
              <SafariWindow
                screens={screens}
                active={active}
                onSelect={setActive}
                host={host}
                name={project.name}
                pace={pace}
                priority={priority ?? index === 0}
                inView={visible}
                onFirstLoaded={markFirstLoaded}
              />
              <div className="min-h-0 max-xl:hidden">
                <IPhoneWindow
                  screens={screens}
                  active={active}
                  name={project.name}
                  pace={pace}
                  priority={priority ?? index === 0}
                  inView={visible}
                />
              </div>
              <div className="flex min-h-0 flex-col overflow-y-auto [scrollbar-width:none]">
                <div className="my-auto flex flex-col gap-4 max-[1100px]:gap-3 [@media(max-height:900px)]:gap-3 [@media(max-height:760px)]:gap-2">
                  {info}
                  {summary}
                  {cta}
                </div>
              </div>
            </div>
            <Dock
              index={index}
              onGoTo={onGoTo}
              className="absolute bottom-3.5 left-1/2 z-30 -translate-x-1/2"
            />
          </div>
        </div>
        <div className="relative mx-auto h-[18px] w-[calc(100%+3rem)] max-w-[min(1840px,100%)] rounded-b-[1.4rem] bg-gradient-to-b from-[#d9dadc] to-[#b8babe] shadow-[0_18px_30px_-12px_rgba(0,0,0,0.35)]">
          <span className="absolute left-1/2 top-0 h-[7px] w-52 -translate-x-1/2 rounded-b-xl bg-[#a4a6aa]" />
        </div>
      </div>

      {/* ===== Tablet and phone: the same desktop, stacked ===== */}
      <div className="mx-auto max-w-[44rem] rounded-[1.6rem] p-3 sm:p-5 lg:hidden" style={wallpaperStyle}>
        <div className="h-[26rem] sm:h-[34rem]">
          <SafariWindow
            screens={screens}
            active={active}
            onSelect={setActive}
            host={host}
            name={project.name}
            pace={pace}
            priority={priority ?? index === 0}
            inView={visible}
            onFirstLoaded={markFirstLoaded}
          />
        </div>
        <div className="mt-4 grid grid-cols-[9.5rem_minmax(0,1fr)] items-stretch gap-3 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-4">
          <div className="h-[19rem] sm:h-[25rem]">
            <IPhoneWindow
              screens={screens}
              active={active}
              name={project.name}
              pace={pace}
              priority={priority ?? index === 0}
              inView={visible}
            />
          </div>
          <div className="flex min-w-0 flex-col gap-3">
            {info}
            {cta}
          </div>
        </div>
        <div className="mt-3">{summary}</div>
        <div className="mt-5 flex justify-center pb-1">
          <Dock index={index} onGoTo={onGoTo} />
        </div>
      </div>
    </div>
  );
}
