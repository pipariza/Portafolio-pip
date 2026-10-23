/** An uncropped capture: path under /public plus its pixel size. */
export type ShotImage = { src: string; width: number; height: number };

export type ProjectScreen = {
  id: string;
  /** Tab label. */
  label: string;
  /** Path shown in the browser bar, e.g. "/pages/somos" ("" for the home page). */
  path: string;
  desktop: ShotImage;
  mobile: ShotImage;
};

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
  /**
   * Full-page captures of the finished site, one per page (the first is shown
   * first). When set, the project uses the device showcase layout instead of a
   * cover image.
   */
  screens?: ProjectScreen[];
  /** Live site, shown as a "Ver sitio" link. */
  url?: string;
};

export const projects: Project[] = [
  {
    slug: "visual-living",
    name: "Visual Living",
    role: "Diseño & Desarrollo web",
    year: "2025",
    stack: "Shopify",
    category: "diseno-web",
    summary:
      "Sitio de una casa de diseño audiovisual en Bogotá. El video abre la página, una sola frase grande ordena todo lo demás y la navegación flota abajo, igual de ligera en el celular y en el escritorio.",
    color: "#e3e0d8",
    url: "https://www.visualliving.co/",
    screens: [
      {
        id: "inicio",
        label: "Inicio",
        path: "",
        desktop: { src: "/work/visual-living/inicio-desktop.jpg", width: 1600, height: 1333 },
        mobile: { src: "/work/visual-living/inicio-mobile.jpg", width: 750, height: 1624 },
      },
      {
        id: "somos",
        label: "Somos",
        path: "/pages/somos",
        desktop: { src: "/work/visual-living/somos-desktop.jpg", width: 1600, height: 1664 },
        mobile: { src: "/work/visual-living/somos-mobile.jpg", width: 750, height: 1624 },
      },
      {
        id: "archivos",
        label: "Archivos",
        path: "/pages/archivos",
        desktop: { src: "/work/visual-living/archivos-desktop.jpg", width: 1600, height: 1082 },
        mobile: { src: "/work/visual-living/archivos-mobile.jpg", width: 750, height: 1624 },
      },
      {
        id: "servicios",
        label: "Servicios",
        path: "/pages/servicios",
        desktop: { src: "/work/visual-living/servicios-desktop.jpg", width: 1600, height: 1595 },
        mobile: { src: "/work/visual-living/servicios-mobile.jpg", width: 750, height: 1624 },
      },
      {
        id: "marcas",
        label: "Marcas",
        path: "/pages/marcas",
        desktop: { src: "/work/visual-living/marcas-desktop.jpg", width: 1600, height: 2695 },
        mobile: { src: "/work/visual-living/marcas-mobile.jpg", width: 750, height: 4710 },
      },
    ],
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
  /** Vimeo thumbnail (oEmbed `thumbnail_url`); shown while the player loads. */
  poster?: string;
  color: string;
};

export const videoClips: VideoClip[] = [
  { id: "clip-1", title: "Tío Mao — Reverse", vimeoId: "1186782588", poster: "https://i.vimeocdn.com/video/2153279007-c32ffd2cdd81ac414fc704818e80e50c33f0e5eb1530c0231a5887616b82f897-d_640?region=us", color: "#5a5a52" },
  { id: "clip-2", title: "Ajisen — Trend 2", vimeoId: "1186781699", poster: "https://i.vimeocdn.com/video/2153294434-323467cf1710d1bfa87349690713e048894440cb555eabd3066db6c2606d46fc-d_640?region=us", color: "#3f3f39" },
  { id: "clip-3", title: "Bilongo — 2026", vimeoId: "1186781746", poster: "https://i.vimeocdn.com/video/2153294285-0aceb9497475dd7844f14a60f68ae4ce86f8672b68068a3a747687f1f0429e11-d_640?region=us", color: "#6b6b60" },
  { id: "clip-4", title: "Ajisen — Amigos", vimeoId: "1186781697", poster: "https://i.vimeocdn.com/video/2153294149-6250b5c87128b7128ffed65c479aa5ba046e2d47a095715bad7492a39218b242-d_640?region=us", color: "#47463f" },
  { id: "clip-5", title: "Bilongo — Canciones que recuerdan", vimeoId: "1186781812", poster: "https://i.vimeocdn.com/video/2153294000-f45d06a6ccaaaebe381f42e940cfb04f79498471d78e704de7b1c2e609948b6d-d_640?region=us", color: "#565549" },
  { id: "clip-6", title: "Bilongo — Ritual", vimeoId: "1186781821", poster: "https://i.vimeocdn.com/video/2153285598-c97ffa6b257d38b43a523c6a5b210bdadb6b3371f543043b441e87d510af6e56-d_640?region=us", color: "#4d4c45" },
  { id: "clip-7", title: "Bilongo — Síguelo", vimeoId: "1186782117", poster: "https://i.vimeocdn.com/video/2153285386-fc1ac9d81254a57a084a84ef0fca7508d1594b61d525e1fab3b5b2cdb34cd159-d_640?region=us", color: "#3a3934" },
  { id: "clip-8", title: "Ajisen — Recap", vimeoId: "1186781696", poster: "https://i.vimeocdn.com/video/2153285206-9c11a1b0e9d95906dae5c32eb18a2250fb1ee4cbf1ca240d307f3b54f5c850c3-d_640?region=us", color: "#605f54" },
  { id: "clip-9", title: "Tío Mao — Caras", vimeoId: "1186782407", poster: "https://i.vimeocdn.com/video/2153285017-cf402cfc07bfbe5a4e3ded137b68f54796fb448577417116e53e31518a6c0b86-d_640?region=us", color: "#44433c" },
  { id: "clip-10", title: "Tío Mao — Dim Sum Mix", vimeoId: "1186782573", poster: "https://i.vimeocdn.com/video/2153283970-72e4cfe704116075bfbc8ee5bddbcb84857e5cca56b56bdaa9ded99b932d3eb4-d_640?region=us", color: "#57564c" },
];
