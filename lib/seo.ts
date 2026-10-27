import type { Metadata } from "next";

/**
 * Metadata of a page: its own title and description (the layout's are the home's) plus the
 * Open Graph / Twitter copies and the canonical address. A page's `openGraph` replaces the
 * layout's whole, so the site-wide fields are repeated here.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", locale: "es_CO", siteName: "Pip Ariza", title, description, url: path },
    twitter: { card: "summary", title, description },
  };
}
