"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { TrashItem } from "@/lib/dock";

function Thumb({
  item,
  large = false,
}: {
  item: TrashItem;
  large?: boolean;
}) {
  const ext = item.file.split(".").pop()?.toUpperCase();

  return (
    <div
      className={`relative aspect-[4/3] w-full overflow-hidden rounded-md shadow-md ring-1 ring-black/10 ${
        large ? "max-w-md" : ""
      }`}
      style={{ background: item.color }}
    >
      {item.image ? (
        <Image
          src={item.image}
          alt={item.file}
          fill
          sizes={large ? "(min-width: 768px) 448px, 90vw" : "(min-width: 768px) 220px, 45vw"}
          className="object-cover"
        />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold tracking-wide text-black/35">
          {ext}
        </span>
      )}
    </div>
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
          className="mb-4 text-xs font-medium underline-offset-4 hover:underline"
        >
          ← Volver a la papelera
        </button>
        <Thumb item={item} large />
        <p className="mt-4 break-all text-xs text-black/50">{item.file}</p>
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
          className="rounded-full border border-black/15 px-3 py-1 text-xs font-medium transition-colors hover:bg-black/5"
        >
          Vaciar papelera
        </button>
      </div>

      {replyVisible && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 rounded-lg bg-[#f6efe0] px-3 py-2 text-sm"
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
            <Thumb item={it} />
            <span className="max-w-full break-all rounded px-1.5 py-0.5 text-xs leading-tight group-hover:bg-[#2f6fe4] group-hover:text-white group-focus-visible:bg-[#2f6fe4] group-focus-visible:text-white">
              {it.file}
            </span>
          </button>
        ))}
      </motion.div>
    </div>
  );
}
