"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { useLocale } from "@/components/LocaleProvider";
import { EASE } from "@/components/mac/window";
import { SOFT_GRAY, wallpaperStyle } from "@/components/mac/wallpaper";
import { openSpotlight } from "@/lib/spotlight";

/*
 * The 404 as a macOS alert on the same soft gray desktop as the site: the folder with a
 * question mark (what a Mac shows when it cannot find what it needs), a message like the
 * Finder's "the item could not be found" and two buttons, the blue one being the default.
 */

/** The classic folder with a question mark (flat, two blues). */
function FolderQuestionIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path d="M6 14a5 5 0 0 1 5-5h12.5l5.5 6.5H53a5 5 0 0 1 5 5V50a5 5 0 0 1-5 5H11a5 5 0 0 1-5-5V14Z" fill="#3f9af5" />
      <rect x="6" y="21" width="52" height="34" rx="5" fill="#8ccbff" />
      <path d="M26.5 31c0-3.8 2.8-6.2 6.2-6.2 3.5 0 6.1 2.3 6.1 5.5 0 4.7-6.3 4.6-6.3 9.6" fill="none" stroke="#fff" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="32.5" cy="46.6" r="2.7" fill="#fff" />
    </svg>
  );
}

export default function NotFoundAlert() {
  const { tr, href } = useLocale();
  // The address as the visitor typed it (the Spanish pages live in /es inside, without it outside).
  const pathname = usePathname().replace(/^\/es(?=\/|$)/, "") || "/";
  const reduce = useReducedMotion();
  const shown = pathname.length > 48 ? `${pathname.slice(0, 47)}…` : pathname;

  return (
    <div
      className="flex min-h-screen w-full items-center justify-center px-4 pb-16 pt-[calc(34px+16px)] text-[#1d1d1f]"
      style={wallpaperStyle(SOFT_GRAY)}
    >
      <motion.div
        role="alertdialog"
        aria-labelledby="notfound-title"
        aria-describedby="notfound-text"
        initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="w-[min(430px,100%)] rounded-[18px] bg-white/75 p-5 shadow-[0_0_0_0.5px_rgba(0,0,0,0.2),0_30px_70px_-20px_rgba(30,40,40,0.5),0_10px_24px_-10px_rgba(30,40,40,0.3)] backdrop-blur-[40px] backdrop-saturate-[1.6] sm:p-6"
      >
        <div className="flex gap-4">
          <FolderQuestionIcon className="h-16 w-16 shrink-0 drop-shadow-[0_6px_8px_rgba(30,60,100,0.3)]" />
          <div className="min-w-0">
            <h1 id="notfound-title" className="break-words text-[15px] font-bold leading-snug">
              {tr(`No se encontró la página «${shown}».`, `The page “${shown}” was not found.`)}
            </h1>
            <p id="notfound-text" className="mt-1.5 text-[13px] leading-snug text-black/65">
              {tr(
                "La dirección no existe o se movió. Revisa que esté bien escrita o vuelve al inicio.",
                "The address doesn't exist or was moved. Check that it is spelled correctly or go back home.",
              )}
              <span className="mt-1.5 block text-black/60">{tr("(Código de error 404.)", "(Error code 404.)")}</span>
            </p>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2.5 max-sm:flex-col-reverse">
          <button
            type="button"
            onClick={openSpotlight}
            data-cursor-hover
            className="inline-flex h-8 items-center justify-center rounded-[7px] border border-black/15 bg-white px-4 text-[13px] font-medium shadow-[0_1px_1px_rgba(0,0,0,0.08)] outline-none transition-colors hover:bg-[#f5f5f3] focus-visible:ring-2 focus-visible:ring-[#0a84ff] max-sm:h-11"
          >
            {tr("Buscar…", "Search…")}
          </button>
          <Link
            href={href("/")}
            autoFocus
            data-cursor-hover
            className="inline-flex h-8 items-center justify-center rounded-[7px] bg-[#0a64d8] px-4 text-[13px] font-semibold text-white shadow-[0_1px_1px_rgba(0,0,0,0.15)] outline-none transition-[filter] hover:brightness-110 focus-visible:ring-2 focus-visible:ring-[#0a84ff] focus-visible:ring-offset-2 max-sm:h-11"
          >
            {tr("Ir al inicio", "Go home")}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
