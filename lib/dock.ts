import { CONTACT } from "@/lib/config";

export type WindowTab = {
  label: string;
  meta?: string;
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
          paragraphs: ["Texto de prueba: la papelera está vacía."],
        },
      ],
    },
  },
];
