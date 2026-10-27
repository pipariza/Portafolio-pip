"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { EASE } from "@/components/mac/window";
import { SOFT_GRAY, wallpaperStyle } from "@/components/mac/wallpaper";
import { parsePathname } from "@/lib/i18n/routes";
import { clearZoomOrigin, peekZoomOrigin, removeZoomBackdrop, trackPath } from "@/lib/zoom";

/*
 * Wraps every page and starts over (a new key) when the section changes (/ → /work, not
 * /work → /work/mar-de-palma). When the home page sent you here by clicking an icon, the
 * new page grows from that icon (like an app opening); in any other case, and on a hard
 * load, it renders as is. While it grows, the home's wallpaper stays behind it so there is
 * no dark edge around the shrunken page. It also notes which page is showing (the home
 * fades in when you come back to it) and drops the wallpaper that the zoom out
 * (lib/zoom.ts) leaves behind.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const { path } = parsePathname(usePathname());
  const section = `/${path.split("/")[1] ?? ""}`;
  return (
    <ZoomIn key={section} path={path}>
      {children}
    </ZoomIn>
  );
}

function ZoomIn({ children, path }: { children: ReactNode; path: string }) {
  const reduce = useReducedMotion();
  const [origin] = useState(peekZoomOrigin);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    clearZoomOrigin();
    trackPath(path);
    const id = window.setTimeout(removeZoomBackdrop, 800);
    return () => window.clearTimeout(id);
  }, [path]);

  if (!origin) return <>{children}</>;

  return (
    <>
      {!settled && (
        <div aria-hidden="true" className="pointer-events-none fixed inset-0" style={wallpaperStyle(SOFT_GRAY)} />
      )}
      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: reduce ? 0.2 : 0.55, ease: EASE }}
        style={{ transformOrigin: `${origin.x}px ${origin.y}px` }}
        onAnimationComplete={() => setSettled(true)}
      >
        {children}
      </motion.div>
    </>
  );
}
