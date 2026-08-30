"use client";

import { useEffect, useRef } from "react";

const HOVER_SELECTOR = "a, button, [role='button'], input, select, textarea, [data-cursor-hover]";

export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ring = ringRef.current;
    if (!ring) return;

    const moveRing = (event: PointerEvent) => {
      ring.style.transform = `translate(${event.clientX}px, ${event.clientY}px) translate(-50%, -50%)`;
    };

    const setHover = (isHover: boolean) => {
      if (isHover) {
        ring.setAttribute("data-hover", "true");
      } else {
        ring.removeAttribute("data-hover");
      }
    };

    const onOver = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (target?.closest(HOVER_SELECTOR)) setHover(true);
    };

    const onOut = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (target?.closest(HOVER_SELECTOR)) setHover(false);
    };

    window.addEventListener("pointermove", moveRing);
    window.addEventListener("pointerover", onOver);
    window.addEventListener("pointerout", onOut);

    return () => {
      window.removeEventListener("pointermove", moveRing);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerout", onOut);
    };
  }, []);

  return <div ref={ringRef} className="cursor-ring" aria-hidden="true" />;
}
