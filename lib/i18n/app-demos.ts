import type { DemoId } from "@/lib/data";
import type { Bi } from "./config";

/*
 * The steps of the "how it works" demo on each app's page (components/apps/demo), in both
 * languages next to each other. The screens drawn for each step (with made-up data) are in
 * the *Mock.tsx files of that folder; keep the number of steps here equal to the number of
 * scenes there.
 */
export type DemoStep = { title: Bi; text: Bi };

export const DEMO_STEPS: Record<DemoId, DemoStep[]> = {
  tareas: [
    {
      title: { es: "El admin asigna", en: "The admin assigns" },
      text: {
        es: "Pone título, responsable, fecha límite y prioridad. La tarea cae en su semana.",
        en: "Sets a title, owner, due date and priority. The task lands in its week.",
      },
    },
    {
      title: { es: "Cada quien ve lo suyo", en: "Everyone sees their own" },
      text: {
        es: "El colaborador entra con un código de 8 dígitos que le llega al correo. Ve sus tareas por urgencia y no puede ver las de sus compañeros.",
        en: "Collaborators sign in with an 8-digit code sent to their email. They see their tasks by urgency and cannot see their teammates'.",
      },
    },
    {
      title: { es: "Avanza con estados y notas", en: "Moves on with statuses and notes" },
      text: {
        es: "Marca la tarea como sin iniciar, en curso o completada y deja notas. El estado «atrasada» lo calcula el sistema solo, según la fecha.",
        en: "Marks the task as not started, in progress or done and leaves notes. The “overdue” status is calculated by the system from the due date.",
      },
    },
    {
      title: { es: "Avisos y reportes", en: "Alerts and reports" },
      text: {
        es: "Cada día el sistema envía un correo cuando una tarea está por vencer o ya venció, y el admin consulta un reporte por colaborador.",
        en: "Every day the system emails when a task is about to be due or is overdue, and the admin checks a report per collaborator.",
      },
    },
  ],
  cronogramas: [
    {
      title: { es: "Se arma la grilla", en: "The grid takes shape" },
      text: {
        es: "Cada marca tiene su cronograma: una grilla de posts como la de Instagram. Se reordena arrastrando y se ve cómo quedará el perfil.",
        en: "Each brand has its own schedule: a grid of posts like Instagram's. It is reordered by dragging, so you see how the profile will look.",
      },
    },
    {
      title: { es: "Cada post, al detalle", en: "Every post in detail" },
      text: {
        es: "Fecha, caption y archivos: imagen, carrusel o video de hasta 500 MB, con subida reanudable. Las notas pueden ir en una imagen puntual.",
        en: "Date, caption and files: an image, a carousel or a video of up to 500 MB, with resumable uploads. Notes can be attached to one specific image.",
      },
    },
    {
      title: { es: "El cliente revisa por un link", en: "The client reviews from a link" },
      text: {
        es: "Sin crear cuenta: abre el link, edita captions, deja notas y aprueba. El equipo ve los cambios en pocos segundos.",
        en: "No account needed: they open the link, edit captions, leave notes and approve. The team sees the changes within seconds.",
      },
    },
    {
      title: { es: "Aprobación y entrega", en: "Approval and delivery" },
      text: {
        es: "Se aprueba post por post o todos a la vez. Luego se descarga en ZIP o en PDF, y el cronograma se borra solo a los 30 días.",
        en: "Posts are approved one by one or all at once. Then it is downloaded as a ZIP or a PDF, and the schedule deletes itself after 30 days.",
      },
    },
  ],
};

/** The note under every demo: the screens are drawn, the real platform holds clients' data. */
export const DEMO_DISCLAIMER: Bi = {
  es: "Pantallas ilustrativas con datos ficticios: la plataforma real es privada y guarda información de clientes.",
  en: "Illustrative screens with made-up data: the real platform is private and holds clients' information.",
};

export const DEMO_UI = {
  heading: { es: "Cómo funciona", en: "How it works" } satisfies Bi,
  pause: { es: "Pausar", en: "Pause" } satisfies Bi,
  play: { es: "Reproducir", en: "Play" } satisfies Bi,
  step: { es: "Paso", en: "Step" } satisfies Bi,
  of: { es: "de", en: "of" } satisfies Bi,
};
