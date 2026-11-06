"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useLocale } from "@/components/LocaleProvider";
import type { AppProject } from "@/lib/data";
import { AppGlyph } from "./demo/glyphs";

// A tile is a flat color or, with `glass`, the see-through glass of the dock (the wallpaper is light).
function tileLook(app: AppProject) {
  return app.glass
    ? { className: "glass-pill border", attrs: { "data-theme": "light" } }
    : { className: "shadow-lg", attrs: { style: { background: app.color } } };
}

export function DesktopAppIcon({
  app,
  style,
}: {
  app: AppProject;
  style?: React.CSSProperties;
}) {
  const router = useRouter();
  const { href } = useLocale();
  const look = tileLook(app);

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.15}
      whileTap={{ cursor: "grabbing" }}
      onTap={() => router.push(href(`/apps/${app.slug}`))}
      className="absolute flex flex-col items-center gap-2 select-none touch-none"
      style={{ rotate: app.rotation, ...style }}
      data-cursor-hover
    >
      <div
        className={`relative flex h-[100px] w-20 items-center justify-center overflow-hidden rounded-[10px] text-white! ${look.className}`}
        {...look.attrs}
      >
        {app.image ? (
          <Image src={app.image} alt={app.name} fill sizes="80px" className="object-cover" />
        ) : (
          (app.glyph ?? app.demo) && <AppGlyph glyph={(app.glyph ?? app.demo)!} size={36} />
        )}
      </div>
      <span className="text-[11px] font-medium uppercase tracking-[0.05em] text-ink">
        {app.label}
      </span>
    </motion.div>
  );
}

export function GridAppIcon({ app }: { app: AppProject }) {
  const { href } = useLocale();
  const look = tileLook(app);
  return (
    <Link
      href={href(`/apps/${app.slug}`)}
      className="flex flex-col items-center gap-2"
      data-cursor-hover
    >
      <div
        className={`relative flex h-20 w-16 items-center justify-center overflow-hidden rounded-[10px] text-white! ${look.className}`}
        {...look.attrs}
      >
        {app.image ? (
          <Image src={app.image} alt={app.name} fill sizes="64px" className="object-cover" />
        ) : (
          (app.glyph ?? app.demo) && <AppGlyph glyph={(app.glyph ?? app.demo)!} size={30} />
        )}
      </div>
      <span className="text-[11px] font-medium uppercase tracking-[0.05em] text-ink text-center">
        {app.label}
      </span>
    </Link>
  );
}
