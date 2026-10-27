"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useLocale } from "@/components/LocaleProvider";
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
  const { tr } = useLocale();
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          role={toast.kind === "error" ? "alert" : "status"}
          initial={{ opacity: 0, y: -14, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: EASE } }}
          exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
          className="group/toast fixed right-3 top-[46px] z-[75] flex w-[min(340px,calc(100vw-24px))] gap-3 rounded-2xl bg-white/75 p-3 text-[#1d1d1f] shadow-[0_0_0_0.5px_rgba(0,0,0,0.14),0_18px_40px_-12px_rgba(30,40,40,0.45)] backdrop-blur-[30px] backdrop-saturate-[1.6] sm:right-[18px]"
        >
          <div className="h-[38px] w-[38px] shrink-0" aria-hidden="true">
            <MailAppIcon />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-2 text-[12.5px] text-black/60">
              <b className="text-[13.5px] font-semibold text-[#1d1d1f]">
                {toast.kind === "success" ? tr("Mail", "Mail") : tr("No se pudo enviar", "Could not send")}
              </b>
              <span>{tr("ahora", "now")}</span>
            </div>
            {toast.kind === "success" ? (
              <p className="mt-0.5 text-[13px] leading-[1.4] text-black/75">
                {tr("Mensaje enviado. Gracias, te respondo en menos de 48 horas.", "Message sent. Thank you, I will reply within 48 hours.")}
              </p>
            ) : (
              <p className="mt-0.5 text-[13px] leading-[1.4] text-black/75">
                {tr("Algo falló. Escríbeme directo a", "Something went wrong. Write to me directly at")}{" "}
                <a href={`mailto:${CONTACT.email}`} className="text-[#0066cc] underline">
                  {CONTACT.email}
                </a>{" "}
                {tr("o por", "or via")}{" "}
                <a
                  href={CONTACT.whatsapp.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0066cc] underline"
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
            aria-label={tr("Cerrar notificación", "Close notification")}
            data-cursor-hover
            className="absolute -left-2 -top-2 grid h-[22px] w-[22px] place-items-center rounded-full bg-[#f3f1ee] text-black/60 opacity-0 shadow-[0_0_0_0.5px_rgba(0,0,0,0.2)] outline-none transition-opacity focus-visible:opacity-100 group-hover/toast:opacity-100 max-sm:opacity-100"
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
