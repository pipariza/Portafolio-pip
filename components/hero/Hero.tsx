"use client";

import { useState } from "react";
import Link from "next/link";
import { ThemeSection } from "@/lib/section-theme";
import { CodeIcon, LayersIcon, PlayRectIcon } from "./icons";

const PANELS = [
  {
    n: "01",
    title: "Diseño Web",
    subtitle: "Interfaces & sitios",
    href: "/work",
    Icon: CodeIcon,
  },
  {
    n: "02",
    title: "Aplicativos Web",
    subtitle: "Productos con IA",
    href: "/apps",
    Icon: LayersIcon,
  },
  {
    n: "03",
    title: "Edición de Video",
    subtitle: "Reels & motion",
    href: "/video",
    Icon: PlayRectIcon,
  },
];

export default function Hero() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <ThemeSection
      theme="dark"
      id="inicio"
      className="relative flex flex-col md:flex-row w-full md:h-screen bg-void"
    >
      {PANELS.map((panel, i) => (
        <Link
          key={panel.n}
          href={panel.href}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
          style={{
            flexGrow: hovered === i ? 2.3 : 1,
            transition: "flex-grow 0.6s var(--ease-panel)",
          }}
          className="relative flex-none md:flex-1 md:basis-0 h-[70vh] md:h-full w-full overflow-hidden border-b md:border-b-0 md:border-r border-white/10 last:border-none group"
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 100% at 50% 0%, #232322 0%, #121211 60%, #0a0a0a 100%)",
            }}
          />
          <div className="absolute inset-0 tech-grid" />

          <panel.Icon className="absolute inset-0 m-auto h-[55%] w-[55%] text-white/[0.13] transition-transform duration-700 group-hover:scale-105" />

          {/* Below the menu bar: on a phone only the first panel reaches the top. */}
          <span
            className={`absolute left-6 top-6 text-xs font-medium tracking-[0.08em] text-bone/70 md:top-14 ${
              i === 0 ? "max-md:top-14" : ""
            }`}
          >
            {panel.n}
          </span>

          <div className="absolute bottom-8 left-6 right-6">
            <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-bone/60 mb-2">
              {panel.subtitle}
            </p>
            <h2 className="text-3xl md:text-4xl font-medium text-bone">
              {panel.title}
            </h2>
          </div>

          <span className="absolute bottom-8 right-6 flex h-11 w-11 items-center justify-center rounded-full border border-bone/30 text-bone transition-colors group-hover:border-bone/70">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 8h10m0 0L9 4m4 4l-4 4"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </Link>
      ))}
    </ThemeSection>
  );
}
