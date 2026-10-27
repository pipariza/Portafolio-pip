"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, animate, motion, useDragControls, useMotionValue } from "framer-motion";
import { useMacWindow } from "@/components/mac/window";
import { DesktopShortcut, DockTile, MiniDock } from "@/components/mac/dock";
import { SOFT_GRAY, wallpaperStyle } from "@/components/mac/wallpaper";
import MailWindow, { EMPTY_DRAFT, type Draft } from "./MailWindow";
import ContactsWindow from "./ContactsWindow";
import Notification, { type Toast } from "./Notification";
import { ContactsAppIcon, MailAppIcon } from "./icons";

/*
 * The contact page as a macOS desktop, like the Work projects: a soft gray
 * wallpaper (the same stack of radial glows), the site's own menu bar above it,
 * and two windows with working traffic lights: Mail ("Nuevo mensaje", the
 * form) and Contacts (Pip's card). A closed window leaves its app icon on the
 * desktop; a minimized one waits in a small dock that slides up from the bottom.
 * From lg up the windows can be dragged by their title bar (inside the desktop,
 * under the menu bar) and the one you touch comes to the front.
 */

// The same stack of glows as the Work projects' wallpapers, in soft grays.
const WALLPAPER = wallpaperStyle(SOFT_GRAY);

// Windows can be dragged from lg up; below that they are stacked in the page.
const DRAG_QUERY = "(min-width: 1024px)";
function subscribeDrag(onChange: () => void) {
  const query = window.matchMedia(DRAG_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
const canDragNow = () => window.matchMedia(DRAG_QUERY).matches;

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

  // Dragging: each window's offset from its slot lives here, so a window that is
  // closed or minimized comes back where it was left.
  const canDrag = useSyncExternalStore(subscribeDrag, canDragNow, () => false);
  const boundsRef = useRef<HTMLDivElement>(null);
  const mailX = useMotionValue(0);
  const mailY = useMotionValue(0);
  const cardX = useMotionValue(0);
  const cardY = useMotionValue(0);
  const mailDrag = useDragControls();
  const cardDrag = useDragControls();
  const [front, setFront] = useState<"mail" | "card">("mail");

  // Back to the stacked layout (a narrower window, a tablet turned upright): back to the slots.
  useEffect(() => {
    if (canDrag) return;
    mailX.set(0);
    mailY.set(0);
    cardX.set(0);
    cardY.set(0);
  }, [canDrag, mailX, mailY, cardX, cardY]);

  // Full screen sits in a transformed box otherwise, so Mail glides home first and
  // returns to where it was when full screen ends (by the button, Esc or minimizing).
  const savedMail = useRef({ x: 0, y: 0 });
  const toggleMailZoom = () => {
    if (!mail.zoomed) {
      savedMail.current = { x: mailX.get(), y: mailY.get() };
      if (savedMail.current.x || savedMail.current.y) {
        animate(mailX, 0, { duration: 0.25 });
        animate(mailY, 0, { duration: 0.25 });
        window.setTimeout(mail.toggleZoom, 260);
        return;
      }
    }
    mail.toggleZoom();
  };
  useEffect(() => {
    if (mail.zoomed) return;
    const { x, y } = savedMail.current;
    if (x || y) {
      animate(mailX, x, { duration: 0.3, delay: 0.4 });
      animate(mailY, y, { duration: 0.3, delay: 0.4 });
    }
    savedMail.current = { x: 0, y: 0 };
  }, [mail.zoomed, mailX, mailY]);

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
      className="relative w-full overflow-hidden text-[#1d1d1f] lg:h-screen lg:min-h-[700px] xl:min-h-[684px]"
      style={WALLPAPER}
    >
      <div className="flex flex-col gap-4 px-3 pb-24 pt-[calc(34px+14px)] lg:absolute lg:inset-0 lg:flex-row lg:items-center lg:justify-center lg:gap-10 lg:px-10 lg:pb-0 lg:pt-[34px] 2xl:gap-14">
        {/* Each slot keeps its size when its window is closed or minimized, so nothing shifts.
            Stacked (below lg) the Contacts card goes first and Mail below it; side by side Mail is on the left. */}
        <div
          className="relative min-h-[9rem] w-full max-lg:order-2 lg:h-[560px] lg:w-[min(720px,52vw)] lg:shrink-0 xl:h-[600px] xl:w-[min(780px,54vw)] 2xl:h-[680px] 2xl:w-[900px]"
          style={{ zIndex: front === "mail" ? 20 : 10 }}
        >
          <motion.div
            style={{ x: mailX, y: mailY }}
            drag={canDrag}
            dragControls={mailDrag}
            dragListener={false}
            dragConstraints={boundsRef}
            dragElastic={0}
            dragMomentum={false}
            onPointerDown={() => setFront("mail")}
            className="h-full w-full"
          >
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
                  onZoom={toggleMailZoom}
                  onSent={sent}
                  onError={failed}
                  onTitlePointerDown={canDrag ? (e) => mailDrag.start(e) : undefined}
                />
              )}
            </AnimatePresence>
          </motion.div>
          <AnimatePresence initial={false}>
            {mail.win === "closed" && (
              <DesktopShortcut key="mail-shortcut" label="Mail" aria="Abrir Mail: nuevo mensaje" onOpen={mail.open} buttonRef={mailShortcutRef}>
                <MailAppIcon />
              </DesktopShortcut>
            )}
          </AnimatePresence>
        </div>

        <div
          className="relative min-h-[9rem] w-full max-lg:order-1 lg:flex lg:h-[560px] lg:w-[340px] lg:shrink-0 lg:items-center xl:h-[600px] xl:w-[360px] 2xl:h-[680px] 2xl:w-[400px]"
          style={{ zIndex: front === "card" ? 20 : 10 }}
        >
          {/* The draggable box keeps one size whether or not the window is in it: framer keeps a dragged box at the same relative spot inside its limits, so a box that shrank to nothing would jump when the window came back. */}
          <motion.div
            style={{ x: cardX, y: cardY }}
            drag={canDrag}
            dragControls={cardDrag}
            dragListener={false}
            dragConstraints={boundsRef}
            dragElastic={0}
            dragMomentum={false}
            onPointerDown={() => setFront("card")}
            className="w-full lg:h-[624px] 2xl:h-[640px]"
          >
            <AnimatePresence initial={false} custom={card.fx}>
              {card.win === "open" && (
                <ContactsWindow
                  key="card"
                  fx={card.fx}
                  windowRef={card.ref}
                  onClose={card.close}
                  onMinimize={card.minimize}
                  onTitlePointerDown={canDrag ? (e) => cardDrag.start(e) : undefined}
                />
              )}
            </AnimatePresence>
          </motion.div>
          <AnimatePresence initial={false}>
            {card.win === "closed" && (
              <DesktopShortcut key="card-shortcut" label="Contactos" aria="Abrir Contactos" onOpen={card.open} buttonRef={cardShortcutRef}>
                <ContactsAppIcon />
              </DesktopShortcut>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* The area the windows can be dragged in: the desktop under the menu bar. */}
      <div
        ref={boundsRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-2 bottom-2 top-[calc(34px+0.5rem)] max-lg:hidden"
      />

      <MiniDock tone="light" show={mail.win === "minimized" || card.win === "minimized"}>
        {mail.win === "minimized" && (
          <DockTile tone="light" title="Nuevo mensaje" onRestore={mail.open} buttonRef={mailTileRef}>
            <span className="absolute inset-x-[12%] top-[38%] h-[7%] rounded-full bg-black/25" />
            <span className="absolute inset-x-[12%] top-[52%] h-[7%] rounded-full bg-black/15" />
            <span className="absolute left-[12%] top-[66%] h-[7%] w-[45%] rounded-full bg-black/15" />
            <span className="absolute bottom-[9%] right-[9%] h-[14%] w-[30%] rounded-full bg-[#0a84ff]" />
          </DockTile>
        )}
        {card.win === "minimized" && (
          <DockTile tone="light" title="Contactos" onRestore={card.open} buttonRef={cardTileRef}>
            <span className="absolute left-1/2 top-[32%] h-[34%] w-[34%] -translate-x-1/2 rounded-full bg-gradient-to-br from-[#7aa2ff] to-[#7a4e96]" />
            <span className="absolute inset-x-[16%] top-[72%] h-[7%] rounded-full bg-black/25" />
            <span className="absolute inset-x-[26%] top-[84%] h-[7%] rounded-full bg-black/15" />
          </DockTile>
        )}
      </MiniDock>
      <Notification toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
