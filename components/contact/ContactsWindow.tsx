"use client";

import { useState, type PointerEvent, type ReactNode, type Ref } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLocale } from "@/components/LocaleProvider";
import { CONTACT, NAME } from "@/lib/config";
import {
  TrafficLights,
  WINDOW_FX,
  WINDOW_FX_REDUCED,
  type WindowFx,
} from "@/components/mac/window";
import { ChatGlyph, EnvelopeGlyph, InstagramGlyph, LinkedInGlyph } from "./icons";

function CopyButton({ text, label }: { text: string; label: string }) {
  const { tr } = useLocale();
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
      aria-label={tr(`Copiar ${label}`, `Copy ${label}`)}
      data-cursor-hover
      className="shrink-0 rounded-full border border-black/20 px-2.5 py-0.5 text-[11px] font-medium text-black/65 outline-none transition-colors hover:bg-black/[0.06] focus-visible:ring-2 focus-visible:ring-[#0a84ff]/70"
    >
      {copied ? tr("Copiado ✓", "Copied ✓") : tr("Copiar", "Copy")}
    </button>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-black/[0.09] px-[22px] py-[9px]">
      <div className="min-w-0">
        <p className="text-[11.5px] text-black/60">{label}</p>
        <div className="truncate text-[14px] text-[#0066cc]">{children}</div>
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
      className="group/action w-[66px] text-center text-[11.5px] text-black/60 outline-none min-[400px]:w-[74px]"
    >
      <span className="mx-auto mb-1.5 grid h-11 w-11 place-items-center rounded-full bg-black/[0.06] text-[#0a84ff] transition-colors group-hover/action:bg-black/10 group-focus-visible/action:ring-2 group-focus-visible/action:ring-[#0a84ff]/70">
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
  const { tr } = useLocale();
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
      className="relative w-full overflow-hidden rounded-[14px] bg-white/70 lg:h-full text-[#1d1d1f] shadow-[0_0_0_0.5px_rgba(0,0,0,0.2),0_40px_80px_-24px_rgba(30,40,40,0.5),0_12px_28px_-10px_rgba(30,40,40,0.3)] backdrop-blur-[40px] backdrop-saturate-[1.6]"
    >
      <div
        onPointerDown={startDrag}
        className="relative flex h-[52px] select-none items-center border-b border-black/[0.12] bg-[#f3f1ee]/90 px-4 lg:touch-none"
      >
        <TrafficLights fixedSize canZoom={false} onClose={onClose} onMinimize={onMinimize} onZoom={() => {}} />
        <p className="pointer-events-none absolute inset-x-0 text-center text-[13px] font-semibold text-black/60">
          {tr("Contactos", "Contacts")}
        </p>
      </div>

      <div className="pt-5 text-center">
        <div
          aria-hidden="true"
          className="mx-auto mb-3.5 grid h-[92px] w-[92px] place-items-center rounded-full bg-gradient-to-br from-[#7aa2ff] to-[#7a4e96] text-[34px] font-bold tracking-tight text-white shadow-[0_14px_30px_-10px_rgba(122,78,150,0.7),inset_0_0_0_1px_rgba(255,255,255,0.25)]"
        >
          PA
        </div>
        <h2 className="text-[22px] font-bold tracking-tight">{NAME.alias}</h2>
        <p className="mt-[2px] text-[13px] font-medium text-black/75">{NAME.full}</p>
        <p className="mt-[2px] text-[13px] text-black/60">{tr("Diseño & Desarrollo web · Bogotá", "Web Design & Development · Bogotá")}</p>

        <div className="mb-3 mt-4 flex justify-center gap-2 min-[400px]:gap-3.5">
          <Action href={`mailto:${CONTACT.email}`} label={tr("Correo", "Email")}>
            <EnvelopeGlyph />
          </Action>
          <Action href={CONTACT.whatsapp.href} label="WhatsApp" external>
            <ChatGlyph />
          </Action>
          <Action href={CONTACT.instagram.href} label="Instagram" external>
            <InstagramGlyph />
          </Action>
          {CONTACT.linkedin && (
            <Action href={CONTACT.linkedin.href} label="LinkedIn" external>
              <LinkedInGlyph />
            </Action>
          )}
        </div>
      </div>

      <div className="text-left">
        <div className="flex items-center justify-between gap-3 border-t border-black/[0.09] px-[22px] py-[9px]">
          <div className="min-w-0">
            <p className="text-[11.5px] text-black/60">{tr("Correo", "Email")}</p>
            <a href={`mailto:${CONTACT.email}`} className={`block truncate text-[14px] text-[#0066cc] ${LINK}`}>
              {CONTACT.email}
            </a>
          </div>
          <CopyButton text={CONTACT.email} label={tr("el correo", "the email")} />
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-black/[0.09] px-[22px] py-[9px]">
          <div className="min-w-0">
            <p className="text-[11.5px] text-black/60">WhatsApp</p>
            <a
              href={CONTACT.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`block truncate text-[14px] text-[#0066cc] ${LINK}`}
            >
              {CONTACT.whatsapp.label}
            </a>
          </div>
          <CopyButton text={CONTACT.whatsapp.label} label={tr("el número de WhatsApp", "the WhatsApp number")} />
        </div>
        <Row label="Instagram">
          <a href={CONTACT.instagram.href} target="_blank" rel="noopener noreferrer" className={LINK}>
            @{CONTACT.instagram.href.split("/").pop()}
          </a>
        </Row>
        {CONTACT.linkedin && (
          <Row label="LinkedIn">
            <a href={CONTACT.linkedin.href} target="_blank" rel="noopener noreferrer" className={LINK}>
              {CONTACT.linkedin.href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
            </a>
          </Row>
        )}
        <div className="border-t border-black/[0.09] px-[22px] py-[9px] pb-4">
          <p className="text-[11.5px] text-black/60">{tr("Ciudad", "City")}</p>
          <p className="text-[14px] text-black/80">{CONTACT.city}</p>
        </div>
      </div>
    </motion.div>
  );
}
