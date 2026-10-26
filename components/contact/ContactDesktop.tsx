"use client";

import { useEffect, useRef, useState, type ReactNode, type Ref } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE, useMacWindow } from "@/components/mac/window";
import MailWindow, { EMPTY_DRAFT, type Draft } from "./MailWindow";
import ContactsWindow from "./ContactsWindow";
import Notification, { type Toast } from "./Notification";
import { ContactsAppIcon, MailAppIcon } from "./icons";

/*
 * The contact page as a macOS desktop, like the Work projects: a dusk
 * wallpaper (the same stack of radial glows), the site's own menu bar above it,
 * and two windows with working traffic lights: Mail ("Nuevo mensaje", the
 * form) and Contacts (Pip's card). A closed window leaves its app icon on the
 * desktop; a minimized one waits in a small dock that slides up from the bottom.
 */

const WALLPAPER = {
  background:
    "radial-gradient(900px 600px at 14% 8%, rgba(86,104,170,0.55), transparent 65%), radial-gradient(1000px 700px at 90% 100%, rgba(122,78,150,0.5), transparent 62%), radial-gradient(700px 500px at 62% 42%, rgba(40,70,96,0.55), transparent 70%), linear-gradient(135deg, #10131b, #1a1626)",
};

/** What is left where a window was, once it is closed. */
function DesktopShortcut({
  label,
  aria,
  onOpen,
  buttonRef,
  children,
}: {
  label: string;
  aria: string;
  onOpen: () => void;
  buttonRef: Ref<HTMLButtonElement>;
  children: ReactNode;
}) {
  return (
    <motion.button
      ref={buttonRef}
      type="button"
      onClick={onOpen}
      aria-label={aria}
      data-cursor-hover
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1, transition: { duration: 0.3, ease: EASE } }}
      exit={{ opacity: 0, transition: { duration: 0.12 } }}
      className="group/shortcut absolute inset-0 m-auto flex h-fit w-fit flex-col items-center gap-2.5 rounded-2xl p-3 outline-none"
    >
      <span className="block h-[76px] w-[76px] transition-transform duration-200 group-hover/shortcut:scale-105 group-focus-visible/shortcut:scale-105">
        {children}
      </span>
      <span className="rounded-md bg-black/55 px-2 py-0.5 text-[12.5px] font-medium text-white backdrop-blur-md group-focus-visible/shortcut:ring-2 group-focus-visible/shortcut:ring-[#0a84ff]">
        {label}
      </span>
    </motion.button>
  );
}

/** A minimized window in the dock: click it to bring the window back. */
function DockTile({
  title,
  onRestore,
  buttonRef,
  children,
}: {
  title: string;
  onRestore: () => void;
  buttonRef: Ref<HTMLButtonElement>;
  children: ReactNode;
}) {
  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onRestore}
      aria-label={`Restaurar ${title}`}
      title={title}
      data-cursor-hover
      className="group/tile relative h-12 w-12 shrink-0 outline-none sm:h-14 sm:w-14"
    >
      <span className="absolute inset-0 block overflow-hidden rounded-[10px] bg-[#26262a] shadow-[0_6px_14px_-4px_rgba(0,0,0,0.6),0_0_0_0.5px_rgba(255,255,255,0.22)] transition-transform duration-200 ease-out group-hover/tile:-translate-y-1.5 group-focus-visible/tile:ring-2 group-focus-visible/tile:ring-[#0a84ff]">
        <span className="absolute inset-x-0 top-0 flex h-[24%] items-center gap-[7%] bg-[#3a3a3e] px-[9%]">
          <i className="block h-[24%] w-[9%] rounded-full bg-[#ff5f57]" />
          <i className="block h-[24%] w-[9%] rounded-full bg-[#febc2e]" />
          <i className="block h-[24%] w-[9%] rounded-full bg-[#28c840]" />
        </span>
        {children}
      </span>
    </button>
  );
}

/** The dock only shows up while a window is minimized. */
function MiniDock({ show, children }: { show: boolean; children: ReactNode }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.nav
          aria-label="Ventanas minimizadas"
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } }}
          exit={{ opacity: 0, y: 36, transition: { duration: 0.2 } }}
          className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-1/2 z-[60] flex -translate-x-1/2 items-end gap-3 rounded-[26px] bg-white/[0.12] px-3.5 pb-2.5 pt-2.5 shadow-[inset_0_0_0_0.5px_rgba(255,255,255,0.22),0_0_0_0.5px_rgba(0,0,0,0.3),0_18px_40px_-12px_rgba(0,0,0,0.7)] backdrop-blur-3xl backdrop-saturate-150"
        >
          {children}
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

export default function ContactDesktop() {
  const deskRef = useRef<HTMLDivElement>(null);
  const mailShortcutRef = useRef<HTMLButtonElement>(null);
  const mailTileRef = useRef<HTMLButtonElement>(null);
  const cardShortcutRef = useRef<HTMLButtonElement>(null);
  const cardTileRef = useRef<HTMLButtonElement>(null);

  // A minimized window flies to the bottom middle of the screen, where the dock slides up.
  const flyTo = () => {
    const desk = deskRef.current?.getBoundingClientRect();
    if (!desk) return null;
    return { x: desk.left + desk.width / 2, y: Math.min(desk.bottom, window.innerHeight) - 48 };
  };
  const mail = useMacWindow(flyTo);
  const card = useMacWindow(flyTo);

  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [toast, setToast] = useState<Toast | null>(null);

  // The banner fades by itself (an error stays longer: it carries the alternatives).
  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), toast.kind === "success" ? 9000 : 16000);
    return () => window.clearTimeout(id);
  }, [toast]);

  // Keyboard users lose their place when a window disappears: hand the focus to what replaces it.
  useEffect(() => {
    if (mail.win === "closed") mailShortcutRef.current?.focus({ preventScroll: true });
    if (mail.win === "minimized") mailTileRef.current?.focus({ preventScroll: true });
  }, [mail.win]);
  useEffect(() => {
    if (card.win === "closed") cardShortcutRef.current?.focus({ preventScroll: true });
    if (card.win === "minimized") cardTileRef.current?.focus({ preventScroll: true });
  }, [card.win]);

  const sent = () => {
    setDraft(EMPTY_DRAFT);
    mail.minimize();
    setToast({ id: Date.now(), kind: "success" });
  };
  const failed = () => setToast({ id: Date.now(), kind: "error" });

  return (
    <div
      ref={deskRef}
      className="relative w-full overflow-hidden text-white lg:h-screen lg:min-h-[700px] xl:min-h-[660px]"
      style={WALLPAPER}
    >
      <div className="flex flex-col gap-4 px-3 pb-24 pt-[calc(34px+14px)] lg:absolute lg:inset-0 lg:flex-row lg:items-center lg:justify-center lg:gap-10 lg:px-10 lg:pb-0 lg:pt-[34px] 2xl:gap-14">
        {/* Each slot keeps its size when its window is closed or minimized, so nothing shifts. */}
        <div className="relative min-h-[9rem] w-full lg:h-[560px] lg:w-[min(720px,52vw)] lg:shrink-0 xl:h-[600px] xl:w-[min(780px,54vw)] 2xl:h-[680px] 2xl:w-[900px]">
          <AnimatePresence initial={false} custom={mail.fx}>
            {mail.win === "open" && (
              <MailWindow
                key="mail"
                draft={draft}
                onDraft={(patch) => setDraft((d) => ({ ...d, ...patch }))}
                zoomed={mail.zoomed}
                fx={mail.fx}
                windowRef={mail.ref}
                onClose={mail.close}
                onMinimize={mail.minimize}
                onZoom={mail.toggleZoom}
                onSent={sent}
                onError={failed}
              />
            )}
            {mail.win === "closed" && (
              <DesktopShortcut key="mail-shortcut" label="Mail" aria="Abrir Mail: nuevo mensaje" onOpen={mail.open} buttonRef={mailShortcutRef}>
                <MailAppIcon />
              </DesktopShortcut>
            )}
          </AnimatePresence>
        </div>

        <div className="relative min-h-[9rem] w-full lg:flex lg:h-[560px] lg:w-[340px] lg:shrink-0 lg:items-center xl:h-[600px] xl:w-[360px] 2xl:h-[680px] 2xl:w-[400px]">
          <AnimatePresence initial={false} custom={card.fx}>
            {card.win === "open" && (
              <ContactsWindow
                key="card"
                fx={card.fx}
                windowRef={card.ref}
                onClose={card.close}
                onMinimize={card.minimize}
              />
            )}
            {card.win === "closed" && (
              <DesktopShortcut key="card-shortcut" label="Contactos" aria="Abrir Contactos" onOpen={card.open} buttonRef={cardShortcutRef}>
                <ContactsAppIcon />
              </DesktopShortcut>
            )}
          </AnimatePresence>
        </div>
      </div>

      <MiniDock show={mail.win === "minimized" || card.win === "minimized"}>
        {mail.win === "minimized" && (
          <DockTile title="Nuevo mensaje" onRestore={mail.open} buttonRef={mailTileRef}>
            <span className="absolute inset-x-[12%] top-[38%] h-[7%] rounded-full bg-white/25" />
            <span className="absolute inset-x-[12%] top-[52%] h-[7%] rounded-full bg-white/15" />
            <span className="absolute left-[12%] top-[66%] h-[7%] w-[45%] rounded-full bg-white/15" />
            <span className="absolute bottom-[9%] right-[9%] h-[14%] w-[30%] rounded-full bg-[#0a84ff]" />
          </DockTile>
        )}
        {card.win === "minimized" && (
          <DockTile title="Contactos" onRestore={card.open} buttonRef={cardTileRef}>
            <span className="absolute left-1/2 top-[32%] h-[34%] w-[34%] -translate-x-1/2 rounded-full bg-gradient-to-br from-[#7aa2ff] to-[#7a4e96]" />
            <span className="absolute inset-x-[16%] top-[72%] h-[7%] rounded-full bg-white/25" />
            <span className="absolute inset-x-[26%] top-[84%] h-[7%] rounded-full bg-white/15" />
          </DockTile>
        )}
      </MiniDock>
      <Notification toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
