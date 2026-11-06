import type { DemoId } from "@/lib/data";
import { VISUAL_FRAMES, type DemoFrame } from "@/lib/visual-frames";
import type { Bi } from "./config";

/*
 * The steps of the "how it works" demo on each app's page (components/apps/demo), with their
 * texts in both languages next to each other. Each step plays a short sequence of screens of the
 * REAL platform (lib/visual-frames.ts, files in public/apps/visual): either frames of an action
 * (typing, tapping, dragging) or a full page that scrolls slowly. They were captured from a
 * throwaway copy of Visual running on made-up data (invented brand, people and dates); a blue ring
 * marks what each step is about. The platform's interface is in Spanish, so the screens are the
 * same in both languages.
 */
export type DemoStep = { title: Bi; text: Bi; frames: DemoFrame[] };

export const DEMO_STEPS: Record<DemoId, DemoStep[]> = {
  tareas: [
    {
      frames: VISUAL_FRAMES["tareas-1"],
      title: { es: "El admin asigna", en: "The admin assigns" },
      text: {
        es: "Crea la tarea con título, responsable, semana, fecha límite y prioridad, y si quiere la repite en las semanas siguientes.",
        en: "Creates the task with a title, owner, week, due date and priority, and can repeat it in the following weeks.",
      },
    },
    {
      frames: VISUAL_FRAMES["tareas-2"],
      title: { es: "Cada quien ve lo suyo", en: "Everyone sees their own" },
      text: {
        es: "El colaborador entra con un código de 8 dígitos que le llega al correo. Ve solo sus tareas, ordenadas por urgencia y con su estado, y no puede ver las de sus compañeros.",
        en: "Collaborators sign in with an 8-digit code sent to their email. They see only their own tasks, sorted by urgency and with their status, and cannot see their teammates'.",
      },
    },
    {
      frames: VISUAL_FRAMES["tareas-3"],
      title: { es: "Avanza con estados y notas", en: "Moves on with statuses and notes" },
      text: {
        es: "Con un toque inicia o completa la tarea y puede dejar una nota para el admin. El estado «atrasada» lo calcula el sistema solo, según la fecha.",
        en: "With one tap they start or complete the task and can leave a note for the admin. The “overdue” status is calculated by the system from the due date.",
      },
    },
    {
      frames: VISUAL_FRAMES["tareas-4"],
      title: { es: "El admin hace seguimiento", en: "The admin follows up" },
      text: {
        es: "Ve de un vistazo qué está atrasado, qué vence hoy y qué notas faltan por revisar, filtra por colaborador y genera reportes. Cada día el sistema envía un correo cuando una tarea está por vencer o ya venció.",
        en: "Sees at a glance what is overdue, what is due today and which notes are still unread, filters by collaborator and generates reports. Every day the system emails when a task is about to be due or is overdue.",
      },
    },
    {
      frames: VISUAL_FRAMES["tareas-5"],
      title: { es: "Un asistente de IA", en: "An AI assistant" },
      text: {
        es: "Responde en lenguaje natural sobre las tareas y los cronogramas que esa persona puede ver. Solo consulta: no cambia nada, y si no tiene el dato lo dice en vez de inventarlo.",
        en: "Answers in plain language about the tasks and schedules that person can see. It is read-only: it changes nothing, and if it does not have the data it says so instead of making it up.",
      },
    },
  ],
  cronogramas: [
    {
      frames: VISUAL_FRAMES["cronogramas-1"],
      title: { es: "Se arma la grilla", en: "The grid takes shape" },
      text: {
        es: "Cada marca tiene su cronograma: una grilla de posts como la de Instagram. Se reordena arrastrando (con pulsación larga en el celular) y se ve cómo quedará el perfil.",
        en: "Each brand has its own schedule: a grid of posts like Instagram's. It is reordered by dragging (long press on a phone), so you see how the profile will look.",
      },
    },
    {
      frames: VISUAL_FRAMES["cronogramas-2"],
      title: { es: "Cada post, al detalle", en: "Every post in detail" },
      text: {
        es: "Archivos (imagen, carrusel o video de hasta 500 MB, con subida reanudable), caption y fecha. Las notas pueden ir en una imagen puntual del carrusel.",
        en: "Files (an image, a carousel or a video of up to 500 MB, with resumable uploads), caption and date. Notes can be attached to one specific image of the carousel.",
      },
    },
    {
      frames: VISUAL_FRAMES["cronogramas-3"],
      title: { es: "El cliente revisa por un link", en: "The client reviews from a link" },
      text: {
        es: "Sin crear cuenta: abre el link, puede corregir el caption, deja notas y aprueba. El equipo ve los cambios en pocos segundos.",
        en: "No account needed: they open the link, can fix the caption, leave notes and approve. The team sees the changes within seconds.",
      },
    },
    {
      frames: VISUAL_FRAMES["cronogramas-4"],
      title: { es: "Aprobación y entrega", en: "Approval and delivery" },
      text: {
        es: "Se aprueba post por post o todos a la vez, y el equipo ve cuántos faltan. Luego se descarga en ZIP o en PDF, y el cronograma se borra solo a los 30 días.",
        en: "Posts are approved one by one or all at once, and the team sees how many are left. Then it is downloaded as a ZIP or a PDF, and the schedule deletes itself after 30 days.",
      },
    },
  ],
};

/** The note under every demo: the screens are real, the data is not. */
export const DEMO_DISCLAIMER: Bi = {
  es: "Pantallas de la plataforma real con datos ficticios (marca, personas y fechas inventadas): la plataforma es privada y guarda información de clientes.",
  en: "Screens of the real platform with made-up data (invented brand, people and dates): the platform is private and holds clients' information. Its interface is in Spanish.",
};

export const DEMO_UI = {
  heading: { es: "Cómo funciona", en: "How it works" } satisfies Bi,
  pause: { es: "Pausar", en: "Pause" } satisfies Bi,
  play: { es: "Reproducir", en: "Play" } satisfies Bi,
  step: { es: "Paso", en: "Step" } satisfies Bi,
  of: { es: "de", en: "of" } satisfies Bi,
  screen: { es: "Pantalla de la plataforma", en: "Platform screen" } satisfies Bi,
};

/** What an app does, as short cards, for the apps that do not have a step-by-step demo yet. */
export const APP_FEATURES: Record<string, { title: Bi; text: Bi }[]> = {
  macros: [
    {
      title: { es: "Registro diario", en: "Daily log" },
      text: {
        es: "Busca un alimento o una receta, pon los gramos y los macros se calculan y se guardan.",
        en: "Search a food or a recipe, enter the grams and the macros are worked out and saved.",
      },
    },
    {
      title: { es: "Los macros del día", en: "Today's macros" },
      text: {
        es: "Calorías, proteína, carbohidratos y grasa de cada persona, lado a lado, con anillos de progreso.",
        en: "Calories, protein, carbs and fat for each person, side by side, with progress rings.",
      },
    },
    {
      title: { es: "Recetas y despensa", en: "Recipes and pantry" },
      text: {
        es: "Recetas con macros calculados al instante y sugerencias según lo que hay en la despensa.",
        en: "Recipes with instantly calculated macros and suggestions based on what is in the pantry.",
      },
    },
    {
      title: { es: "Plan semanal y compras", en: "Weekly plan and shopping" },
      text: {
        es: "La semana planeada y una lista de compras para no improvisar.",
        en: "The week planned out and a shopping list so nothing is improvised.",
      },
    },
    {
      title: { es: "IA que ayuda", en: "AI that helps" },
      text: {
        es: "Calcula los macros de un alimento con su nombre, registra una comida describiéndola y propone los ingredientes de una receta.",
        en: "Works out a food's macros from its name, logs a meal from a description and drafts a recipe's ingredients.",
      },
    },
    {
      title: { es: "Progreso y reportes", en: "Progress and reports" },
      text: {
        es: "Historial con gráficas y reportes en PDF y CSV.",
        en: "History with charts and reports in PDF and CSV.",
      },
    },
    {
      title: { es: "Sin contraseñas", en: "No passwords" },
      text: {
        es: "Un código de casa compartido entra a los dos. Se instala como app y se puede consultar sin conexión.",
        en: "A shared household code gets both people in. It installs as an app and can be read offline.",
      },
    },
  ],
  "free-spirit": [
    {
      title: { es: "Precios por ciudad desde Excel", en: "City prices from Excel" },
      text: {
        es: "Se exporta el catálogo, se llena una columna por cada una de las 10 ciudades y se vuelve a importar. Antes de guardar hay una vista previa que pone los errores primero.",
        en: "The catalog is exported, one column is filled in for each of the 10 cities and it is imported back. Before saving, a preview shows the errors first.",
      },
    },
    {
      title: { es: "Importación que no pisa cambios", en: "Imports that don't overwrite changes" },
      text: {
        es: "Hasta 10.000 variantes por ciudad en segundo plano, con historial. Cada lote se comprueba otra vez contra Shopify antes de escribir; si alguien cambió el precio mientras tanto, no se pisa.",
        en: "Up to 10,000 variants per city in the background, with a history. Each batch is checked against Shopify again before writing; if someone changed the price in the meantime, it is not overwritten.",
      },
    },
    {
      title: { es: "Nacional tachado, regional al lado", en: "National struck through, regional beside it" },
      text: {
        es: "En producto, colecciones, búsqueda, buscador predictivo, inicio y recomendaciones se ve el precio nacional tachado junto al de la ciudad.",
        en: "On product pages, collections, search, predictive search, home and recommendations the national price shows struck through next to the city's.",
      },
    },
    {
      title: { es: "El carrito cobra lo que se ve", en: "The cart charges what you see" },
      text: {
        es: "Una función de Shopify (Cart Transform) corre en sus servidores y fija el precio regional de cada línea al pagar; no depende del navegador de quien compra.",
        en: "A Shopify Function (Cart Transform) runs on Shopify's servers and sets each line's regional price at checkout; it does not depend on the shopper's browser.",
      },
    },
    {
      title: { es: "Reglas que cuidan el margen", en: "Rules that protect the margin" },
      text: {
        es: "Los productos con etiqueta SALE conservan su oferta, y si el precio regional falta o es mayor que el nacional, se cobra el nacional. Solo pesos colombianos enteros.",
        en: "Products tagged SALE keep their offer, and if the regional price is missing or higher than the national one, the national price is charged. Whole Colombian pesos only.",
      },
    },
    {
      title: { es: "Contenido por ciudad", en: "Content by city" },
      text: {
        es: "Banners que solo ven algunas ciudades, secciones que se ocultan en otras y colecciones propias de cada ciudad que la web usa sola cuando están publicadas.",
        en: "Banners only some cities see, sections hidden in others and each city's own collections, which the site uses on its own when they are published.",
      },
    },
    {
      title: { es: "Guía para el equipo de pauta", en: "Guide for the ads team" },
      text: {
        es: "Un PDF de 6 páginas que explica cómo armar los anuncios en Meta (catálogo o enlace manual), con los textos listos por ciudad y una lista de revisión.",
        en: "A 6-page PDF that explains how to build the ads on Meta (catalog or manual link), with ready-made text for each city and a checklist.",
      },
    },
    {
      title: { es: "Medición por ciudad", en: "Results by city" },
      text: {
        es: "La ciudad queda guardada en cada pedido y, con las UTM del anuncio, se comparan las ventas de una ciudad con otra.",
        en: "The city is saved on every order and, with the ad's UTMs, one city's sales can be compared with another's.",
      },
    },
  ],
};

export const FEATURES_HEADING: Bi = { es: "Qué hace", en: "What it does" };

/** "How it works" of an app without a demo: numbered steps, in the order things happen. */
export const APP_FLOW: Record<string, { title: Bi; text: Bi }[]> = {
  "free-spirit": [
    {
      title: { es: "El enlace elige la ciudad", en: "The link picks the city" },
      text: {
        es: "No importa dónde esté la persona: cuenta el enlace por el que entra, un subdominio de la ciudad o el parámetro ?fs_campaign=cali. Queda guardado 7 días en el navegador y en el carrito.",
        en: "Where the person is does not matter: what counts is the link they come in through, a city subdomain or the ?fs_campaign=cali parameter. It is kept for 7 days in the browser and on the cart.",
      },
    },
    {
      title: { es: "Los precios viven en Shopify", en: "The prices live in Shopify" },
      text: {
        es: "Cada variante guarda en un metacampo un pequeño JSON con el precio de cada ciudad. La app lo escribe desde el Excel; no hay otra base de precios que mantener.",
        en: "Each variant keeps a small JSON with each city's price in a metafield. The app writes it from the Excel; there is no other price database to maintain.",
      },
    },
    {
      title: { es: "La tienda lo muestra", en: "The store shows it" },
      text: {
        es: "Un script del tema lee la ciudad y dibuja el precio nacional tachado con el regional. Lo que carga después de la página, como el buscador, consulta los precios con un acceso público de solo lectura a la API de tienda.",
        en: "A theme script reads the city and draws the national price struck through with the regional one. What loads after the page, like search, fetches the prices with public read-only access to the Storefront API.",
      },
    },
    {
      title: { es: "El carrito lo cobra", en: "The cart charges it" },
      text: {
        es: "Al pagar, la función del carrito lee la ciudad y el metacampo de cada producto y fija el precio por unidad. Si algo no cuadra, queda el nacional: nunca cobra más que el nacional.",
        en: "At checkout, the cart function reads the city and each product's metafield and sets the unit price. If anything does not add up, the national price stays: it never charges more than the national one.",
      },
    },
    {
      title: { es: "Se mide por ciudad", en: "It is measured by city" },
      text: {
        es: "La ciudad queda en el pedido y, con las UTM del anuncio, se ve qué ciudad vende más.",
        en: "The city stays on the order and, with the ad's UTMs, you can see which city sells more.",
      },
    },
  ],
};
export const FLOW_HEADING: Bi = { es: "Cómo funciona", en: "How it works" };

/** A screen of an app without a step-by-step demo: a capture with its caption (components/apps/AppShots). */
export type Shot = {
  group: "panel" | "store";
  title: Bi;
  text: Bi;
  alt: Bi;
  /** The window's title bar (not translated: it is what the screen itself says). */
  label: string;
  /** Under /public. Windows are 4:3; the phone is 390:844. */
  src: string;
  frame: "window" | "phone";
};

export const APP_SHOTS: Record<string, Shot[]> = {
  "free-spirit": [
    {
      group: "panel",
      title: { es: "Precios por ciudad", en: "Prices by city" },
      text: {
        es: "El panel de la app dentro de Shopify: eliges la ciudad, buscas un producto o un SKU y ves el precio nacional junto al regional, que se edita al momento.",
        en: "The app's admin inside Shopify: pick the city, search a product or a SKU and see the national price next to the regional one, which you can edit on the spot.",
      },
      alt: { es: "Panel de precios regionales con la tabla de variantes", en: "Regional prices admin with the variants table" },
      label: "Free Spirit | Precios regionales",
      src: "/apps/free-spirit/panel-precios.webp",
      frame: "window",
    },
    {
      group: "panel",
      title: { es: "Importar el Excel", en: "Importing the Excel" },
      text: {
        es: "Se sube el Excel de una ciudad (o de todas). La app lo valida antes de tocar nada: 15 cambios, 9 sin cambio, 0 errores; solo entonces se confirma.",
        en: "The Excel for one city (or all of them) is uploaded. The app validates it before touching anything: 15 changes, 9 unchanged, 0 errors; only then is it confirmed.",
      },
      alt: { es: "Vista previa de la importación con los cambios de precio", en: "Import preview with the price changes" },
      label: "Importar precios por ciudad",
      src: "/apps/free-spirit/panel-importar.webp",
      frame: "window",
    },
    {
      group: "panel",
      title: { es: "Historial de importaciones", en: "Import history" },
      text: {
        es: "Cada importación queda registrada con su archivo, su estado y cuántas variantes se guardaron. Si algo falla, se ve cuál y por qué.",
        en: "Every import is recorded with its file, its status and how many variants were saved. If something fails, you can see which one and why.",
      },
      alt: { es: "Historial de importaciones con su estado", en: "Import history with each one's status" },
      label: "Historial de importaciones",
      src: "/apps/free-spirit/panel-historial.webp",
      frame: "window",
    },
    {
      group: "store",
      title: { es: "Colección con los precios de la ciudad", en: "Collection with the city's prices" },
      text: {
        es: "Con la campaña activa aparece el banner de la ciudad y cada tarjeta muestra el precio nacional tachado y el regional. Lo que está en SALE conserva su oferta.",
        en: "With the campaign on, the city banner appears and each card shows the national price struck through and the regional one. Anything on SALE keeps its offer.",
      },
      alt: { es: "Colección de la tienda con precios regionales", en: "Store collection with regional prices" },
      label: "Tienda de ejemplo · ?fs_campaign=barranquilla",
      src: "/apps/free-spirit/tienda-coleccion.webp",
      frame: "window",
    },
    {
      group: "store",
      title: { es: "Página de producto", en: "Product page" },
      text: {
        es: "El mismo precio nacional tachado y el regional en la página del producto, para la variante elegida.",
        en: "The same struck-through national price and the regional one on the product page, for the chosen variant.",
      },
      alt: { es: "Página de producto con precio regional", en: "Product page with regional price" },
      label: "Tienda de ejemplo · ?fs_campaign=barranquilla",
      src: "/apps/free-spirit/tienda-producto.webp",
      frame: "window",
    },
    {
      group: "store",
      title: { es: "En el celular", en: "On a phone" },
      text: {
        es: "Así llega quien entra desde el anuncio de Instagram o Facebook: lo mismo, en pantalla de celular.",
        en: "How it looks for someone coming from an Instagram or Facebook ad: the same, on a phone screen.",
      },
      alt: { es: "Página de producto en el celular con precio regional", en: "Product page on a phone with regional price" },
      label: "",
      src: "/apps/free-spirit/tienda-movil.webp",
      frame: "phone",
    },
    {
      group: "store",
      title: { es: "El carrito", en: "The cart" },
      text: {
        es: "Maqueta del resultado: al pagar, la función de Shopify deja cada línea al precio de la ciudad; lo que se vio es lo que se cobra.",
        en: "Mock-up of the result: at checkout, the Shopify function leaves each line at the city's price; what was shown is what is charged.",
      },
      alt: { es: "Carrito con los precios de la ciudad", en: "Cart with the city's prices" },
      label: "Tienda de ejemplo · carrito",
      src: "/apps/free-spirit/tienda-carrito.webp",
      frame: "window",
    },
  ],
};

export const SHOTS_UI = {
  heading: { es: "Así se ve", en: "How it looks" } satisfies Bi,
  panel: { es: "En el panel de la app", en: "In the app's admin" } satisfies Bi,
  store: { es: "En la tienda", en: "In the store" } satisfies Bi,
  disclaimer: {
    es: "Panel: capturas de la app real con datos inventados. Tienda: una tienda de ejemplo («Alba», con productos y precios inventados) que corre el script real de la extensión; el carrito es una maqueta del resultado. No se muestra la tienda ni los precios de Free Spirit.",
    en: "Admin: screens of the real app with made-up data. Store: an example store (\"Alba\", with invented products and prices) running the extension's real script; the cart is a mock-up of the result. Free Spirit's own store and prices are not shown. The admin's interface is in Spanish.",
  } satisfies Bi,
};
