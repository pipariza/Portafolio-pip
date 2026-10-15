"use client";

import { useState } from "react";

type Mode = "preview" | "outline";

const OUTLINE = "#2f6fe4";
const shapeTransition = "fill 0.35s ease, stroke 0.35s ease, stroke-width 0.35s ease";

/** Anchor point square, drawn only in the outline view. */
function Anchor({ x, y }: { x: number; y: number }) {
  return <rect x={x - 3} y={y - 3} width="6" height="6" fill="#fff" stroke={OUTLINE} strokeWidth="1.2" />;
}

/**
 * Demo mark that flips between the finished artwork and its outline (paths,
 * anchor points and Bézier handles), like Illustrator's Preview / Outline views.
 * Swap the shapes for a real logo when one is available.
 */
export default function VectorToggle() {
  const [mode, setMode] = useState<Mode>("preview");
  const outline = mode === "outline";

  return (
    <div>
      <div
        role="group"
        aria-label="Vista"
        className="mb-3 inline-flex rounded-full border border-black/15 p-0.5 text-[11px] font-medium"
      >
        {(["preview", "outline"] as const).map((m) => (
          <button
            key={m}
            type="button"
            data-cursor-hover
            aria-pressed={mode === m}
            onClick={() => setMode(m)}
            className={`rounded-full px-3 py-1 transition-colors ${
              mode === m ? "bg-[#1d1d1f] text-white" : "text-black/60 hover:text-black"
            }`}
          >
            {m === "preview" ? "Vista previa" : "Trazado"}
          </button>
        ))}
      </div>

      <div
        className="aspect-[16/10] w-full max-w-md overflow-hidden rounded-md bg-[#fafafa] ring-1 ring-black/10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        <svg viewBox="0 0 240 150" className="h-full w-full" role="img" aria-label="Logotipo de prueba">
          {/* Circle */}
          <circle
            cx="80"
            cy="75"
            r="48"
            style={{
              fill: outline ? "transparent" : "#f2b63c",
              stroke: outline ? OUTLINE : "transparent",
              strokeWidth: outline ? 1.2 : 0,
              transition: shapeTransition,
            }}
          />
          {/* Triangle */}
          <polygon
            points="120,30 200,120 120,120"
            style={{
              fill: outline ? "transparent" : "#1d1d1f",
              stroke: outline ? OUTLINE : "transparent",
              strokeWidth: outline ? 1.2 : 0,
              transition: shapeTransition,
            }}
          />
          {/* Wave */}
          <path
            d="M40 125 C80 95 120 140 200 115"
            fill="none"
            style={{
              stroke: outline ? OUTLINE : "#e2675c",
              strokeWidth: outline ? 1.2 : 8,
              strokeLinecap: "round",
              transition: shapeTransition,
            }}
          />

          <g style={{ opacity: outline ? 1 : 0, transition: "opacity 0.35s ease" }}>
            {/* Bézier handles of the wave */}
            <line x1="40" y1="125" x2="80" y2="95" stroke={OUTLINE} strokeWidth="1" />
            <line x1="200" y1="115" x2="120" y2="140" stroke={OUTLINE} strokeWidth="1" />
            <circle cx="80" cy="95" r="2.5" fill={OUTLINE} />
            <circle cx="120" cy="140" r="2.5" fill={OUTLINE} />
            {/* Anchor points */}
            <Anchor x={32} y={75} />
            <Anchor x={80} y={27} />
            <Anchor x={128} y={75} />
            <Anchor x={80} y={123} />
            <Anchor x={120} y={30} />
            <Anchor x={200} y={120} />
            <Anchor x={120} y={120} />
            <Anchor x={40} y={125} />
            <Anchor x={200} y={115} />
          </g>
        </svg>
      </div>
    </div>
  );
}
