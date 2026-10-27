/*
 * The pages of this visit, so the menu bar's back arrow knows where "back" is. A page
 * reached again after the one before it counts as going back (that also covers the
 * browser's own back button). A plain module variable: it is empty after a reload, and
 * then the arrow falls back to the page "above" the current one.
 */
const stack: string[] = [];

const clean = (path: string) => path.split(/[?#]/)[0] || "/";

export function recordVisit(path: string) {
  const p = clean(path);
  if (stack[stack.length - 1] === p) return;
  if (stack.length >= 2 && stack[stack.length - 2] === p) stack.pop();
  else stack.push(p);
}

/** The page you were on before this one in this visit, if any. */
export const previousPath = () => (stack.length >= 2 ? stack[stack.length - 2] : null);

/** The page "above" this one: /work/mar-de-palma → /work, everything else → the home. */
export function parentPath(path: string) {
  const parts = clean(path).split("/").filter(Boolean);
  return parts.length > 1 ? `/${parts.slice(0, -1).join("/")}` : "/";
}
