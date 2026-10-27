import { CONTACT, NAME } from "@/lib/config";
import { pick, type Locale } from "@/lib/i18n/config";

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

/**
 * The windows of the Apps desktop. Every text sits next to its English twin: tr(spanish, english).
 * (The "test text" ones are placeholders that will be replaced by the real texts.)
 */
export function getDockItems(lang: Locale): DockItem[] {
  const tr = (es: string, en: string) => pick(lang, es, en);

  return [
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
            lead: tr(
              "Uso Claude para resolver problemas y ahorrarle tiempo y dinero a mis clientes.",
              "I use Claude to solve problems and save my clients time and money.",
            ),
            paragraphs: [
              tr(
                "Con él convierto ideas en aplicativos que funcionan, automatizo lo repetitivo y entrego soluciones más rápido y a un menor costo.",
                "With it I turn ideas into apps that work, automate the repetitive and deliver solutions faster and at a lower cost.",
              ),
            ],
            listTitle: tr("Lo uso para:", "I use it to:"),
            list: [
              tr("Automatizar tareas repetitivas", "Automate repetitive tasks"),
              tr("Prototipar aplicativos con IA", "Prototype AI-powered apps"),
              tr("Resolver problemas de código y de diseño", "Solve code and design problems"),
            ],
            linksTitle: tr("Proyectos hechos con Claude:", "Projects made with Claude:"),
            linksEmptyText: tr(
              "Pronto estarán aquí los enlaces a los proyectos terminados.",
              "Links to the finished projects will be here soon.",
            ),
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
            label: tr("Resumen", "Summary"),
            meta: "01",
            lead: tr(
              "Aquí dejo la realidad un poco mejor de lo que era.",
              "Here I leave reality a little better than it was.",
            ),
            paragraphs: [
              tr(
                "Texto de prueba: retoque, composición y piezas gráficas.",
                "Test text: retouching, compositing and graphic pieces.",
              ),
            ],
            listTitle: tr("Lo uso para:", "I use it for:"),
            list: [
              tr("Retoque fotográfico", "Photo retouching"),
              tr("Composición de imágenes", "Image compositing"),
              "Mockups",
              tr("Piezas para redes", "Social media pieces"),
            ],
            stat: tr(
              "Capas en mi archivo más grande: 214. Con nombre: 3. (dato de prueba)",
              "Layers in my biggest file: 214. Named: 3. (test data)",
            ),
          },
          {
            label: tr("Antes / Después", "Before / After"),
            meta: "02",
            paragraphs: [
              tr(
                "Arrastra la línea para comparar. (Imagen de prueba: aquí irá un retoque tuyo.)",
                "Drag the line to compare. (Test image: one of your retouches will go here.)",
              ),
            ],
            beforeAfter: { beforeColor: "#bdb9b0", afterColor: "#f2b63c" },
          },
          {
            label: tr("Trabajos", "Work"),
            meta: "03",
            works: [
              {
                title: tr("Retoque de retrato", "Portrait retouching"),
                caption: tr("Texto de prueba: piel, luz y color.", "Test text: skin, light and color."),
                color: "#e7d9c4",
              },
              {
                title: tr("Mockup de empaque", "Packaging mockup"),
                caption: tr(
                  "Texto de prueba: una marca sobre producto real.",
                  "Test text: a brand on a real product.",
                ),
                color: "#d9dde3",
              },
              {
                title: tr("Pieza para redes", "Social media piece"),
                caption: tr(
                  "Texto de prueba: campaña en formato vertical.",
                  "Test text: a campaign in vertical format.",
                ),
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
            label: tr("Resumen", "Summary"),
            meta: "01",
            lead: tr(
              "Puntos de ancla suficientes para perder la paciencia.",
              "Enough anchor points to lose your patience.",
            ),
            paragraphs: [
              tr(
                "Texto de prueba: ilustración vectorial, logotipos y sistemas gráficos.",
                "Test text: vector illustration, logos and graphic systems.",
              ),
            ],
            listTitle: tr("Lo uso para:", "I use it for:"),
            list: [
              tr("Logotipos", "Logos"),
              tr("Íconos", "Icons"),
              tr("Ilustración vectorial", "Vector illustration"),
              tr("Sistemas gráficos", "Graphic systems"),
            ],
            stat: tr(
              "Veces que usé Ctrl+Z en un solo logo: 1.204. (dato de prueba)",
              "Times I used Ctrl+Z on a single logo: 1,204. (test data)",
            ),
          },
          {
            label: tr("Trazado", "Outline"),
            meta: "02",
            paragraphs: [
              tr(
                "Alterna entre el diseño terminado y sus trazos. (Dibujo de prueba: aquí irá uno de tus logos.)",
                "Switch between the finished design and its strokes. (Test drawing: one of your logos will go here.)",
              ),
            ],
            vector: true,
          },
          {
            label: tr("Trabajos", "Work"),
            meta: "03",
            works: [
              {
                title: tr("Logotipo", "Logo"),
                caption: tr(
                  "Texto de prueba: identidad para una marca.",
                  "Test text: identity for a brand.",
                ),
                color: "#e4dcc9",
              },
              {
                title: tr("Set de íconos", "Icon set"),
                caption: tr(
                  "Texto de prueba: una familia de íconos coherente.",
                  "Test text: a coherent family of icons.",
                ),
                color: "#d6e2d8",
              },
              {
                title: tr("Ilustración", "Illustration"),
                caption: tr(
                  "Texto de prueba: vector con carácter propio.",
                  "Test text: vector with its own character.",
                ),
                color: "#dcd6e6",
              },
            ],
          },
        ],
      },
    },
    {
      id: "aviso",
      label: tr("Aviso", "Notice"),
      icon: "/dock/error.avif",
      group: 0,
      window: {
        title: tr("Aviso", "Notice"),
        tabs: [
          {
            label: tr("Aviso", "Notice"),
            lead: tr(
              "Atención: este portafolio puede provocar ganas de contratar a su autor.",
              "Warning: this portfolio may cause an urge to hire its author.",
            ),
            paragraphs: [
              tr(
                `Disponible para trabajo full-time en agencias digitales y de diseño. Si es trabajo remoto, mucho mejor. Desde ${CONTACT.city}.`,
                `Available for full-time work at digital and design agencies. If it is remote work, even better. From ${CONTACT.city}.`,
              ),
            ],
            listTitle: tr("Lo que hago:", "What I do:"),
            list: [
              tr("Diseño y desarrollo web", "Web design and development"),
              tr("Aplicativos con IA", "AI-powered apps"),
              tr("Edición de video vertical", "Vertical video editing"),
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
        title: tr(`Información sobre: ${NAME.alias} (${NAME.full})`, `About: ${NAME.alias} (${NAME.full})`),
        tabs: [
          {
            label: tr("Sobre mí", "About me"),
            meta: "01",
            lead: tr(
              "Diseñador digital que construye ecosistemas web orientados a negocio.",
              "Digital designer who builds business-oriented web ecosystems.",
            ),
            paragraphs: [
              tr(
                `Soy ${NAME.full} y trabajo con el nombre de ${NAME.alias}.`,
                `I am ${NAME.full} and I work under the name ${NAME.alias}.`,
              ),
              tr(
                "Más de tres años combinando UX/UI, e-commerce, contenido audiovisual y pauta digital en Meta, para que cada elemento tenga una función dentro del recorrido del usuario.",
                "Over three years combining UX/UI, e-commerce, audiovisual content and paid media on Meta, so that every element has a role in the user's journey.",
              ),
              tr(
                "Hoy gestiono la tienda Shopify de Boho Chic SAS: creo productos de e-commerce con IA, automatizo procesos y mejoro la experiencia de compra.",
                "Today I manage the Shopify store of Boho Chic SAS: I create e-commerce products with AI, automate processes and improve the shopping experience.",
              ),
            ],
            stats: [
              { value: "500+", label: tr("productos creados con IA", "products created with AI") },
              { value: "10+", label: tr("tareas automatizadas", "automated tasks") },
              { value: "20%", label: tr("de crecimiento en ventas", "sales growth") },
            ],
            listTitle: tr("Puedo hacer...", "I can do..."),
            list: [
              tr(
                "Sitios web y e-commerce (Shopify, Squarespace, WordPress)",
                "Websites and e-commerce (Shopify, Squarespace, WordPress)",
              ),
              tr("Diseño de interfaces UX/UI", "UX/UI interface design"),
              tr("Edición de video y contenido para redes", "Video editing and content for social media"),
              tr("Pauta digital en Meta", "Paid media on Meta"),
              tr("Automatización y productos con IA", "Automation and AI-powered products"),
            ],
            email: CONTACT.email,
            phone: CONTACT.whatsapp,
          },
          {
            label: tr("Experiencia", "Experience"),
            meta: "02",
            entries: [
              {
                title: tr("Gestor Shopify", "Shopify Manager"),
                org: "Boho Chic SAS",
                period: tr("Julio 2026 – Presente", "July 2026 – Present"),
                points: [
                  tr(
                    "Administro la tienda Shopify y la mejoro de forma continua.",
                    "I manage the Shopify store and improve it continuously.",
                  ),
                  tr(
                    "Creé más de 500 productos para el e-commerce con ayuda de IA.",
                    "I created over 500 e-commerce products with the help of AI.",
                  ),
                  tr(
                    "Automaticé más de 10 tareas, desde correos hasta flows que mejoraron los procesos del negocio.",
                    "I automated over 10 tasks, from emails to flows that improved the business's processes.",
                  ),
                  tr(
                    "Diseñé secciones modernas y optimizadas para la tienda.",
                    "I designed modern, optimized sections for the store.",
                  ),
                  tr(
                    "Mejoré la experiencia de compra (UX/UI) y las ventas crecieron un 20%.",
                    "I improved the shopping experience (UX/UI) and sales grew 20%.",
                  ),
                ],
              },
              {
                title: tr("Diseñador web y trafficker", "Web Designer and Paid Media Buyer"),
                org: "Visual Living",
                period: tr("2024 – Julio 2026", "2024 – July 2026"),
                points: [
                  tr(
                    "Desarrollo de sitios web para marcas de moda, restaurantes y diseño.",
                    "Website development for fashion, restaurant and design brands.",
                  ),
                  tr("Campañas digitales en Meta.", "Digital campaigns on Meta."),
                  tr("Edición de contenido audiovisual.", "Audiovisual content editing."),
                ],
              },
              {
                title: tr("Proyectos web", "Web projects"),
                org: "Freelance",
                period: tr("2023 – Actual", "2023 – Present"),
                points: [
                  tr(
                    "Sitios para marcas como Feria EVA, Culto, El Departamento TV y Cloud&Butter.",
                    "Websites for brands like Feria EVA, Culto, El Departamento TV and Cloud&Butter.",
                  ),
                  tr(
                    "Estructuración de portafolios y e-commerce en Squarespace, Shopify y WordPress.",
                    "Portfolio and e-commerce structuring on Squarespace, Shopify and WordPress.",
                  ),
                ],
              },
              {
                title: tr("Diseñador en marketing", "Marketing Designer"),
                org: "Up Strategy",
                period: tr("2023 · 6 meses", "2023 · 6 months"),
                points: [
                  tr("Conceptualización de marca.", "Brand conceptualization."),
                  tr(
                    "Creación de contenido gráfico, video y banners.",
                    "Graphic, video and banner content creation.",
                  ),
                  tr("Diseño de interfaces web.", "Web interface design."),
                ],
              },
            ],
          },
          {
            label: "Skills",
            meta: "03",
            groups: [
              {
                title: tr("Web y e-commerce", "Web and e-commerce"),
                items: [
                  "UX / UI",
                  tr("Arquitectura web", "Web architecture"),
                  "Shopify, Squarespace, WordPress",
                ],
              },
              {
                title: tr("IA y automatización", "AI and automation"),
                items: [
                  tr("Productos de e-commerce con IA", "AI-powered e-commerce products"),
                  tr("Automatización de correos y flows", "Email and flow automation"),
                  tr("Desarrollo con IA", "AI-assisted development"),
                ],
              },
              {
                title: tr("Contenido", "Content"),
                items: [
                  tr("Edición de video", "Video editing"),
                  tr("Diseño gráfico", "Graphic design"),
                  tr("Creación de contenido con IA", "AI content creation"),
                ],
              },
              {
                title: "Digital",
                items: [
                  tr("Pauta digital en Meta", "Paid media on Meta"),
                  tr("Estrategia", "Strategy"),
                  tr("Implementación", "Implementation"),
                ],
              },
            ],
            chipsTitle: tr("Herramientas:", "Tools:"),
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
            label: tr("Educación", "Education"),
            meta: "04",
            entries: [
              {
                title: tr(
                  "Pregrado en Diseño Digital y Multimedia",
                  "Bachelor's degree in Digital Design and Multimedia",
                ),
                org: "Universidad Colegio Mayor de Cundinamarca",
                period: "2019 – 2025",
                points: [],
              },
            ],
          },
          {
            label: tr("Intereses", "Interests"),
            meta: "∞",
            paragraphs: [
              tr("Lo que hago cuando no estoy diseñando:", "What I do when I'm not designing:"),
            ],
            list: [
              tr("Escribir poesía y cuentos", "Writing poetry and short stories"),
              tr("Hacer hiking", "Hiking"),
              tr("Ilustrar", "Illustrating"),
              tr("Cocinar", "Cooking"),
              "Cat lover",
            ],
          },
        ],
      },
    },
    {
      id: "fotos",
      label: tr("Fotos", "Photos"),
      icon: "/dock/imagenes.avif",
      group: 1,
      window: {
        title: tr("Fotos", "Photos"),
        tabs: [
          {
            label: tr("Fotos", "Photos"),
            paragraphs: [
              tr(
                "Texto de prueba: aquí irá una selección de fotografías y detrás de cámaras.",
                "Test text: a selection of photographs and behind the scenes will go here.",
              ),
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
      label: tr("Correo", "Mail"),
      icon: "/dock/mail.avif",
      group: 2,
      window: {
        title: tr("Correo", "Mail"),
        tabs: [
          {
            label: tr("Correo", "Mail"),
            paragraphs: [
              tr(
                "¿Tienes un proyecto, una oferta o solo quieres saludar? Escríbeme.",
                "Do you have a project, an offer, or do you just want to say hi? Write to me.",
              ),
            ],
            email: CONTACT.email,
            phone: CONTACT.whatsapp,
          },
        ],
      },
    },
    {
      id: "papelera",
      label: tr("Papelera", "Trash"),
      icon: "/dock/papelera.avif",
      group: 3,
      window: {
        title: tr("Papelera", "Trash"),
        tabs: [
          {
            label: tr("Papelera", "Trash"),
            trash: {
              emptyReply: tr(
                "No puedo: aquí viven mis mejores lecciones.",
                "I can't: my best lessons live here.",
              ),
              // Placeholder examples. To use a real image, drop it in /public/papelera
              // and set `image: "/papelera/archivo.jpg"` on the item.
              items: [
                {
                  file: "logo_v14_FINAL_final.png",
                  color: "#e7d9c4",
                  what: tr(
                    "Texto de prueba: un logotipo que pasó por 14 versiones y nunca se usó.",
                    "Test text: a logo that went through 14 versions and was never used.",
                  ),
                  learned: tr(
                    "Texto de prueba: con la versión 3 ya sabía la respuesta.",
                    "Test text: by version 3 I already knew the answer.",
                  ),
                },
                {
                  file: tr("propuesta_rechazada.jpg", "rejected_proposal.jpg"),
                  color: "#d9dde3",
                  what: tr(
                    "Texto de prueba: una propuesta de campaña que el cliente descartó en la primera reunión.",
                    "Test text: a campaign proposal the client rejected in the first meeting.",
                  ),
                  learned: tr(
                    "Texto de prueba: entender el problema antes de dibujar la solución.",
                    "Test text: understand the problem before drawing the solution.",
                  ),
                },
                {
                  file: tr("campana_que_nunca_salio.psd", "campaign_that_never_launched.psd"),
                  color: "#e6d3d3",
                  what: tr(
                    "Texto de prueba: una campaña terminada que jamás se publicó.",
                    "Test text: a finished campaign that was never published.",
                  ),
                  learned: tr(
                    "Texto de prueba: no todo lo bueno sale, y está bien.",
                    "Test text: not everything good gets out, and that's okay.",
                  ),
                },
                {
                  file: tr("web_sin_terminar.fig", "unfinished_site.fig"),
                  color: "#d6e2d8",
                  what: tr(
                    "Texto de prueba: un sitio web abandonado a la mitad del diseño.",
                    "Test text: a website abandoned halfway through the design.",
                  ),
                  learned: tr(
                    "Texto de prueba: acotar el alcance desde el día uno.",
                    "Test text: limit the scope from day one.",
                  ),
                },
                {
                  file: tr("rediseno_marca_v2.ai", "brand_redesign_v2.ai"),
                  color: "#e4dcc9",
                  what: tr(
                    "Texto de prueba: un rediseño de marca que se quedó en el cajón.",
                    "Test text: a brand redesign that stayed in the drawer.",
                  ),
                  learned: tr(
                    "Texto de prueba: me enamoré de la idea y no del problema.",
                    "Test text: I fell in love with the idea, not the problem.",
                  ),
                },
                {
                  file: "primer_reel_ever.mov",
                  color: "#dcd6e6",
                  what: tr(
                    "Texto de prueba: el primer video vertical que edité. No envejeció bien.",
                    "Test text: the first vertical video I edited. It didn't age well.",
                  ),
                  learned: tr(
                    "Texto de prueba: el ritmo del corte importa más que los efectos.",
                    "Test text: the rhythm of the cut matters more than the effects.",
                  ),
                },
              ],
            },
          },
        ],
      },
    },
  ];
}
