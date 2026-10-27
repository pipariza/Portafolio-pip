import type { Metadata } from "next";
import { SITE_URL } from "@/lib/config";
import { locales, type Bi, type Locale } from "@/lib/i18n/config";
import { localizeHref } from "@/lib/i18n/routes";

const OG_LOCALE: Record<Locale, string> = { es: "es_CO", en: "en_US" };

/** Title and description of each page, in both languages (the text a search engine and a shared link show). */
export const PAGES = {
  home: {
    path: "/",
    title: { es: "Pip Ariza — Diseño & Desarrollo Web", en: "Pip Ariza — Web Design & Development" },
    description: {
      es: "Pip Ariza (Duvan Felipe Colmenares Ariza): diseñador y desarrollador web con foco en aplicativos con IA y edición de video. Disponible para trabajo remoto.",
      en: "Pip Ariza (Duvan Felipe Colmenares Ariza): web designer and developer focused on AI-powered apps and video editing. Available for remote work.",
    },
  },
  work: {
    path: "/work",
    title: { es: "Work — Pip Ariza", en: "Work — Pip Ariza" },
    description: {
      es: "Proyectos de diseño y desarrollo web de Pip Ariza: tiendas Shopify, sitios en WordPress y marcas como Visual Living, El Departamento y Feria EVA.",
      en: "Web design and development projects by Pip Ariza: Shopify stores, WordPress sites and brands like Visual Living, El Departamento and Feria EVA.",
    },
  },
  apps: {
    path: "/apps",
    title: { es: "Aplicativos — Pip Ariza", en: "Apps — Pip Ariza" },
    description: {
      es: "Escritorio interactivo de Pip Ariza: aplicativos con IA, CV, piezas de diseño y contacto. Abre cada ícono para ver su ventana.",
      en: "Pip Ariza's interactive desktop: AI-powered apps, resume, design pieces and contact. Open each icon to see its window.",
    },
  },
  video: {
    path: "/video",
    title: { es: "Edición de Video — Pip Ariza", en: "Video Editing — Pip Ariza" },
    description: {
      es: "Edición de video vertical y motion de Pip Ariza: reels y clips para marcas como Bilongo, Ajisen y Tío Mao.",
      en: "Vertical video editing and motion by Pip Ariza: reels and clips for brands like Bilongo, Ajisen and Tío Mao.",
    },
  },
  about: {
    path: "/about",
    title: { es: "About — Pip Ariza", en: "About — Pip Ariza" },
    description: {
      es: "Quién es Pip Ariza (Duvan Felipe Colmenares Ariza): más de tres años en diseño y desarrollo web, e-commerce, pauta digital y edición de video, desde Bogotá.",
      en: "Who Pip Ariza (Duvan Felipe Colmenares Ariza) is: over three years in web design and development, e-commerce, digital advertising and video editing, from Bogotá.",
    },
  },
  contact: {
    path: "/contacto",
    title: { es: "Contacto — Pip Ariza", en: "Contact — Pip Ariza" },
    description: {
      es: "Contacta a Pip Ariza: escribe por correo, WhatsApp, LinkedIn o Instagram, o usa el formulario. Respuesta en menos de 48 horas.",
      en: "Contact Pip Ariza: write by email, WhatsApp, LinkedIn or Instagram, or use the form. Reply within 48 hours.",
    },
  },
} satisfies Record<string, { path: string; title: Bi; description: Bi }>;

/**
 * Metadata of a page in a language: title, description, the Open Graph / Twitter copies, the
 * canonical address and the other language's address (hreflang). A page's `openGraph`
 * replaces the layout's whole, so the site-wide fields are repeated here.
 */
export function metadataFor(lang: Locale, path: string, title: string, description: string): Metadata {
  const url = localizeHref(path, lang);
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        es: localizeHref(path, "es"),
        en: localizeHref(path, "en"),
        "x-default": localizeHref(path, "es"),
      },
    },
    openGraph: {
      type: "website",
      locale: OG_LOCALE[lang],
      alternateLocale: locales.filter((l) => l !== lang).map((l) => OG_LOCALE[l]),
      siteName: "Pip Ariza",
      title,
      description,
      url,
    },
    twitter: { card: "summary", title, description },
  };
}

export function pageMetadata(lang: Locale, key: keyof typeof PAGES): Metadata {
  const page = PAGES[key];
  return metadataFor(lang, page.path, page.title[lang], page.description[lang]);
}

export { SITE_URL };
