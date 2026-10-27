"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Variants } from "framer-motion";
import { useLocale } from "@/components/LocaleProvider";

/*
 * What every macOS-style window on the site shares (Work's Safari, Contact's
 * Mail and Contacts): the three traffic lights, the motion for closing and
 * minimizing, and the state of one window.
 */

export const EASE = [0.16, 0.84, 0.44, 1] as const;

/** Where a window is heading (or coming from) when it is closed or minimized into the dock. */
export type WindowFx = { kind: "close" | "minimize"; x: number; y: number };

export const WINDOW_FX: Variants = {
  hidden: (fx: WindowFx) =>
    fx.kind === "minimize"
      ? { opacity: 0, scale: 0.12, x: fx.x, y: fx.y }
      : { opacity: 0, scale: 0.94, x: 0, y: 0 },
  shown: {
    opacity: 1,
    scale: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.45, ease: EASE },
  },
  gone: (fx: WindowFx) =>
    fx.kind === "minimize"
      ? {
          opacity: [1, 1, 0],
          scale: 0.12,
          x: fx.x,
          y: fx.y,
          transition: {
            duration: 0.5,
            ease: [0.5, 0, 0.75, 0],
            opacity: { duration: 0.5, times: [0, 0.7, 1] },
          },
        }
      : { opacity: 0, scale: 0.92, transition: { duration: 0.18 } },
};

export const WINDOW_FX_REDUCED: Variants = {
  hidden: { opacity: 0 },
  shown: { opacity: 1, transition: { duration: 0.01 } },
  gone: { opacity: 0, transition: { duration: 0.01 } },
};

export type WindowState = "open" | "closed" | "minimized";

/**
 * State of one window: open, closed (an icon stays on the desktop to open it
 * again), minimized (it flies to `flyTo()`, a point in viewport coordinates, and
 * waits in the dock) and, apart from that, full screen under the menu bar.
 * Full screen is left with Esc, freezes the page behind it and, when the window
 * sits in a horizontal scroller (the Work carousel), freezes that too.
 * Put `ref` on the window element.
 */
export function useMacWindow(flyTo: () => { x: number; y: number } | null) {
  const [win, setWin] = useState<WindowState>("open");
  const [zoomed, setZoomed] = useState(false);
  const [fx, setFx] = useState<WindowFx>({ kind: "close", x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!zoomed) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoomed(false);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // A swipe on the full-screen window must not slide a carousel behind it.
    let scroller = ref.current?.parentElement ?? null;
    while (scroller && !/(auto|scroll)/.test(getComputedStyle(scroller).overflowX)) {
      scroller = scroller.parentElement;
    }
    const previousX = scroller?.style.overflowX ?? "";
    if (scroller) scroller.style.overflowX = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      if (scroller) scroller.style.overflowX = previousX;
      window.removeEventListener("keydown", onKey);
    };
  }, [zoomed]);

  const close = () => {
    setFx({ kind: "close", x: 0, y: 0 });
    setZoomed(false);
    setWin("closed");
  };
  const minimize = () => {
    const w = ref.current?.getBoundingClientRect();
    const target = flyTo();
    setFx(
      w && target
        ? {
            kind: "minimize",
            x: target.x - (w.left + w.width / 2),
            y: target.y - (w.top + w.height / 2),
          }
        : { kind: "close", x: 0, y: 0 },
    );
    setZoomed(false);
    setWin("minimized");
  };
  const open = () => setWin("open");
  const toggleZoom = () => setZoomed((z) => !z);

  return { win, zoomed, fx, ref, close, minimize, open, toggleZoom };
}

/**
 * One window button. Its hit area is wider than the dot (the dots are tiny on a
 * phone), and the symbol shows on hover, like macOS.
 */
function Light({
  label,
  onClick,
  color,
  hit,
  dot,
  disabled = false,
  children,
}: {
  label: string;
  onClick: () => void;
  color: string;
  hit: string;
  dot: string;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      data-cursor-hover={disabled ? undefined : true}
      className={`group/light flex h-full items-center justify-center outline-none ${hit}`}
    >
      <span
        className={`flex items-center justify-center rounded-full shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.18)] group-focus-visible/light:ring-2 group-focus-visible/light:ring-[#0078d4] group-focus-visible/light:ring-offset-1 ${dot} ${
          disabled ? "opacity-40" : ""
        }`}
        style={{ background: disabled ? "#8a8a8e" : color }}
      >
        {children}
      </span>
    </button>
  );
}

/**
 * The red, yellow and green buttons.
 * - `zoomed`: the window is full screen (green becomes "exit full screen").
 * - `fixedSize`: dots in px at every width, with the hover symbols (windows that
 *   do not scale with their screen); by default only a full-screen window does.
 *   Without it the dots are measured in cqw, for the scaled-down Work desktop.
 * - `canZoom={false}`: a window that cannot be enlarged (green stays grey).
 */
export function TrafficLights({
  zoomed = false,
  fixedSize,
  canZoom = true,
  onClose,
  onMinimize,
  onZoom,
}: {
  zoomed?: boolean;
  fixedSize?: boolean;
  canZoom?: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onZoom: () => void;
}) {
  const { tr } = useLocale();
  const fixed = fixedSize ?? zoomed;
  const hit = fixed ? "w-5" : "w-[max(18px,4.8cqw)] lg:w-5";
  const dot = fixed ? "h-3 w-3" : "h-[max(7px,2.4cqw)] w-[max(7px,2.4cqw)] lg:h-3 lg:w-3";
  // Too small to read on a phone (and nobody hovers there): only shown from lg up or when fixed.
  const glyph = `h-[7px] w-[7px] opacity-0 transition-opacity group-hover/lights:opacity-100 group-focus-within/lights:opacity-100 ${
    fixed ? "" : "max-lg:hidden"
  }`;
  return (
    <div role="group" aria-label={tr("Controles de la ventana", "Window controls")} className="group/lights -ml-1 flex h-full items-center">
      <Light label={tr("Cerrar ventana", "Close window")} onClick={onClose} color="#ff5f57" hit={hit} dot={dot}>
        <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className={`${glyph} text-[#4d0000]/70`} aria-hidden="true">
          <path d="m2 2 6 6M8 2 2 8" />
        </svg>
      </Light>
      <Light label={tr("Minimizar ventana", "Minimize window")} onClick={onMinimize} color="#febc2e" hit={hit} dot={dot}>
        <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className={`${glyph} text-[#5a3b00]/70`} aria-hidden="true">
          <path d="M1.5 5h7" />
        </svg>
      </Light>
      <Light
        label={zoomed ? tr("Salir de pantalla completa", "Exit full screen") : tr("Pantalla completa", "Full screen")}
        onClick={onZoom}
        color="#28c840"
        hit={hit}
        dot={dot}
        disabled={!canZoom}
      >
        {canZoom && (
          <svg viewBox="0 0 10 10" fill="currentColor" className={`${glyph} text-[#0a4d0f]/70`} aria-hidden="true">
            {zoomed ? <path d="M1 5h4V1zM9 5H5v4z" /> : <path d="M1 1h4L1 5zM9 9H5l4-4z" />}
          </svg>
        )}
      </Light>
    </div>
  );
}
