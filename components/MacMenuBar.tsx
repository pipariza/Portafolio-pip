"use client";

import { useEffect, useState, useSyncExternalStore, type MouseEvent } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { openSpotlight } from "@/lib/spotlight";
import { zoomOutThen } from "@/lib/zoom";
import { parentPath, previousPath, recordVisit } from "@/lib/history";

export type MacMenuLink = { href: string; label: string; active: boolean };

// Light pages get a light, frosted bar; dark pages get macOS's dark one.
const SKIN = {
  light: {
    bar: "bg-white/60 text-[#1d1d1f] shadow-[0_0.5px_0_rgba(0,0,0,0.14)]",
    hover: "hover:bg-black/10 focus-visible:bg-black/10",
    active: "bg-black/[0.08]",
    menu: "border-black/10 bg-[#f6f4f0]/95 text-[#1d1d1f]",
    menuActive: "bg-black/[0.07]",
    scrim: "bg-black/30",
  },
  dark: {
    bar: "bg-[#161616]/60 text-white shadow-[0_0.5px_0_rgba(255,255,255,0.14)]",
    hover: "hover:bg-white/15 focus-visible:bg-white/15",
    active: "bg-white/[0.14]",
    menu: "border-white/[0.12] bg-[#1c1c1e]/95 text-white",
    menuActive: "bg-white/[0.12]",
    scrim: "bg-black/50",
  },
} as const;

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

function AppleLogo() {
  return (
    <svg width="14" height="17" viewBox="0 0 24 24" aria-hidden="true" className="-mt-0.5 shrink-0">
      <path
        fill="currentColor"
        d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
      />
    </svg>
  );
}

// A few status icons, like a real menu bar but without the crowd. Only the magnifier does
// something: it opens Spotlight (the search window, also on ⌘K).
function StatusIcons({ hover }: { hover: string }) {
  return (
    <span className="flex items-center gap-4 max-md:hidden">
      <button
        type="button"
        onClick={openSpotlight}
        aria-label="Buscar (⌘K)"
        title="Buscar (⌘K)"
        data-cursor-hover
        className={`-m-1.5 rounded-md p-1.5 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff] ${hover}`}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
          <circle cx="6.8" cy="6.8" r="4.3" />
          <path d="m10 10 3.6 3.6" />
        </svg>
      </button>
      <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor" aria-hidden="true" className="max-lg:hidden">
        <path d="M8 2.2c2 0 3.8.8 5.1 2.1l1.1-1.2A8.9 8.9 0 0 0 8 .6a8.9 8.9 0 0 0-6.2 2.5l1.1 1.2A7.2 7.2 0 0 1 8 2.2Zm0 3.4c1.1 0 2.1.4 2.9 1.2l1.1-1.2A6 6 0 0 0 8 4a6 6 0 0 0-4 1.6l1.1 1.2c.8-.8 1.8-1.2 2.9-1.2Zm0 3.3c.5 0 1 .2 1.4.6L8 11.1 6.6 9.5c.4-.4.9-.6 1.4-.6Z" />
      </svg>
      <svg width="26" height="12" viewBox="0 0 26 12" fill="none" aria-hidden="true" className="max-lg:hidden">
        <rect x=".5" y=".5" width="22" height="11" rx="3.2" stroke="currentColor" opacity=".45" />
        <rect x="2" y="2" width="16" height="8" rx="1.8" fill="currentColor" />
        <path d="M24 4v4c.8-.3 1.4-1.1 1.4-2S24.8 4.3 24 4Z" fill="currentColor" opacity=".5" />
      </svg>
    </span>
  );
}

/**
 * The site's menu on the Work pages, drawn as a macOS menu bar: the Apple logo,
 * the name in bold like the front app, the pages as menus, and a few status
 * icons with the visitor's real clock. On phones the menus fold into one
 * button that opens a dropdown under the bar.
 */
export default function MacMenuBar({
  links,
  theme,
}: {
  links: MacMenuLink[];
  theme: "light" | "dark";
}) {
  const skin = SKIN[theme];
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    recordVisit(pathname);
  }, [pathname]);

  // The back arrow, on every page but the home: back to the page you came from in this visit
  // (through the zoom out when that is the home) or, if there is none, to the page above this one.
  const goBack = () => {
    const previous = previousPath();
    if (previous) {
      if (previous === "/") zoomOutThen(pathname, () => router.back());
      else router.back();
      return;
    }
    const parent = parentPath(pathname);
    if (parent === "/") zoomOutThen(pathname, () => router.push("/"));
    else router.push(parent);
  };

  // Going home from a page: the page shrinks toward the icon it came from first (lib/zoom.ts).
  // A click with a modifier key (new tab) is left alone.
  const goHome = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href !== "/" || pathname === "/") return;
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    zoomOutThen(pathname, () => router.push("/"));
  };
  // The snapshot is a string that only changes with the minute, so the bar
  // re-renders once a minute even though the clock is checked every second.
  const clock = useSyncExternalStore(subscribeClock, clockSnapshot, () => "");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // A clear ring on keyboard focus (a tint alone is hard to see on a translucent bar).
  const ring = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff]";
  const item = `rounded-md px-2.5 py-[3px] transition-colors ${ring} ${skin.hover}`;

  return (
    <header className="fixed inset-x-0 top-0 z-[70]">
      <div
        className={`flex h-[34px] items-center pl-3 pr-2 text-[13px] backdrop-blur-2xl backdrop-saturate-150 transition-colors duration-300 md:px-4 ${skin.bar}`}
      >
        <nav aria-label="Principal" className="flex min-w-0 items-center gap-2.5 md:gap-3">
          {!isHome && (
            <button
              type="button"
              onClick={goBack}
              aria-label="Volver a la página anterior"
              title="Atrás"
              className={`-ml-2 flex h-[34px] min-w-9 items-center justify-center gap-1 rounded-md px-2 font-medium transition-colors ${ring} ${skin.hover}`}
            >
              <svg width="8" height="13" viewBox="0 0 8 13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6.5 1.5 2 6.5l4.5 5" />
              </svg>
              <span className="max-lg:hidden">Atrás</span>
            </button>
          )}
          <AppleLogo />
          <Link
            href="/"
            onClick={(e) => goHome(e, "/")}
            className={`-mx-1.5 rounded-md px-1.5 py-[3px] font-bold transition-colors ${ring} ${skin.hover}`}
          >
            Pip Ariza
          </Link>
          <ul className="hidden items-center md:flex">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={(e) => goHome(e, link.href)}
                  aria-current={link.active ? "page" : undefined}
                  className={`${item} ${link.active ? `${skin.active} font-semibold` : ""}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-3 text-[12.5px] md:gap-4">
          {/* The permanent call to hire: always in the bar, on every page. */}
          <Link
            href="/contacto"
            aria-current={pathname === "/contacto" ? "page" : undefined}
            aria-label="Disponible para trabajo: contáctame"
            className={`flex items-center gap-1.5 rounded-full bg-[#30a14e]/15 px-2.5 py-[3px] font-semibold text-[#1c6a31] transition-colors hover:bg-[#30a14e]/25 ${ring}`}
          >
            <i
              aria-hidden="true"
              className="block h-[7px] w-[7px] rounded-full bg-[#30a14e] shadow-[0_0_0_3px_rgba(48,161,78,0.2)]"
            />
            <span>
              Disponible<span className="max-lg:hidden"> para trabajo</span>
            </span>
          </Link>
          <StatusIcons hover={skin.hover} />
          <span className="tabular-nums max-[479px]:hidden">{clock}</span>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            className={`-mr-1 flex h-[34px] w-11 flex-col items-center justify-center gap-[5px] rounded-md md:hidden ${ring}`}
          >
            <span
              className="block h-[1.5px] w-5 bg-current transition-transform"
              style={{ transform: open ? "translateY(3.5px) rotate(45deg)" : "none" }}
            />
            <span
              className="block h-[1.5px] w-5 bg-current transition-transform"
              style={{ transform: open ? "translateY(-3.5px) rotate(-45deg)" : "none" }}
            />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            key="scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
            aria-hidden="true"
            className={`fixed inset-0 -z-10 md:hidden ${skin.scrim}`}
          />
        )}
        {open && (
          <motion.ul
            key="menu"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className={`absolute right-2 top-[40px] w-56 rounded-xl border p-1.5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.5)] backdrop-blur-2xl md:hidden ${skin.menu}`}
          >
            <li>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  openSpotlight();
                }}
                className={`flex h-11 w-full items-center rounded-lg px-3 text-[15px] font-medium ${ring}`}
              >
                Buscar
              </button>
            </li>
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={(e) => {
                    setOpen(false);
                    goHome(e, link.href);
                  }}
                  aria-current={link.active ? "page" : undefined}
                  className={`flex h-11 items-center rounded-lg px-3 text-[15px] ${ring} ${
                    link.active ? `${skin.menuActive} font-semibold` : "font-medium"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  );
}
