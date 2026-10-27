/*
 * Where a "zoom in" transition starts. The home page stores the center of the icon you
 * clicked; the template of the next page (app/template.tsx) reads it to grow from there.
 * A plain module variable on purpose: it only has to survive one client-side navigation,
 * and it is empty on a hard load, so the server and the first client render agree.
 */
export type ZoomOrigin = { x: number; y: number };

let pending: ZoomOrigin | null = null;

export const setZoomOrigin = (origin: ZoomOrigin) => {
  pending = origin;
};
/** Read without clearing: render has to stay pure (React may render twice). */
export const peekZoomOrigin = () => pending;
export const clearZoomOrigin = () => {
  pending = null;
};
