"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLocale } from "@/components/LocaleProvider";
import { HL, Label, MockWindow, Pill } from "./parts";

type Estado = "sin_iniciar" | "en_curso" | "completada" | "atrasada";

/** The platform shows a task's status with a shape, not a color: empty, half, full, dashed. */
function Shape({ estado }: { estado: Estado }) {
  const base = { width: 14, height: 14, viewBox: "0 0 14 14", className: "shrink-0" };
  if (estado === "completada")
    return (
      <svg {...base}>
        <rect x="1" y="1" width="12" height="12" fill="currentColor" />
      </svg>
    );
  if (estado === "en_curso")
    return (
      <svg {...base}>
        <rect x="1" y="1" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <rect x="1" y="7" width="12" height="6" fill="currentColor" />
      </svg>
    );
  if (estado === "atrasada")
    return (
      <svg {...base}>
        <rect
          x="1"
          y="1"
          width="12"
          height="12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="2.4 2.1"
        />
      </svg>
    );
  return (
    <svg {...base}>
      <rect x="1" y="1" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function Field({
  label,
  value,
  hl,
  caret,
}: {
  label: string;
  value: string;
  hl?: boolean;
  caret?: boolean;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div
        className={`mt-1 flex h-9 items-center rounded-md border border-black/20 bg-white px-3 text-[12px] ${
          hl ? HL : ""
        }`}
      >
        <span className="truncate">{value}</span>
        {caret && <span className="ml-0.5 h-4 w-px animate-pulse bg-black" />}
      </div>
    </div>
  );
}

function Segmented({
  options,
  selected,
  hl,
}: {
  options: string[];
  selected: number;
  hl?: boolean;
}) {
  return (
    <div className={`inline-flex rounded-full border border-black/20 p-0.5 ${hl ? HL : ""}`}>
      {options.map((o, i) => (
        <span
          key={o}
          className={`rounded-full px-3 py-1 text-[11px] font-medium ${
            i === selected ? "bg-black text-white" : "text-black/65"
          }`}
        >
          {o}
        </span>
      ))}
    </div>
  );
}

function Row({
  estado,
  title,
  date,
  prio,
}: {
  estado: Estado;
  title: string;
  date: string;
  prio: "alta" | "media" | "baja";
}) {
  const { tr } = useLocale();
  const word = { alta: tr("alta", "high"), media: tr("media", "medium"), baja: tr("baja", "low") }[prio];
  return (
    <div className="flex items-center gap-3 border-b border-black/10 py-2.5">
      <Shape estado={estado} />
      <span className="min-w-0 flex-1 truncate text-[12px] font-medium">{title}</span>
      <span className="shrink-0 text-[10px] text-black/55">{date}</span>
      <span
        className={`w-10 shrink-0 text-right text-[10px] ${
          prio === "alta" ? "font-bold uppercase" : prio === "baja" ? "text-black/55" : ""
        }`}
      >
        {word}
      </span>
    </div>
  );
}

function Crear() {
  const { tr } = useLocale();
  return (
    <div className="space-y-3 p-5">
      <p className="text-[15px] font-bold tracking-tight">{tr("Nueva tarea", "New task")}</p>
      <Field
        label={tr("Título", "Title")}
        value={tr("Entregar piezas de campaña", "Deliver campaign pieces")}
        caret
      />
      <div className="grid grid-cols-2 gap-3">
        <Field label={tr("Responsable", "Owner")} value="Ana  ▾" hl />
        <Field label={tr("Fecha límite", "Due date")} value={tr("Vie 14 nov", "Fri Nov 14")} />
      </div>
      <div>
        <Label>{tr("Prioridad", "Priority")}</Label>
        <div className="mt-1">
          <Segmented options={[tr("Alta", "High"), tr("Media", "Medium"), tr("Baja", "Low")]} selected={0} />
        </div>
      </div>
      <div className="pt-2">
        <Pill tone="dark" className="h-9 px-5 text-[12px]">
          {tr("Crear tarea", "Create task")}
        </Pill>
      </div>
      <p className="text-[10px] text-black/55">
        {tr("Queda en la semana del 10 al 16 de noviembre.", "It lands in the week of November 10 to 16.")}
      </p>
    </div>
  );
}

function MisTareas() {
  const { tr } = useLocale();
  return (
    <div className="p-5">
      <div className="space-y-4">
        <div>
          <Label>{tr("Atrasadas · 1", "Overdue · 1")}</Label>
          <Row
            estado="atrasada"
            title={tr("Pagar licencia de música", "Pay music license")}
            date={tr("Vie 7", "Fri 7")}
            prio="alta"
          />
        </div>
        <div>
          <Label>{tr("Esta semana · 2", "This week · 2")}</Label>
          <Row
            estado="sin_iniciar"
            title={tr("Entregar piezas de campaña", "Deliver campaign pieces")}
            date={tr("Vie 14", "Fri 14")}
            prio="alta"
          />
          <Row
            estado="en_curso"
            title={tr("Editar reel de lanzamiento", "Edit launch reel")}
            date={tr("Mié 12", "Wed 12")}
            prio="media"
          />
        </div>
        <div>
          <Label>{tr("Completadas · 1", "Done · 1")}</Label>
          <Row
            estado="completada"
            title={tr("Subir logos al drive", "Upload logos to the drive")}
            date={tr("Lun 3", "Mon 3")}
            prio="baja"
          />
        </div>
      </div>
      <div className={`mt-4 rounded-lg bg-[#f3f1ee] p-3 text-[11px] leading-snug ${HL}`}>
        {tr(
          "Ana solo ve sus tareas: las de Luis no aparecen, ni siquiera si pregunta por ellas.",
          "Ana only sees her own tasks: Luis's don't show up, not even if she asks about them.",
        )}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-black/60">
        {(
          [
            ["sin_iniciar", tr("sin iniciar", "not started")],
            ["en_curso", tr("en curso", "in progress")],
            ["completada", tr("completada", "done")],
            ["atrasada", tr("atrasada", "overdue")],
          ] as [Estado, string][]
        ).map(([e, label]) => (
          <span key={e} className="inline-flex items-center gap-1.5">
            <Shape estado={e} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

function Detalle() {
  const { tr } = useLocale();
  return (
    <div className="p-5">
      <p className="text-[15px] font-bold tracking-tight">
        {tr("Entregar piezas de campaña", "Deliver campaign pieces")}
      </p>
      <p className="mt-1 text-[11px] text-black/60">
        {tr("Vence el vie 14 nov · Prioridad ", "Due Fri Nov 14 · Priority ")}
        <strong className="font-bold uppercase">{tr("alta", "high")}</strong>
      </p>
      <div className="mt-4">
        <Segmented
          options={[tr("Sin iniciar", "Not started"), tr("En curso", "In progress"), tr("Completada", "Done")]}
          selected={1}
          hl
        />
      </div>
      <div className="mt-5">
        <Label>{tr("Notas", "Notes")}</Label>
        <div className="mt-2 space-y-2">
          <div className="rounded-lg bg-[#f3f1ee] p-3">
            <p className="text-[10px] font-bold">Ana</p>
            <p className="mt-0.5 text-[12px] leading-snug">
              {tr("Ya van 6 de 10 piezas, termino mañana.", "6 of 10 pieces done, I finish tomorrow.")}
            </p>
          </div>
          <div className="rounded-lg bg-[#f3f1ee] p-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold">Admin</p>
              <span className="text-[10px] text-black/55">✓ {tr("Revisada", "Reviewed")}</span>
            </div>
            <p className="mt-0.5 text-[12px] leading-snug">
              {tr("Perfecto. Mándame el enlace cuando esté.", "Great. Send me the link when it's ready.")}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-4 flex h-9 items-center rounded-full border border-black/20 px-4 text-[11px] text-black/45">
        {tr("Escribe una nota…", "Write a note…")}
      </div>
    </div>
  );
}

function Avisos() {
  const { tr } = useLocale();
  const bars: [Estado, string, number][] = [
    ["completada", tr("Completadas", "Done"), 7],
    ["en_curso", tr("En curso", "In progress"), 2],
    ["atrasada", tr("Atrasadas", "Overdue"), 1],
  ];
  return (
    <div className="space-y-3 p-4">
      <div className={`rounded-lg border border-black/15 p-3 ${HL}`}>
        <div className="flex items-center gap-2 text-[10px] text-black/55">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 7 9 6 9-6" />
          </svg>
          {tr("Visual · Alerta automática", "Visual · Automatic alert")}
        </div>
        <p className="mt-2 text-[13px] font-bold tracking-tight">
          {tr("Tu tarea vence mañana", "Your task is due tomorrow")}
        </p>
        <p className="mt-1 text-[11.5px] leading-snug text-black/70">
          {tr(
            "«Entregar piezas de campaña» vence el vie 14 nov. Prioridad alta.",
            "“Deliver campaign pieces” is due Fri Nov 14. High priority.",
          )}
        </p>
        <p className="mt-2 text-[10px] text-black/50">
          {tr("Se envía solo, una vez al día, si la tarea está por vencer o ya venció.", "Sent on its own, once a day, when a task is about to be due or is overdue.")}
        </p>
      </div>
      <div className="rounded-lg border border-black/15 p-3">
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-bold tracking-tight">{tr("Reporte · Ana", "Report · Ana")}</p>
          <Badge10>{tr("Admin", "Admin")}</Badge10>
        </div>
        <div className="mt-3 space-y-2">
          {bars.map(([e, label, n]) => (
            <div key={e} className="flex items-center gap-2 text-[11px]">
              <Shape estado={e} />
              <span className="w-[74px] shrink-0">{label}</span>
              <span className="h-1.5 flex-1 rounded-full bg-black/10">
                <span className="block h-full rounded-full bg-black" style={{ width: `${n * 10}%` }} />
              </span>
              <span className="w-4 text-right font-bold">{n}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Badge10({ children }: { children: string }) {
  return (
    <span className="rounded-full border border-black/25 px-2 py-0.5 text-[8.5px] font-bold uppercase tracking-[0.06em]">
      {children}
    </span>
  );
}

export default function TareasMock({ step }: { step: number }) {
  const { tr } = useLocale();
  const reduce = useReducedMotion();

  const frames = [
    { title: tr("Nueva tarea", "New task"), badge: "Admin", scene: <Crear /> },
    { title: tr("Mis tareas", "My tasks"), badge: tr("Colaboradora", "Collaborator"), scene: <MisTareas /> },
    { title: tr("Detalle de la tarea", "Task detail"), badge: tr("Colaboradora", "Collaborator"), scene: <Detalle /> },
    { title: tr("Correo y reporte", "Email and report"), badge: null, scene: <Avisos /> },
  ];
  const frame = frames[Math.min(step, frames.length - 1)];

  return (
    <MockWindow title={frame.title} badge={frame.badge}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="absolute inset-0"
        >
          {frame.scene}
        </motion.div>
      </AnimatePresence>
    </MockWindow>
  );
}
