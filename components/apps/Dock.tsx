"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import { useLocale } from "@/components/LocaleProvider";
import { getDockItems, type DockItem } from "@/lib/dock";
import { useSectionTheme } from "@/lib/section-theme";
import MacWindow, { type ExitMode } from "./MacWindow";

const iconClasses =
  "h-8 w-8 min-[400px]:h-9 min-[400px]:w-9 md:h-12 md:w-12 object-contain transition-transform duration-200 group-hover:-translate-y-1.5 group-hover:scale-110";

function Tooltip({ label }: { label: string }) {
  return (
    <span className="pointer-events-none absolute bottom-full left-1/2 mb-3 -translate-x-1/2 whitespace-nowrap max-md:hidden rounded-lg bg-[#4a3a34]/85 px-3 py-1.5 text-[13px] font-medium text-white opacity-0 backdrop-blur-md transition-opacity duration-150 group-hover:opacity-100">
      {label}
      <span className="absolute left-1/2 top-full -mt-1 h-2.5 w-2.5 -translate-x-1/2 rotate-45 bg-[#4a3a34]/85" />
    </span>
  );
}

export default function Dock() {
  const { theme } = useSectionTheme();
  const { lang } = useLocale();
  const dockItems = useMemo(() => getDockItems(lang), [lang]);
  const [openIds, setOpenIds] = useState<string[]>([]);
  const [exitMode, setExitMode] = useState<ExitMode>("close");
  const layerRef = useRef<HTMLDivElement>(null);

  // /apps#cv (the "Saber más" button of the About page) opens that note as soon as the desktop is up.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!dockItems.some((item) => item.id === id && "window" in item)) return;
    const timer = window.setTimeout(
      () => setOpenIds((ids) => (ids.includes(id) ? ids : [...ids, id])),
      350,
    );
    return () => window.clearTimeout(timer);
  }, [dockItems]);

  const bringToFront = (id: string) =>
    setOpenIds((ids) =>
      ids[ids.length - 1] === id ? ids : [...ids.filter((i) => i !== id), id],
    );

  const dismiss = (id: string, mode: ExitMode) => {
    setExitMode(mode);
    setOpenIds((ids) => ids.filter((i) => i !== id));
  };

  const itemBody = (item: DockItem) => (
    <>
      <Tooltip label={item.label} />
      <Image
        src={item.icon}
        alt=""
        width={112}
        height={112}
        className={iconClasses}
      />
      {openIds.includes(item.id) && (
        <span className="absolute -bottom-1.5 h-1 w-1 rounded-full bg-current/60 max-md:portrait:bottom-auto max-md:portrait:-left-1 max-md:portrait:top-1/2 max-md:portrait:-translate-y-1/2" />
      )}
    </>
  );

  // The before: layer is an invisible, bigger hit area (44 px on phones); nothing changes visually.
  const itemClasses =
    "group relative flex shrink-0 items-end justify-center before:absolute before:-inset-[6px] before:content-['']";

  return (
    <>
      <div
        ref={layerRef}
        className="pointer-events-none fixed inset-0 z-40 overflow-hidden"
      >
        <AnimatePresence custom={exitMode}>
          {openIds.map((id, i) => {
            const item = dockItems.find((d) => d.id === id);
            if (!item || !("window" in item)) return null;
            return (
              <MacWindow
                key={id}
                win={item.window}
                index={i}
                zIndex={i + 1}
                constraintsRef={layerRef}
                exitMode={exitMode}
                onClose={() => dismiss(id, "close")}
                onMinimize={() => dismiss(id, "minimize")}
                onFocus={() => bringToFront(id)}
              />
            );
          })}
        </AnimatePresence>
      </div>

      {/* Horizontal, centered at the bottom by default (tablets, laptops, landscape phones).
          Portrait phones: vertical bar on the left edge. Anchored to the screen, not the page. */}
      <div data-theme={theme} className="glass-pill fixed bottom-3 left-1/2 z-[60] flex w-max max-w-[calc(100vw-12px)] -translate-x-1/2 flex-row items-end gap-1.5 rounded-full border px-3.5 pb-1.5 pt-1.5 md:bottom-8 md:gap-2 md:px-5 md:pb-2 max-md:portrait:bottom-auto max-md:portrait:left-2 max-md:portrait:top-1/2 max-md:portrait:max-h-[calc(100svh-6rem)] max-md:portrait:translate-x-0 max-md:portrait:-translate-y-1/2 max-md:portrait:flex-col max-md:portrait:items-center max-md:portrait:overflow-y-auto max-md:portrait:px-2 max-md:portrait:py-3">
        {dockItems.map((item, i) => {
          const newGroup = i > 0 && dockItems[i - 1].group !== item.group;
          return (
            <Fragment key={item.id}>
              {newGroup && (
                <span
                  className="mx-0.5 mb-1 h-7 w-px self-center bg-current/20 md:mx-1 md:h-10 max-md:portrait:mx-0 max-md:portrait:my-0.5 max-md:portrait:mb-0 max-md:portrait:h-px max-md:portrait:w-6"
                  aria-hidden="true"
                />
              )}
              {"href" in item ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  data-cursor-hover
                  className={itemClasses}
                >
                  {itemBody(item)}
                </a>
              ) : (
                <button
                  type="button"
                  aria-label={item.label}
                  data-cursor-hover
                  onClick={() => bringToFront(item.id)}
                  className={itemClasses}
                >
                  {itemBody(item)}
                </button>
              )}
            </Fragment>
          );
        })}
      </div>
    </>
  );
}
