/**
 * A video that plays over the spot where the page has one. Coordinates are in
 * the page's own CSS pixels at the width it was captured (see `pageWidth`),
 * so they follow the screenshot at any scale.
 */
export type ShotVideo = {
  /** Path under /public. */
  src: string;
  x: number;
  y: number;
  w: number;
  h: number;
  radius?: number;
  fit?: "cover" | "contain";
  /** Text the page draws over the video (the capture's own copy is hidden by the video). */
  label?: { text: string; size: number };
  /** Transparent image of everything the page draws over this video (logo, buttons, titles, shading). */
  overlay?: string;
  /** Top-right corner left uncovered, for the floating "Contacto" button that sits over the video. */
  notch?: { w: number; h: number };
};

/** An uncropped capture: path under /public plus its pixel size. */
export type ShotImage = {
  src: string;
  width: number;
  height: number;
  /** CSS width the capture was taken at, when it is not the default (1440 desktop, 500 mobile). */
  pageWidth?: number;
  videos?: ShotVideo[];
};

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
  /** Live site, shown as a "Ver sitio" link and in the browser bar. */
  url?: string;
  /** Multiplies how long the slow tour of each capture takes (default 1; higher is calmer). */
  tourPace?: number;
  /** Small credit line under the project text, e.g. who owns the media shown. */
  note?: string;
};

export const projects: Project[] = [
  {
    slug: "visual-living",
    name: "Visual Living",
    role: "Diseño & Desarrollo web",
    year: "2025",
    stack: "Shopify Development",
    category: "diseno-web",
    summary:
      "Sitio de una casa de diseño audiovisual en Bogotá. El video abre la página, una sola frase grande ordena todo lo demás y la navegación flota abajo, igual de ligera en el celular y en el escritorio.",
    color: "#e3e0d8",
    url: "https://www.visualliving.co/",
    note: "El contenido audiovisual es propiedad de cada marca.",
    screens: [
      {
        id: "inicio",
        label: "Inicio",
        path: "",
        desktop: {
          src: "/work/visual-living/inicio-desktop.jpg",
          width: 1600,
          height: 1333,
          videos: [
            { src: "/work/visual-living/video/inicio.mp4", x: 35, y: 134, w: 1370, h: 630, radius: 20, fit: "cover", notch: { w: 84, h: 6 } },
          ],
        },
        mobile: {
          src: "/work/visual-living/inicio-mobile.jpg",
          width: 750,
          height: 1624,
          videos: [
            { src: "/work/visual-living/video/inicio.mp4", x: 35, y: 86, w: 430, h: 242, radius: 20, fit: "contain", notch: { w: 72, h: 18 } },
          ],
        },
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
        desktop: {
          src: "/work/visual-living/archivos-desktop.jpg",
          width: 1600,
          height: 1082,
          videos: [
            { src: "/work/visual-living/video/archivos-reels.mp4", x: 480, y: 114, w: 480, h: 360, fit: "cover", label: { text: "Reels", size: 36 } },
            { src: "/work/visual-living/video/archivos-videoads.mp4", x: 0, y: 474, w: 480, h: 360, fit: "cover", label: { text: "Video ads", size: 36 } },
          ],
        },
        mobile: {
          src: "/work/visual-living/archivos-mobile.jpg",
          width: 750,
          height: 1624,
          videos: [
            { src: "/work/visual-living/video/archivos-reels.mp4", x: 250, y: 66, w: 250, h: 263, fit: "cover", label: { text: "Reels", size: 20 }, notch: { w: 107, h: 38 } },
            { src: "/work/visual-living/video/archivos-videoads.mp4", x: 250, y: 328, w: 250, h: 263, fit: "cover", label: { text: "Video ads", size: 20 } },
          ],
        },
      },
      {
        id: "servicios",
        label: "Servicios",
        path: "/pages/servicios",
        desktop: {
          src: "/work/visual-living/servicios-desktop.jpg",
          width: 1600,
          height: 1595,
          videos: [{ src: "/work/visual-living/video/servicios.mp4", x: 30, y: 594, w: 1380, h: 682, radius: 20, fit: "contain" }],
        },
        mobile: {
          src: "/work/visual-living/servicios-mobile.jpg",
          width: 750,
          height: 1624,
          videos: [{ src: "/work/visual-living/video/servicios.mp4", x: 30, y: 351, w: 440, h: 217, radius: 20, fit: "contain" }],
        },
      },
      {
        id: "marcas",
        label: "Marcas",
        path: "/pages/marcas",
        desktop: {
          src: "/work/visual-living/marcas-desktop.jpg",
          width: 1600,
          height: 2695,
          videos: [
            { src: "/work/visual-living/video/marcas.mp4", x: 35, y: 134, w: 1370, h: 677, radius: 20, fit: "contain", notch: { w: 84, h: 6 } },
          ],
        },
        mobile: {
          src: "/work/visual-living/marcas-mobile.jpg",
          width: 750,
          height: 4710,
          videos: [
            { src: "/work/visual-living/video/marcas.mp4", x: 35, y: 86, w: 430, h: 212, radius: 20, fit: "contain", notch: { w: 72, h: 18 } },
          ],
        },
      },
    ],
  },
  {
    slug: "el-departamento",
    name: "El Departamento",
    role: "Diseño & Desarrollo web",
    year: "2025",
    stack: "WordPress.org Development",
    category: "diseno-web",
    summary:
      "Sitio de El Departamento (DPTO), casa creativa para marcas, plataformas y talento del entretenimiento. Un video a pantalla completa abre la página, los proyectos destacados se mueven por sí solos y todo se recorre con calma, con mucho aire entre secciones.",
    color: "#e2e1de",
    url: "https://eldepartamento.tv/",
    tourPace: 1.9,
    note: "El contenido audiovisual es propiedad de cada marca.",
    screens: [
      {
        id: "inicio",
        label: "Inicio",
        path: "",
        desktop: {
          src: "/work/el-departamento/inicio-desktop.jpg",
          width: 1440,
          height: 4478,
          videos: [
            { src: "/work/el-departamento/video/banner-home-dpto.mp4", x: 0, y: 0, w: 1440, h: 900, fit: "cover", overlay: "/work/el-departamento/overlay/banner-home-dpto-home-desktop.webp" },
            { src: "/work/el-departamento/video/p1-cien-anos-de-soledad.mp4", x: 80, y: 1603, w: 1280, h: 240, fit: "cover", overlay: "/work/el-departamento/overlay/p1-cien-anos-de-soledad-home-desktop.webp" },
            { src: "/work/el-departamento/video/p2-sony.mp4", x: 80, y: 1859, w: 632, h: 240, fit: "cover", overlay: "/work/el-departamento/overlay/p2-sony-home-desktop.webp" },
            { src: "/work/el-departamento/video/p3-karol-g.mp4", x: 728, y: 1859, w: 416, h: 240, fit: "cover", overlay: "/work/el-departamento/overlay/p3-karol-g-home-desktop.webp" },
            { src: "/work/el-departamento/video/p4-griselda.mp4", x: 1160, y: 1859, w: 200, h: 240, fit: "cover", overlay: "/work/el-departamento/overlay/p4-griselda-home-desktop.webp" },
            { src: "/work/el-departamento/video/p5-rolos-vs-paisas-hotd-promo-s2-web.mp4", x: 80, y: 2115, w: 1280, h: 240, fit: "cover", overlay: "/work/el-departamento/overlay/p5-rolos-vs-paisas-hotd-promo-s2-web-home-desktop.webp" },
            { src: "/work/el-departamento/video/p6-sqtm-case-study-universal-web.mp4", x: 80, y: 2371, w: 308, h: 240, fit: "cover", overlay: "/work/el-departamento/overlay/p6-sqtm-case-study-universal-web-home-desktop.webp" },
            { src: "/work/el-departamento/video/p7-ojos-de-mujer-intro-entertainment-web.mp4", x: 404, y: 2371, w: 416, h: 240, fit: "cover", overlay: "/work/el-departamento/overlay/p7-ojos-de-mujer-intro-entertainment-web-home-desktop.webp" },
            { src: "/work/el-departamento/video/p8-netflix-star-power-base-web.mp4", x: 836, y: 2371, w: 524, h: 240, fit: "cover", overlay: "/work/el-departamento/overlay/p8-netflix-star-power-base-web-home-desktop.webp" },
            { src: "/work/el-departamento/video/loop-creative-solutions-and-design.mp4", x: 118, y: 3344, w: 375, h: 500, fit: "cover", overlay: "/work/el-departamento/overlay/loop-creative-solutions-and-design-home-desktop.webp" },
            { src: "/work/el-departamento/video/loop-live-action-and-social.mp4", x: 533, y: 3344, w: 375, h: 500, fit: "cover", overlay: "/work/el-departamento/overlay/loop-live-action-and-social-home-desktop.webp" },
            { src: "/work/el-departamento/video/loop-motion-and-post.mp4", x: 947, y: 3344, w: 375, h: 500, fit: "cover", overlay: "/work/el-departamento/overlay/loop-motion-and-post-home-desktop.webp" },
          ],
        },
        mobile: {
          src: "/work/el-departamento/inicio-mobile.jpg",
          width: 600,
          height: 9900,
          pageWidth: 390,
          videos: [
            { src: "/work/el-departamento/video/banner-home-dpto.mp4", x: 0, y: 0, w: 390, h: 844, fit: "cover", overlay: "/work/el-departamento/overlay/banner-home-dpto-home-mobile.webp" },
            { src: "/work/el-departamento/video/p1-cien-anos-de-soledad.mp4", x: 0, y: 1442, w: 390, h: 241, fit: "cover", overlay: "/work/el-departamento/overlay/p1-cien-anos-de-soledad-home-mobile.webp" },
            { src: "/work/el-departamento/video/p2-sony.mp4", x: 0, y: 1682, w: 390, h: 241, fit: "cover", overlay: "/work/el-departamento/overlay/p2-sony-home-mobile.webp" },
            { src: "/work/el-departamento/video/p3-karol-g.mp4", x: 0, y: 1922, w: 390, h: 241, fit: "cover", overlay: "/work/el-departamento/overlay/p3-karol-g-home-mobile.webp" },
            { src: "/work/el-departamento/video/p4-griselda.mp4", x: 0, y: 2162, w: 390, h: 241, fit: "cover", overlay: "/work/el-departamento/overlay/p4-griselda-home-mobile.webp" },
            { src: "/work/el-departamento/video/p5-rolos-vs-paisas-hotd-promo-s2-web.mp4", x: 0, y: 2402, w: 390, h: 241, fit: "cover", overlay: "/work/el-departamento/overlay/p5-rolos-vs-paisas-hotd-promo-s2-web-home-mobile.webp" },
            { src: "/work/el-departamento/video/p6-sqtm-case-study-universal-web.mp4", x: 0, y: 2642, w: 390, h: 241, fit: "cover", overlay: "/work/el-departamento/overlay/p6-sqtm-case-study-universal-web-home-mobile.webp" },
            { src: "/work/el-departamento/video/p7-ojos-de-mujer-intro-entertainment-web.mp4", x: 0, y: 2882, w: 390, h: 241, fit: "cover", overlay: "/work/el-departamento/overlay/p7-ojos-de-mujer-intro-entertainment-web-home-mobile.webp" },
            { src: "/work/el-departamento/video/p8-netflix-star-power-base-web.mp4", x: 0, y: 3122, w: 390, h: 241, fit: "cover", overlay: "/work/el-departamento/overlay/p8-netflix-star-power-base-web-home-mobile.webp" },
            { src: "/work/el-departamento/video/loop-creative-solutions-and-design.mp4", x: 39, y: 4218, w: 312, h: 416, fit: "cover", overlay: "/work/el-departamento/overlay/loop-creative-solutions-and-design-home-mobile.webp" },
            { src: "/work/el-departamento/video/loop-live-action-and-social.mp4", x: 39, y: 4687, w: 312, h: 416, fit: "cover", overlay: "/work/el-departamento/overlay/loop-live-action-and-social-home-mobile.webp" },
            { src: "/work/el-departamento/video/loop-motion-and-post.mp4", x: 39, y: 5157, w: 312, h: 416, fit: "cover", overlay: "/work/el-departamento/overlay/loop-motion-and-post-home-mobile.webp" },
          ],
        },
      },
      {
        id: "caso",
        label: "Caso",
        path: "/cien-anos-de-soledad/",
        desktop: {
          src: "/work/el-departamento/caso-desktop.jpg",
          width: 1440,
          height: 4729,
          videos: [
            { src: "/work/el-departamento/video/banner-home-dpto.mp4", x: 0, y: 0, w: 1440, h: 900, fit: "cover", overlay: "/work/el-departamento/overlay/banner-home-dpto-caso-desktop.webp" },
            { src: "/work/el-departamento/video/anuncio-especial.mp4", x: 190, y: 1390, w: 1060, h: 482, fit: "cover" },
            { src: "/work/el-departamento/video/directores.mp4", x: 190, y: 2127, w: 1060, h: 482, fit: "cover" },
            { src: "/work/el-departamento/video/arte.mp4", x: 190, y: 2894, w: 1060, h: 482, fit: "cover" },
            { src: "/work/el-departamento/video/vestuario.mp4", x: 190, y: 3631, w: 1060, h: 482, fit: "cover" },
          ],
        },
        mobile: {
          src: "/work/el-departamento/caso-mobile.jpg",
          width: 600,
          height: 6504,
          pageWidth: 390,
          videos: [
            { src: "/work/el-departamento/video/banner-home-dpto.mp4", x: 0, y: 0, w: 390, h: 844, fit: "cover", overlay: "/work/el-departamento/overlay/banner-home-dpto-caso-mobile.webp" },
            { src: "/work/el-departamento/video/anuncio-especial.mp4", x: 20, y: 1509, w: 350, h: 159, fit: "cover" },
            { src: "/work/el-departamento/video/directores.mp4", x: 20, y: 2007, w: 350, h: 159, fit: "cover" },
            { src: "/work/el-departamento/video/arte.mp4", x: 20, y: 2597, w: 350, h: 159, fit: "cover" },
            { src: "/work/el-departamento/video/vestuario.mp4", x: 20, y: 3095, w: 350, h: 159, fit: "cover" },
          ],
        },
      },
    ],
  },
  {
    slug: "el-costurero-de-meme",
    name: "El Costurero de Meme",
    role: "Diseño & Desarrollo web",
    year: "2025",
    stack: "Shopify Development",
    category: "diseno-web",
    summary:
      "Tienda en línea de muñecos de tela y crochet hechos a mano en Colombia. Una portada cálida, colecciones por mundos (bebés, granja, selva), fichas de producto claras y la historia del taller como parte de la compra.",
    color: "#e8e3d8",
    url: "https://www.elcosturerodememe.com.co/",
    tourPace: 1.5,
    note: "El contenido audiovisual es propiedad de cada marca.",
    screens: [
      {
        id: "inicio",
        label: "Inicio",
        path: "",
        desktop: { src: "/work/el-costurero-de-meme/inicio-desktop.jpg", width: 1440, height: 4983 },
        mobile: { src: "/work/el-costurero-de-meme/inicio-mobile.jpg", width: 600, height: 8155, pageWidth: 390 },
      },
      {
        id: "coleccion",
        label: "Colección",
        path: "/collections/todos-los-munecos",
        desktop: { src: "/work/el-costurero-de-meme/coleccion-desktop.jpg", width: 1440, height: 2797 },
        mobile: { src: "/work/el-costurero-de-meme/coleccion-mobile.jpg", width: 600, height: 6012, pageWidth: 390 },
      },
      {
        id: "producto",
        label: "Producto",
        path: "/products/caballo-bebe",
        desktop: { src: "/work/el-costurero-de-meme/producto-desktop.jpg", width: 1440, height: 2387 },
        mobile: { src: "/work/el-costurero-de-meme/producto-mobile.jpg", width: 600, height: 5224, pageWidth: 390 },
      },
      {
        id: "nosotros",
        label: "Nosotros",
        path: "/pages/nosotros",
        desktop: {
          src: "/work/el-costurero-de-meme/nosotros-desktop.jpg",
          width: 1440,
          height: 3533,
          videos: [
            { src: "/work/el-costurero-de-meme/video/nosotros-desktop.mp4", x: 0, y: 164, w: 1440, h: 650, fit: "cover" },
          ],
        },
        mobile: {
          src: "/work/el-costurero-de-meme/nosotros-mobile.jpg",
          width: 600,
          height: 6812,
          pageWidth: 390,
          videos: [
            { src: "/work/el-costurero-de-meme/video/nosotros-mobile.mp4", x: 0, y: 150, w: 390, h: 550, fit: "cover" },
          ],
        },
      },
    ],
  },
  {
    slug: "mar-de-palma",
    name: "Mar de Palma",
    role: "Diseño & Desarrollo web",
    year: "2025",
    stack: "Shopify Development",
    category: "diseno-web",
    summary:
      "Tienda en línea de cosmética natural de Cartagena de Indias: jabones, cremas y velas con fragancias propias. Una portada que alterna producto y mar, fichas claras y videos que explican, con calma, de qué está hecho cada producto.",
    color: "#e9e2d6",
    url: "https://mardepalma.com/",
    tourPace: 1.6,
    note: "El contenido audiovisual es propiedad de cada marca.",
    screens: [
      {
        id: "inicio",
        label: "Inicio",
        path: "",
        desktop: {
          src: "/work/mar-de-palma/inicio-desktop.jpg",
          width: 1440,
          height: 7460,
          videos: [
            { src: "/work/mar-de-palma/video/hero.mp4", x: 720, y: 165, w: 720, h: 900, fit: "cover", overlay: "/work/mar-de-palma/overlay/hero-desktop.webp" },
          ],
        },
        mobile: {
          src: "/work/mar-de-palma/inicio-mobile.jpg",
          width: 600,
          height: 11275,
          pageWidth: 390,
        },
      },
      {
        id: "coleccion",
        label: "Colección",
        path: "/collections/all",
        desktop: {
          src: "/work/mar-de-palma/coleccion-desktop.jpg",
          width: 1440,
          height: 5473,
        },
        mobile: {
          src: "/work/mar-de-palma/coleccion-mobile.jpg",
          width: 600,
          height: 8017,
          pageWidth: 390,
        },
      },
      {
        id: "producto",
        label: "Producto",
        path: "/products/jabon-liquido-restaurador-olt-1911",
        desktop: {
          src: "/work/mar-de-palma/producto-desktop.jpg",
          width: 1440,
          height: 2242,
        },
        mobile: {
          src: "/work/mar-de-palma/producto-mobile.jpg",
          width: 600,
          height: 5549,
          pageWidth: 390,
        },
      },
      {
        id: "ingredientes",
        label: "Ingredientes",
        path: "/pages/ingredientes",
        desktop: {
          src: "/work/mar-de-palma/ingredientes-desktop.jpg",
          width: 1440,
          height: 2562,
          videos: [
            { src: "/work/mar-de-palma/video/ingrediente-1.mp4", x: 10, y: 895, w: 348, h: 618, fit: "contain" },
            { src: "/work/mar-de-palma/video/ingrediente-2.mp4", x: 368, y: 895, w: 348, h: 618, fit: "contain" },
            { src: "/work/mar-de-palma/video/ingrediente-3.mp4", x: 725, y: 895, w: 348, h: 618, fit: "contain" },
            { src: "/work/mar-de-palma/video/ingrediente-4.mp4", x: 1083, y: 895, w: 348, h: 618, fit: "contain" },
          ],
        },
        mobile: {
          src: "/work/mar-de-palma/ingredientes-mobile.jpg",
          width: 600,
          height: 4587,
          pageWidth: 390,
          videos: [
            { src: "/work/mar-de-palma/video/ingrediente-1.mp4", x: 10, y: 741, w: 296, h: 526, fit: "contain" },
            { src: "/work/mar-de-palma/video/ingrediente-2.mp4", x: 316, y: 741, w: 296, h: 526, fit: "contain" },
            { src: "/work/mar-de-palma/video/ingrediente-3.mp4", x: 622, y: 741, w: 296, h: 526, fit: "contain" },
            { src: "/work/mar-de-palma/video/ingrediente-4.mp4", x: 928, y: 741, w: 296, h: 526, fit: "contain" },
          ],
        },
      },
      {
        id: "nosotras",
        label: "Nosotras",
        path: "/pages/nosotras",
        desktop: {
          src: "/work/mar-de-palma/nosotras-desktop.jpg",
          width: 1440,
          height: 2978,
        },
        mobile: {
          src: "/work/mar-de-palma/nosotras-mobile.jpg",
          width: 600,
          height: 5770,
          pageWidth: 390,
        },
      },
    ],
  },
  {
    slug: "feria-eva",
    name: "Feria EVA",
    role: "Diseño & Desarrollo web",
    year: "2024",
    stack: "Shopify",
    category: "diseno-web",
    summary:
      "Sitio de Feria EVA, un shopping festival con 8 años y 22 ediciones en Colombia. La portada de la edición del año, el recorrido por las ediciones anteriores, el pabellón EVA Home y la convocatoria para marcas, todo en un rosa suave y editorial.",
    color: "#eadfe0",
    url: "https://www.feriaeva.com/",
    tourPace: 1.5,
    note: "El contenido audiovisual es propiedad de cada marca.",
    screens: [
      {
        id: "inicio",
        label: "Inicio",
        path: "",
        desktop: { src: "/work/feria-eva/inicio-desktop.jpg", width: 1440, height: 6099 },
        mobile: { src: "/work/feria-eva/inicio-mobile.jpg", width: 600, height: 5962, pageWidth: 398 },
      },
      {
        id: "nosotros",
        label: "Nosotros",
        path: "/pages/nosotros",
        desktop: { src: "/work/feria-eva/nosotros-desktop.jpg", width: 1440, height: 2140 },
        mobile: { src: "/work/feria-eva/nosotros-mobile.jpg", width: 600, height: 3672, pageWidth: 398 },
      },
      {
        id: "ediciones",
        label: "Ediciones",
        path: "/pages/ediciones",
        desktop: { src: "/work/feria-eva/ediciones-desktop.jpg", width: 1440, height: 4539 },
        mobile: { src: "/work/feria-eva/ediciones-mobile.jpg", width: 600, height: 5163, pageWidth: 398 },
      },
      {
        id: "evahome",
        label: "EVA Home",
        path: "/pages/eva-home",
        desktop: { src: "/work/feria-eva/evahome-desktop.jpg", width: 1440, height: 4688 },
        mobile: { src: "/work/feria-eva/evahome-mobile.jpg", width: 600, height: 7329, pageWidth: 398 },
      },
      {
        id: "convocatoria",
        label: "Convocatoria",
        path: "/pages/patrocinadores-y-expositores",
        desktop: { src: "/work/feria-eva/patrocinadores-desktop.jpg", width: 1440, height: 1781 },
        mobile: { src: "/work/feria-eva/patrocinadores-mobile.jpg", width: 600, height: 1804, pageWidth: 398 },
      },
    ],
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
