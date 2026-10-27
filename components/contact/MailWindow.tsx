"use client";

import { useState, type FormEvent, type KeyboardEvent, type PointerEvent, type Ref } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CONTACT, FORMSPREE_ENDPOINT } from "@/lib/config";
import {
  EASE,
  TrafficLights,
  WINDOW_FX,
  WINDOW_FX_REDUCED,
  type WindowFx,
} from "@/components/mac/window";
import { PlaneGlyph } from "./icons";

/** What the visitor has typed. It lives above the window so a minimized or closed draft is not lost. */
export type Draft = { name: string; email: string; reason: string; message: string };
export const EMPTY_DRAFT: Draft = { name: "", email: "", reason: "", message: "" };

const REASONS = ["Oferta laboral", "Propuesta freelance", "Colaboración", "Otro"];

const ROW =
  "flex min-h-[44px] items-center gap-2.5 border-b border-black/[0.09] px-4 text-[14px] sm:px-[18px]";
const LABEL = "w-[52px] shrink-0 text-right text-black/50 sm:w-[62px]";
const INPUT =
  "min-w-0 rounded-md bg-transparent px-1.5 py-1.5 text-[#1d1d1f] outline-none placeholder:text-black/40 focus-visible:ring-2 focus-visible:ring-[#0a84ff]/70";

/**
 * "Nuevo mensaje": the contact form drawn as a Mail compose window. It sends to
 * the same Formspree form as before (same field names and honeypot).
 */
export default function MailWindow({
  draft,
  onDraft,
  zoomed,
  fx,
  windowRef,
  onClose,
  onMinimize,
  onZoom,
  onSent,
  onError,
  onTitlePointerDown,
}: {
  draft: Draft;
  onDraft: (patch: Partial<Draft>) => void;
  zoomed: boolean;
  fx: WindowFx;
  windowRef: Ref<HTMLDivElement>;
  onClose: () => void;
  onMinimize: () => void;
  onZoom: () => void;
  onSent: () => void;
  onError: () => void;
  /** Drag the window by its title bar (only given where windows can be dragged). */
  onTitlePointerDown?: (event: PointerEvent<HTMLElement>) => void;
}) {
  const reduce = useReducedMotion();
  const [sending, setSending] = useState(false);

  function startDrag(event: PointerEvent<HTMLElement>) {
    if (!onTitlePointerDown || zoomed) return;
    // The buttons and fields in the bar keep working as buttons and fields.
    if ((event.target as HTMLElement).closest("button, a, input, select, textarea")) return;
    onTitlePointerDown(event);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    setSending(true);
    const data = new FormData(event.currentTarget);
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (res.ok) onSent();
      else onError();
    } catch {
      onError();
    } finally {
      setSending(false);
    }
  }

  // ⌘↵ / Ctrl↵ sends, like Mail.
  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  return (
    <motion.div
      ref={windowRef}
      layout={!reduce}
      transition={{ layout: { duration: 0.45, ease: EASE } }}
      variants={reduce ? WINDOW_FX_REDUCED : WINDOW_FX}
      custom={fx}
      initial="hidden"
      animate="shown"
      exit="gone"
      className={`flex flex-col overflow-hidden bg-white/70 text-[#1d1d1f] backdrop-blur-[40px] backdrop-saturate-[1.6] ${
        zoomed
          ? "fixed inset-x-0 bottom-0 top-[34px] z-[65]"
          : "relative rounded-[14px] shadow-[0_0_0_0.5px_rgba(0,0,0,0.2),0_40px_80px_-24px_rgba(30,40,40,0.5),0_12px_28px_-10px_rgba(30,40,40,0.3)] lg:h-full"
      }`}
    >
      <form onSubmit={handleSubmit} className="contents">
        {/* Honeypot: invisible to people, bots fill it and Formspree drops the submission. */}
        <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

        <div
          onPointerDown={startDrag}
          className="relative flex h-[52px] shrink-0 select-none items-center gap-3 border-b border-black/[0.12] bg-[#f3f1ee]/90 px-4 lg:touch-none"
        >
          <TrafficLights fixedSize zoomed={zoomed} onClose={onClose} onMinimize={onMinimize} onZoom={onZoom} />
          <p className="pointer-events-none absolute inset-x-0 text-center text-[13px] font-semibold text-black/55 max-sm:hidden">
            Nuevo mensaje
          </p>
          <button
            type="submit"
            disabled={sending}
            data-cursor-hover
            className="relative z-10 ml-auto flex h-[30px] items-center gap-[7px] rounded-full bg-[#0071e3] pl-3 pr-3.5 text-[13px] font-semibold text-white shadow-[0_6px_14px_-6px_rgba(10,132,255,0.8),inset_0_0_0_0.5px_rgba(255,255,255,0.25)] outline-none transition-[filter] hover:brightness-110 focus-visible:ring-2 focus-visible:ring-[#0a84ff]/60 focus-visible:ring-offset-2 disabled:cursor-default disabled:opacity-60"
          >
            <PlaneGlyph />
            {sending ? "Enviando…" : "Enviar"}
            <kbd className="border-l border-white/35 pl-[7px] font-sans text-[11px] font-normal text-white/80 max-sm:hidden">⌘ ↵</kbd>
          </button>
        </div>

        <div className={ROW}>
          <span className={LABEL}>Para:</span>
          <span className="rounded-md bg-[#0a84ff]/15 px-2.5 py-[3px] font-medium text-[#0066cc]">Pip Ariza</span>
          <span className="min-w-0 truncate text-black/55">{CONTACT.email}</span>
        </div>

        <div className={ROW}>
          <label htmlFor="contact-name" className={LABEL}>
            De:
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Tu nombre"
            value={draft.name}
            onChange={(e) => onDraft({ name: e.target.value })}
            className={`${INPUT} w-[34%]`}
          />
          <span aria-hidden="true" className="text-black/35">&lt;</span>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            aria-label="Correo"
            placeholder="tu@correo.com"
            value={draft.email}
            onChange={(e) => onDraft({ email: e.target.value })}
            className={`${INPUT} flex-1`}
          />
          <span aria-hidden="true" className="text-black/35">&gt;</span>
        </div>

        <div className={ROW}>
          <label htmlFor="contact-reason" className={LABEL}>
            Asunto:
          </label>
          <div className="relative">
            <select
              id="contact-reason"
              name="reason"
              required
              value={draft.reason}
              onChange={(e) => onDraft({ reason: e.target.value })}
              data-cursor-hover
              className={`appearance-none rounded-[7px] bg-black/[0.06] py-1 pl-3 pr-8 text-[13.5px] outline-none focus-visible:ring-2 focus-visible:ring-[#0a84ff]/70 [&>option]:bg-white [&>option]:text-[#1d1d1f] ${
                draft.reason ? "text-[#1d1d1f]" : "text-black/55"
              }`}
            >
              <option value="" disabled>
                Elige un motivo
              </option>
              {REASONS.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
            <svg
              width="9"
              height="12"
              viewBox="0 0 9 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-black/55"
              aria-hidden="true"
            >
              <path d="m1.5 4.5 3-3 3 3M1.5 7.5l3 3 3-3" />
            </svg>
          </div>
        </div>

        <label htmlFor="contact-message" className="sr-only">
          Mensaje (opcional)
        </label>
        <textarea
          id="contact-message"
          name="message"
          placeholder="Cuéntame en qué estás pensando — trabajo, colaboración o simple curiosidad."
          value={draft.message}
          onChange={(e) => onDraft({ message: e.target.value })}
          onKeyDown={handleKeyDown}
          className="min-h-[200px] w-full flex-1 resize-none bg-transparent px-5 pb-2 pt-[18px] text-[15px] leading-[1.6] text-[#1d1d1f] outline-none placeholder:text-black/40 lg:min-h-0"
        />
        <p aria-hidden="true" className="px-5 pb-4 text-[13px] text-black/40 max-sm:hidden">
          Enviado desde pipariza.digital
        </p>

        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-black/[0.09] bg-black/[0.03] px-[18px] py-3 text-[12.5px] text-black/55">
          <span className="flex items-center">
            <i
              aria-hidden="true"
              className="mr-2 inline-block h-[7px] w-[7px] rounded-full bg-[#30d158] shadow-[0_0_0_3px_rgba(48,209,88,0.2)]"
            />
            Te respondo en menos de 48 horas
          </span>
          <span className="max-sm:hidden">Mensaje opcional</span>
        </div>
      </form>
    </motion.div>
  );
}
