import type { DemoId } from "@/lib/data";

/** The white line icon on the desktop tile of each app with a demo (Tareas, Cronogramas, Asistente IA). */
export function AppGlyph({ demo, size }: { demo: DemoId; size: number }) {
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
  if (demo === "tareas")
    return (
      <svg {...common}>
        <rect x="4" y="4" width="16" height="16" rx="2.5" />
        <path d="m8 12.2 2.6 2.6L16 9.4" />
      </svg>
    );
  if (demo === "cronogramas")
    return (
      <svg {...common}>
        <rect x="3.5" y="3.5" width="17" height="17" rx="2" />
        <path d="M9.2 3.5v17M14.8 3.5v17M3.5 9.2h17M3.5 14.8h17" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v6a2.5 2.5 0 0 1-2.5 2.5H11l-3.5 3v-3A2.5 2.5 0 0 1 5 12.5z" />
      <path d="M12 7.2v3.6M10.2 9h3.6" />
    </svg>
  );
}
