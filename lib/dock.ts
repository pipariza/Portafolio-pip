import { CONTACT } from "@/lib/config";

/** A discarded piece shown in the Trash window. */
export type TrashItem = {
  /** Funny file name shown under the thumbnail, e.g. "logo_v14_FINAL_final.png". */
  file: string;
  /** Path under /public (e.g. "/papelera/logo.jpg"). Falls back to a colored tile. */
  image?: string;
  /** Placeholder tile color while there is no image. */
  color: string;
  /** What it was. */
  what: string;
  /** What it taught you. */
  learned: string;
};

/** A featured piece shown as a captioned thumbnail. */
export type WorkThumb = {
  title: string;
  caption: string;
  /** Path under /public. Falls back to a colored tile. */
  image?: string;
  color: string;
};

export type WindowTab = {
  label: string;
  meta?: string;
  /** Photoshop: before/after comparison slider. Without images it shows colored tiles. */
  beforeAfter?: {
    before?: string;
    after?: string;
    beforeColor: string;
    afterColor: string;
  };
  /** Illustrator: toggle between the finished mark and its outline (paths and anchor points). */
  vector?: boolean;
  /** Captioned thumbnails of featured pieces. */
  works?: WorkThumb[];
  /** Big highlighted numbers, e.g. { value: "500+", label: "productos" }. */
  stats?: { value: string; label: string }[];
  /** CV-style entries: role, organization, period and bullet points. */
  entries?: { title: string; org: string; period: string; points: string[] }[];
  /** Titled groups of short items (skills), laid out in columns when there is room. */
  groups?: { title: string; items: string[] }[];
  /** Small tags (tools), with an optional heading. */
  chipsTitle?: string;
  chips?: string[];
  /** Small humorous stat shown in a callout. */
  stat?: string;
  /**
   * Project links. An empty array renders the "coming soon" message;
   * add { label, href } entries once the projects are live.
   */
  links?: { label: string; href: string }[];
  linksTitle?: string;
  linksEmptyText?: string;
  /** Renders a Finder-style grid of discarded projects instead of text. */
  trash?: { items: TrashItem[]; emptyReply: string };
  /** Larger opening line shown above the paragraphs. */
  lead?: string;
  paragraphs?: string[];
  listTitle?: string;
  list?: string[];
  /** Shown as a mailto link with a copy button. */
  email?: string;
  /** Shown as a WhatsApp link with a copy button, under the email. */
  phone?: { label: string; href: string };
};

export type DockWindow = {
  title: string;
  tabs: WindowTab[];
};

export type DockItem = {
  id: string;
  label: string;
  /** Path under /public */
  icon: string;
  /** Items with the same group number sit together; a divider goes between groups. */
  group: number;
} & ({ href: string } | { window: DockWindow });

export const dockItems: DockItem[] = [
  {
    id: "claude",
    label: "Claude",
    icon: "/dock/Claude-ai-icon.svg.webp",
    group: 0,
    window: {
      title: "Claude",
      tabs: [
        {
          label: "Claude",
          lead: "Uso Claude para resolver problemas y ahorrarle tiempo y dinero a mis clientes.",
          paragraphs: [
            "Con él convierto ideas en aplicativos que funcionan, automatizo lo repetitivo y entrego soluciones más rápido y a un menor costo.",
          ],
          listTitle: "Lo uso para:",
          list: [
            "Automatizar tareas repetitivas",
            "Prototipar aplicativos con IA",
            "Resolver problemas de código y de diseño",
          ],
          linksTitle: "Proyectos hechos con Claude:",
          linksEmptyText: "Pronto estarán aquí los enlaces a los proyectos terminados.",
          // Add { label: "Nombre del proyecto", href: "https://..." } when each one is live.
          links: [],
        },
      ],
    },
  },
  {
    id: "photoshop",
    label: "Photoshop",
    icon: "/dock/photoshop.avif",
    group: 0,
    window: {
      title: "Photoshop",
      tabs: [
        {
          label: "Resumen",
          meta: "01",
          lead: "Aquí dejo la realidad un poco mejor de lo que era.",
          paragraphs: [
            "Texto de prueba: retoque, composición y piezas gráficas.",
          ],
          listTitle: "Lo uso para:",
          list: [
            "Retoque fotográfico",
            "Composición de imágenes",
            "Mockups",
            "Piezas para redes",
          ],
          stat: "Capas en mi archivo más grande: 214. Con nombre: 3. (dato de prueba)",
        },
        {
          label: "Antes / Después",
          meta: "02",
          paragraphs: [
            "Arrastra la línea para comparar. (Imagen de prueba: aquí irá un retoque tuyo.)",
          ],
          beforeAfter: { beforeColor: "#bdb9b0", afterColor: "#f2b63c" },
        },
        {
          label: "Trabajos",
          meta: "03",
          works: [
            {
              title: "Retoque de retrato",
              caption: "Texto de prueba: piel, luz y color.",
              color: "#e7d9c4",
            },
            {
              title: "Mockup de empaque",
              caption: "Texto de prueba: una marca sobre producto real.",
              color: "#d9dde3",
            },
            {
              title: "Pieza para redes",
              caption: "Texto de prueba: campaña en formato vertical.",
              color: "#e6d3d3",
            },
          ],
        },
      ],
    },
  },
  {
    id: "illustrator",
    label: "Illustrator",
    icon: "/dock/illustrator.avif",
    group: 0,
    window: {
      title: "Illustrator",
      tabs: [
        {
          label: "Resumen",
          meta: "01",
          lead: "Puntos de ancla suficientes para perder la paciencia.",
          paragraphs: [
            "Texto de prueba: ilustración vectorial, logotipos y sistemas gráficos.",
          ],
          listTitle: "Lo uso para:",
          list: [
            "Logotipos",
            "Íconos",
            "Ilustración vectorial",
            "Sistemas gráficos",
          ],
          stat: "Veces que usé Ctrl+Z en un solo logo: 1.204. (dato de prueba)",
        },
        {
          label: "Trazado",
          meta: "02",
          paragraphs: [
            "Alterna entre el diseño terminado y sus trazos. (Dibujo de prueba: aquí irá uno de tus logos.)",
          ],
          vector: true,
        },
        {
          label: "Trabajos",
          meta: "03",
          works: [
            {
              title: "Logotipo",
              caption: "Texto de prueba: identidad para una marca.",
              color: "#e4dcc9",
            },
            {
              title: "Set de íconos",
              caption: "Texto de prueba: una familia de íconos coherente.",
              color: "#d6e2d8",
            },
            {
              title: "Ilustración",
              caption: "Texto de prueba: vector con carácter propio.",
              color: "#dcd6e6",
            },
          ],
        },
      ],
    },
  },
  {
    id: "aviso",
    label: "Aviso",
    icon: "/dock/error.avif",
    group: 0,
    window: {
      title: "Aviso",
      tabs: [
        {
          label: "Aviso",
          lead: "Atención: este portafolio puede provocar ganas de contratar a su autor.",
          paragraphs: [
            `Disponible para trabajo full-time en agencias digitales y de diseño. Si es trabajo remoto, mucho mejor. Desde ${CONTACT.city}.`,
          ],
          listTitle: "Lo que hago:",
          list: [
            "Diseño y desarrollo web",
            "Aplicativos con IA",
            "Edición de video vertical",
          ],
          email: CONTACT.email,
          phone: CONTACT.whatsapp,
        },
      ],
    },
  },
  {
    id: "cv",
    label: "CV",
    icon: "/dock/notas.avif",
    group: 1,
    window: {
      title: "Información sobre: Felipe (Pip) Ariza",
      tabs: [
        {
          label: "Sobre mí",
          meta: "01",
          lead: "Diseñador digital que construye ecosistemas web orientados a negocio.",
          paragraphs: [
            "Más de dos años combinando UX/UI, e-commerce, contenido audiovisual y pauta digital en Meta, para que cada elemento tenga una función dentro del recorrido del usuario.",
            "Hoy gestiono la tienda Shopify de Boho Chic SAS: creo productos de e-commerce con IA, automatizo procesos y mejoro la experiencia de compra.",
          ],
          stats: [
            { value: "500+", label: "productos creados con IA" },
            { value: "10+", label: "tareas automatizadas" },
            { value: "20%", label: "de crecimiento en ventas" },
          ],
          listTitle: "Puedo hacer...",
          list: [
            "Sitios web y e-commerce (Shopify, Squarespace, WordPress)",
            "Diseño de interfaces UX/UI",
            "Edición de video y contenido para redes",
            "Pauta digital en Meta",
            "Automatización y productos con IA",
          ],
          email: CONTACT.email,
          phone: CONTACT.whatsapp,
        },
        {
          label: "Experiencia",
          meta: "02",
          entries: [
            {
              title: "Gestor Shopify",
              org: "Boho Chic SAS",
              period: "Julio 2026 – Presente",
              points: [
                "Administro la tienda Shopify y la mejoro de forma continua.",
                "Creé más de 500 productos para el e-commerce con ayuda de IA.",
                "Automaticé más de 10 tareas, desde correos hasta flows que mejoraron los procesos del negocio.",
                "Diseñé secciones modernas y optimizadas para la tienda.",
                "Mejoré la experiencia de compra (UX/UI) y las ventas crecieron un 20%.",
              ],
            },
            {
              title: "Diseñador web y trafficker",
              org: "Visual Living",
              period: "2024 – Presente",
              points: [
                "Desarrollo de sitios web para marcas de moda, restaurantes y diseño.",
                "Campañas digitales en Meta.",
                "Edición de contenido audiovisual.",
              ],
            },
            {
              title: "Proyectos web",
              org: "Freelance",
              period: "2023 – Actual",
              points: [
                "Sitios para marcas como Feria EVA, Culto, El Departamento TV y Cloud&Butter.",
                "Estructuración de portafolios y e-commerce en Squarespace, Shopify y WordPress.",
              ],
            },
            {
              title: "Diseñador en marketing",
              org: "Up Strategy",
              period: "2023 · 6 meses",
              points: [
                "Conceptualización de marca.",
                "Creación de contenido gráfico, video y banners.",
                "Diseño de interfaces web.",
              ],
            },
          ],
        },
        {
          label: "Skills",
          meta: "03",
          groups: [
            {
              title: "Web y e-commerce",
              items: ["UX / UI", "Arquitectura web", "Shopify, Squarespace, WordPress"],
            },
            {
              title: "IA y automatización",
              items: [
                "Productos de e-commerce con IA",
                "Automatización de correos y flows",
                "Desarrollo con IA",
              ],
            },
            {
              title: "Contenido",
              items: ["Edición de video", "Diseño gráfico", "Creación de contenido con IA"],
            },
            {
              title: "Digital",
              items: ["Pauta digital en Meta", "Estrategia", "Implementación"],
            },
          ],
          chipsTitle: "Herramientas:",
          chips: [
            "Shopify",
            "Squarespace",
            "WordPress",
            "Figma",
            "Adobe Creative Cloud",
            "CapCut",
            "Facebook Ads",
            "Google Analytics",
            "Claude",
          ],
        },
        {
          label: "Educación",
          meta: "04",
          entries: [
            {
              title: "Pregrado en Diseño Digital y Multimedia",
              org: "Universidad Colegio Mayor de Cundinamarca",
              period: "2019 – 2025",
              points: [],
            },
          ],
        },
        {
          label: "Intereses",
          meta: "∞",
          paragraphs: ["Lo que hago cuando no estoy diseñando:"],
          list: [
            "Escribir poesía y cuentos",
            "Hacer hiking",
            "Ilustrar",
            "Cocinar",
            "Cat lover",
          ],
        },
      ],
    },
  },
  {
    id: "fotos",
    label: "Fotos",
    icon: "/dock/imagenes.avif",
    group: 1,
    window: {
      title: "Fotos",
      tabs: [
        {
          label: "Fotos",
          paragraphs: [
            "Texto de prueba: aquí irá una selección de fotografías y detrás de cámaras.",
          ],
        },
      ],
    },
  },
  {
    id: "instagram",
    label: "Instagram",
    icon: "/dock/instagram.avif",
    group: 2,
    href: "https://www.instagram.com/pipariza/",
  },
  {
    id: "correo",
    label: "Correo",
    icon: "/dock/mail.avif",
    group: 2,
    window: {
      title: "Correo",
      tabs: [
        {
          label: "Correo",
          paragraphs: [
            "¿Tienes un proyecto, una oferta o solo quieres saludar? Escríbeme.",
          ],
          email: CONTACT.email,
          phone: CONTACT.whatsapp,
        },
      ],
    },
  },
  {
    id: "papelera",
    label: "Papelera",
    icon: "/dock/papelera.avif",
    group: 3,
    window: {
      title: "Papelera",
      tabs: [
        {
          label: "Papelera",
          trash: {
            emptyReply: "No puedo: aquí viven mis mejores lecciones.",
            // Placeholder examples. To use a real image, drop it in /public/papelera
            // and set `image: "/papelera/archivo.jpg"` on the item.
            items: [
              {
                file: "logo_v14_FINAL_final.png",
                color: "#e7d9c4",
                what: "Texto de prueba: un logotipo que pasó por 14 versiones y nunca se usó.",
                learned: "Texto de prueba: con la versión 3 ya sabía la respuesta.",
              },
              {
                file: "propuesta_rechazada.jpg",
                color: "#d9dde3",
                what: "Texto de prueba: una propuesta de campaña que el cliente descartó en la primera reunión.",
                learned: "Texto de prueba: entender el problema antes de dibujar la solución.",
              },
              {
                file: "campana_que_nunca_salio.psd",
                color: "#e6d3d3",
                what: "Texto de prueba: una campaña terminada que jamás se publicó.",
                learned: "Texto de prueba: no todo lo bueno sale, y está bien.",
              },
              {
                file: "web_sin_terminar.fig",
                color: "#d6e2d8",
                what: "Texto de prueba: un sitio web abandonado a la mitad del diseño.",
                learned: "Texto de prueba: acotar el alcance desde el día uno.",
              },
              {
                file: "rediseno_marca_v2.ai",
                color: "#e4dcc9",
                what: "Texto de prueba: un rediseño de marca que se quedó en el cajón.",
                learned: "Texto de prueba: me enamoré de la idea y no del problema.",
              },
              {
                file: "primer_reel_ever.mov",
                color: "#dcd6e6",
                what: "Texto de prueba: el primer video vertical que edité. No envejeció bien.",
                learned: "Texto de prueba: el ritmo del corte importa más que los efectos.",
              },
            ],
          },
        },
      ],
    },
  },
];
