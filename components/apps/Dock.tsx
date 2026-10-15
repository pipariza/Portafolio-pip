"use client";

import { Fragment, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import { dockItems, type DockItem } from "@/lib/dock";
import MacWindow, { type ExitMode } from "./MacWindow";

const iconClasses =
  "h-9 w-9 min-[400px]:h-10 min-[400px]:w-10 md:h-14 md:w-14 object-contain transition-transform duration-200 group-hover:-translate-y-1.5 group-hover:scale-110";

function Tooltip({ label }: { label: string }) {
  return (
    <span className="pointer-events-none absolute bottom-full left-1/2 mb-3 -translate-x-1/2 whitespace-nowrap max-md:hidden rounded-lg bg-[#4a3a34]/85 px-3 py-1.5 text-[13px] font-medium text-white opacity-0 backdrop-blur-md transition-opacity duration-150 group-hover:opacity-100">
      {label}
      <span className="absolute left-1/2 top-full -mt-1 h-2.5 w-2.5 -translate-x-1/2 rotate-45 bg-[#4a3a34]/85" />
    </span>
  );
}

export default function Dock() {
  const [openIds, setOpenIds] = useState<string[]>([]);
  const [exitMode, setExitMode] = useState<ExitMode>("close");
  const layerRef = useRef<HTMLDivElement>(null);

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
        <span className="absolute -bottom-1.5 h-1 w-1 rounded-full bg-black/60 max-md:portrait:bottom-auto max-md:portrait:-left-1 max-md:portrait:top-1/2 max-md:portrait:-translate-y-1/2" />
      )}
    </>
  );

  const itemClasses =
    "group relative flex shrink-0 items-end justify-center";

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
      <div className="fixed bottom-3 left-1/2 z-[60] flex w-max max-w-[calc(100vw-12px)] -translate-x-1/2 flex-row items-end gap-1.5 rounded-[22px] border border-white/50 bg-white/30 px-2 pb-2 pt-2 shadow-[0_10px_40px_rgba(0,0,0,0.18)] backdrop-blur-2xl md:bottom-8 md:gap-2 md:px-3 md:pb-2.5 max-md:portrait:bottom-auto max-md:portrait:left-2 max-md:portrait:top-1/2 max-md:portrait:max-h-[calc(100svh-6rem)] max-md:portrait:translate-x-0 max-md:portrait:-translate-y-1/2 max-md:portrait:flex-col max-md:portrait:items-center max-md:portrait:overflow-y-auto max-md:portrait:px-2 max-md:portrait:py-3">
        {dockItems.map((item, i) => {
          const newGroup = i > 0 && dockItems[i - 1].group !== item.group;
          return (
            <Fragment key={item.id}>
              {newGroup && (
                <span
                  className="mx-0.5 mb-1 h-8 w-px self-center bg-black/20 md:mx-1 md:h-12 max-md:portrait:mx-0 max-md:portrait:my-0.5 max-md:portrait:mb-0 max-md:portrait:h-px max-md:portrait:w-7"
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
