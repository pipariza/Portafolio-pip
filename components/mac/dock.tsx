"use client";

import type { ReactNode, Ref } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE } from "./window";

/*
 * Pieces of the desktop around a window, shared by Contact and About: what a
 * closed window leaves on the desktop, and the small dock that slides up while a
 * window is minimized. `tone` matches the page: light wallpapers get a light
 * glass dock, dark ones a dark glass dock.
 */

export type DockTone = "light" | "dark";

/** What is left where a window was, once it is closed: the app's icon (the child) and its name. */
export function DesktopShortcut({
  label,
  aria,
  onOpen,
  buttonRef,
  children,
}: {
  label: string;
  aria: string;
  onOpen: () => void;
  buttonRef: Ref<HTMLButtonElement>;
  children: ReactNode;
}) {
  return (
    <motion.button
      ref={buttonRef}
      type="button"
      onClick={onOpen}
      aria-label={aria}
      data-cursor-hover
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1, transition: { duration: 0.3, ease: EASE } }}
      exit={{ opacity: 0, transition: { duration: 0.12 } }}
      className="group/shortcut absolute inset-0 m-auto flex h-fit w-fit flex-col items-center gap-2.5 rounded-2xl p-3 outline-none"
    >
      <span className="block h-[76px] w-[76px] transition-transform duration-200 group-hover/shortcut:scale-105 group-focus-visible/shortcut:scale-105">
        {children}
      </span>
      <span className="rounded-md bg-black/55 px-2 py-0.5 text-[12.5px] font-medium text-white backdrop-blur-md group-focus-visible/shortcut:ring-2 group-focus-visible/shortcut:ring-[#0a84ff]">
        {label}
      </span>
    </motion.button>
  );
}

/** A minimized window in the dock: click it to bring the window back. The child draws the little preview. */
export function DockTile({
  title,
  tone,
  onRestore,
  buttonRef,
  children,
}: {
  title: string;
  tone: DockTone;
  onRestore: () => void;
  buttonRef: Ref<HTMLButtonElement>;
  children: ReactNode;
}) {
  const dark = tone === "dark";
  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onRestore}
      aria-label={`Restaurar ${title}`}
      title={title}
      data-cursor-hover
      className="group/tile relative h-12 w-12 shrink-0 outline-none sm:h-14 sm:w-14"
    >
      <span
        className={`absolute inset-0 block overflow-hidden rounded-[10px] transition-transform duration-200 ease-out group-hover/tile:-translate-y-1.5 group-focus-visible/tile:ring-2 group-focus-visible/tile:ring-[#0a84ff] ${
          dark
            ? "bg-[#2a2166] shadow-[0_6px_14px_-4px_rgba(8,4,40,0.6),0_0_0_0.5px_rgba(196,185,255,0.35)]"
            : "bg-white shadow-[0_6px_14px_-4px_rgba(0,0,0,0.4),0_0_0_0.5px_rgba(0,0,0,0.25)]"
        }`}
      >
        <span
          className={`absolute inset-x-0 top-0 flex h-[24%] items-center gap-[7%] px-[9%] ${
            dark ? "bg-[#4c3fa8]" : "bg-[#f3f1ee]"
          }`}
        >
          <i className="block h-[24%] w-[9%] rounded-full bg-[#ff5f57]" />
          <i className="block h-[24%] w-[9%] rounded-full bg-[#febc2e]" />
          <i className="block h-[24%] w-[9%] rounded-full bg-[#28c840]" />
        </span>
        {children}
      </span>
    </button>
  );
}

/** The dock only shows up while a window is minimized. */
export function MiniDock({
  show,
  tone,
  children,
}: {
  show: boolean;
  tone: DockTone;
  children: ReactNode;
}) {
  const dark = tone === "dark";
  return (
    <AnimatePresence>
      {show && (
        <motion.nav
          aria-label="Ventanas minimizadas"
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } }}
          exit={{ opacity: 0, y: 36, transition: { duration: 0.2 } }}
          className={`fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-1/2 z-[60] flex -translate-x-1/2 items-end gap-3 rounded-[26px] px-3.5 pb-2.5 pt-2.5 backdrop-blur-3xl backdrop-saturate-150 ${
            dark
              ? "bg-[#8b7bff]/[0.22] shadow-[inset_0_0_0_0.5px_rgba(220,212,255,0.3),0_0_0_0.5px_rgba(10,4,44,0.4),0_18px_40px_-12px_rgba(10,4,44,0.75)]"
              : "bg-white/60 shadow-[inset_0_0_0_0.5px_rgba(255,255,255,0.9),0_0_0_0.5px_rgba(0,0,0,0.14),0_18px_40px_-12px_rgba(30,40,40,0.45)]"
          }`}
        >
          {children}
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
