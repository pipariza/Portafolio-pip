"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ComponentType, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "@/components/LocaleProvider";
import type { Locale } from "@/lib/i18n/config";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EASE, WINDOW_FX, WINDOW_FX_REDUCED, type WindowFx } from "@/components/mac/window";
import { DesktopShortcut } from "@/components/mac/dock";
import { SOFT_GRAY, wallpaperStyle } from "@/components/mac/wallpaper";
import { cameFromSection, setZoomOrigin } from "@/lib/zoom";
import { MailAppIcon } from "@/components/contact/icons";
import { AppsAppIcon, FinderIcon, VideoAppIcon, WebAppIcon } from "./icons";

/*
 * The home page as a macOS desktop, like the rest of the site: the same soft gray
 * wallpaper, two desktop widgets (a note with the one-line pitch, the clock), a dock
 * with every page and, in the middle, a panel drawn like the macOS stack window: a
 * close button, "3 ítems" and one big tile per area of work (Web, Apps, Video). The
 * tile is a picture with the name over it (a flat color until the pictures exist), it
 * grows a little under the cursor and takes you to its page. The close button leaves
 * the Finder icon on the desktop (and in the dock) to bring the panel back. Below md it
 * is an iPhone home screen instead: widgets, the same panel without the close button,
 * the dock at the bottom.
 */

const WALLPAPER = wallpaperStyle(SOFT_GRAY);

/** What a link of the desktop does when clicked: the home fades out and the next page grows from the link. */
type Go = (e: MouseEvent<HTMLAnchorElement>, href: string) => void;

type Glyph = ComponentType<{ className?: string }>;

// Closing the panel: it just fades away (the Finder icon takes its place).
const CLOSE_FX: WindowFx = { kind: "close", x: 0, y: 0 };

// The Notes app icon, the one About's closed window leaves on its desktop.
function NotesAppIcon({ className }: { className?: string }) {
  return <Image src="/dock/notas.avif" alt="" width={112} height={112} priority className={`object-contain ${className ?? ""}`} />;
}

// The dock: an app icon each. The Notes icon opens the CV note of the Apps desktop (/apps#cv).
const DOCK_ITEMS: { href: string; label: string; aria: { es: string; en: string }; App: Glyph }[] = [
  { href: "/work", label: "Work", aria: { es: "Work", en: "Work" }, App: WebAppIcon },
  { href: "/apps", label: "Apps", aria: { es: "Apps", en: "Apps" }, App: AppsAppIcon },
  { href: "/video", label: "Video", aria: { es: "Video", en: "Video" }, App: VideoAppIcon },
  { href: "/apps#cv", label: "CV", aria: { es: "Currículum (CV)", en: "Resume (CV)" }, App: NotesAppIcon },
  { href: "/contacto", label: "Contact", aria: { es: "Contact", en: "Contact" }, App: MailAppIcon },
];

/* ---------- clock (Bogotá) ---------- */

function subscribeClock(onChange: () => void) {
  const id = window.setInterval(onChange, 10_000);
  return () => window.clearInterval(id);
}

// One string so the snapshot is stable between ticks of the same minute.
function clockStamp(lang: Locale) {
  const now = new Date();
  const locale = lang === "en" ? "en-US" : "es-CO";
  const time = new Intl.DateTimeFormat(locale, {
    timeZone: "America/Bogota",
    hour: "numeric",
    minute: "2-digit",
    hour12: lang === "en",
  }).format(now);
  const date = new Intl.DateTimeFormat(locale, {
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
  const { tr, href } = useLocale();
  return (
    <div className={`${WIDGET} ${className}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-black/60">{tr("Notas", "Notes")}</p>
      <p className="mt-2 text-[15px] font-semibold leading-snug">
        {tr(
          "Diseño y desarrollo web con foco en aplicativos con IA",
          "Web design and development focused on AI-powered apps",
        )}
      </p>
      <Link
        href={href("/contacto")}
        onClick={(e) => onGo(e, "/contacto")}
        data-cursor-hover
        className="group/avail -my-3 mt-0 inline-flex items-center gap-2 rounded-md py-3 text-[12.5px] text-black/70 outline-none hover:text-black focus-visible:ring-2 focus-visible:ring-[#0a84ff]"
      >
        <i
          aria-hidden="true"
          className="block h-[7px] w-[7px] rounded-full bg-[#30a14e] shadow-[0_0_0_3px_rgba(48,161,78,0.2)]"
        />
        {tr("Disponible para trabajo", "Available for work")}
        <span aria-hidden="true" className="transition-transform group-hover/avail:translate-x-0.5">
          →
        </span>
      </Link>
    </div>
  );
}

function ClockWidget({ className = "" }: { className?: string }) {
  const { lang } = useLocale();
  const stamp = useSyncExternalStore(subscribeClock, () => clockStamp(lang), () => "");
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

/** `image` (a path in /public, with a see-through background) fills the tile once the area has its picture. */
type Area = { href: string; title: string; sub: string; image?: string };

// One tile: see-through like the panel, with a thin border; the picture (if any) fills it, the name sits at the
// bottom, and it grows a touch under the cursor (not with "reduce motion").
function AreaTile({ area, onGo }: { area: Area; onGo: Go }) {
  const { href } = useLocale();
  return (
    <Link
      href={href(area.href)}
      onClick={(e) => onGo(e, area.href)}
      data-cursor-hover
      className="group/area relative block aspect-[4/5] overflow-hidden rounded-[14px] border border-[rgba(20,19,16,0.2)] outline-none transition duration-300 ease-out hover:z-10 hover:scale-[1.03] hover:border-[rgba(20,19,16,0.32)] focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-[#0a84ff] focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none motion-reduce:hover:scale-100 md:aspect-auto md:h-full"
    >
      {area.image && <Image src={area.image} alt="" fill priority sizes="(min-width: 1024px) 320px, 200px" className="object-cover" />}
      {/* With a picture, the name stays clear of the phone that sits in its right third. */}
      <span
        className={`absolute inset-x-0 bottom-0 block pb-3.5 pl-3.5 md:pb-4 md:pl-4 ${
          area.image ? "pr-[38%]" : "pr-3.5 md:pr-4"
        }`}
      >
        <span className="block text-[15px] font-semibold leading-tight md:text-[16px] xl:text-[18px] 2xl:text-[20px]">{area.title}</span>
        <span className="mt-0.5 block text-[12px] text-black/60 xl:text-[13px]">{area.sub}</span>
      </span>
    </Link>
  );
}

// The panel: a see-through glass window (the widgets' glass) like the macOS stack, with its close button and the item count.
// The grid fills what the slot gives it: three tiles in a row on md and up, two columns on a phone.
function AreasPanel({ areas, onGo, onClose }: { areas: Area[]; onGo: Go; onClose?: () => void }) {
  const { tr } = useLocale();
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-[24px] border border-[rgba(20,19,16,0.08)] bg-[rgba(20,19,16,0.05)] shadow-[0_30px_60px_-32px_rgba(30,40,40,0.35)] backdrop-blur-[18px] md:rounded-[28px]">
      <div className="flex h-12 shrink-0 items-center gap-3 px-4 md:h-14 md:px-7">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label={tr("Cerrar", "Close")}
            data-cursor-hover
            className="-m-2 rounded-full p-2 outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff]"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="block h-6 w-6">
              <circle cx="12" cy="12" r="11" fill="rgba(20,19,16,0.5)" />
              <path d="m8 8 8 8M16 8l-8 8" stroke="white" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            </svg>
          </button>
        )}
        <p className="text-[17px] font-semibold md:text-[19px]">{tr("3 ítems", "3 items")}</p>
      </div>
      <ul
        aria-label={tr("Áreas de trabajo", "Work areas")}
        className="grid min-h-0 flex-1 grid-cols-1 content-start gap-3 min-[360px]:grid-cols-2 px-4 pb-4 md:grid-cols-3 md:grid-rows-[minmax(0,1fr)] md:gap-5 md:px-7 md:pb-7"
      >
        {areas.map((area) => (
          <li key={area.href} className="md:h-full">
            <AreaTile area={area} onGo={onGo} />
          </li>
        ))}
      </ul>
    </div>
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
  leaving,
  arriving,
  onGo,
  onOpenFinder,
}: {
  leaving: boolean;
  /** The home was reached from another page: the dock fades in. */
  arriving: boolean;
  onGo: Go;
  onOpenFinder: () => void;
}) {
  const { lang, tr, href: localHref } = useLocale();
  return (
    <motion.nav
      aria-label={tr("Páginas", "Pages")}
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
        aria-label={tr("Finder: inicio", "Finder: home")}
        aria-current="page"
        data-cursor-hover
        className={`group/dock outline-none max-md:hidden ${DOCK_ICON}`}
      >
        <DockTooltip label={tr("Inicio", "Home")} />
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
          href={localHref(href)}
          onClick={(e) => onGo(e, href)}
          aria-label={aria[lang]}
          data-cursor-hover
          className={`group/dock outline-none ${DOCK_ICON}`}
        >
          <DockTooltip label={label} />
          <span className="absolute inset-0 block rounded-[22%] transition-transform duration-200 ease-out group-hover/dock:-translate-y-1.5 group-hover/dock:scale-110 group-focus-visible/dock:-translate-y-1.5 group-focus-visible/dock:ring-2 group-focus-visible/dock:ring-[#0a84ff]">
            <App className="h-full w-full drop-shadow-[0_3px_5px_rgba(0,0,0,0.3)]" />
          </span>
        </Link>
      ))}
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
  const { tr, href: localHref } = useLocale();
  const deskRef = useRef<HTMLDivElement>(null);
  const [leaving, setLeaving] = useState(false);
  // Coming back from a page (menu, Spotlight, the back button): the desktop zooms in softly.
  const [arriving] = useState(cameFromSection);
  const shortcutRef = useRef<HTMLButtonElement>(null);
  const [panelOpen, setPanelOpen] = useState(true);
  const open = () => setPanelOpen(true);
  const close = () => setPanelOpen(false);

  // Keyboard users lose their place when the panel disappears: hand the focus to the icon that replaces it.
  useEffect(() => {
    if (!panelOpen) shortcutRef.current?.focus({ preventScroll: true });
  }, [panelOpen]);

  // Clicking an icon: the desktop fades out and the next page grows from that icon (app/template.tsx).
  // A click with a modifier key (new tab) is left alone.
  const go: Go = (e, href) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (leaving) return;
    const r = e.currentTarget.getBoundingClientRect();
    setZoomOrigin({ x: r.left + r.width / 2, y: r.top + r.height / 2 }, href);
    setLeaving(true);
    window.setTimeout(() => router.push(localHref(href)), reduce ? 0 : 180);
  };

  // Fades out when you leave, grows in a little (or just fades) when you come back.
  const enter = reduce ? { opacity: 0 } : { opacity: 0, scale: 1.05 };
  const blockMotion = {
    initial: arriving ? enter : (false as const),
    animate: { opacity: leaving ? 0 : 1, scale: 1 },
    transition: leaving ? { duration: 0.2 } : { duration: 0.5, ease: EASE },
  };

  // Web has its picture; the others get theirs (`image`) when Pip sends them.
  const areas: Area[] = [
    { href: "/work", title: tr("Diseño Web", "Web Design"), sub: tr(`${projectCount} proyectos`, `${projectCount} projects`), image: "/home/web-inicio-6.webp" },
    { href: "/apps", title: tr("Aplicativos Web", "Web Apps"), sub: tr("Productos con IA", "AI-powered products") },
    { href: "/video", title: tr("Edición de Video", "Video Editing"), sub: tr(`${clipCount} clips`, `${clipCount} clips`) },
  ];

  return (
    <div
      ref={deskRef}
      className="relative min-h-[100svh] w-full overflow-hidden text-[#1d1d1f] md:h-screen md:min-h-[720px] lg:min-h-[640px]"
      style={WALLPAPER}
    >
      <h1 className="sr-only">
        {tr(
          "Pip Ariza: diseño y desarrollo web con foco en aplicativos con IA",
          "Pip Ariza: web design and development focused on AI-powered apps",
        )}
      </h1>

      {/* Tablet and desktop: widgets and the panel of areas. */}
      <motion.div
        {...blockMotion}
        className="hidden h-full flex-col items-center justify-center gap-4 px-5 pb-[104px] pt-[calc(34px+12px)] md:flex"
      >
        {/* From lg up the widgets sit in the corners; below, in a row above the panel. */}
        <div className="flex w-[min(728px,100%)] items-stretch justify-between gap-4 lg:contents">
          <NotesWidget onGo={go} className="md:w-[220px] lg:absolute lg:left-6 lg:top-[calc(34px+24px)] lg:w-[200px]" />
          <ClockWidget className="md:w-[150px] lg:absolute lg:right-6 lg:top-[calc(34px+24px)]" />
        </div>

        {/*
          The slot keeps its size when the panel is closed, so nothing shifts. Its height follows its width
          (--w) so the tiles stay 4:5: header 56 + tile rows + 28 of bottom padding.
        */}
        <div className="relative shrink-0 [--w:min(728px,calc(100vw-40px))] w-[var(--w)] h-[min(calc(44px+var(--w)*0.41667),max(320px,calc(100vh-290px)))] lg:[--w:min(960px,calc(100vw-480px))] 2xl:[--w:min(1120px,calc(100vw-480px))]">
          <AnimatePresence initial={false} custom={CLOSE_FX}>
            {panelOpen && (
              <motion.div
                key="areas"
                variants={reduce ? WINDOW_FX_REDUCED : WINDOW_FX}
                custom={CLOSE_FX}
                initial="hidden"
                animate="shown"
                exit="gone"
                className="h-full w-full"
              >
                <AreasPanel areas={areas} onGo={go} onClose={close} />
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence initial={false}>
            {!panelOpen && (
              <DesktopShortcut key="shortcut" label="Finder" aria={tr("Abrir el Finder: inicio", "Open Finder: home")} onOpen={open} buttonRef={shortcutRef}>
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
        <div className="mt-6">
          <AreasPanel areas={areas} onGo={go} />
        </div>
      </motion.div>

      <HomeDock leaving={leaving} arriving={arriving} onGo={go} onOpenFinder={open} />
    </div>
  );
}
