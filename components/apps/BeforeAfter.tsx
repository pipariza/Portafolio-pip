"use client";

import { useLocale } from "@/components/LocaleProvider";

import { useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";

function Layer({
  image,
  color,
  label,
  side,
}: {
  image?: string;
  color: string;
  label: string;
  side: "left" | "right";
}) {
  return (
    <div className="absolute inset-0" style={{ background: color }}>
      {image && (
        <Image
          src={image}
          alt={label}
          fill
          sizes="(min-width: 768px) 448px, 90vw"
          className="pointer-events-none object-cover"
          draggable={false}
        />
      )}
      <span
        className={`pointer-events-none absolute top-2 rounded-full bg-black/45 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.08em] text-white ${
          side === "left" ? "left-2" : "right-2"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

/** Drag the handle (or use the arrow keys) to reveal the "after" over the "before". */
export default function BeforeAfter({
  before,
  after,
  beforeColor,
  afterColor,
}: {
  before?: string;
  after?: string;
  beforeColor: string;
  afterColor: string;
}) {
  const { tr } = useLocale();
  const [pos, setPos] = useState(50);
  const boxRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const clamp = (v: number) => Math.min(100, Math.max(0, v));

  const moveTo = (clientX: number) => {
    const rect = boxRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos(clamp(((clientX - rect.left) / rect.width) * 100));
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowLeft") setPos((p) => clamp(p - 5));
    if (e.key === "ArrowRight") setPos((p) => clamp(p + 5));
  };

  return (
    <div
      ref={boxRef}
      data-cursor-hover
      className="relative aspect-[16/10] w-full max-w-md touch-pan-y select-none overflow-hidden rounded-md shadow-md ring-1 ring-black/10"
      onPointerDown={(e) => {
        dragging.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        moveTo(e.clientX);
      }}
      onPointerMove={(e) => {
        if (dragging.current) moveTo(e.clientX);
      }}
      onPointerUp={() => {
        dragging.current = false;
      }}
      onPointerCancel={() => {
        dragging.current = false;
      }}
    >
      <Layer image={before} color={beforeColor} label={tr("Antes", "Before")} side="left" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
        <Layer image={after} color={afterColor} label={tr("Después", "After")} side="right" />
      </div>

      <div
        className="pointer-events-none absolute inset-y-0 w-px bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.15)]"
        style={{ left: `${pos}%` }}
      />
      <button
        type="button"
        role="slider"
        aria-label={tr("Comparar antes y después", "Compare before and after")}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        onKeyDown={onKeyDown}
        className="absolute top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-lg"
        style={{ left: `${pos}%` }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path d="M6 5L2.5 9 6 13M12 5l3.5 4L12 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
