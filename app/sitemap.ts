import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";
import { projects } from "@/lib/data";

// The main pages and each Work project (the Apps detail pages are still placeholders).
const PATHS = [
  "",
  "/work",
  ...projects.map((project) => `/work/${project.slug}`),
  "/apps",
  "/video",
  "/about",
  "/contacto",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
