"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

export type MacMenuLink = { href: string; label: string; active: boolean };

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

// A few status icons, like a real menu bar but without the crowd. They only decorate.
function StatusIcons() {
  return (
    <span className="flex items-center gap-4 max-md:hidden" aria-hidden="true">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="max-lg:hidden">
        <circle cx="6.8" cy="6.8" r="4.3" />
        <path d="m10 10 3.6 3.6" />
      </svg>
      <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
        <path d="M8 2.2c2 0 3.8.8 5.1 2.1l1.1-1.2A8.9 8.9 0 0 0 8 .6a8.9 8.9 0 0 0-6.2 2.5l1.1 1.2A7.2 7.2 0 0 1 8 2.2Zm0 3.4c1.1 0 2.1.4 2.9 1.2l1.1-1.2A6 6 0 0 0 8 4a6 6 0 0 0-4 1.6l1.1 1.2c.8-.8 1.8-1.2 2.9-1.2Zm0 3.3c.5 0 1 .2 1.4.6L8 11.1 6.6 9.5c.4-.4.9-.6 1.4-.6Z" />
      </svg>
      <svg width="26" height="12" viewBox="0 0 26 12" fill="none">
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
export default function MacMenuBar({ links }: { links: MacMenuLink[] }) {
  const [open, setOpen] = useState(false);
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

  const item =
    "rounded-md px-2.5 py-[3px] transition-colors hover:bg-black/10 focus-visible:bg-black/10 focus-visible:outline-none";

  return (
    <header className="fixed inset-x-0 top-0 z-[70] text-[#1d1d1f]">
      <div className="flex h-[34px] items-center bg-white/60 pl-3 pr-2 text-[13px] shadow-[0_0.5px_0_rgba(0,0,0,0.14)] backdrop-blur-2xl backdrop-saturate-150 md:px-4">
        <nav aria-label="Principal" className="flex min-w-0 items-center gap-2.5 md:gap-3">
          <AppleLogo />
          <Link href="/" className="-mx-1.5 rounded-md px-1.5 py-[3px] font-bold hover:bg-black/10">
            Pip Ariza
          </Link>
          <ul className="hidden items-center md:flex">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={link.active ? "page" : undefined}
                  className={`${item} ${link.active ? "bg-black/[0.08] font-semibold" : ""}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-4 text-[12.5px]">
          <StatusIcons />
          <span className="tabular-nums">{clock}</span>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            className="-mr-1 flex h-[34px] w-11 flex-col items-center justify-center gap-[5px] md:hidden"
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
            className="fixed inset-0 -z-10 bg-black/30 md:hidden"
          />
        )}
        {open && (
          <motion.ul
            key="menu"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="absolute right-2 top-[40px] w-56 rounded-xl border border-black/10 bg-[#f6f4f0]/95 p-1.5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.5)] backdrop-blur-2xl md:hidden"
          >
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={link.active ? "page" : undefined}
                  className={`flex h-11 items-center rounded-lg px-3 text-[15px] ${
                    link.active ? "bg-black/[0.07] font-semibold" : "font-medium active:bg-black/[0.07]"
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
