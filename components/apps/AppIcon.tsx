"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { AppProject } from "@/lib/data";

export function DesktopAppIcon({
  app,
  style,
}: {
  app: AppProject;
  style?: React.CSSProperties;
}) {
  const router = useRouter();

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.15}
      whileTap={{ cursor: "grabbing" }}
      onTap={() => router.push(`/apps/${app.slug}`)}
      className="absolute flex flex-col items-center gap-2 select-none touch-none"
      style={{ rotate: app.rotation, ...style }}
      data-cursor-hover
    >
      <div
        className="h-20 w-20 rounded-none shadow-lg flex items-center justify-center text-bone/80 text-base font-medium"
        style={{ background: app.color }}
      >
        {app.name.slice(0, 2).toUpperCase()}
      </div>
      <span className="text-[11px] font-medium uppercase tracking-[0.05em] text-ink">
        {app.label}
      </span>
    </motion.div>
  );
}

export function GridAppIcon({ app }: { app: AppProject }) {
  return (
    <a
      href={`/apps/${app.slug}`}
      className="flex flex-col items-center gap-2"
      data-cursor-hover
    >
      <div
        className="h-16 w-16 rounded-none shadow-lg flex items-center justify-center text-bone/80 text-sm font-medium"
        style={{ background: app.color }}
      >
        {app.name.slice(0, 2).toUpperCase()}
      </div>
      <span className="text-[11px] font-medium uppercase tracking-[0.05em] text-ink text-center">
        {app.label}
      </span>
    </a>
  );
}
