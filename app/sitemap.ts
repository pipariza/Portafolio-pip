import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";
import { projectData } from "@/lib/data";
import { locales } from "@/lib/i18n/config";
import { localizeHref } from "@/lib/i18n/routes";

// The main pages and each Work project (the Apps detail pages are still placeholders).
const PATHS = [
  "/",
  "/work",
  ...projectData.map((project) => `/work/${project.slug}`),
  "/apps",
  "/video",
  "/about",
  "/contacto",
];

// Every page in both languages, each one pointing to its twin (hreflang).
export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.flatMap((path) =>
    locales.map((lang) => ({
      url: `${SITE_URL}${localizeHref(path, lang).replace(/^\/$/, "")}`,
      changeFrequency: "monthly" as const,
      priority: path === "/" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${SITE_URL}${localizeHref(path, l).replace(/^\/$/, "")}`]),
        ),
      },
    })),
  );
}
