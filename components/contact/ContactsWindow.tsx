"use client";

import { useState, type PointerEvent, type ReactNode, type Ref } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CONTACT } from "@/lib/config";
import {
  TrafficLights,
  WINDOW_FX,
  WINDOW_FX_REDUCED,
  type WindowFx,
} from "@/components/mac/window";
import { ChatGlyph, EnvelopeGlyph, InstagramGlyph } from "./icons";

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard can be blocked; the link next to it still works.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copiar ${label}`}
      data-cursor-hover
      className="shrink-0 rounded-full border border-[#c4b9ff]/40 px-2.5 py-0.5 text-[11px] font-medium text-[#e4defe]/85 outline-none transition-colors hover:bg-[#8b7bff]/25 focus-visible:ring-2 focus-visible:ring-[#b4a8ff]/80"
    >
      {copied ? "Copiado ✓" : "Copiar"}
    </button>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-[#c4b9ff]/[0.18] px-[22px] py-[11px]">
      <div className="min-w-0">
        <p className="text-[11.5px] text-[#d6d0ff]/60">{label}</p>
        <div className="truncate text-[14px] text-[#c9bfff]">{children}</div>
      </div>
    </div>
  );
}

const LINK = "outline-none hover:underline focus-visible:underline";

function Action({ href, label, external, children }: { href: string; label: string; external?: boolean; children: ReactNode }) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : null)}
      data-cursor-hover
      className="group/action w-[74px] text-center text-[11.5px] text-[#d6d0ff]/75 outline-none"
    >
      <span className="mx-auto mb-1.5 grid h-11 w-11 place-items-center rounded-full bg-[#8b7bff]/25 text-[#d4c9ff] transition-colors group-hover/action:bg-[#8b7bff]/40 group-focus-visible/action:ring-2 group-focus-visible/action:ring-[#b4a8ff]/80">
        {children}
      </span>
      {label}
    </a>
  );
}

/** "Contactos": Pip's card, with the same links as the form's alternatives. */
export default function ContactsWindow({
  fx,
  windowRef,
  onClose,
  onMinimize,
  onTitlePointerDown,
}: {
  fx: WindowFx;
  windowRef: Ref<HTMLDivElement>;
  onClose: () => void;
  onMinimize: () => void;
  /** Drag the window by its title bar (only given where windows can be dragged). */
  onTitlePointerDown?: (event: PointerEvent<HTMLElement>) => void;
}) {
  const reduce = useReducedMotion();

  function startDrag(event: PointerEvent<HTMLElement>) {
    if (!onTitlePointerDown) return;
    // The buttons in the bar keep working as buttons.
    if ((event.target as HTMLElement).closest("button, a")) return;
    onTitlePointerDown(event);
  }

  return (
    <motion.div
      ref={windowRef}
      variants={reduce ? WINDOW_FX_REDUCED : WINDOW_FX}
      custom={fx}
      initial="hidden"
      animate="shown"
      exit="gone"
      className="relative w-full overflow-hidden rounded-[14px] bg-[rgba(38,30,92,0.64)] lg:h-full text-[#f6f3ff] shadow-[0_0_0_0.5px_rgba(196,185,255,0.3),0_40px_80px_-20px_rgba(10,4,44,0.75),0_12px_28px_-10px_rgba(10,4,44,0.55)] backdrop-blur-[40px] backdrop-saturate-[1.9]"
    >
      <div
        onPointerDown={startDrag}
        className="relative flex h-[52px] select-none items-center border-b border-[#c4b9ff]/[0.18] bg-[rgba(104,84,208,0.40)] px-4 lg:touch-none"
      >
        <TrafficLights fixedSize canZoom={false} onClose={onClose} onMinimize={onMinimize} onZoom={() => {}} />
        <p className="pointer-events-none absolute inset-x-0 text-center text-[13px] font-semibold text-[#e4defe]/75">
          Contactos
        </p>
      </div>

      <div className="pt-6 text-center">
        <div
          aria-hidden="true"
          className="mx-auto mb-3.5 grid h-[92px] w-[92px] place-items-center rounded-full bg-gradient-to-br from-[#ff8ad4] via-[#8b7bff] to-[#4cc9f0] text-[34px] font-bold tracking-tight text-white shadow-[0_14px_30px_-10px_rgba(139,123,255,0.65),inset_0_0_0_1px_rgba(255,255,255,0.25)]"
        >
          PA
        </div>
        <h2 className="text-[22px] font-bold tracking-tight">Pip Ariza</h2>
        <p className="mt-[3px] text-[13px] text-[#d6d0ff]/75">Diseño &amp; Desarrollo web · Bogotá</p>

        <div className="mb-4 mt-[18px] flex justify-center gap-3.5">
          <Action href={`mailto:${CONTACT.email}`} label="Correo">
            <EnvelopeGlyph />
          </Action>
          <Action href={CONTACT.whatsapp.href} label="WhatsApp" external>
            <ChatGlyph />
          </Action>
          <Action href={CONTACT.instagram.href} label="Instagram" external>
            <InstagramGlyph />
          </Action>
        </div>
      </div>

      <div className="text-left">
        <div className="flex items-center justify-between gap-3 border-t border-[#c4b9ff]/[0.18] px-[22px] py-[11px]">
          <div className="min-w-0">
            <p className="text-[11.5px] text-[#d6d0ff]/60">correo</p>
            <a href={`mailto:${CONTACT.email}`} className={`block truncate text-[14px] text-[#c9bfff] ${LINK}`}>
              {CONTACT.email}
            </a>
          </div>
          <CopyButton text={CONTACT.email} label="el correo" />
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-[#c4b9ff]/[0.18] px-[22px] py-[11px]">
          <div className="min-w-0">
            <p className="text-[11.5px] text-[#d6d0ff]/60">WhatsApp</p>
            <a
              href={CONTACT.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`block truncate text-[14px] text-[#c9bfff] ${LINK}`}
            >
              {CONTACT.whatsapp.label}
            </a>
          </div>
          <CopyButton text={CONTACT.whatsapp.label} label="el número de WhatsApp" />
        </div>
        <Row label="Instagram">
          <a href={CONTACT.instagram.href} target="_blank" rel="noopener noreferrer" className={LINK}>
            @{CONTACT.instagram.href.split("/").pop()}
          </a>
        </Row>
        {CONTACT.linkedin && (
          <Row label="LinkedIn">
            <a href={CONTACT.linkedin.href} target="_blank" rel="noopener noreferrer" className={LINK}>
              {CONTACT.linkedin.href.replace(/^https?:\/\/(www\.)?/, "")}
            </a>
          </Row>
        )}
        <div className="border-t border-[#c4b9ff]/[0.18] px-[22px] py-[11px] pb-[18px]">
          <p className="text-[11.5px] text-[#d6d0ff]/60">ciudad</p>
          <p className="text-[14px] text-[#f0ecff]/90">{CONTACT.city}</p>
        </div>
      </div>
    </motion.div>
  );
}
