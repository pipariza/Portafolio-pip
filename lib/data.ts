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
  /** Tiny blurred copy (data URL) shown while the real image loads. */
  blur?: string;
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
  /** "mac": show the project as a MacBook desktop (Safari + iPhone windows, widgets, dock). */
  layout?: "mac";
  /** Desktop wallpaper colors for the Mac layout: top-left glow, middle, bottom-right. */
  wallpaper?: [string, string, string];
  /** Dock icon in the Mac layout: the brand's `logo` (a complete square icon, path under /public, shown full bleed), or a flat color with initials when there is none. `bg` also colors the little site icon on the Safari tabs. */
  dock?: { bg: string; fg: string; label: string; logo?: string };
};

/**
 * The data of each project that does not depend on the language. Its role, summary and credit
 * line are texts in both languages: see lib/i18n/projects.ts (`getProjects(lang)`).
 */
export type ProjectData = Omit<Project, "role" | "summary" | "note">;

export const projectData: ProjectData[] = [
  {
    slug: "visual-living",
    dock: { bg: "#161616", fg: "#ffffff", label: "VL", logo: "/work/visual-living/logo.png" },
    name: "Visual Living",
    year: "2025",
    stack: "Shopify Development",
    category: "diseno-web",
    color: "#e3e0d8",
    url: "https://www.visualliving.co/",
    layout: "mac",
    wallpaper: ["#f7f2e8", "#dbe0dc", "#8aa5a2"],
    screens: [
      {
        id: "inicio",
        label: "Inicio",
        path: "",
        desktop: {
          src: "/work/visual-living/inicio-desktop.jpg",
          blur: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAMAA4DASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABQEC/8QAIRAAAgEEAAcAAAAAAAAAAAAAAQIDAAQRIRITMTJBgcH/xAAVAQEBAAAAAAAAAAAAAAAAAAABAv/EABcRAQADAAAAAAAAAAAAAAAAAAAREmH/2gAMAwEAAhEDEQA/AFRNMqmUySkczhCjIznrrzUsrm5aRxLNKwA0GXHymTBGo0g91sIqdqgZqK6Zf//Z",
          width: 1600,
          height: 1333,
          videos: [
            { src: "/work/visual-living/video/inicio.mp4", x: 35, y: 134, w: 1370, h: 630, radius: 20, fit: "cover", notch: { w: 84, h: 6 } },
          ],
        },
        mobile: {
          src: "/work/visual-living/inicio-mobile.jpg",
          blur: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAeAA4DASIAAhEBAxEB/8QAGAAAAwEBAAAAAAAAAAAAAAAAAQMEAAX/xAAiEAACAgIBAwUAAAAAAAAAAAABAgMRAAQxBRJRISIzUnH/xAAVAQEBAAAAAAAAAAAAAAAAAAABAv/EABcRAQEBAQAAAAAAAAAAAAAAAAARAVH/2gAMAwEAAhEDEQA/AOxJsyx7EkokCokvaQBd3jel70+1PIsrJSLwnnKJNTlnEZ93d8d+vn9yiGBYyWAWyOQoByZvTTs2Cj9jgFhqJvKD/9k=",
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
        desktop: { src: "/work/visual-living/somos-desktop.jpg", blur: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAPAA4DASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAwX/xAAhEAEAAQMEAgMAAAAAAAAAAAABAgAEEQMFISISIzEyof/EABUBAQEAAAAAAAAAAAAAAAAAAAID/8QAFxEAAwEAAAAAAAAAAAAAAAAAAAEREv/aAAwDAQACEQMRAD8Ao297N1WDcOfsmf2nndzEDXlnnPamltZw+ETDnrJKU2zRke45PhjJKnljqP/Z", width: 1600, height: 1664 },
        mobile: { src: "/work/visual-living/somos-mobile.jpg", blur: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAeAA4DASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAQIEBf/EACAQAAICAgICAwAAAAAAAAAAAAECABEDIQQxBRNSccH/xAAVAQEBAAAAAAAAAAAAAAAAAAACA//EABgRAQADAQAAAAAAAAAAAAAAAAABAhES/9oADAMBAAIRAxEAPwDUwczIeQT7gG2Tv8lB5uUEAZd0bFCIOAjNa4GUg9g1YlCeMx5KbIGXWqbcnzYthoMocUevuN1BR+RgFhqJuUF//9k=", width: 750, height: 1624 },
      },
      {
        id: "archivos",
        label: "Archivos",
        path: "/pages/archivos",
        desktop: {
          src: "/work/visual-living/archivos-desktop.jpg",
          blur: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAJAA4DASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAQIEBv/EAB0QAAIBBQEBAAAAAAAAAAAAAAEDAgAEBRESMRP/xAAUAQEAAAAAAAAAAAAAAAAAAAAB/8QAFREBAQAAAAAAAAAAAAAAAAAAABH/2gAMAwEAAhEDEQA/AHysry3iCu7cQxuxx1Hka8Jq/HvuD81ya9mkgmZhLmR37s1oaBohr//Z",
          width: 1600,
          height: 1082,
          videos: [
            { src: "/work/visual-living/video/archivos-reels.mp4", x: 480, y: 114, w: 480, h: 360, fit: "cover", label: { text: "Reels", size: 36 } },
            { src: "/work/visual-living/video/archivos-videoads.mp4", x: 0, y: 474, w: 480, h: 360, fit: "cover", label: { text: "Video ads", size: 36 } },
          ],
        },
        mobile: {
          src: "/work/visual-living/archivos-mobile.jpg",
          blur: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAeAA4DASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAQQFBv/EACQQAAIBBAEDBQEAAAAAAAAAAAECEQADBBIFITFhExUyUXHR/8QAFAEBAAAAAAAAAAAAAAAAAAAAAv/EABURAQEAAAAAAAAAAAAAAAAAAAAR/9oADAMBAAIRAxEAPwAX+VzLefkW1vlX1JUKZiASZnp5pL37l0QMcskEwDoP5VkW8cZ4Rse2022uMSgkmY70w6Ymo9LCx2+9kHSjSlZvi9UybRexfe8SoG20Bp71e45+Xa+wzrAS3r0gD5T4P7WjZNhBYx4oiQYkmkL/2Q==",
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
          blur: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAOAA4DASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAgMEBf/EACIQAAEDAwQDAQAAAAAAAAAAAAECAxEABBIFBiHRJDFRcf/EABUBAQEAAAAAAAAAAAAAAAAAAAAC/8QAFhEBAQEAAAAAAAAAAAAAAAAAAQBB/9oADAMBAAIRAxEAPwDWGqM84vqkmeEnqit9fscyF3KjIkApV9/KmO238l+S3B9DE8UhvaTiAkm4bKgnGcT3SkXb/9k=",
          width: 1600,
          height: 1595,
          videos: [{ src: "/work/visual-living/video/servicios.mp4", x: 30, y: 594, w: 1380, h: 682, radius: 20, fit: "contain" }],
        },
        mobile: {
          src: "/work/visual-living/servicios-mobile.jpg",
          blur: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAeAA4DASIAAhEBAxEB/8QAGAAAAgMAAAAAAAAAAAAAAAAAAQYCBAX/xAAlEAACAQMDAgcAAAAAAAAAAAABAhEAAwQFEjETYSIjQVFSccH/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAv/EABcRAQADAAAAAAAAAAAAAAAAAAABAhH/2gAMAwEAAhEDEQA/AN9brC4zhoYn3/Ku2Gd1BaOOQeaWcjUcxMm+gdoRmgBBxJj0o6Fn6jfy/PuM1royAUA8Ujt3omLaamXcIkj6MVKhB+RoCd0TNFP/2Q==",
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
          blur: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAYAA4DASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAEEBf/EAB4QAAIBBAMBAAAAAAAAAAAAAAECAAMEESEFMVFh/8QAFQEBAQAAAAAAAAAAAAAAAAAAAQL/xAAVEQEBAAAAAAAAAAAAAAAAAAAAEf/aAAwDAQACEQMRAD8At5V7wtTFpXrI5Y5Cee4lXHVLgWyCtcVKrbyzd9zaYbGhGo1JhpNnPyPoQhKD/9k=",
          width: 1600,
          height: 2695,
          videos: [
            { src: "/work/visual-living/video/marcas.mp4", x: 35, y: 134, w: 1370, h: 677, radius: 20, fit: "contain", notch: { w: 84, h: 6 } },
          ],
        },
        mobile: {
          src: "/work/visual-living/marcas-mobile.jpg",
          blur: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCABYAA4DASIAAhEBAxEB/8QAGAAAAwEBAAAAAAAAAAAAAAAAAAECBAX/xAAmEAEAAgEDBAIBBQAAAAAAAAABAhEAEiExAwRBUSJhBRRxgZGh/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAH/xAAWEQEBAQAAAAAAAAAAAAAAAAAAARH/2gAMAwEAAhEDEQA/AOl+V7ru+36o9nIJs0Riy295u/Fdx3HX6Uf1HUjKelVjGjnN042oNSeHRdZUI0qceqrJlUN6quW/o4xxdRe59Jk6UnJ1TSX9Ryzm7f2cqJnG/jcgfI8Y4xqTK5b+F2wTfzv9442lpT6vAlgK7bS53ccTlSl+7wr5bBTy3gRCTKgk8uBEjpyZEtCbax/y8sIkmqvzWS9PpXNYx+Var81xlRI6l+OrzWApy0ltB7ccW3g/jDDA/9k=",
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
    dock: { bg: "#22e48f", fg: "#06210f", label: "DP", logo: "/work/el-departamento/logo.png" },
    layout: "mac",
    wallpaper: ["#e6f3ec", "#c3cde0", "#6b739a"],
    name: "El Departamento",
    year: "2025",
    stack: "WordPress.org Development",
    category: "diseno-web",
    color: "#e2e1de",
    url: "https://eldepartamento.tv/",
    tourPace: 1.9,
    screens: [
      {
        id: "inicio",
        label: "Inicio",
        path: "",
        desktop: {
          src: "/work/el-departamento/inicio-desktop.jpg",
          blur: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAsAA4DASIAAhEBAxEB/8QAGgAAAQUBAAAAAAAAAAAAAAAAAwABAgQFBv/EACMQAAICAgEDBQEAAAAAAAAAAAECAxEABBIhIkETFFFhccH/xAAWAQEBAQAAAAAAAAAAAAAAAAABAwD/xAAYEQADAQEAAAAAAAAAAAAAAAAAAREhA//aAAwDAQACEQMRAD8AxtUx6s7HYDOsi8VauRU9PH5lxtCB4I5Nbc9FGHUyyqAT8ADyPOc/GJZDZDvX3kHDKxBBGWfXagauGwjvForEsTlpAGDjuBFfAypuSbDrzkrua7VawHvNghR7h+0UKNVim3J5YwjzMyg2B0yTjGh43gKxkQhaQBiWBsj6xt6WN9aJUjRXB68QP5gi7OSWNk+fzIMbwpj/2Q==",
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
          blur: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCADnAA4DASIAAhEBAxEB/8QAGgAAAgMBAQAAAAAAAAAAAAAAAgMBBAUABv/EAC8QAAIBAwMDAgUCBwAAAAAAAAECAwAEERIhMQUiQRNRMmFxkaEjgUJSkrHB0eH/xAAXAQADAQAAAAAAAAAAAAAAAAAAAQID/8QAHhEAAgICAwEBAAAAAAAAAAAAAAECEQMhEhMiQSP/2gAMAwEAAhEDEQA/ACKMbNArrJuQCNtqiFJIFX18hWBI+9WHEEUxUPpRd8D80bypJao3Pdit0g4xqqPOTzgTtkkg01OqSJaKmQQG9qq9TurWWYGFu0D+EVntMCMA7ZqW6Y7BjCYywBz7g0MgUHK7fLG1SspCgb7ULvqA5rIRqDprxplXgkj1Y16c+M0m6sWR11MmSOEXj61oQSgW/oiMuHAdznGgjY5pt3NbFiZpH9UncKMkbedqbx5E9oTkkJaPqAncRsVY7kIcAkeP+UyS/wCsOzsZt1IViAOcU2yvmchWcsyphBpx8ySfrRzKsz5WN4lI7ssDlqXbL6WoL4dBbSIkWiMH9Jgx8hs7CoVZIoUNyChPg70kdUTTgTRqPYNvS7jqSPgl45MeC3+qzasaMU2s+ARE5B9lJoTBKOYn/pNeul6mPVMKvoRQXBHv7VQub95UjcHJxg71tSugca2XJQ6W2GDEg7dgH+KRAifytk77Y4/cV59Z5cDXLKQeAJKBppQcrLIAeO/NTi/N2Vky81VAjGF+Dzzn80J4HFGrfANR2zwucUB4HP2oMgkRmA0qx+h5oWVl2YEVtWzWzWcQS3keUL3Nk4FJ6xJHJFDpj9Nl2IxjPzq3BpWQppuiLS8jSBUd3yBwo4pXUbmOdVVCThs71Z6VbpIoaWPUrdq/XzVXqcDQOFZQM7jBzS5t+bL6Yr0W7C6hS2RXcArwCeKq9UuVncBDlVO32rXsrW2NhAzwoHZN3wp/vWd1iGKGNRGo1atzpAPHBxUtJbEpt6LnT/Tks4vUk04XGKpdYdMrHE5ZFPn3pM9nLaRxM5QiQZXtyfyPnVdl1YyQMeygUCi01aHMSAoIznYZ3pco07ZH7Cjc9q/KlyMWxmgYZIYbnFCQPfNdXUDP/9k=",
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
          blur: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAuAA4DASIAAhEBAxEB/8QAGAAAAwEBAAAAAAAAAAAAAAAAAQMEAgX/xAAjEAACAgIBBAIDAAAAAAAAAAABAgMRAAQSITFRYQUTQbHw/8QAFgEAAwAAAAAAAAAAAAAAAAAAAAEC/8QAFhEBAQEAAAAAAAAAAAAAAAAAABEh/9oADAMBAAIRAxEAPwDhjZ4d0JPsYHmiYdiPWRQrsSsFjDuzdhZxTvJfVmHq8mKq7RO80FazngDXGx1P8cn+Q154Jr2K5v1sfnG6uk8sH2iRFHgmj+8n2keN+MjA14NjHlJTBBC+vGTJLza7UAEVid2GGJl+iQyA+RWCkJPFOPq8wyr4wguP/9k=",
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
          blur: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCACYAA4DASIAAhEBAxEB/8QAGQAAAwEBAQAAAAAAAAAAAAAAAgMEBQAB/8QAKhAAAgEDAwMDAwUAAAAAAAAAAQIDAAQREiExE0FhInGBMpHRFFJyocH/xAAYAQADAQEAAAAAAAAAAAAAAAAAAQIDBP/EABoRAQEBAQADAAAAAAAAAAAAAAABESECQVH/2gAMAwEAAhEDEQA/AMO4X9QYmaZXwNOF7AUqS8uQdJfbsABtRKLHOepOp/iPzXjizY7TTe5Qfmu3Z8ZTkxXHZWfQXNyNWkn5rMCnOyhhxnFLV9LZ5+DVC3ZVdK6AB+5aylk9rktKX6R7UubgGiAXA2HFBLp2xj4rnU9WONsAdUsewQfmlMMMcZx55rTt794AOnBDqwPXuG+4qK6fqSmTQqajnCnalLQLhM5Q4HGsUl5CwxjFWW9xbpCEltmc53YHkZor25t51TpQNERz5phOPpHtQTfSPenraXEkavEhCY5Jz/lTypIhxJkGjQqW7uVhEaS6VAwAKnuJJZMGWQufNM0OIwwBbYYAVt/6pMokwNUbKPIpcC5b6TRErNJpRe2Nz2pV5fSXCqJRkjvS5raeFY2k9IcZXBG4pRRm5bNLIc8tnFMsruqLKzPpGFDNxSZAV7AfOaN29KeKCRtRziqTJgj6gOB70JXz9q6uoN//2Q==",
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
    dock: { bg: "#a9722b", fg: "#fff7e6", label: "CM", logo: "/work/el-costurero-de-meme/logo.png" },
    layout: "mac",
    wallpaper: ["#fcefe4", "#eadacd", "#c4a088"],
    name: "El Costurero de Meme",
    year: "2025",
    stack: "Shopify Development",
    category: "diseno-web",
    color: "#e8e3d8",
    url: "https://www.elcosturerodememe.com.co/",
    tourPace: 1.5,
    screens: [
      {
        id: "inicio",
        label: "Inicio",
        path: "",
        desktop: { src: "/work/el-costurero-de-meme/inicio-desktop.jpg", blur: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAwAA4DASIAAhEBAxEB/8QAGAAAAwEBAAAAAAAAAAAAAAAAAQMEAgb/xAAoEAACAQIFAwMFAAAAAAAAAAABAgMAEQQFEiEiEzFRMjRBQmGRoeH/xAAWAQADAAAAAAAAAAAAAAAAAAAAAQL/xAAXEQEBAQEAAAAAAAAAAAAAAAAAAREh/9oADAMBAAIRAxEAPwDpYMQ7NJqU2BuKnbMZ0xDIIdadwTxNVGFAbCeQEff+UBhUYe4mJ8hqhewJBJ1DaMab+on4t3oxSKhIcxpsLcxvUwyyQMz9XkRa19vxSZ8hXEheoxVl+pDuf1Sso4cMySPZy5IIB380+PHRyStGuoFRck01YIxfgpHxtWjDGTcopPm1Gk//2Q==", width: 1440, height: 4983 },
        mobile: { src: "/work/el-costurero-de-meme/inicio-mobile.jpg", blur: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAC+AA4DASIAAhEBAxEB/8QAGgAAAgMBAQAAAAAAAAAAAAAAAgMBBAUABv/EACsQAAICAQMDAwMEAwAAAAAAAAECAxEABBIhEyIxBUFRMmGBFBVxkSTB0f/EABcBAQEBAQAAAAAAAAAAAAAAAAEAAgP/xAAaEQEBAQADAQAAAAAAAAAAAAAAEQECEiEi/9oADAMBAAIRAxEAPwD1Tt1Y2EJUOOLZbAwkmhLFAy7l8r4IyvHEkDOdzW3k1/vEt6bFNMZWd2Yiu5c53G4bqGkZlMOpiRTxTJus4yByiVNPG7X5UUKzPjaRm3rAWVh9RIse/wA4Y67X/jtXt3L/ANyzji0iLUTdKPZpwEY7R3jFCb1AzF4I42sVRdeMsrptYFVGjUKKsdQe2cNHqTIXEPcRzUoGOU7Gu4BbkA/jCjAF0AP4GLMwIuq+9jJWW/C/mxl2ysRWCnqPd0RQ54w4A1NuHvYxe872UN4xsL7gfajg1Cw0e9uwb/f5w4ZkdnCjlODiV0wGpefqHldu3isnR6VdO0jCQsZDZv5wSQsnVbi46/o5GjEwabqrwWtTftlfUeq/pyA8SjcDyGvHaPXjUKDsCgi+Dj7qnjPBhK7JI9w28mvFZU/c4oW6Z0jIQPBcePbNeP0x4ldS6kv5JP2+KwZ/QoNW4klJZgoUFWrgfxh9NXGs4W7IJv75KqF8YsSRvyCcPco+c6ObK6OvrsIAsVzWORdYszFyHj29oB8HGNpS2sWfqntP01weKyznOkNgE2R/eFgHyfP4OEv5wLjXzWSMg3kjIP/Z", width: 600, height: 8155, pageWidth: 390 },
      },
      {
        id: "coleccion",
        label: "Colección",
        path: "/collections/todos-los-munecos",
        desktop: { src: "/work/el-costurero-de-meme/coleccion-desktop.jpg", blur: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAbAA4DASIAAhEBAxEB/8QAGQAAAgMBAAAAAAAAAAAAAAAAAAIBAwQG/8QAIhAAAgEEAQQDAAAAAAAAAAAAAQIAAxEhMRIEEyJBMoHB/8QAFQEBAQAAAAAAAAAAAAAAAAAAAQL/xAAWEQEBAQAAAAAAAAAAAAAAAAAAEUH/2gAMAwEAAhEDEQA/AOreoyOQEuL/AJLKTlxleOBuZ6nlWcdt8Hfo4j9MvF6ni4wPlrXqTpDU0d2PJwb/AFqPSVad7FjrcJMil//Z", width: 1440, height: 2797 },
        mobile: { src: "/work/el-costurero-de-meme/coleccion-mobile.jpg", blur: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCACMAA4DASIAAhEBAxEB/8QAGQAAAwEBAQAAAAAAAAAAAAAAAQIDAAQG/8QAKBAAAgICAgEDBAIDAAAAAAAAAQIDEQAhBBIxE0FRFCIjYTJxgZHx/8QAFgEBAQEAAAAAAAAAAAAAAAAAAAEC/8QAGBEBAQADAAAAAAAAAAAAAAAAAAEREiH/2gAMAwEAAhEDEQA/APVzHtGREyq/sWBIGVTqw1WR+pPZlC7Av9Zk5DOSKGszxShE7swbz7YYIFS/yE3kkjlHKdtGMr/m7y0AktywFXqvjAmrnu6djoX5wceUyFqcmiR5xhMO7r6ewLvDBKjFuqrY0f0fjIAET1GbuNjeLxeLHC0jLIxMjdjZveRWHkHnvIVHo9Co3v5vOjjRygv3GibBvx+sRaCyN2dSSK8G8Xh8kzNKCT9jVlPWTsyUCwvWNA6t26x1RomsBBDF6ryd/uIrG48IjLH1S3bdH2yKpIOQ32EoV/l8ZXjB6bstb1iCp5EKyiIsBI3ha86vKBgPbOf6eIzCUp+QeDZ1lcm1MF7UTo4wIOKQb1X+sIFf8zKsf6vCMBF4QKwj/9k=", width: 600, height: 6012, pageWidth: 390 },
      },
      {
        id: "producto",
        label: "Producto",
        path: "/products/caballo-bebe",
        desktop: { src: "/work/el-costurero-de-meme/producto-desktop.jpg", blur: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAXAA4DASIAAhEBAxEB/8QAGAAAAwEBAAAAAAAAAAAAAAAAAAEDBAb/xAAfEAABBAICAwAAAAAAAAAAAAABAAIDEQQxQVESQ5H/xAAVAQEBAAAAAAAAAAAAAAAAAAABA//EABURAQEAAAAAAAAAAAAAAAAAAAAR/9oADAMBAAIRAxEAPwDp58gxZcUQ9p60tTebUHPiZMXOLvLVEkjvSpDKyWyx16P1BIXZs3Z5TFjRQhSpf//Z", width: 1440, height: 2387 },
        mobile: { src: "/work/el-costurero-de-meme/producto-mobile.jpg", blur: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAB6AA4DASIAAhEBAxEB/8QAGgAAAwEBAQEAAAAAAAAAAAAAAQIEAAMFBv/EACcQAAICAQMDAwUBAAAAAAAAAAECABEDBCExEkFRBXGBExQiYZKx/8QAFgEBAQEAAAAAAAAAAAAAAAAAAAEC/8QAGBEBAQEBAQAAAAAAAAAAAAAAAAERITH/2gAMAwEAAhEDEQA/APq85BQrjZFydiwsCdU6TxRrxPO9Qz/bLle6YkAHwTK9ExfCjkgllBJB2mebi5zUvqHp7azIAXdcYNkL3lOhwvgwjG9WoqwKBjYsmPMzjHnLFTRo8SiJJ6W3whaoQ19oN75MK+9x0Kbs8xl+YhAs7n+TOimx3+ZRGqP1uKPTW0TSJmtvqK3OxPiIuoc6vJg/OgvUGo+eJ302V3Zw1ijt+x5mVA6wLq104xk9Vgtew2uUhqGwijkwzO0KSbNf5CDfaBh7/FwgVxIrH3mEM0I//9k=", width: 600, height: 5224, pageWidth: 390 },
      },
      {
        id: "nosotros",
        label: "Nosotros",
        path: "/pages/nosotros",
        desktop: {
          src: "/work/el-costurero-de-meme/nosotros-desktop.jpg",
          blur: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAiAA4DASIAAhEBAxEB/8QAGQABAAIDAAAAAAAAAAAAAAAABAABAgMF/8QAJBAAAgEDAwMFAAAAAAAAAAAAAQIDAAQRBRIhMWGBQVFSscH/xAAVAQEBAAAAAAAAAAAAAAAAAAABAv/EABcRAAMBAAAAAAAAAAAAAAAAAAABESH/2gAMAwEAAhEDEQA/AEward2xxcGSZWOQwIyPGKbPqhiIBlfPZc/lIu9YWC4kiNu7bDjcGHNKs76O5d40BDIAT5oThT05Oo2jy3NxmCZlboyg4HHpilaLGyM2+3eJtgyWUjn2575PmlyW6SPI2ZFZj13H6rZBEsG7aXOfk2aiqjcMqupUqQP/2Q==",
          width: 1440,
          height: 3533,
          videos: [
            { src: "/work/el-costurero-de-meme/video/nosotros-desktop.mp4", x: 0, y: 164, w: 1440, h: 650, fit: "cover" },
          ],
        },
        mobile: {
          src: "/work/el-costurero-de-meme/nosotros-mobile.jpg",
          blur: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCACfAA4DASIAAhEBAxEB/8QAGgAAAgMBAQAAAAAAAAAAAAAAAQIDBAUABv/EACwQAAIBBAEDAwIGAwAAAAAAAAECAwAEESESBRMxMkFhFIEWIiRRkbGhosH/xAAXAQEBAQEAAAAAAAAAAAAAAAAAAgED/8QAGhEBAAMBAQEAAAAAAAAAAAAAAAERIUESMf/aAAwDAQACEQMRAD8A35OpQyRN2A3MeCUzj7ZqD8R9PVihEoYeQY8ViR3E9umAoILAByN4+aKWn1UjvwTuLoqx0fkVNxPxVS0buCW5gdoom4t4OQKyIJSdk78V7WRCwK5Ug+xXVQx9PtBn9PD9owKyiJpYb1Gink0Wx5xmiMfFV1Lx88BFxK5ZyxY7z7ZqbpoH1Dg/mIX3Ox4pjDGZ5TKx49wsOPk/FRwCKy6mXj5NHJDredg7/wCVEbLrNUuzWcKyv3JuBJJwSBrNLDZoZg3dLrxPHwRjVL1m4eSPtRQ9xkdWkUNtRsZH71T6VdNJGp9JUurDzg5FZ04ki+ssb28lEDzrKRoAZGCdfOjS9OsZorhmg7kccilmSZgCGyPv+9aF3K0QVl4sSxBOP8VIzLHMARsqT/VL2isZ6XVvLdzwRKgkjc8gVxjfmonvFfqHYzlkjJ5L6cEjVa09j0p7iQyalX1EPgrn+qa26T09ZuUQfnxxt85Ga3zts9Ye4sBFK9wkcs7yE8kDADBqzZ2wiAkPJWZcFCRr+KRopzdrIJQIl8pk71VmlpAeTRpGAySR/rTL9/4qRxG/aiKBFcKD/9k=",
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
    dock: { bg: "#a87b5b", fg: "#ffffff", label: "MP", logo: "/work/mar-de-palma/logo.png" },
    layout: "mac",
    wallpaper: ["#f9efe3", "#ebdac7", "#b79b7e"],
    name: "Mar de Palma",
    year: "2025",
    stack: "Shopify Development",
    category: "diseno-web",
    color: "#e9e2d6",
    url: "https://mardepalma.com/",
    tourPace: 1.6,
    screens: [
      {
        id: "inicio",
        label: "Inicio",
        path: "",
        desktop: {
          src: "/work/mar-de-palma/inicio-desktop.jpg",
          blur: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCABJAA4DASIAAhEBAxEB/8QAGAAAAwEBAAAAAAAAAAAAAAAAAwQFAQL/xAAsEAACAgIABQIDCQAAAAAAAAABAgMRAAQFEiExQRMiFiNRYXGBorHR0uHx/8QAFwEBAQEBAAAAAAAAAAAAAAAAAQIAA//EABkRAQEBAAMAAAAAAAAAAAAAAAEAERIhQf/aAAwDAQACEQMRAD8AryTOWlQAJUXMHrz1/rJ3rbVdNxD180P1GW10o1neX5wLew/MNAfUDxg14VrMRzRuLFn3nv8ATOYVuMjM8aV6mw1o3Q0TZwUO6H9g2ja2L9NgDjTcPd2JePXJY2TTWfzZ3HoSp0WLWA+1G/fJyrkUQJzT8yyOXYUaXwDY85sXE4IpGLSbJq1o1/LLrcG1WHKYpOWz2kIv6YH4c4ce8Eg7HpKfxxBjRe4UMW+BrpOdl0L3KbN/5eMbJ24529BNh0IHayAfNY0NrVLuo2QWY9ge1Z1Ht6zOzrOG8EdaGbPLbKJwlVkaQSkORRYKLIwg4e6mxsuPuUY7m45G3//Z",
          width: 1440,
          height: 7460,
          videos: [
            { src: "/work/mar-de-palma/video/hero.mp4", x: 720, y: 165, w: 720, h: 900, fit: "cover", overlay: "/work/mar-de-palma/overlay/hero-desktop.webp" },
          ],
        },
        mobile: {
          src: "/work/mar-de-palma/inicio-mobile.jpg",
          blur: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAEHAA4DASIAAhEBAxEB/8QAGgAAAQUBAAAAAAAAAAAAAAAAAQACAwQFBv/EADEQAAIBAwIFAgQEBwAAAAAAAAECAwAEERIhBRMxQVEioRRhcZEGI0KxMjNTgtHw8f/EABcBAQEBAQAAAAAAAAAAAAAAAAIBAAP/xAAaEQEBAQEBAQEAAAAAAAAAAAAAARESITEC/9oADAMBAAIRAxEAPwDaNvbKM8lR/caXw9t/QX7mqfFWduHTRhCXfKjHYeauWjGa2jcgg4wQeuRsa4O+KPE+I21mqpO3qI2UD3q1wueOexSSInQzMfc1oS20EpzJDE+OmqMH96dHbwooCxRqB0CqAKXI9HaxzDHrGsDVjHaijq5YBgSh0t8j/poaPzS/kY60UXSWOP4jmkBoB+ILajgrpxnbrSiBDSEsTqbIyem1ULjialVEchhYn9SA596ki4gvLXMcjtjdgoAPvU6i5VP4WRm9URAQgqw3J8/SojFdIoULK2M4ITG3inS8RZJ3RWBIzsqg4+tQ2fEbmSYhpExpJ2UeRQyH6dbcVu5bhA9vbCF5uXnHqxnGetbojQdI0z50ismPilipLJaFSTnOFFSHjsAP8qX2phoLw+2Mzxi2l0qMhuYd/lSh4dbyxapLaRDnGOYTWkZI13MijPlhSVkx6XU/QismOMvdVzZhFUFoXdWA8aiR+9XLN1LxRiPSEhHTp2oTxJFd3CouAXYHfqKs8Ft4pLuRWXZU2APzFGSw7+pT7mxaS4llE1tpZiwJk7VNwuJLS4eSS5tirLp9MoPeshgjIeeypCRvkdfpWRJykmfls4jBwvc1tTma6x/w3FJLqe5lYjfSQNqlX8PWjAktqydzpFaqppneTJJYAY7bUIV5UekZO5O58nNLIm0prmOBQW1EE49C6v2p8ciyorqdmGRkYP2rmraJo2hs7YIshTUzdgB1NTrB8A3JITDDUGX9Xmj1fpc+/Vo8KkE6TRT6JE2zoyCPB3o3HC7i4kEkl0moDA/L2A+9Xo+bzpC5wv6RnP8AyngPoxq9WeuM0sibT9s0sCubnvrz4hiJzylOcjAwgODQ4Vxk3V46PckKsedJ858/LpU6bAblSAl4oiWGGyh396iSG2gcvDbQqxGDhSNvvWtJw2CMD1yE+Mj/ABTl4VbuoYPJg/Sp6Xi+VDde1EDAwKXejSA3O/SiDmh370R86zEaVKlWZ//Z",
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
          blur: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAA1AA4DASIAAhEBAxEB/8QAGAAAAwEBAAAAAAAAAAAAAAAAAAIDBgH/xAApEAABAwMDAgUFAAAAAAAAAAABAAIREiExAxMiBVEVMoGD4UFiccHw/8QAFwEBAQEBAAAAAAAAAAAAAAAAAAECA//EABURAQEAAAAAAAAAAAAAAAAAAAAR/9oADAMBAAIRAxEAPwDSusHxpNNJEWymAbuObttgAQYylcHRqc4uI+3CcTuO5Wgce2VzbSeNMt1qg4iRVH1wnBbvvia6RP4vH7Q4vh8NBMim2Uwmt1uMCCiJPLKdWSbkT/eisByLu6xnjHWR5tdg9n4XR1nrJxrA+x8JRshab5XfVCEV/9k=",
          width: 1440,
          height: 5473,
        },
        mobile: {
          src: "/work/mar-de-palma/coleccion-mobile.jpg",
          blur: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAC7AA4DASIAAhEBAxEB/8QAGQAAAwEBAQAAAAAAAAAAAAAAAAECAwYE/8QANBAAAQMDAgMDCQkAAAAAAAAAAQACEQMSITFBBBMiBTJxFEJRgZGSocHRBhYjUlNhg5Ph/8QAFwEBAQEBAAAAAAAAAAAAAAAAAAECA//EABcRAQEBAQAAAAAAAAAAAAAAAAARASH/2gAMAwEAAhEDEQA/AOhPZ/DDSj7CUx2dwpGaMeJK0BfzyJ6LRGN59KKZeXVL9LunEYj4rnMbuq6biJ6omExaZt2MHKgMHPNTctt0RTYGuqEee644QPmHnGnsG3fFDKhe6oCIsdHjjVVbmUBts6ZQZgO8pLpFpYBH7yii1wfVLiCHPlsbCArubeW5uifUhrmuLg3VpgoiRTHPNSDcW267IpsDXPIHfMnO6BUdzzTgWhoMzmZSpVXVH1Q4EBj7RO+Ag0jMygCN5UBv45fJy22NtUqTbXVDPedcPYimC/nEYstxjeUUy8uqXxF3TjaEBzeaWQbgLphNhaSbUDt65xMIaInT1KBTisXzn0R81PDUzTBLiC46wMf6g5H728f+Th/cP1QPtbx/6fD+4fqvF5Nxnm9nVB/CfomOE4w97gq39JHyU6zXeVmueAAYGquncGAOJJ9J3TTVaLdNRidYVDxlAEeKAEFAQf/Z",
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
          blur: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAWAA4DASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAgAG/8QAHxAAAgICAQUAAAAAAAAAAAAAAQIAERIxYQMhUXGR/8QAFgEBAQEAAAAAAAAAAAAAAAAAAAID/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A0tA9V1wWgoINe4lVTtF+QrasaSsm7nitxIzEgMuIK2eD4mayA3zKUoH/2Q==",
          width: 1440,
          height: 2242,
        },
        mobile: {
          src: "/work/mar-de-palma/producto-mobile.jpg",
          blur: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCACBAA4DASIAAhEBAxEB/8QAGAAAAwEBAAAAAAAAAAAAAAAAAAECAwb/xAAqEAABBAEDAgQHAQAAAAAAAAABAAIDESESMUEEYRMUUZEFMjNxgYKS4f/EABcBAQEBAQAAAAAAAAAAAAAAAAABAgP/xAAWEQEBAQAAAAAAAAAAAAAAAAAAARH/2gAMAwEAAhEDEQA/AOh8h03EQ9ypd0PSgWYQfyU/iDZX9KWwODHkghxvFZ4+y0leTE1210VzyN7UdXJAIXeYvQ0i8kZVyMMsDRE4NGCLHFJPjEoIkjY4XdOFrVopoFAVwEGfiSA/RP8AQTbJITmEj9gqIzyqCBY9D7JiuBSyAd5smjo0Vfe0Q69c2skjXbbFUK2Hr/qDWhe+Um6bOkiwaPZZhldW6T1YG/N3vb3SgY5skxc4EPfqbXApEauLWi3Y7p44USR+JV7BUxuhgaNgimmleUIEavICYrhBQgCgbIQg/9k=",
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
          blur: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAZAA4DASIAAhEBAxEB/8QAGAAAAwEBAAAAAAAAAAAAAAAAAQIEAwb/xAAoEAABAQUGBwEAAAAAAAAAAAABAAIDBBEhBRIVMWGiBhQjMkFxgtH/xAAWAQEBAQAAAAAAAAAAAAAAAAAAAgP/xAAXEQEBAQEAAAAAAAAAAAAAAAAAARES/9oADAMBAAIRAxEAPwBmYXiANi82ZSrN4x+LUQtukd+5lRC04m6G+TeUandOZ09apDaUXQCFeUGZGayq+XT4dDSPTl9FHDYXy63FVIpkNr//2Q==",
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
          blur: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCABrAA4DASIAAhEBAxEB/8QAGgAAAgMBAQAAAAAAAAAAAAAAAQIAAwUEBv/EACsQAAEEAQIEAwkAAAAAAAAAAAEAAgMRBAUxEiFBURMicSRCcoKRocHR8f/EABcBAQEBAQAAAAAAAAAAAAAAAAACAQP/xAAbEQEAAgIDAAAAAAAAAAAAAAAAARECEiEiYf/aAAwDAQACEQMRAD8Api1fxSODT8cg9pXK1+psYBxYMBPYSOXPj6BqEDjxMZtyqYBWnQ9RkNhkY9ZQVxnxt5PVuF79EW8hSxH5D4yxrppy5+zWusnurmGVwsTykEAjzFba6YjtRiycl0kbgzwYi0NkIBebvl9E8WvwY+NDH4cjnNZRJoCx/VjnSsvjJAZVkjzLuxcJscXtOMJpCT74oBb1OZaZodB9kh3W0dMh5ipCPjH6QGlQHcPHz3+FGsq2h1zNc8AA0N08dhgDjZ7nqiirQHVFJyvekw9bQQj1UAUKgQf/2Q==",
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
          blur: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAdAA4DASIAAhEBAxEB/8QAGQAAAQUAAAAAAAAAAAAAAAAAAgABAwQF/8QAJhAAAQQBAwEJAAAAAAAAAAAAAQACAxExBBMhBRIUIiMzYYGi0f/EABcBAAMBAAAAAAAAAAAAAAAAAAABAgP/xAAXEQEBAQEAAAAAAAAAAAAAAAAAASEx/9oADAMBAAIRAxEAPwDY7413VJ9IA3y4y8+EcY/U0GoMocaFA8cDCuRPbN23bbQcHFlE2CIYjaPhZXeLgYtIYS4sl5cbNtCk25L9b6BEABfulSYf/9k=",
          width: 1440,
          height: 2978,
        },
        mobile: {
          src: "/work/mar-de-palma/nosotras-mobile.jpg",
          blur: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCACHAA4DASIAAhEBAxEB/8QAGQAAAwEBAQAAAAAAAAAAAAAAAAECBQME/8QAKhAAAgEDAwIFBAMAAAAAAAAAAQIAAxEhBBJBMWEFFCJCURMjcYGCkdH/xAAXAQEBAQEAAAAAAAAAAAAAAAAAAQID/8QAFxEBAQEBAAAAAAAAAAAAAAAAAAERUf/aAAwDAQACEQMRAD8A13GhTUvQNIBkXcTuPb/Yqa6Spe1BSAbdTmeg6GgNXV1IRvq1V2sd1xbHH6hR0KUx6WbPBtOVnHSV18zQJP3Vx1nRWXgzLVCajAcsb/3NJAJJTGLrFappayIwVnbbc5tmalBmKjcc2zG2i05JHl0IJvmdlpKBhQPxEhpnrKEzw/iNshQf4wJ8T9qg97LLpjSY/BAPeUCD0kve3pIBvzKxxNMpYn2kA3zKvecatYUwLgE/EpKm5QwGDIpFQ3WMCwsIcxwJvnpGDeLnmMd4AYQhA//Z",
          width: 600,
          height: 5770,
          pageWidth: 390,
        },
      },
    ],
  },
  {
    slug: "feria-eva",
    dock: { bg: "#d9739a", fg: "#ffffff", label: "EV", logo: "/work/feria-eva/logo.png" },
    layout: "mac",
    wallpaper: ["#fde8eb", "#e9c9c8", "#b98a8c"],
    name: "Feria EVA",
    year: "2024",
    stack: "Shopify",
    category: "diseno-web",
    color: "#eadfe0",
    url: "https://www.feriaeva.com/",
    tourPace: 1.5,
    screens: [
      {
        id: "inicio",
        label: "Inicio",
        path: "",
        desktop: { src: "/work/feria-eva/inicio-desktop.jpg", blur: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAA7AA4DASIAAhEBAxEB/8QAGQAAAgMBAAAAAAAAAAAAAAAAAgMBBAUA/8QAKRABAAEDAgMHBQAAAAAAAAAAAQIAAxEEIQUSMRQiI1FhcZETMkGBof/EABcBAQEBAQAAAAAAAAAAAAAAAAIBAwT/xAAaEQEBAAIDAAAAAAAAAAAAAAAAEQISIXGR/9oADAMBAAIRAxEAPwDeb5zJyhE9KbCUU70c+WApFs0ri4EiaYxJ3KGWptwkwt6e5difnOD+0Zk12xUJcF1MDENRE5jfqY9SihwjUwisblpZOXmy71sytqqdfbNFG2xkuNkqUYXPWRh9Xw73hoOLS59vOmW9QXLsrZGYxBWUEH90SD1qTarC4UI9sXvT+EqHtufvPkrPrqbq168f/9k=", width: 1440, height: 6099 },
        mobile: { src: "/work/feria-eva/inicio-mobile.jpg", blur: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCACLAA4DASIAAhEBAxEB/8QAGQAAAgMBAAAAAAAAAAAAAAAAAgQBAwUA/8QAKxAAAgAFAgQGAgMAAAAAAAAAAQIAAwQRIRIxBWFxgRMiMkFRkRQjM1OC/8QAGAEAAwEBAAAAAAAAAAAAAAAAAAEDAgT/xAAbEQADAQADAQAAAAAAAAAAAAAAARESEyFRAv/aAAwDAQACEQMRAD8A3/Dptgi37xIl0wa+hR3haTN1E6HLOtyRfaGJbl0UsAzWzY2ET2dEfpYlNLlltElRqPsTkQa08pbESwLCwzHX9V0ZfMe/OCBIA0i467RuIwxSZxGUCpVgQVDFR1PzFdBWXklKqYzTgxJ0DFuXKMzirTGlLMkuCVHmIAsLHaKmrj46r/J5Dnni+3WK4YdNG69LS2CeCtl+oFeG0Re/4yagLX6w2bEkFCf9RYqj1ZBPOI6Yjs3gvaAJI2QGJBNsgCFBQx+KcVn0lX4EuQjqFDXZWO/SG+FVsyupmmTUVCr6QFBAtYfMNTJtsXZeYtmCV9ag57w0uyjazIcdsC5+ImMf8qp/sb6gkqqjVmY23xGoU4WCsqet/wBJPVTErJnFyTKYdsRpsCSfMPu0EmPcHveAOV+GSalSxY08q5zfMHIqtDkpJlqSNxeFIOX6u0Mo/lQ//9k=", width: 600, height: 5962, pageWidth: 398 },
      },
      {
        id: "nosotros",
        label: "Nosotros",
        path: "/pages/nosotros",
        desktop: { src: "/work/feria-eva/nosotros-desktop.jpg", blur: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAVAA4DASIAAhEBAxEB/8QAGAAAAgMAAAAAAAAAAAAAAAAAAAQBBQb/xAAiEAABAwIGAwAAAAAAAAAAAAABAAIDESEEBRQiU5ExodH/xAAXAQADAQAAAAAAAAAAAAAAAAABAgME/8QAGREAAwADAAAAAAAAAAAAAAAAAAERAhJR/9oADAMBAAIRAxEAPwBpsmamEOdG5rh5BjF/SUmnz0vrHDKG0tSEfFqXhS0bboQ0rOOwqNZiOQ9BGtxHKeghCYvquH//2Q==", width: 1440, height: 2140 },
        mobile: { src: "/work/feria-eva/nosotros-mobile.jpg", blur: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCABWAA4DASIAAhEBAxEB/8QAGgAAAgMBAQAAAAAAAAAAAAAAAQIAAwQFBv/EACkQAAEDAwMDAgcAAAAAAAAAAAEAAhEDBBIhMUEFE4EUkRUiMnGCsfD/xAAYAQADAQEAAAAAAAAAAAAAAAAAAQIEA//EABkRAQEBAQEBAAAAAAAAAAAAAAABEUExUf/aAAwDAQACEQMRAD8A2jqVs5siycPyCHxazFXH0jgY2yC5tNr+xEzUp6QOVkbTqvui/AnJvkKNrXJtu17B1hatPy0Gg8xKNPp9oBPZbO25Vz5yKLCRxPlU5XwricjqU1Pc7qOyy/SNOeUDhXYyd5TU4kxPlK6MjqZ+yanGsSgcB2/PsmZ/aKk3luRHdA8FEXdAnSoPYpnl+OPKan9XhRRNpr//2Q==", width: 600, height: 3672, pageWidth: 398 },
      },
      {
        id: "ediciones",
        label: "Ediciones",
        path: "/pages/ediciones",
        desktop: { src: "/work/feria-eva/ediciones-desktop.jpg", blur: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAsAA4DASIAAhEBAxEB/8QAGAAAAwEBAAAAAAAAAAAAAAAAAAQFAQL/xAArEAACAQMDAQUJAAAAAAAAAAABAgMABBESITETBRQigZEkMkFRUnHR4fD/xAAXAQADAQAAAAAAAAAAAAAAAAAAAQIE/8QAGxEAAwACAwAAAAAAAAAAAAAAAAECESESE1H/2gAMAwEAAhEDEQA/AAdqXrNgefgG1ZD2nfSMeo+lMbEIoyfSk1NxHIoeUK3Ozq3w5+VcL3l945c423kCkDzpF5ZRW8tGkV1Lac5I0+8cVOumWKcm3uNYYckcU1Z2AEntCqAp3KsfEDxjFJX8AiPTMGU1EqxJ3H8aWjTE3LxoYguJZAqoM6RhQMfmi4gluNCvgBRtn9VTEMS8RoPsorelH9C+lHFk9T9P/9k=", width: 1440, height: 4539 },
        mobile: { src: "/work/feria-eva/ediciones-mobile.jpg", blur: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAB4AA4DASIAAhEBAxEB/8QAGQAAAwEBAQAAAAAAAAAAAAAAAwQFAAIB/8QALBAAAgEDAgQEBgMAAAAAAAAAAQIDAAQREiETMUFRBSJhkSMyQ1JxgUJywf/EABgBAAMBAQAAAAAAAAAAAAAAAAECAwAE/8QAHREAAgICAwEAAAAAAAAAAAAAAAECERJBAxMhUf/aAAwDAQACEQMRAD8AePiNrp2s2z/YGvY/EbZ38tk4wPuFQ7eVX4jmV1jA/iobHuRQ45NU54LyOMHzOvMbYO3L8ViuT+nUdkWwOFECc4GimLCGcMQvDjQA4Ogb70KCS9t5GaKCRsj6kTN7V3aw3M8kkkyTRZJIRY2xvz26UbJKNFpE4uTEWYL2rqJXXyyZDDNLy3GSzrIyJyAAwa0N5DrKyF2wNiQB/tSv0vTYQQAyDU+F54K59MDtUi4gezvChdZFZcqcevbpRo/E7qN1M4iZTnZBvRJJ7a44ZdVacLhtyABntmmcRuKdOyXGpjjLPa8aVuj6sKOpGCKyxSyXbsINCb6VUHbeq3hkTLezSpE7CViVfcBRS3iVu9veiWOJ1VwQ2k5Gcj267UcmL1+02V9Mhh1NchHAy2k5HvSsIgvHd5LgcLbThyp1dSQf1S6XUDOcyxxoVyC6tuewxXqXUWvSGViB8yqcfqlvZuyQKK2tJ2HxIwnMkyYIx6GhssUU4KacMv05PxStrdwR6hcQ8QEbYYr70ylzE8pAt9C4JAD8qMp6oilWynpX7R7V3Eq6vlHLtWrU53s//9k=", width: 600, height: 5163, pageWidth: 398 },
      },
      {
        id: "evahome",
        label: "EVA Home",
        path: "/pages/eva-home",
        desktop: { src: "/work/feria-eva/evahome-desktop.jpg", blur: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAuAA4DASIAAhEBAxEB/8QAGQAAAwADAAAAAAAAAAAAAAAAAQMFAAQG/8QAKxAAAQMDAwEGBwAAAAAAAAAAAQIDEQAEEgUTITEGIiMyUYEWUmFxkZLR/8QAFwEBAAMAAAAAAAAAAAAAAAAAAgABA//EABoRAQACAwEAAAAAAAAAAAAAAAABERMhMVH/2gAMAwEAAhEDEQA/AC7q1wC2Uud1YnyJ496TeaxdM4hL45HXbEn2irnw/YJAhCgE+XxFVi+ztg4vNaHCYid1VE9qLjrTZ8RWM9JopcTkRlz6VyupL1B11xblu4pDbhSkgcYz9/pVezupf21LyXtye7HSAalLip62nrBDycVqcjLLiP5SmNIYauFPpU8VEEQo8cmfSpJtk/O5+1EW4AjNf5pN8Mev/9k=", width: 1440, height: 4688 },
        mobile: { src: "/work/feria-eva/evahome-mobile.jpg", blur: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCACrAA4DASIAAhEBAxEB/8QAGgAAAgMBAQAAAAAAAAAAAAAAAgQAAQUDBv/EADEQAAIBAwIEAwQLAAAAAAAAAAECAwAEERIhEyIxQQUyUQZxgdEUQlJhYoKRkrHB4f/EABgBAAMBAQAAAAAAAAAAAAAAAAECAwAE/8QAHREAAwACAgMAAAAAAAAAAAAAAAERAiESMRNBUf/aAAwDAQACEQMRAD8AeXxKzaQILVhnvkH+6GDxa0mlKx2bbDfLCsaCWNGjdpF4j8yqD0p6xsolcyQyNuuCpG43oMos8vbMqPhG6iDJuVwwAGxC01aGZ8yAEqOXbYj9KQtbgQ3HPp75J61reGTJCJU4gILZGCGz8qFJw9O8EWc8KMk/gFXHBGCTwox+QUb6tsZq01fWzRKkZCelWqFahzjBz7xRA5HQ/GloKCQc9KtQfTFUCV83eheUgjGN/uoGF7+8W2jBBDEsFxpz1oLC6W/RnYbqcDbFYF5a+Ite3R+jzSRsSYwG2znbvT/s1b3MLym6heI6cDUdj8KfQN00Js62x611tfMfdSst0BK6iJnIYg6W/wArvZSiSQgLjlz5s0i7LvJcYJ3lzA0jjEg0eYhduvc0XhFyJ7uZEVQqr6b9fWsee7SKe+xJlmkYaW1EDB22xiu3si7C7uISQRww2APLv0opEm0NXHgdm73MplnjkZi7PnIHfpRez9nBbXM7QvI7FdJLqBnetN7SJ+IrFyJM6hnrUtbSG2JaIuSRjmYmnr6E47p3OvXso04696tdWOYYryAuJAN5n/efnRxTyGTaaQ7fbNCnX4H9HlZ0RUBjwBgZiXNRlM+FcqAN+WML/FVRx+b4U0HP/9k=", width: 600, height: 7329, pageWidth: 398 },
      },
      {
        id: "convocatoria",
        label: "Convocatoria",
        path: "/pages/patrocinadores-y-expositores",
        desktop: { src: "/work/feria-eva/patrocinadores-desktop.jpg", blur: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAARAA4DASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAIDBf/EACEQAAICAQMFAQAAAAAAAAAAAAECAAMRBAUSEyEjQdFR/8QAFgEBAQEAAAAAAAAAAAAAAAAAAgME/8QAGREBAAIDAAAAAAAAAAAAAAAAAAEDESEx/9oADAMBAAIRAxEAPwCdV2+kt1S4x64pEfU7+W8aWMPwVpmarorWswdMEk+/kfS8KbCzumCMdgfkOJapr11GEIRrv//Z", width: 1440, height: 1781 },
        mobile: { src: "/work/feria-eva/patrocinadores-mobile.jpg", blur: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAqAA4DASIAAhEBAxEB/8QAGAAAAwEBAAAAAAAAAAAAAAAAAgMEBgH/xAAmEAABAwMBCAMAAAAAAAAAAAABAAIDBBESBRQhIjJBUoGSBjFy/8QAFgEBAQEAAAAAAAAAAAAAAAAAAwIB/8QAGhEAAwEAAwAAAAAAAAAAAAAAAAIRARIhUf/aAAwDAQACEQMRAD8AJnyKhfubQyA/oJ0WtUkj+GicAB3hZ+GIiIOLWggYuud5XI3iSY47iB46KOXYt2Wmnlj0+N7mGgjOJI5imUdBptTK7GgjaQL3uTdKqb7RMcftx6KvSi4SycIuWrRmRcSwXt1R3j1CJlbO42Lh6hSI4+bwrE1c8P/Z", width: 600, height: 1804, pageWidth: 398 },
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
  /** The small line above the name on the app's page (e.g. where the app was built). */
  kicker?: string;
  /** Apps with an interactive "how it works" demo on their page (components/apps/demo). */
  demo?: DemoId;
  /** Why the app was built (strategic goal); localized in lib/i18n/projects.ts. */
  objective?: string;
  /** Hours it took to build (shown as "Tiempo de construcción"). Left out when not known. */
  hours?: number;
  /** The tools used (names, the same in both languages); replaces `stack` on the page when set. */
  tools?: string[];
};

/** The apps that have a step-by-step demo; their steps live in lib/i18n/app-demos.ts. */
export type DemoId = "tareas" | "cronogramas" | "asistente";

/** The apps' own data; their role and description are in lib/i18n/projects.ts (`getApps(lang)`). */
export type AppData = Omit<AppProject, "role" | "description" | "kicker" | "objective">;

export const appData: AppData[] = [
  {
    slug: "tareas",
    name: "Tareas",
    label: "TAREAS",
    year: "2026",
    stack: "Next.js, Supabase, Resend",
    rotation: -6,
    color: "#35342f",
    demo: "tareas",
    hours: 25,
    tools: ["Claude Code", "Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase (Auth, Postgres, RLS)", "Resend", "Gemini API", "Vercel"],
  },
  {
    slug: "cronogramas",
    name: "Cronogramas",
    label: "CRONOGRAMAS",
    year: "2026",
    stack: "Next.js, Supabase Storage, dnd-kit",
    rotation: 4,
    color: "#3d3b36",
    demo: "cronogramas",
    hours: 20,
    tools: ["Claude Code", "Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase (Postgres, Storage, RLS)", "dnd-kit", "JSZip", "pdf-lib", "tus-js-client", "Vercel"],
  },
  {
    slug: "asistente-ia",
    name: "Asistente IA",
    label: "ASISTENTE IA",
    year: "2026",
    stack: "Gemini API, Next.js, Supabase",
    rotation: -3,
    color: "#2e2d2b",
    demo: "asistente",
    tools: ["Gemini API", "Claude Code", "Next.js", "Supabase", "Vercel"],
  },
  {
    slug: "app-cuatro",
    name: "App Cuatro",
    label: "APP CUATRO",
    year: "2024",
    stack: "Next.js, Tailwind, Recharts",
    rotation: 5,
    color: "#403f3a",
  },
  {
    slug: "app-cinco",
    name: "App Cinco",
    label: "APP CINCO",
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
