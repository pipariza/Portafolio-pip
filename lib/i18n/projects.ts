import { appData, projectData, type AppProject, type Project } from "@/lib/data";
import type { Bi, Locale } from "./config";

/*
 * The texts of the projects, in both languages, next to each other: change a text here in
 * Spanish and in English at the same time. `getProjects(lang)` joins them with the data that
 * does not depend on the language (lib/data.ts).
 */
const CREDIT: Bi = {
  es: "El contenido audiovisual es propiedad de cada marca.",
  en: "The audiovisual content belongs to each brand.",
};
const WEB_ROLE: Bi = { es: "Diseño & Desarrollo web", en: "Web Design & Development" };

const PROJECT_TEXTS: Record<string, { role: Bi; summary: Bi }> = {
  "visual-living": {
    role: WEB_ROLE,
    summary: {
      es: "Sitio de una casa de diseño audiovisual en Bogotá. El video abre la página, una sola frase grande ordena todo lo demás y la navegación flota abajo, igual de ligera en el celular y en el escritorio.",
      en: "Website of an audiovisual design house in Bogotá. A video opens the page, one big sentence organizes everything else, and the navigation floats at the bottom, just as light on a phone as on a desktop.",
    },
  },
  "el-departamento": {
    role: WEB_ROLE,
    summary: {
      es: "Sitio de El Departamento (DPTO), casa creativa para marcas, plataformas y talento del entretenimiento. Un video a pantalla completa abre la página, los proyectos destacados se mueven por sí solos y todo se recorre con calma, con mucho aire entre secciones.",
      en: "Website of El Departamento (DPTO), a creative house for brands, platforms and entertainment talent. A full-screen video opens the page, the featured projects move on their own and everything is browsed calmly, with plenty of air between sections.",
    },
  },
  "el-costurero-de-meme": {
    role: WEB_ROLE,
    summary: {
      es: "Tienda en línea de muñecos de tela y crochet hechos a mano en Colombia. Una portada cálida, colecciones por mundos (bebés, granja, selva), fichas de producto claras y la historia del taller como parte de la compra.",
      en: "Online store of handmade fabric and crochet dolls made in Colombia. A warm cover page, collections by worlds (babies, farm, jungle), clear product pages and the workshop's story as part of the purchase.",
    },
  },
  "mar-de-palma": {
    role: WEB_ROLE,
    summary: {
      es: "Tienda en línea de cosmética natural de Cartagena de Indias: jabones, cremas y velas con fragancias propias. Una portada que alterna producto y mar, fichas claras y videos que explican, con calma, de qué está hecho cada producto.",
      en: "Online store of natural cosmetics from Cartagena de Indias: soaps, creams and candles with their own fragrances. A cover page that alternates product and sea, clear product pages and videos that explain, calmly, what each product is made of.",
    },
  },
  "feria-eva": {
    role: WEB_ROLE,
    summary: {
      es: "Sitio de Feria EVA, un shopping festival con 8 años y 22 ediciones en Colombia. La portada de la edición del año, el recorrido por las ediciones anteriores, el pabellón EVA Home y la convocatoria para marcas, todo en un rosa suave y editorial.",
      en: "Website of Feria EVA, a shopping festival with 8 years and 22 editions in Colombia. The cover of this year's edition, a tour of the previous editions, the EVA Home pavilion and the call for brands, all in a soft, editorial pink.",
    },
  },
};

export function getProjects(lang: Locale): Project[] {
  return projectData.map((p) => {
    const text = PROJECT_TEXTS[p.slug];
    return { ...p, role: text.role[lang], summary: text.summary[lang], note: CREDIT[lang] };
  });
}

// Placeholder apps of the Apps page: their texts will be replaced by the real ones.
const APP_TEXTS: Record<string, { role: Bi; description: Bi }> = {
  "app-uno": {
    role: { es: "Producto & Desarrollo", en: "Product & Development" },
    description: {
      es: "Aplicativo con IA para automatizar reportes internos a partir de datos crudos.",
      en: "AI app that automates internal reports from raw data.",
    },
  },
  "app-dos": {
    role: { es: "Desarrollo Full-stack", en: "Full-stack Development" },
    description: {
      es: "Asistente conversacional para soporte de primer nivel.",
      en: "Conversational assistant for first-level support.",
    },
  },
  "app-tres": {
    role: { es: "Producto & Diseño", en: "Product & Design" },
    description: {
      es: "Generador de propuestas comerciales asistido por IA.",
      en: "AI-assisted commercial proposal generator.",
    },
  },
  "app-cuatro": {
    role: { es: "Desarrollo Front-end", en: "Front-end Development" },
    description: {
      es: "Dashboard de analítica con resúmenes generados por IA.",
      en: "Analytics dashboard with AI-generated summaries.",
    },
  },
  "app-cinco": {
    role: { es: "Producto & Desarrollo", en: "Product & Development" },
    description: {
      es: "Herramienta de clasificación automática de contenido.",
      en: "Automatic content classification tool.",
    },
  },
};

export function getApps(lang: Locale): AppProject[] {
  return appData.map((a) => {
    const text = APP_TEXTS[a.slug];
    return { ...a, role: text.role[lang], description: text.description[lang] };
  });
}
