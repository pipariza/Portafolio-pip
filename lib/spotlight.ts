import { useSyncExternalStore } from "react";

/** The menu bar's magnifier (and the phone menu) ask the Spotlight window to open through this event. */
export const OPEN_SPOTLIGHT = "open-spotlight";

export function openSpotlight() {
  window.dispatchEvent(new Event(OPEN_SPOTLIGHT));
}

// The shortcut is ⌘K on a Mac and Ctrl K elsewhere; the server renders the Mac one and the browser corrects it.
const subscribeNothing = () => () => {};
const shortcutNow = () => (/Mac|iPhone|iPad/.test(navigator.platform) ? "⌘K" : "Ctrl K");
export function useSpotlightShortcut() {
  return useSyncExternalStore(subscribeNothing, shortcutNow, () => "⌘K");
}
