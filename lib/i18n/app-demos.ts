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
