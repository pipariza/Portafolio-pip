import type { MetadataRoute } from "next";

/*
 * Makes the site installable ("Add to home screen" / "Install app"): it opens full screen, with no browser
 * bar, like an app. There is no service worker on purpose: the install works without one and the site
 * always loads the latest published version (nothing stale cached on the phone).
 * Spanish is the default language, so the app opens at "/" (the English pages are reached from the site).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Pip Ariza — Diseño & Desarrollo Web",
    short_name: "Pip Ariza",
    description: "Portafolio de Pip Ariza: diseño y desarrollo web, aplicativos con IA y edición de video.",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    // Same cream as the site's menu bar, so the app frame and the launch screen match the page.
    background_color: "#f6f4f0",
    theme_color: "#f6f4f0",
    lang: "es",
    icons: [
      { src: "/pwa/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/pwa/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      // Android crops the icon to its own shape: this one keeps the eye inside the safe area.
      { src: "/pwa/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
