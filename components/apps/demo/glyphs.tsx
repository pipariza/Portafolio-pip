import type { GlyphId } from "@/lib/data";

/** The white line icon on the desktop tile of each real app (Tareas, Cronogramas, Macros). */
export function AppGlyph({ glyph, size }: { glyph: GlyphId; size: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (glyph === "macros")
    return (
      <svg {...common}>
        <path d="M12 3.2a8.8 8.8 0 1 1-8.8 8.8" />
        <path d="M12 7.6a4.4 4.4 0 1 1-4.4 4.4" />
        <circle cx="12" cy="12" r="0.9" fill="currentColor" />
      </svg>
    );
  if (glyph === "tareas")
    return (
      <svg {...common}>
        <rect x="4" y="4" width="16" height="16" rx="2.5" />
        <path d="m8 12.2 2.6 2.6L16 9.4" />
      </svg>
    );
  return (
    <svg {...common}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="2" />
      <path d="M9.2 3.5v17M14.8 3.5v17M3.5 9.2h17M3.5 14.8h17" />
    </svg>
  );
}
