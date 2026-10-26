"use client";

import { useState, type ReactNode, type Ref } from "react";
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
      className="shrink-0 rounded-full border border-white/20 px-2.5 py-0.5 text-[11px] font-medium text-white/75 outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#0a84ff]/70"
    >
      {copied ? "Copiado ✓" : "Copiar"}
    </button>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-white/[0.09] px-[22px] py-[11px]">
      <div className="min-w-0">
        <p className="text-[11.5px] text-white/50">{label}</p>
        <div className="truncate text-[14px] text-[#8ec2ff]">{children}</div>
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
      className="group/action w-[74px] text-center text-[11.5px] text-white/65 outline-none"
    >
      <span className="mx-auto mb-1.5 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-[#0a84ff] transition-colors group-hover/action:bg-white/[0.16] group-focus-visible/action:ring-2 group-focus-visible/action:ring-[#0a84ff]/70">
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
}: {
  fx: WindowFx;
  windowRef: Ref<HTMLDivElement>;
  onClose: () => void;
  onMinimize: () => void;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      ref={windowRef}
      variants={reduce ? WINDOW_FX_REDUCED : WINDOW_FX}
      custom={fx}
      initial="hidden"
      animate="shown"
      exit="gone"
      className="relative w-full overflow-hidden rounded-[14px] bg-[rgba(38,38,41,0.9)] text-[#f5f5f7] shadow-[0_0_0_0.5px_rgba(255,255,255,0.14),0_40px_80px_-20px_rgba(0,0,0,0.7),0_12px_28px_-10px_rgba(0,0,0,0.5)] backdrop-blur-[40px] backdrop-saturate-[1.6]"
    >
      <div className="relative flex h-[52px] items-center border-b border-white/[0.09] bg-[rgba(54,54,58,0.92)] px-4">
        <TrafficLights fixedSize canZoom={false} onClose={onClose} onMinimize={onMinimize} onZoom={() => {}} />
        <p className="pointer-events-none absolute inset-x-0 text-center text-[13px] font-semibold text-white/60">
          Contactos
        </p>
      </div>

      <div className="pt-6 text-center">
        <div
          aria-hidden="true"
          className="mx-auto mb-3.5 grid h-[92px] w-[92px] place-items-center rounded-full bg-gradient-to-br from-[#7aa2ff] to-[#7a4e96] text-[34px] font-bold tracking-tight text-white shadow-[0_14px_30px_-10px_rgba(122,78,150,0.7),inset_0_0_0_1px_rgba(255,255,255,0.25)]"
        >
          PA
        </div>
        <h2 className="text-[22px] font-bold tracking-tight">Pip Ariza</h2>
        <p className="mt-[3px] text-[13px] text-white/65">Diseño &amp; Desarrollo web · Bogotá</p>

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
        <div className="flex items-center justify-between gap-3 border-t border-white/[0.09] px-[22px] py-[11px]">
          <div className="min-w-0">
            <p className="text-[11.5px] text-white/50">correo</p>
            <a href={`mailto:${CONTACT.email}`} className={`block truncate text-[14px] text-[#8ec2ff] ${LINK}`}>
              {CONTACT.email}
            </a>
          </div>
          <CopyButton text={CONTACT.email} label="el correo" />
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-white/[0.09] px-[22px] py-[11px]">
          <div className="min-w-0">
            <p className="text-[11.5px] text-white/50">WhatsApp</p>
            <a
              href={CONTACT.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`block truncate text-[14px] text-[#8ec2ff] ${LINK}`}
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
        <div className="border-t border-white/[0.09] px-[22px] py-[11px] pb-[18px]">
          <p className="text-[11.5px] text-white/50">ciudad</p>
          <p className="text-[14px] text-white/85">{CONTACT.city}</p>
        </div>
      </div>
    </motion.div>
  );
}
