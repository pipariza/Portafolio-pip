"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { TrashItem } from "@/lib/dock";
import Thumb from "./Thumb";

function ItemThumb({
  item,
  large = false,
}: {
  item: TrashItem;
  large?: boolean;
}) {
  return (
    <Thumb
      image={item.image}
      color={item.color}
      alt={item.file}
      label={item.file.split(".").pop()?.toUpperCase()}
      large={large}
    />
  );
}

export default function TrashView({
  items,
  emptyReply,
}: {
  items: TrashItem[];
  emptyReply: string;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [shake, setShake] = useState(0);
  const [replyVisible, setReplyVisible] = useState(false);

  useEffect(() => {
    if (!replyVisible) return;
    const t = window.setTimeout(() => setReplyVisible(false), 3500);
    return () => window.clearTimeout(t);
  }, [replyVisible, shake]);

  const item = selected === null ? null : items[selected];

  if (item) {
    return (
      <div>
        <button
          type="button"
          data-cursor-hover
          onClick={() => setSelected(null)}
          className="mb-4 text-[11px] font-medium underline-offset-4 hover:underline"
        >
          ← Volver a la papelera
        </button>
        <ItemThumb item={item} large />
        <p className="mt-4 break-all text-[11px] text-black/50">{item.file}</p>
        <p className="mt-3 max-w-xl">
          <span className="font-semibold">Qué era: </span>
          {item.what}
        </p>
        <p className="mt-2 max-w-xl">
          <span className="font-semibold">Qué aprendí: </span>
          {item.learned}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-black/50">{items.length} elementos</p>
        <button
          type="button"
          data-cursor-hover
          onClick={() => {
            setShake((s) => s + 1);
            setReplyVisible(true);
          }}
          className="rounded-full border border-black/15 px-3 py-1 text-[11px] font-medium transition-colors hover:bg-black/5"
        >
          Vaciar papelera
        </button>
      </div>

      {replyVisible && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 rounded-lg bg-[#f6efe0] px-3 py-2 text-xs"
        >
          {emptyReply}
        </motion.p>
      )}

      <motion.div
        key={shake}
        animate={shake ? { x: [0, -8, 8, -6, 6, 0] } : undefined}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-2 gap-x-4 gap-y-5 @md:grid-cols-3"
      >
        {items.map((it, i) => (
          <button
            key={it.file}
            type="button"
            data-cursor-hover
            aria-label={`Abrir ${it.file}`}
            onClick={() => setSelected(i)}
            className="group flex flex-col items-center gap-2 text-center"
          >
            <ItemThumb item={it} />
            <span className="max-w-full break-all rounded px-1.5 py-0.5 text-[11px] leading-tight group-hover:bg-[#2f6fe4] group-hover:text-white group-focus-visible:bg-[#2f6fe4] group-focus-visible:text-white">
              {it.file}
            </span>
          </button>
        ))}
      </motion.div>
    </div>
  );
}
