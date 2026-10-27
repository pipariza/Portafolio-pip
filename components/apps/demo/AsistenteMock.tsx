"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLocale } from "@/components/LocaleProvider";
import { HL, MockWindow } from "./parts";

type Message = { who: "u" | "a"; at: number; delay?: number; text: string; source?: string };

function Typing() {
  return (
    <div className="mr-auto flex w-14 items-center justify-center gap-1 rounded-2xl rounded-bl-sm bg-[#f0eeea] py-3">
      {[0, 1, 2].map((d) => (
        <i
          key={d}
          className="h-1.5 w-1.5 animate-pulse rounded-full bg-black/45"
          style={{ animationDelay: `${d * 180}ms` }}
        />
      ))}
    </div>
  );
}

export default function AsistenteMock({ step }: { step: number }) {
  const { tr } = useLocale();
  const reduce = useReducedMotion();

  // The conversation grows with the steps; older messages slide out of the top of the window.
  const messages: Message[] = [
    {
      who: "u",
      at: 0,
      text: tr("¿Qué tengo atrasado esta semana?", "What do I have overdue this week?"),
    },
    {
      who: "a",
      at: 1,
      text: tr(
        "Tienes 1 tarea atrasada: «Pagar licencia de música». Venció el viernes 7 y es de prioridad alta.",
        "You have 1 overdue task: “Pay music license”. It was due on Friday the 7th and it is high priority.",
      ),
      source: tr("Fuente: las 4 tareas que Ana puede ver", "Source: the 4 tasks Ana can see"),
    },
    {
      who: "u",
      at: 2,
      text: tr("¿Qué posts de Casa Lumen faltan por aprobar?", "Which Casa Lumen posts still need approval?"),
    },
    {
      who: "a",
      at: 2,
      delay: 0.7,
      text: tr(
        "Faltan 2: el 04 (carrusel) y el 07 (reel). El cliente dejó una nota en el 04.",
        "2 are left: 04 (carousel) and 07 (reel). The client left a note on 04.",
      ),
      source: tr("Fuente: cronograma de Casa Lumen", "Source: Casa Lumen's schedule"),
    },
    { who: "u", at: 3, text: tr("Borra el post 04", "Delete post 04") },
    {
      who: "a",
      at: 3,
      delay: 0.7,
      text: tr(
        "Solo puedo consultar: no cambio tareas ni posts. Puedes borrarlo desde la pantalla del cronograma.",
        "I can only look things up: I don't change tasks or posts. You can delete it from the schedule screen.",
      ),
      source: tr("Solo lectura", "Read-only"),
    },
  ];
  const visible = messages.filter((m) => m.at <= step);

  return (
    <MockWindow title={tr("Asistente", "Assistant")} badge={tr("Colaboradora", "Collaborator")}>
      <div className="flex h-full flex-col">
        <div className="flex min-h-0 flex-1 flex-col justify-end gap-2 overflow-hidden p-4 [mask-image:linear-gradient(to_bottom,transparent,black_36px)]">
          {visible.map((m, i) => (
            <motion.div
              key={`${m.who}-${m.at}-${i}`}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: reduce ? 0 : (m.delay ?? 0) }}
              className={m.who === "u" ? "ml-auto max-w-[88%]" : "mr-auto max-w-[92%]"}
            >
              <div
                className={
                  m.who === "u"
                    ? "rounded-2xl rounded-br-sm bg-black px-3 py-2 text-[12px] leading-snug text-white"
                    : `rounded-2xl rounded-bl-sm bg-[#f0eeea] px-3 py-2 text-[12px] leading-snug ${
                        m.at === step ? HL : ""
                      }`
                }
              >
                {m.text}
                {m.source && (
                  <span className="mt-1.5 block border-t border-black/10 pt-1 text-[10px] text-black/55">
                    {m.source}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
          {step === 0 && <Typing />}
        </div>
        <div className="flex h-12 shrink-0 items-center gap-2 border-t border-black/[0.06] px-4">
          <span className="flex-1 truncate text-[11.5px] text-black/45">
            {tr("Escribe tu pregunta…", "Type your question…")}
          </span>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-white">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </span>
        </div>
      </div>
    </MockWindow>
  );
}
