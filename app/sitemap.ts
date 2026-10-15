import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";

// Only the main pages; the per-project detail pages are placeholders for now.
const PATHS = ["", "/work", "/apps", "/video", "/about", "/contacto"];

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
