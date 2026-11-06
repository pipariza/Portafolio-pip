"use client";

import { useLocale } from "@/components/LocaleProvider";

import { useState } from "react";

type Mode = "preview" | "outline";

const OUTLINE = "#2f6fe4";
const shapeTransition = "fill 0.35s ease, stroke 0.35s ease, stroke-width 0.35s ease";

/** Anchor point square, drawn only in the outline view. */
function Anchor({ x, y }: { x: number; y: number }) {
  return <rect x={x - 2.8} y={y - 2.8} width="5.6" height="5.6" fill="#fff" stroke={OUTLINE} strokeWidth="1.1" />;
}

type Pt = [number, number];

/*
 * The mark of "Pulpa" (a juice brand concept): a citrus slice, a ring of six wedges and a leaf.
 * The geometry is computed once; the wedges and the leaf are real paths, so the outline view
 * shows their anchor points (and the Bézier handles of the leaf).
 */
const CX = 112;
const CY = 98;
const R = 46;
const WEDGES = 6;
const GAP = (Math.PI / 180) * 8;
const INNER = R * 0.24;
const OUTER = R * 0.8;
const at = (r: number, a: number): Pt => [CX + r * Math.cos(a), CY + r * Math.sin(a)];
const f = (n: number) => n.toFixed(2);

const WEDGE_POINTS = Array.from({ length: WEDGES }, (_, i) => {
  const a0 = -Math.PI / 2 + (i * 2 * Math.PI) / WEDGES + GAP;
  const a1 = -Math.PI / 2 + ((i + 1) * 2 * Math.PI) / WEDGES - GAP;
  const p1 = at(INNER, a0);
  const p2 = at(OUTER, a0);
  const p3 = at(OUTER, a1);
  const p4 = at(INNER, a1);
  return {
    d: `M${f(p1[0])} ${f(p1[1])} L${f(p2[0])} ${f(p2[1])} A${f(OUTER)} ${f(OUTER)} 0 0 1 ${f(p3[0])} ${f(p3[1])} L${f(p4[0])} ${f(p4[1])} Z`,
    anchors: [p1, p2, p3, p4],
  };
});

const LEAF = {
  a: [CX + R * 0.3, CY - R * 0.94] as Pt,
  b: [CX + R * 1.12, CY - R * 1.4] as Pt,
  h1: [CX + R * 0.4, CY - R * 1.5] as Pt,
  h2: [CX + R * 0.96, CY - R * 1.62] as Pt,
  h3: [CX + R * 1.18, CY - R * 1.08] as Pt,
  h4: [CX + R * 0.76, CY - R * 0.9] as Pt,
};
const LEAF_D = `M${LEAF.a.map(f)} C${LEAF.h1.map(f)} ${LEAF.h2.map(f)} ${LEAF.b.map(f)} C${LEAF.h3.map(f)} ${LEAF.h4.map(f)} ${LEAF.a.map(f)} Z`;

const ANCHORS: Pt[] = [
  at(R, 0),
  at(R, Math.PI / 2),
  at(R, Math.PI),
  at(R, -Math.PI / 2),
  ...WEDGE_POINTS.flatMap((w) => w.anchors),
  LEAF.a,
  LEAF.b,
];

/**
 * The "Pulpa" mark that flips between the finished artwork and its outline (paths, anchor
 * points and Bézier handles), like Illustrator's Preview / Outline views.
 */
export default function VectorToggle() {
  const { tr } = useLocale();
  const [mode, setMode] = useState<Mode>("preview");
  const outline = mode === "outline";

  const shape = (fill: string, stroke?: { color: string; width: number }) => ({
    fill: outline ? "transparent" : fill,
    stroke: outline ? OUTLINE : (stroke?.color ?? "transparent"),
    strokeWidth: outline ? 1.2 : (stroke?.width ?? 0),
    strokeLinejoin: "round" as const,
    transition: shapeTransition,
  });

  return (
    <div>
      <div
        role="group"
        aria-label={tr("Vista", "View")}
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
            {m === "preview" ? tr("Vista previa", "Preview") : tr("Trazado", "Outline")}
          </button>
        ))}
      </div>

      <div
        className="aspect-[16/10] w-full max-w-md overflow-hidden rounded-md bg-[#fff3dc] ring-1 ring-black/10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(15,61,46,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(15,61,46,0.06) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        <svg viewBox="0 0 240 150" className="h-full w-full" role="img" aria-label={tr("Marca de Pulpa", "Pulpa mark")}>
          {/* Rind */}
          <circle cx={CX} cy={CY} r={R} style={shape("#ff4f9a")} />
          {/* Wedges */}
          {WEDGE_POINTS.map((w) => (
            <path key={w.d} d={w.d} style={shape("#ff8a1f", { color: "#ff8a1f", width: 3 })} />
          ))}
          {/* Heart */}
          <circle cx={CX} cy={CY} r={R * 0.12} style={shape("#fff3dc")} />
          {/* Leaf */}
          <path d={LEAF_D} style={shape("#16a34a")} />

          <g style={{ opacity: outline ? 1 : 0, transition: "opacity 0.35s ease" }}>
            {/* Bézier handles of the leaf */}
            <g stroke={OUTLINE} strokeWidth="1">
              <line x1={LEAF.a[0]} y1={LEAF.a[1]} x2={LEAF.h1[0]} y2={LEAF.h1[1]} />
              <line x1={LEAF.b[0]} y1={LEAF.b[1]} x2={LEAF.h2[0]} y2={LEAF.h2[1]} />
              <line x1={LEAF.b[0]} y1={LEAF.b[1]} x2={LEAF.h3[0]} y2={LEAF.h3[1]} />
              <line x1={LEAF.a[0]} y1={LEAF.a[1]} x2={LEAF.h4[0]} y2={LEAF.h4[1]} />
            </g>
            {[LEAF.h1, LEAF.h2, LEAF.h3, LEAF.h4].map(([x, y]) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="2.4" fill={OUTLINE} />
            ))}
            {/* Anchor points */}
            {ANCHORS.map(([x, y]) => (
              <Anchor key={`${x}-${y}`} x={x} y={y} />
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
}
