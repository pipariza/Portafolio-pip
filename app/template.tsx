"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASE } from "@/components/mac/window";
import { SOFT_GRAY, wallpaperStyle } from "@/components/mac/wallpaper";
import { clearZoomOrigin, peekZoomOrigin } from "@/lib/zoom";

/*
 * Every page change remounts this template. When the home page sent you here by
 * clicking an icon, the new page grows from that icon (like an app opening); in any
 * other case, and on a hard load, it renders as is. While it grows, the home's
 * wallpaper stays behind it so there is no dark edge around the shrunken page.
 */
export default function Template({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const [origin] = useState(peekZoomOrigin);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    clearZoomOrigin();
  }, []);

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
