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

// The apps of the Apps page. The first three are the real modules of Visual's internal
// platform (their step-by-step demo is in lib/i18n/app-demos.ts); the rest are placeholders
// whose texts will be replaced by the real ones.
const VISUAL_KICKER: Bi = { es: "Plataforma interna de Visual", en: "Visual's internal platform" };
const APP_TEXTS: Record<string, { role: Bi; description: Bi; kicker?: Bi; objective?: Bi }> = {
  tareas: {
    kicker: VISUAL_KICKER,
    objective: {
      es: "Que cada colaborador tenga su semana organizada y fácil de entender, con un seguimiento claro que mejore su experiencia de trabajo y la del admin, y sumar un asistente de IA que responde sobre el trabajo en curso.",
      en: "Give every collaborator a well-organized, easy-to-understand week, with clear follow-up that improves the work experience for them and for the admin, and add an AI assistant that answers questions about the work in progress.",
    },
    role: { es: "Producto & Desarrollo Full-stack", en: "Product & Full-stack Development" },
    description: {
      es: "Organiza el trabajo del equipo por semanas: el admin asigna, cada colaborador ve y avanza solo lo suyo, y el sistema avisa por correo antes de que algo venza.",
      en: "Organizes the team's work by week: the admin assigns, each collaborator sees and moves forward only their own tasks, and the system sends an email before anything is due.",
    },
  },
  cronogramas: {
    kicker: VISUAL_KICKER,
    objective: {
      es: "Ahorrarle tiempo al cliente y mejorar la experiencia de colaboradores y clientes al revisar contenido, con un programa liviano: se usa desde el navegador y el cliente entra con un link, sin crear cuenta.",
      en: "Save the client time and improve the experience of both collaborators and clients when reviewing content, with a lightweight program: it runs in the browser and the client joins with a link, without creating an account.",
    },
    role: { es: "Producto & Desarrollo Full-stack", en: "Product & Full-stack Development" },
    description: {
      es: "Planea las publicaciones de redes de cada marca en una grilla como la de Instagram. El cliente revisa, edita captions, deja notas y aprueba desde un link, sin crear cuenta.",
      en: "Plans each brand's social media posts on an Instagram-like grid. The client reviews, edits captions, leaves notes and approves from a link, without creating an account.",
    },
  },
  macros: {
    kicker: { es: "App instalable (PWA) con IA", en: "Installable app (PWA) with AI" },
    role: { es: "Producto & Desarrollo Full-stack con IA", en: "Product & Full-stack AI Development" },
    description: {
      es: "Planifica y registra las comidas de dos personas con los macros en gramos: recetas, plan semanal, lista de compras y progreso, todo desde un código de casa compartido, sin contraseñas.",
      en: "Plans and logs the meals of two people with macros in grams: recipes, weekly plan, shopping list and progress, all from a shared household code, with no passwords.",
    },
    objective: {
      es: "Que dos personas coman mejor sin complicarse: contar macros sin hojas de cálculo, convertir lo que hay en la despensa en recetas y dejar que la IA haga el trabajo pesado, como calcular un alimento o registrar una comida con solo describirla.",
      en: "Help two people eat better without the hassle: count macros without spreadsheets, turn what is in the pantry into recipes and let AI do the heavy lifting, like working out a food's macros or logging a meal just by describing it.",
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
    return { ...a, role: text.role[lang], description: text.description[lang], kicker: text.kicker?.[lang], objective: text.objective?.[lang] };
  });
}
