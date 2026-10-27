import { SOFT_GRAY, wallpaperStyle } from "@/components/mac/wallpaper";

/*
 * The zoom transition between the home desktop and the pages, like an app opening and
 * closing.
 *
 * In: the home stores the center of the icon you clicked (`setZoomOrigin`); the template
 * of the next page (app/template.tsx) reads it to grow from there.
 * Out: a link that goes home calls `zoomOutThen`, which shrinks the current page toward
 * the icon it came from before navigating; the home then fades in (`cameFromSection`).
 *
 * Module variables on purpose: they only have to survive client-side navigations, and
 * they are empty on a hard load, so the server and the first client render agree.
 */
export type ZoomOrigin = { x: number; y: number };

let pending: ZoomOrigin | null = null;
let lastPath: string | null = null;
let exiting = false;
const origins: Record<string, ZoomOrigin> = {};

// "/work/el-departamento" belongs to the "/work" icon.
const section = (path: string) => `/${path.split("/")[1] ?? ""}`;

export const setZoomOrigin = (origin: ZoomOrigin, href: string) => {
  pending = origin;
  origins[section(href)] = origin;
};
/** Read without clearing: render has to stay pure (React may render twice). */
export const peekZoomOrigin = () => pending;
export const clearZoomOrigin = () => {
  pending = null;
};

/** The template records the page it just mounted, so the home knows where you came from. */
export const trackPath = (path: string) => {
  lastPath = path;
};
/** True when the home is reached from another page of the site (not on a hard load). */
export const cameFromSection = () => lastPath !== null && lastPath !== "/";

const BACKDROP_ID = "zoom-backdrop";

export function removeZoomBackdrop() {
  document.getElementById(BACKDROP_ID)?.remove();
}

/**
 * Shrinks the current page toward the icon it was opened from (or the middle of the
 * screen), over the home's wallpaper, then calls `go` to navigate. Without motion
 * (reduced motion, no Web Animations) it just calls `go`.
 */
export function zoomOutThen(fromPath: string, go: () => void) {
  const main = document.querySelector("main");
  if (
    exiting ||
    !(main instanceof HTMLElement) ||
    typeof main.animate !== "function" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    go();
    return;
  }
  exiting = true;
  const origin = origins[section(fromPath)] ?? { x: window.innerWidth / 2, y: window.innerHeight * 0.45 };

  removeZoomBackdrop();
  const backdrop = document.createElement("div");
  backdrop.id = BACKDROP_ID;
  backdrop.setAttribute("aria-hidden", "true");
  // Below the page (z-index -1), above the canvas: it is what shows around the shrinking page.
  backdrop.style.cssText = `position:fixed;inset:0;z-index:-1;pointer-events:none;background:${wallpaperStyle(SOFT_GRAY).background}`;
  main.parentElement?.insertBefore(backdrop, main);

  main.style.transformOrigin = `${origin.x}px ${origin.y + window.scrollY}px`;
  const finish = () => {
    exiting = false;
    go();
  };
  main
    .animate(
      [
        { transform: "scale(1)", opacity: 1 },
        { transform: "scale(0.8)", opacity: 0 },
      ],
      { duration: 320, easing: "cubic-bezier(0.5, 0, 0.75, 0)", fill: "forwards" },
    )
    .finished.then(finish, finish);
}
