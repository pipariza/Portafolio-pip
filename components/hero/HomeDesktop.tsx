"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "@/components/LocaleProvider";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EASE, WINDOW_FX, WINDOW_FX_REDUCED, type WindowFx } from "@/components/mac/window";
import { DesktopShortcut } from "@/components/mac/dock";
import { SOFT_GRAY, wallpaperStyle } from "@/components/mac/wallpaper";
import { cameFromSection, setZoomOrigin } from "@/lib/zoom";
import { MUSIC } from "@/lib/config";
import type { Weather } from "@/lib/weather";

/*
 * The home page as a macOS desktop, like the rest of the site: the same soft gray
 * wallpaper, two desktop widgets (a note with the one-line pitch, the weather of Bogotá), a dock
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

// Closing the panel: it just fades away (the Finder icon takes its place).
const CLOSE_FX: WindowFx = { kind: "close", x: 0, y: 0 };

// An app icon of the dock: the picture fills its box.
function DockPicture({ src, className }: { src: string; className?: string }) {
  return <Image src={src} alt="" width={112} height={112} priority className={`object-contain ${className ?? ""}`} />;
}

// The dock: an app icon each (Safari, Apps and QuickTime for the three areas; Notes and Mail are the
// ones of the Apps dock). The Notes icon opens the CV note of the Apps desktop (/apps#cv).
const DOCK_ITEMS: { href: string; label: string; aria: { es: string; en: string }; icon: string }[] = [
  { href: "/work", label: "Work", aria: { es: "Work", en: "Work" }, icon: "/dock/safari.webp" },
  { href: "/apps", label: "Apps", aria: { es: "Apps", en: "Apps" }, icon: "/dock/apps.webp" },
  { href: "/video", label: "Video", aria: { es: "Video", en: "Video" }, icon: "/dock/quicktime.webp" },
  { href: "/apps#cv", label: "CV", aria: { es: "Currículum (CV)", en: "Resume (CV)" }, icon: "/dock/notas.avif" },
  { href: "/contacto", label: "Contact", aria: { es: "Contact", en: "Contact" }, icon: "/dock/mail.avif" },
];

/* ---------- widgets ---------- */

// The same glass as the dock and the Work cards: a faint dark tint, a hairline border, a soft blur.
const GLASS = "rounded-[18px] border border-[rgba(20,19,16,0.08)] bg-[rgba(20,19,16,0.05)] backdrop-blur-[18px]";
const WIDGET = `${GLASS} p-4`;
const WIDGET_LABEL = "text-[11px] font-semibold uppercase tracking-[0.08em] text-black/60";

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

/* ---------- weather (Bogotá) ---------- */

// The sky behind the card, like the Weather widget of macOS: night and the usual grey-blue of Bogotá (the
// reference #1e1f32 -> #2d364f), a clear blue by day, and darker slate when it rains.
function weatherSky(w: Weather) {
  const rainy = (w.code >= 51 && w.code <= 67) || (w.code >= 80 && w.code <= 82) || w.code >= 95;
  const clear = w.isDay && w.code <= 2;
  const [top, bottom] = rainy ? ["#232938", "#3a4760"] : clear ? ["#2f6fd6", "#5aa5ec"] : ["#1e1f32", "#2d364f"];
  return `linear-gradient(180deg, ${top}, ${bottom})`;
}

const CLOUD = (
  <g fill="#f4f6fa">
    <circle cx="8" cy="15" r="3.6" />
    <circle cx="13" cy="11.5" r="5" />
    <circle cx="17.4" cy="15" r="3.6" />
    <rect x="8" y="15" width="9.4" height="3.6" />
  </g>
);

// A small flat icon of the weather now (a sun or a moon, a cloud, rain, a storm, fog or snow).
function WeatherIcon({ code, isDay, className }: { code: number; isDay: boolean; className?: string }) {
  const sun = (
    <g>
      <circle cx="12" cy="12" r="4.6" fill="#ffcf4a" />
      <path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5.3 5.3l1.7 1.7M17 17l1.7 1.7M18.7 5.3 17 7M7 17l-1.7 1.7" stroke="#ffcf4a" strokeWidth="1.8" strokeLinecap="round" />
    </g>
  );
  const moon = <path d="M16.5 14.8A6.6 6.6 0 0 1 9.2 6.2a6.6 6.6 0 1 0 7.3 8.6Z" fill="#e8ecff" />;
  let body;
  if (code === 0 || code === 1) body = isDay ? sun : moon;
  else if (code === 2)
    body = (
      <g>
        <g transform="translate(-1.4 -1.6) scale(.72)">{isDay ? sun : moon}</g>
        <g transform="translate(1.6 2.4) scale(.8)">{CLOUD}</g>
      </g>
    );
  else if (code === 45 || code === 48)
    body = (
      <g>
        <g transform="translate(0 -2.4)">{CLOUD}</g>
        <path d="M6 19.6h12M8 22h8" stroke="#cfd6e4" strokeWidth="1.6" strokeLinecap="round" />
      </g>
    );
  else if (code >= 95)
    body = (
      <g>
        <g transform="translate(0 -3)">{CLOUD}</g>
        <path d="m12.8 15.4-2.8 4.2h2.4l-1.2 3.4 3.8-4.8h-2.4Z" fill="#ffcf4a" />
      </g>
    );
  else if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82))
    body = (
      <g>
        <g transform="translate(0 -3)">{CLOUD}</g>
        <path d="M8.6 18.6 7.6 21.4M12.6 18.6l-1 2.8M16.6 18.6l-1 2.8" stroke="#8cc8ff" strokeWidth="1.8" strokeLinecap="round" />
      </g>
    );
  else if (code >= 71 && code <= 77)
    body = (
      <g>
        <g transform="translate(0 -3)">{CLOUD}</g>
        <g fill="#fff">
          <circle cx="8.4" cy="20" r="1.2" />
          <circle cx="12.4" cy="21.2" r="1.2" />
          <circle cx="16.4" cy="20" r="1.2" />
        </g>
      </g>
    );
  else body = CLOUD;
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      {body}
    </svg>
  );
}

const DROP = (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3 w-3 shrink-0">
    <path d="M12 2.8c3.2 4.2 5.4 6.9 5.4 9.6a5.4 5.4 0 0 1-10.8 0c0-2.7 2.2-5.4 5.4-9.6Z" fill="#8cc8ff" />
  </svg>
);

/*
 * The weather of Bogotá, drawn like the macOS Weather widget: the place and the temperature now, an icon with
 * today's high and low, and the chance of rain. It is a plain card (nothing to click) with a small credit to
 * Open-Meteo, which asks for it. The data arrives with the page (lib/weather.ts, refreshed every 15 minutes);
 * if it could not be fetched the numbers show as dashes. Below 400 px it is a slim bar.
 */
function WeatherWidget({ weather, className = "" }: { weather: Weather | null; className?: string }) {
  const { tr } = useLocale();
  const w = weather;
  const label = w
    ? tr(
        `Clima en Bogotá: ${w.temp} grados, máxima ${w.max}, mínima ${w.min}, probabilidad de lluvia ${w.rain}%`,
        `Weather in Bogotá: ${w.temp} degrees, high ${w.max}, low ${w.min}, ${w.rain}% chance of rain`,
      )
    : tr("Clima en Bogotá no disponible", "Weather in Bogotá unavailable");
  const temp = w ? `${w.temp}°` : "--°";
  const icon = w ? (
    <WeatherIcon code={w.code} isDay={w.isDay} className="h-[26px] w-[26px] shrink-0" />
  ) : null;
  const range = w ? (
    <>
      <span>↑{w.max}°</span>
      <span>↓{w.min}°</span>
    </>
  ) : null;
  const rain = tr(`${w?.rain ?? "--"}% hoy`, `${w?.rain ?? "--"}% today`);

  return (
    <div
      role="group"
      aria-label={label}
      className={`relative overflow-hidden rounded-[18px] border border-white/10 p-3.5 pb-6 text-white shadow-[0_6px_18px_rgba(20,19,16,0.12)] ${className}`}
      style={{ background: w ? weatherSky(w) : "linear-gradient(180deg, #1e1f32, #2d364f)" }}
    >
      {/* Wide: the place and the temperature, the icon and the range on the right, then the rain. */}
      <div className="max-[399px]:hidden">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[13px] font-semibold leading-none">Bogotá</p>
            <p className="mt-1.5 text-[34px] font-light leading-none tabular-nums">{temp}</p>
          </div>
          <div className="flex flex-col items-end gap-0.5 text-[11px] font-medium leading-tight tabular-nums">
            {icon}
            {range}
          </div>
        </div>
        <p className="mt-3.5 text-[11px] font-semibold leading-none">{tr("Precipitaciones", "Precipitation")}</p>
        <p className="mt-1.5 flex items-center gap-1 text-[11.5px] leading-none text-white/85">
          {DROP}
          {rain}
        </p>
      </div>

      {/* Narrow phone: one slim row. */}
      <div className="hidden items-center justify-between gap-3 max-[399px]:flex">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-[12px] font-semibold leading-none">Bogotá</p>
            <p className="mt-1 text-[30px] font-light leading-none tabular-nums">{temp}</p>
          </div>
          {icon}
        </div>
        <div className="flex flex-col items-end gap-1 text-[11.5px] font-medium leading-none tabular-nums">
          <span className="flex gap-2">{range}</span>
          <span className="flex items-center gap-1 text-white/85">
            {DROP}
            {rain}
          </span>
        </div>
      </div>

      <a
        href="https://open-meteo.com/"
        target="_blank"
        rel="noopener noreferrer"
        data-cursor-hover
        className="absolute bottom-1.5 right-3.5 rounded text-[9px] leading-none text-white/75 underline-offset-2 outline-none hover:text-white hover:underline focus-visible:ring-2 focus-visible:ring-white"
      >
        Open-Meteo
      </a>
    </div>
  );
}

/* ---------- music (YouTube) ---------- */

// The address of the YouTube player: a playlist, or a few videos one after the other. "nocookie" is YouTube's
// privacy mode (no cookies until something plays); autoplay is fine because it only loads after a click.
function musicSrc() {
  const base = "https://www.youtube-nocookie.com/embed";
  const options = "autoplay=1&playsinline=1&rel=0";
  if (MUSIC.playlistId) return `${base}/videoseries?list=${encodeURIComponent(MUSIC.playlistId)}&${options}`;
  const [first, ...rest] = MUSIC.videoIds;
  return `${base}/${first}?${rest.length ? `playlist=${rest.join(",")}&` : ""}${options}`;
}

/*
 * The music widget starts as a small play button that loads nothing from YouTube, so the home stays fast and
 * nothing ever plays on its own. A click opens the real YouTube player inside the widget (YouTube asks for a
 * visible player of at least 200 x 200, so it is never hidden or reduced to custom buttons); the cross closes
 * it and stops the music. Each place of the home gives it its own size, closed and open.
 */
function MusicWidget({ closedClassName = "", openClassName = "" }: { closedClassName?: string; openClassName?: string }) {
  const { tr } = useLocale();
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        data-cursor-hover
        aria-label={tr("Abrir el reproductor de música", "Open the music player")}
        // On a narrow phone the card is a slim row (play button, then the words) so it does not push the panel down.
        className={`${WIDGET} flex flex-col items-center text-center outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff] max-[399px]:flex-row max-[399px]:justify-center max-[399px]:gap-3 max-[399px]:py-2.5 ${closedClassName}`}
      >
        <span className={WIDGET_LABEL}>{tr("Música", "Music")}</span>
        <span
          aria-hidden="true"
          className="mt-2 grid h-10 w-10 place-items-center rounded-full bg-[#141310] text-white max-[399px]:order-first max-[399px]:mt-0 max-[399px]:h-9 max-[399px]:w-9"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 translate-x-px">
            <path d="M8 5.5v13l11-6.5z" />
          </svg>
        </span>
        <span className="mt-2 text-[12px] text-black/60 max-[399px]:mt-0">{tr("Dale play", "Press play")}</span>
      </button>
    );
  }

  return (
    // p-1.5 (not p-2) so the player inside the 216 px widget is 202 px wide: YouTube asks for at least 200.
    <div className={`${GLASS} p-1.5 ${openClassName}`}>
      <div className="flex h-8 items-center justify-between pl-2">
        <p className={WIDGET_LABEL}>{tr("Música", "Music")}</p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          data-cursor-hover
          aria-label={tr("Cerrar el reproductor", "Close the player")}
          className="grid h-8 w-8 place-items-center rounded-full text-[18px] leading-none text-black/60 outline-none hover:text-black focus-visible:ring-2 focus-visible:ring-[#0a84ff]"
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>
      {/* YouTube takes a few seconds to appear: the word waits behind the player, which covers it once it loads. */}
      <div className="relative h-[200px] overflow-hidden rounded-[12px] bg-black">
        <span aria-hidden="true" className="absolute inset-0 grid place-items-center text-[12px] text-white/60">
          {tr("Cargando…", "Loading…")}
        </span>
        <iframe
          src={musicSrc()}
          title={tr("Reproductor de música (YouTube)", "Music player (YouTube)")}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="relative block h-full w-full"
        />
      </div>
    </div>
  );
}

// The widget of the right: the weather of Bogotá; the music player takes its place once there is a playlist (config).
function RightWidget({
  weather,
  place,
  music,
  musicOpen,
}: {
  weather: Weather | null;
  place: string;
  music: string;
  musicOpen: string;
}) {
  if (MUSIC.playlistId || MUSIC.videoIds.length > 0) return <MusicWidget closedClassName={music} openClassName={musicOpen} />;
  return <WeatherWidget weather={weather} className={place} />;
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
      {area.image && <Image src={area.image} alt="" fill priority quality={90} sizes="(min-width: 1024px) 320px, 200px" className="object-cover" />}
      {/* With a picture, the name stays clear of the phone that sits in its right third. */}
      <span
        className={`absolute inset-x-0 bottom-0 block pb-3.5 pl-3.5 md:pb-4 md:pl-4 ${
          area.image ? "pr-[38%]" : "pr-3.5 md:pr-4"
        }`}
      >
        <span className="block text-[15px] font-semibold leading-tight md:text-[16px] lg:text-[15px] xl:text-[18px] 2xl:text-[20px]">{area.title}</span>
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
        <DockPicture src="/dock/finder.webp" className="h-full w-full drop-shadow-[0_3px_5px_rgba(0,0,0,0.25)] transition-transform duration-200 group-hover/dock:-translate-y-1.5 group-hover/dock:scale-110 group-focus-visible/dock:-translate-y-1.5" />
        <span
          aria-hidden="true"
          className="absolute -bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-black/60"
        />
      </button>
      <span aria-hidden="true" className="mx-0.5 mb-1 h-7 w-px self-center bg-black/20 max-md:hidden md:mx-1 md:h-10" />

      {DOCK_ITEMS.map(({ href, label, aria, icon }) => (
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
            <DockPicture src={icon} className="h-full w-full drop-shadow-[0_3px_5px_rgba(0,0,0,0.3)]" />
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
  weather,
}: {
  projectCount: number;
  clipCount: number;
  /** The weather of Bogotá for the widget (null if it could not be fetched). */
  weather: Weather | null;
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

  // Each area's cover (`image`) is a transparent WebP in public/home, drawn from real work.
  const areas: Area[] = [
    { href: "/work", title: tr("Diseño Web", "Web Design"), sub: tr(`${projectCount} proyectos`, `${projectCount} projects`), image: "/home/web-inicio-7.webp" },
    { href: "/apps", title: tr("Aplicativos Web", "Web Apps"), sub: tr("Productos con IA", "AI-powered products"), image: "/home/apps-8.webp" },
    { href: "/video", title: tr("Edición de Video", "Video Editing"), sub: tr(`${clipCount} clips`, `${clipCount} clips`), image: "/home/video-7.webp" },
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
          <RightWidget
            weather={weather}
            place="md:w-[150px] lg:absolute lg:right-6 lg:top-[calc(34px+24px)]"
            music="md:w-[150px] lg:absolute lg:right-6 lg:top-[calc(34px+24px)]"
            musicOpen="md:w-[216px] md:self-start lg:absolute lg:right-6 lg:top-[calc(34px+24px)] lg:w-[216px]"
          />
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
                <DockPicture src="/dock/finder.webp" className="h-full w-full drop-shadow-[0_8px_14px_rgba(30,40,40,0.35)]" />
              </DesktopShortcut>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Phone: an iPhone home screen. */}
      <motion.div {...blockMotion} className="px-5 pb-28 pt-[calc(34px+18px)] md:hidden">
        <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-[1fr_auto]">
          <NotesWidget onGo={go} />
          <RightWidget
            weather={weather}
            place="w-[124px] max-[399px]:w-full"
            music="w-[124px] max-[399px]:w-full"
            musicOpen="col-span-full w-full"
          />
        </div>
        <div className="mt-6">
          <AreasPanel areas={areas} onGo={go} />
        </div>
      </motion.div>

      <HomeDock leaving={leaving} arriving={arriving} onGo={go} onOpenFinder={open} />
    </div>
  );
}
