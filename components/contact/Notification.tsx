"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CONTACT } from "@/lib/config";
import { EASE } from "@/components/mac/window";
import { MailAppIcon } from "./icons";

/** A banner like macOS's notifications, shown after the message is sent (or fails to send). */
export type Toast = { id: number; kind: "success" | "error" };

export default function Notification({
  toast,
  onClose,
}: {
  toast: Toast | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          role={toast.kind === "error" ? "alert" : "status"}
          initial={{ opacity: 0, y: -14, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: EASE } }}
          exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
          className="group/toast fixed right-3 top-[46px] z-[75] flex w-[min(340px,calc(100vw-24px))] gap-3 rounded-2xl bg-[rgba(60,60,64,0.82)] p-3 text-[#f5f5f7] shadow-[0_0_0_0.5px_rgba(255,255,255,0.16),0_18px_40px_-12px_rgba(0,0,0,0.6)] backdrop-blur-[30px] backdrop-saturate-[1.6] sm:right-[18px]"
        >
          <div className="h-[38px] w-[38px] shrink-0" aria-hidden="true">
            <MailAppIcon />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-2 text-[12.5px] text-white/60">
              <b className="text-[13.5px] font-semibold text-[#f5f5f7]">
                {toast.kind === "success" ? "Mail" : "No se pudo enviar"}
              </b>
              <span>ahora</span>
            </div>
            {toast.kind === "success" ? (
              <p className="mt-0.5 text-[13px] leading-[1.4] text-white/85">
                Mensaje enviado. Gracias, te respondo en menos de 48 horas.
              </p>
            ) : (
              <p className="mt-0.5 text-[13px] leading-[1.4] text-white/85">
                Algo falló. Escríbeme directo a{" "}
                <a href={`mailto:${CONTACT.email}`} className="text-[#8ec2ff] underline">
                  {CONTACT.email}
                </a>{" "}
                o por{" "}
                <a
                  href={CONTACT.whatsapp.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#8ec2ff] underline"
                >
                  WhatsApp
                </a>
                .
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar notificación"
            data-cursor-hover
            className="absolute -left-2 -top-2 grid h-[22px] w-[22px] place-items-center rounded-full bg-[rgba(80,80,84,0.95)] text-white/80 opacity-0 shadow-[0_0_0_0.5px_rgba(255,255,255,0.2)] outline-none transition-opacity focus-visible:opacity-100 group-hover/toast:opacity-100 max-sm:opacity-100"
          >
            <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
              <path d="m2 2 6 6M8 2 2 8" />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
