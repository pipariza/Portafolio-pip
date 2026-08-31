export type Project = {
  slug: string;
  name: string;
  role: string;
  year: string;
  stack: string;
  category: "diseno-web" | "aplicativos";
  summary: string;
  color: string;
  /** Path under /public, e.g. "/work/proyecto-uno.jpg". Falls back to `color` when unset. */
  image?: string;
};

export const projects: Project[] = [
  {
    slug: "proyecto-uno",
    name: "Proyecto Uno",
    role: "Diseño & Desarrollo",
    year: "2025",
    stack: "Next.js, Tailwind",
    category: "diseno-web",
    summary:
      "Sitio a medida para una marca que necesitaba una presencia digital clara y rápida.",
    color: "#3a3a38",
  },
  {
    slug: "proyecto-dos",
    name: "Proyecto Dos",
    role: "Diseño UI",
    year: "2025",
    stack: "Figma, Webflow",
    category: "diseno-web",
    summary: "Rediseño de e-commerce enfocado en conversión y velocidad.",
    color: "#2f2f2d",
  },
  {
    slug: "proyecto-tres",
    name: "Proyecto Tres",
    role: "Desarrollo Front-end",
    year: "2024",
    stack: "React, Framer Motion",
    category: "diseno-web",
    summary: "Landing interactiva con animaciones de scroll a medida.",
    color: "#43423e",
  },
  {
    slug: "proyecto-cuatro",
    name: "Proyecto Cuatro",
    role: "Diseño & Desarrollo",
    year: "2024",
    stack: "Next.js, Sanity",
    category: "diseno-web",
    summary: "Portafolio editorial con CMS headless para un estudio creativo.",
    color: "#383734",
  },
  {
    slug: "proyecto-cinco",
    name: "Proyecto Cinco",
    role: "Diseño UI/UX",
    year: "2024",
    stack: "Figma, Next.js",
    category: "diseno-web",
    summary: "Plataforma interna de gestión con foco en usabilidad.",
    color: "#2c2c2a",
  },
];

export type AppProject = {
  slug: string;
  name: string;
  label: string;
  description: string;
  role: string;
  year: string;
  stack: string;
  rotation: number;
  color: string;
  /** Path under /public, e.g. "/apps/app-uno.jpg". Falls back to `color` when unset. */
  image?: string;
};

export const apps: AppProject[] = [
  {
    slug: "app-uno",
    name: "App Uno",
    label: "APP UNO",
    description:
      "Aplicativo con IA para automatizar reportes internos a partir de datos crudos.",
    role: "Producto & Desarrollo",
    year: "2025",
    stack: "Next.js, OpenAI API, Postgres",
    rotation: -6,
    color: "#35342f",
  },
  {
    slug: "app-dos",
    name: "App Dos",
    label: "APP DOS",
    description: "Asistente conversacional para soporte de primer nivel.",
    role: "Desarrollo Full-stack",
    year: "2025",
    stack: "Next.js, Vercel AI SDK",
    rotation: 4,
    color: "#3d3b36",
  },
  {
    slug: "app-tres",
    name: "App Tres",
    label: "APP TRES",
    description: "Generador de propuestas comerciales asistido por IA.",
    role: "Producto & Diseño",
    year: "2024",
    stack: "React, Node, Claude API",
    rotation: -3,
    color: "#2e2d2b",
  },
  {
    slug: "app-cuatro",
    name: "App Cuatro",
    label: "APP CUATRO",
    description: "Dashboard de analítica con resúmenes generados por IA.",
    role: "Desarrollo Front-end",
    year: "2024",
    stack: "Next.js, Tailwind, Recharts",
    rotation: 5,
    color: "#403f3a",
  },
  {
    slug: "app-cinco",
    name: "App Cinco",
    label: "APP CINCO",
    description: "Herramienta de clasificación automática de contenido.",
    role: "Producto & Desarrollo",
    year: "2024",
    stack: "Python, FastAPI, Next.js",
    rotation: -5,
    color: "#33322e",
  },
];

export type VideoClip = {
  id: string;
  title: string;
  vimeoId: string | null;
  color: string;
};

export const videoClips: VideoClip[] = [
  { id: "clip-1", title: "Tío Mao — Reverse", vimeoId: "1186782588", color: "#5a5a52" },
  { id: "clip-2", title: "Ajisen — Trend 2", vimeoId: "1186781699", color: "#3f3f39" },
  { id: "clip-3", title: "Bilongo — 2026", vimeoId: "1186781746", color: "#6b6b60" },
  { id: "clip-4", title: "Ajisen — Amigos", vimeoId: "1186781697", color: "#47463f" },
  { id: "clip-5", title: "Bilongo — Canciones que recuerdan", vimeoId: "1186781812", color: "#565549" },
  { id: "clip-6", title: "Bilongo — Ritual", vimeoId: "1186781821", color: "#4d4c45" },
  { id: "clip-7", title: "Bilongo — Síguelo", vimeoId: "1186782117", color: "#3a3934" },
  { id: "clip-8", title: "Ajisen — Recap", vimeoId: "1186781696", color: "#605f54" },
  { id: "clip-9", title: "Tío Mao — Caras", vimeoId: "1186782407", color: "#44433c" },
  { id: "clip-10", title: "Tío Mao — Dim Sum Mix", vimeoId: "1186782573", color: "#57564c" },
];
