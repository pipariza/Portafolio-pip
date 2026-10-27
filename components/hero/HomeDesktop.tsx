"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ComponentType, type MouseEvent, type Ref } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  EASE,
  TrafficLights,
  WINDOW_FX,
  WINDOW_FX_REDUCED,
  useMacWindow,
} from "@/components/mac/window";
import { DesktopShortcut } from "@/components/mac/dock";
import { SOFT_GRAY, wallpaperStyle } from "@/components/mac/wallpaper";
import { cameFromSection, setZoomOrigin } from "@/lib/zoom";
import { MailAppIcon } from "@/components/contact/icons";
import {
  AppsAppIcon,
  BrowserGlyph,
  FilmGlyph,
  FinderIcon,
  GridGlyph,
  HomeGlyph,
  MailGlyph,
  UserGlyph,
  VideoAppIcon,
  WebAppIcon,
} from "./icons";

/*
 * The home page as a macOS desktop, like the rest of the site: the same soft gray
 * wallpaper, a Finder window that works as the real menu (the three areas of work as
 * big icons, the five pages in the sidebar), two desktop widgets (a note with the
 * one-line pitch, the clock) and a dock with every page. The Finder's traffic lights
 * work like the other windows': close leaves the Finder icon on the desktop, minimize
 * sends the window to the dock. Below md it is an iPhone home screen instead: widgets,
 * the three areas as app icons, the dock at the bottom.
 */

const WALLPAPER = wallpaperStyle(SOFT_GRAY);

/** What a link of the desktop does when clicked: the home fades out and the next page grows from the link. */
type Go = (e: MouseEvent<HTMLAnchorElement>, href: string) => void;

type Glyph = ComponentType<{ className?: string }>;

// The Notes app icon, the one About's closed window leaves on its desktop.
function NotesAppIcon({ className }: { className?: string }) {
  return <Image src="/dock/notas.avif" alt="" width={112} height={112} priority className={`object-contain ${className ?? ""}`} />;
}

// The pages of the Finder's sidebar, in the order of the menu bar (the labels are the menu bar's).
const PAGES: { href: string; label: string; Glyph: Glyph }[] = [
  { href: "/work", label: "Work", Glyph: BrowserGlyph },
  { href: "/apps", label: "Apps", Glyph: GridGlyph },
  { href: "/video", label: "Video", Glyph: FilmGlyph },
  { href: "/about", label: "About", Glyph: UserGlyph },
  { href: "/contacto", label: "Contact", Glyph: MailGlyph },
];

// The dock: an app icon each. The Notes icon opens the CV note of the Apps desktop (/apps#cv).
const DOCK_ITEMS: { href: string; label: string; aria: string; App: Glyph }[] = [
  { href: "/work", label: "Work", aria: "Work", App: WebAppIcon },
  { href: "/apps", label: "Apps", aria: "Apps", App: AppsAppIcon },
  { href: "/video", label: "Video", aria: "Video", App: VideoAppIcon },
  { href: "/apps#cv", label: "CV", aria: "Currículum (CV)", App: NotesAppIcon },
  { href: "/contacto", label: "Contact", aria: "Contact", App: MailAppIcon },
];

/* ---------- clock (Bogotá) ---------- */

function subscribeClock(onChange: () => void) {
  const id = window.setInterval(onChange, 10_000);
  return () => window.clearInterval(id);
}

// One string so the snapshot is stable between ticks of the same minute.
function clockStamp() {
  const now = new Date();
  const time = new Intl.DateTimeFormat("es-CO", {
    timeZone: "America/Bogota",
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
  }).format(now);
  const date = new Intl.DateTimeFormat("es-CO", {
    timeZone: "America/Bogota",
    weekday: "long",
    day: "numeric",
    month: "long",
  })
    .format(now)
    .replace(",", "");
  return `${time}|${date}`;
}

/* ---------- widgets ---------- */

// The same glass as the dock and the Work cards: a faint dark tint, a hairline border, a soft blur.
const WIDGET =
  "rounded-[18px] border border-[rgba(20,19,16,0.08)] bg-[rgba(20,19,16,0.05)] p-4 backdrop-blur-[18px]";

function NotesWidget({ className = "", onGo }: { className?: string; onGo: Go }) {
  return (
    <div className={`${WIDGET} ${className}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-black/60">Notas</p>
      <p className="mt-2 text-[15px] font-semibold leading-snug">
        Diseño y desarrollo web con foco en aplicativos con IA
      </p>
      <Link
        href="/contacto"
        onClick={(e) => onGo(e, "/contacto")}
        data-cursor-hover
        className="group/avail -my-3 mt-0 inline-flex items-center gap-2 rounded-md py-3 text-[12.5px] text-black/70 outline-none hover:text-black focus-visible:ring-2 focus-visible:ring-[#0a84ff]"
      >
        <i
          aria-hidden="true"
          className="block h-[7px] w-[7px] rounded-full bg-[#30a14e] shadow-[0_0_0_3px_rgba(48,161,78,0.2)]"
        />
        Disponible para trabajo
        <span aria-hidden="true" className="transition-transform group-hover/avail:translate-x-0.5">
          →
        </span>
      </Link>
    </div>
  );
}

function ClockWidget({ className = "" }: { className?: string }) {
  const stamp = useSyncExternalStore(subscribeClock, clockStamp, () => "");
  const [time = "", date = ""] = stamp.split("|");
  return (
    <div className={`${WIDGET} text-center ${className}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-black/60">Bogotá</p>
      <p className="mt-1 min-h-[1.1em] text-[34px] font-medium leading-[1.1] tabular-nums">{time}</p>
      <p className="mt-1 min-h-[1.2em] text-[12px] text-black/60">{date}</p>
    </div>
  );
}

/* ---------- the three areas of work ---------- */

type Area = { href: string; title: string; sub: string; Icon: Glyph };

function AreaItem({ area, size, onGo }: { area: Area; size: string; onGo: Go }) {
  return (
    <Link
      href={area.href}
      onClick={(e) => onGo(e, area.href)}
      data-cursor-hover
      className="group/area flex flex-col items-center gap-2 rounded-xl px-1 py-3 text-center outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff]"
    >
      <area.Icon
        className={`drop-shadow-[0_8px_10px_rgba(30,40,40,0.3)] transition-transform duration-200 ease-out group-hover/area:-translate-y-1 group-hover/area:scale-105 group-focus-visible/area:-translate-y-1 ${size}`}
      />
      <span className="text-[14px] font-semibold leading-tight">{area.title}</span>
      <span className="text-[12px] text-black/60 max-md:hidden">{area.sub}</span>
    </Link>
  );
}

/* ---------- dock ---------- */

// The icon sizes of the Apps and Work docks.
// 40 px on the smallest phones, 44 from 400 px (the size of a finger), 48 on desktop.
const DOCK_ICON = "relative h-10 w-10 shrink-0 min-[400px]:h-11 min-[400px]:w-11 md:h-12 md:w-12";

function DockTooltip({ label }: { label: string }) {
  return (
    <span className="pointer-events-none absolute bottom-full left-1/2 mb-3 -translate-x-1/2 whitespace-nowrap rounded-lg bg-[#4a3a34]/85 px-3 py-1.5 text-[13px] font-medium text-white opacity-0 backdrop-blur-md transition-opacity duration-150 group-hover/dock:opacity-100 group-focus-visible/dock:opacity-100 max-md:hidden">
      {label}
      <span className="absolute left-1/2 top-full -mt-1 h-2.5 w-2.5 -translate-x-1/2 rotate-45 bg-[#4a3a34]/85" />
    </span>
  );
}

function HomeDock({
  minimized,
  leaving,
  arriving,
  onGo,
  onOpenFinder,
  navRef,
  restoreRef,
}: {
  minimized: boolean;
  leaving: boolean;
  /** The home was reached from another page: the dock fades in. */
  arriving: boolean;
  onGo: Go;
  onOpenFinder: () => void;
  navRef: Ref<HTMLElement>;
  restoreRef: Ref<HTMLButtonElement>;
}) {
  return (
    <motion.nav
      ref={navRef}
      aria-label="Páginas"
      data-theme="light"
      initial={arriving ? { opacity: 0 } : false}
      animate={{ opacity: leaving ? 0 : 1 }}
      transition={leaving ? { duration: 0.2 } : { duration: 0.5, ease: EASE }}
      className="glass-pill fixed bottom-3 left-1/2 z-[60] flex w-max max-w-[calc(100vw-12px)] -translate-x-1/2 items-end gap-1.5 rounded-full border px-3.5 pb-1.5 pt-1.5 md:bottom-8 md:gap-2 md:px-5 md:pb-2"
    >
      {/* The Finder is the page you are on: it brings its window back if you closed it. */}
      <button
        type="button"
        onClick={onOpenFinder}
        aria-label="Finder: inicio"
        aria-current="page"
        data-cursor-hover
        className={`group/dock outline-none max-md:hidden ${DOCK_ICON}`}
      >
        <DockTooltip label="Inicio" />
        <FinderIcon className="h-full w-full drop-shadow-[0_3px_5px_rgba(0,0,0,0.25)] transition-transform duration-200 group-hover/dock:-translate-y-1.5 group-hover/dock:scale-110 group-focus-visible/dock:-translate-y-1.5" />
        <span
          aria-hidden="true"
          className="absolute -bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-black/60"
        />
      </button>
      <span aria-hidden="true" className="mx-0.5 mb-1 h-7 w-px self-center bg-black/20 max-md:hidden md:mx-1 md:h-10" />

      {DOCK_ITEMS.map(({ href, label, aria, App }) => (
        <Link
          key={href}
          href={href}
          onClick={(e) => onGo(e, href)}
          aria-label={aria}
          data-cursor-hover
          className={`group/dock outline-none ${DOCK_ICON}`}
        >
          <DockTooltip label={label} />
          <span className="absolute inset-0 block rounded-[22%] transition-transform duration-200 ease-out group-hover/dock:-translate-y-1.5 group-hover/dock:scale-110 group-focus-visible/dock:-translate-y-1.5 group-focus-visible/dock:ring-2 group-focus-visible/dock:ring-[#0a84ff]">
            <App className="h-full w-full drop-shadow-[0_3px_5px_rgba(0,0,0,0.3)]" />
          </span>
        </Link>
      ))}

      <AnimatePresence initial={false}>
        {minimized && (
          <motion.div
            key="minimized"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto", transition: { duration: 0.3, ease: EASE } }}
            exit={{ opacity: 0, width: 0, transition: { duration: 0.2 } }}
            className="-my-3 flex items-end gap-1.5 overflow-hidden py-3 md:gap-2"
          >
            <span aria-hidden="true" className="mx-0.5 mb-1 h-7 w-px shrink-0 self-center bg-black/20 md:mx-1 md:h-10" />
            <button
              ref={restoreRef}
              type="button"
              onClick={onOpenFinder}
              aria-label="Restaurar Finder"
              title="Pip Ariza"
              data-cursor-hover
              className={`group/min outline-none ${DOCK_ICON}`}
            >
              <span className="absolute inset-0 block overflow-hidden rounded-[10px] bg-white shadow-[0_6px_14px_-4px_rgba(0,0,0,0.4),0_0_0_0.5px_rgba(0,0,0,0.25)] transition-transform duration-200 ease-out group-hover/min:-translate-y-1.5 group-focus-visible/min:ring-2 group-focus-visible/min:ring-[#0078d4]">
                <span className="absolute inset-x-0 top-0 flex h-[22%] items-center gap-[7%] bg-[#f3f1ee] px-[9%]">
                  <i className="block h-[22%] w-[9%] rounded-full bg-[#ff5f57]" />
                  <i className="block h-[22%] w-[9%] rounded-full bg-[#febc2e]" />
                  <i className="block h-[22%] w-[9%] rounded-full bg-[#28c840]" />
                </span>
                <span className="absolute inset-x-[12%] bottom-[16%] top-[42%] flex items-center justify-between">
                  <i className="block h-[70%] w-[26%] rounded-[3px] bg-black/20" />
                  <i className="block h-[70%] w-[26%] rounded-[3px] bg-black/20" />
                  <i className="block h-[70%] w-[26%] rounded-[3px] bg-black/20" />
                </span>
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

/* ---------- the desktop ---------- */

export default function HomeDesktop({
  projectCount,
  clipCount,
}: {
  projectCount: number;
  clipCount: number;
}) {
  const reduce = useReducedMotion();
  const router = useRouter();
  const deskRef = useRef<HTMLDivElement>(null);
  const [leaving, setLeaving] = useState(false);
  // Coming back from a page (menu, Spotlight, the back button): the desktop zooms in softly.
  const [arriving] = useState(cameFromSection);
  const dockRef = useRef<HTMLElement>(null);
  const shortcutRef = useRef<HTMLButtonElement>(null);
  const restoreRef = useRef<HTMLButtonElement>(null);

  // A minimized window flies to the right end of the dock, where its tile appears.
  const {
    win,
    fx,
    ref: windowRef,
    close,
    minimize,
    open,
  } = useMacWindow(() => {
    const dock = dockRef.current?.getBoundingClientRect();
    return dock ? { x: dock.right, y: dock.top + dock.height / 2 } : null;
  });

  // Keyboard users lose their place when the window disappears: hand the focus to what replaces it.
  useEffect(() => {
    if (win === "closed") shortcutRef.current?.focus({ preventScroll: true });
    if (win === "minimized") restoreRef.current?.focus({ preventScroll: true });
  }, [win]);

  // Clicking an icon: the desktop fades out and the next page grows from that icon (app/template.tsx).
  // A click with a modifier key (new tab) is left alone.
  const go: Go = (e, href) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (leaving) return;
    const r = e.currentTarget.getBoundingClientRect();
    setZoomOrigin({ x: r.left + r.width / 2, y: r.top + r.height / 2 }, href);
    setLeaving(true);
    window.setTimeout(() => router.push(href), reduce ? 0 : 180);
  };

  // Fades out when you leave, grows in a little (or just fades) when you come back.
  const enter = reduce ? { opacity: 0 } : { opacity: 0, scale: 1.05 };
  const blockMotion = {
    initial: arriving ? enter : (false as const),
    animate: { opacity: leaving ? 0 : 1, scale: 1 },
    transition: leaving ? { duration: 0.2 } : { duration: 0.5, ease: EASE },
  };

  const areas: Area[] = [
    { href: "/work", title: "Diseño Web", sub: `${projectCount} proyectos`, Icon: WebAppIcon },
    { href: "/apps", title: "Aplicativos Web", sub: "Productos con IA", Icon: AppsAppIcon },
    { href: "/video", title: "Edición de Video", sub: `${clipCount} clips`, Icon: VideoAppIcon },
  ];

  return (
    <div
      ref={deskRef}
      className="relative min-h-[100svh] w-full overflow-hidden text-[#1d1d1f] md:h-screen md:min-h-[720px] lg:min-h-[640px]"
      style={WALLPAPER}
    >
      <h1 className="sr-only">Pip Ariza: diseño y desarrollo web con foco en aplicativos con IA</h1>

      {/* Tablet and desktop: widgets and the Finder window. */}
      <motion.div
        {...blockMotion}
        className="hidden h-full flex-col items-center justify-center gap-4 px-5 pb-[104px] pt-[calc(34px+12px)] md:flex"
      >
        {/* From lg up the widgets sit in the corners; below, in a row above the window. */}
        <div className="flex w-[min(728px,100%)] items-stretch justify-between gap-4 lg:contents">
          <NotesWidget onGo={go} className="md:w-[220px] lg:absolute lg:left-6 lg:top-[calc(34px+24px)] lg:w-[200px]" />
          <ClockWidget className="md:w-[150px] lg:absolute lg:right-6 lg:top-[calc(34px+24px)]" />
        </div>

        {/* The slot keeps its size when the window is closed or minimized, so nothing shifts. */}
        <div className="relative shrink-0 md:h-[440px] md:w-[min(728px,100%)] lg:h-[max(400px,min(540px,calc(100vh-290px)))] lg:w-[min(860px,calc(100vw-480px))] 2xl:h-[max(400px,min(640px,calc(100vh-290px)))] 2xl:w-[min(1040px,calc(100vw-480px))]">
          <AnimatePresence initial={false} custom={fx}>
            {win === "open" && (
              <motion.div
                key="finder"
                ref={windowRef}
                variants={reduce ? WINDOW_FX_REDUCED : WINDOW_FX}
                custom={fx}
                initial="hidden"
                animate="shown"
                exit="gone"
                className="flex h-full w-full flex-col overflow-hidden rounded-[14px] bg-white/70 shadow-[0_0_0_0.5px_rgba(0,0,0,0.2),0_40px_80px_-24px_rgba(30,40,40,0.5),0_12px_28px_-10px_rgba(30,40,40,0.3)] backdrop-blur-[40px] backdrop-saturate-[1.6]"
              >
                <div className="relative flex h-[52px] shrink-0 items-center border-b border-black/[0.12] bg-[#f3f1ee]/90 px-4">
                  <TrafficLights fixedSize canZoom={false} onClose={close} onMinimize={minimize} onZoom={() => {}} />
                  <p className="pointer-events-none absolute inset-x-0 text-center text-[13px] font-semibold text-black/60">
                    Pip Ariza
                  </p>
                </div>

                <div className="flex min-h-0 flex-1">
                  <nav
                    aria-label="Favoritos"
                    className="w-[150px] shrink-0 border-r border-black/[0.09] bg-[#f3f1ee]/60 px-2.5 py-3 text-[13px]"
                  >
                    <p className="px-2 pb-1.5 text-[11px] font-semibold text-black/60">Favoritos</p>
                    <ul className="space-y-0.5">
                      <li>
                        <span
                          aria-current="page"
                          className="flex items-center gap-2 rounded-md bg-black/[0.08] px-2 py-1.5 font-semibold"
                        >
                          <HomeGlyph className="h-4 w-4 text-[#0a64d8]" />
                          Inicio
                        </span>
                      </li>
                      {PAGES.map(({ href, label, Glyph: PageGlyph }) => (
                        <li key={href}>
                          <Link
                            href={href}
                            onClick={(e) => go(e, href)}
                            data-cursor-hover
                            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-black/80 outline-none transition-colors hover:bg-black/[0.06] focus-visible:ring-2 focus-visible:ring-[#0a84ff]"
                          >
                            <PageGlyph className="h-4 w-4 text-[#0a64d8]" />
                            {label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </nav>

                  <div className="grid min-w-0 flex-1 grid-cols-3 content-center gap-1 px-3">
                    {areas.map((area) => (
                      <AreaItem key={area.href} area={area} onGo={go} size="h-20 w-20 lg:h-24 lg:w-24 2xl:h-32 2xl:w-32" />
                    ))}
                  </div>
                </div>

                <div className="flex h-7 shrink-0 items-center justify-center border-t border-black/[0.09] bg-[#f3f1ee]/80 text-[11.5px] text-black/60">
                  3 elementos
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence initial={false}>
            {win === "closed" && (
              <DesktopShortcut key="shortcut" label="Finder" aria="Abrir el Finder: inicio" onOpen={open} buttonRef={shortcutRef}>
                <FinderIcon className="h-full w-full drop-shadow-[0_8px_14px_rgba(30,40,40,0.35)]" />
              </DesktopShortcut>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Phone: an iPhone home screen. */}
      <motion.div {...blockMotion} className="px-5 pb-28 pt-[calc(34px+18px)] md:hidden">
        <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-[1fr_auto]">
          <NotesWidget onGo={go} />
          <ClockWidget className="w-[124px] max-[399px]:hidden" />
        </div>
        <ul className="mt-10 grid grid-cols-3 gap-x-2">
          {areas.map((area) => (
            <li key={area.href}>
              <AreaItem area={area} onGo={go} size="h-[72px] w-[72px]" />
            </li>
          ))}
        </ul>
      </motion.div>

      <HomeDock minimized={win === "minimized"} leaving={leaving} arriving={arriving} onGo={go} onOpenFinder={open} navRef={dockRef} restoreRef={restoreRef} />
    </div>
  );
}
