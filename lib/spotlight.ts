/** The menu bar's magnifier (and the phone menu) ask the Spotlight window to open through this event. */
export const OPEN_SPOTLIGHT = "open-spotlight";

export function openSpotlight() {
  window.dispatchEvent(new Event(OPEN_SPOTLIGHT));
}
