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

export type WindowTab = {
  label: string;
  meta?: string;
  /** Renders a Finder-style grid of discarded projects instead of text. */
  trash?: { items: TrashItem[]; emptyReply: string };
  /** Larger opening line shown above the paragraphs. */
  lead?: string;
  paragraphs?: string[];
  listTitle?: string;
  list?: string[];
  /** Shown as a mailto link with a copy button. */
  email?: string;
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
          paragraphs: [
            "Texto de prueba: aquí va una descripción de cómo trabajas con IA en tus aplicativos.",
          ],
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
          label: "Photoshop",
          paragraphs: [
            "Texto de prueba: retoque, composición y piezas gráficas.",
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
          label: "Illustrator",
          paragraphs: [
            "Texto de prueba: ilustración vectorial, logotipos y sistemas gráficos.",
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
      title: "Información sobre: Pip Ariza",
      tabs: [
        {
          label: "Sobre mí",
          meta: "01",
          paragraphs: [
            "Texto de prueba: diseño y desarrollo web con foco en aplicativos con IA, y edición de video como diferencial. Aquí va tu presentación real.",
          ],
          listTitle: "Puedo hacer...",
          list: [
            "Diseño web",
            "Desarrollo front-end",
            "Aplicativos con IA",
            "Edición de video vertical",
            "Motion",
            "Reels",
          ],
        },
        {
          label: "CV",
          meta: "02",
          paragraphs: [
            "Texto de prueba: aquí va tu experiencia, estudios y herramientas.",
          ],
          list: [
            "2025 — Cargo / Empresa (prueba)",
            "2024 — Cargo / Empresa (prueba)",
            "2023 — Estudios / Institución (prueba)",
          ],
        },
        {
          label: "Intereses",
          meta: "∞",
          paragraphs: [
            "Texto de prueba: música, cine, tecnología y todo lo que inspira tu trabajo.",
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
