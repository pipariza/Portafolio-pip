"use client";

import { useState, type RefObject } from "react";
import {
  animate,
  motion,
  useDragControls,
  useMotionValue,
  type Variants,
} from "framer-motion";
import type { DockWindow } from "@/lib/dock";

export type ExitMode = "close" | "minimize";

const variants: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  shown: { opacity: 1, scale: 1 },
  exit: (mode: ExitMode) =>
    mode === "minimize"
      ? {
          opacity: 0,
          scale: 0.3,
          y: typeof window === "undefined" ? 300 : window.innerHeight * 0.45,
        }
      : { opacity: 0, scale: 0.94 },
};

function TrafficButton({
  label,
  color,
  onClick,
  children,
}: {
  label: string;
  color: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      data-cursor-hover
      onPointerDown={(e) => e.stopPropagation()}
      onClick={onClick}
      className="flex h-3.5 w-3.5 items-center justify-center rounded-full text-black/60"
      style={{ background: color }}
    >
      <span className="opacity-0 transition-opacity group-hover/dots:opacity-100">
        {children}
      </span>
    </button>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard can be blocked; the mailto link above still works.
    }
  };

  return (
    <button
      type="button"
      data-cursor-hover
      onClick={copy}
      className="rounded-full border border-black/15 px-3 py-1 text-xs font-medium transition-colors hover:bg-black/5"
    >
      {copied ? "Copiado ✓" : "Copiar"}
    </button>
  );
}

export default function MacWindow({
  win,
  index,
  zIndex,
  constraintsRef,
  exitMode,
  onClose,
  onMinimize,
  onFocus,
}: {
  win: DockWindow;
  index: number;
  zIndex: number;
  constraintsRef: RefObject<HTMLDivElement | null>;
  exitMode: ExitMode;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
}) {
  const [tab, setTab] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const controls = useDragControls();
  // Cascade extra windows only on large screens; keep windows centered on phones and tablets.
  const cascade = typeof window !== "undefined" && window.innerWidth >= 1024;
  const x = useMotionValue(cascade ? (index % 4) * 28 - 42 : 0);
  const y = useMotionValue(cascade ? (index % 4) * 28 - 40 : 0);

  const toggleZoom = () => {
    setZoomed((z) => !z);
    animate(x, 0, { duration: 0.3 });
    animate(y, 0, { duration: 0.3 });
  };

  const hasSidebar = win.tabs.length > 1;
  const current = win.tabs[tab];

  return (
    <div
      className="pointer-events-none absolute inset-0 flex items-center justify-center max-md:landscape:px-2 max-md:landscape:pb-16 max-md:portrait:pl-[68px] max-md:portrait:pr-2"
      style={{ zIndex }}
    >
      <motion.div
        variants={variants}
        initial="hidden"
        animate="shown"
        exit="exit"
        custom={exitMode}
        transition={{ duration: 0.28, ease: [0.16, 0.84, 0.44, 1] }}
        drag
        dragControls={controls}
        dragListener={false}
        dragConstraints={constraintsRef}
        dragElastic={0}
        dragMomentum={false}
        style={{ x, y }}
        onPointerDown={onFocus}
        className={`pointer-events-auto flex flex-col overflow-hidden rounded-[18px] bg-white text-[#1d1d1f] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)] ring-1 ring-black/10 transition-[width,height] duration-300 ${
          zoomed
            ? "h-[min(80vh,820px)] w-full md:w-[min(1100px,94vw)]"
            : "h-[min(520px,68vh)] w-full md:w-[min(720px,92vw)]"
        }`}
      >
        <div
          onPointerDown={(e) => controls.start(e)}
          className="flex h-12 shrink-0 touch-none select-none items-center gap-4 border-b border-black/10 bg-[#eeebe9] px-4"
        >
          <div className="group/dots flex items-center gap-2">
            <TrafficButton label="Cerrar" color="#e2675c" onClick={onClose}>
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
                <path d="M1.5 1.5l5 5M6.5 1.5l-5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </TrafficButton>
            <TrafficButton label="Minimizar" color="#e9bf5f" onClick={onMinimize}>
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
                <path d="M1.5 4h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </TrafficButton>
            <TrafficButton
              label={zoomed ? "Reducir" : "Ampliar"}
              color="#6cbb58"
              onClick={toggleZoom}
            >
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
                <path d="M4 1.5v5M1.5 4h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </TrafficButton>
          </div>
          <p className="truncate text-[15px] font-medium">{win.title}</p>
        </div>

        <div className="flex min-h-0 flex-1">
          {hasSidebar && (
            <aside className="w-[28%] min-w-[104px] max-w-[210px] shrink-0 border-r border-black/10 bg-[#efecea] px-2 pt-4 md:w-[32%] md:min-w-[130px] md:px-3">
              {win.tabs.map((t, i) => (
                <button
                  key={t.label}
                  type="button"
                  data-cursor-hover
                  onClick={() => setTab(i)}
                  className="flex w-full items-center justify-between border-b border-black/10 px-2 py-3 text-left text-sm last:border-b-0 md:px-3 md:text-[15px]"
                >
                  <span className={i === tab ? "font-semibold" : "font-normal"}>
                    {t.label}
                  </span>
                  {t.meta && <span className="text-black/45">{t.meta}</span>}
                </button>
              ))}
            </aside>
          )}

          <div className="min-w-0 flex-1 overflow-y-auto p-4 text-sm leading-snug md:p-6 md:text-[15px]">
            {current.lead && (
              <p className="mb-4 max-w-xl text-lg font-semibold leading-tight md:text-xl">
                {current.lead}
              </p>
            )}
            {current.paragraphs?.map((p) => (
              <p key={p} className="mb-5 max-w-xl">
                {p}
              </p>
            ))}
            {current.listTitle && <p className="mb-3">{current.listTitle}</p>}
            {current.list && (
              <ul className="space-y-2.5">
                {current.list.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#f2b63c]">
                      <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
                        <path d="M2.5 5.8l2 2 4-4.6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            )}
            {current.email && (
              <div className={`flex flex-wrap items-center gap-3 ${current.list ? "mt-6" : ""}`}>
                <a
                  href={`mailto:${current.email}`}
                  data-cursor-hover
                  className="break-all text-base font-medium underline underline-offset-4 md:text-lg"
                >
                  {current.email}
                </a>
                <CopyButton text={current.email} />
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
