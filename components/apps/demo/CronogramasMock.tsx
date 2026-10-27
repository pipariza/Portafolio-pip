"use client";

import type { CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLocale } from "@/components/LocaleProvider";
import { HL, Label, MockWindow, Pill } from "./parts";

/* Nine made-up posts: soft gradients stand in for the images. */
const TILES: { bg: string; kind: "imagen" | "carrusel" | "video" }[] = [
  { bg: "linear-gradient(135deg,#e8d5c4,#cfae92)", kind: "imagen" },
  { bg: "linear-gradient(135deg,#cfd9d2,#9fb8a8)", kind: "carrusel" },
  { bg: "linear-gradient(135deg,#e9d7de,#d3a4b6)", kind: "imagen" },
  { bg: "linear-gradient(135deg,#d6dbe8,#a3aed0)", kind: "carrusel" },
  { bg: "linear-gradient(135deg,#f1e4bf,#dcc07a)", kind: "imagen" },
  { bg: "linear-gradient(135deg,#d9d0e6,#b3a2d1)", kind: "imagen" },
  { bg: "linear-gradient(135deg,#cfe3e6,#8fbcc4)", kind: "video" },
  { bg: "linear-gradient(135deg,#eed3cf,#d99a90)", kind: "imagen" },
  { bg: "linear-gradient(135deg,#dfe3cf,#b4bf8a)", kind: "carrusel" },
];
const PENDING = new Set([3, 6]); // posts 04 and 07 are still waiting for the client

function KindIcon({ kind }: { kind: "imagen" | "carrusel" | "video" }) {
  if (kind === "imagen") return null;
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      className="absolute right-1 top-1 text-white drop-shadow"
      fill="currentColor"
    >
      {kind === "video" ? (
        <path d="M7 4.5v15l13-7.5z" />
      ) : (
        <path d="M8 3h11a2 2 0 0 1 2 2v11h-2V5H8zM5 7h11a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z" />
      )}
    </svg>
  );
}

function Tile({
  index,
  style,
  className = "",
  mark,
}: {
  index: number;
  style?: CSSProperties;
  className?: string;
  mark?: "ok" | "wait";
}) {
  const t = TILES[index];
  return (
    <div
      className={`relative aspect-square overflow-hidden ${className}`}
      style={{ background: t.bg, ...style }}
    >
      <span
        className="absolute h-1/2 w-1/2 rounded-full bg-white/35"
        style={{ left: `${10 + ((index * 23) % 40)}%`, top: `${12 + ((index * 31) % 38)}%` }}
      />
      <KindIcon kind={t.kind} />
      <span className="absolute bottom-0.5 left-1 text-[9px] font-bold text-white drop-shadow">
        {String(index + 1).padStart(2, "0")}
      </span>
      {mark && (
        <span
          className={`absolute bottom-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[8px] font-bold text-white ${
            mark === "ok" ? "bg-[#1f9d55]" : "bg-black/55"
          }`}
        >
          {mark === "ok" ? "✓" : "…"}
        </span>
      )}
    </div>
  );
}

function ProfileHeader({ approved }: { approved: number }) {
  const { tr } = useLocale();
  return (
    <div className="flex items-center gap-3">
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white"
        style={{ background: "linear-gradient(135deg,#d3a4b6,#a3aed0)" }}
      >
        CL
      </span>
      <div className="min-w-0">
        <p className="truncate text-[13px] font-bold tracking-tight">Casa Lumen</p>
        <p className="text-[10.5px] text-black/60">
          {tr("9 posts", "9 posts")} · {approved} {tr("aprobados", "approved")}
        </p>
      </div>
    </div>
  );
}

function Grid({
  max,
  marks,
  ring,
  className = "",
}: {
  max: number;
  marks?: boolean;
  /** Index of the post to point at with the blue ring. */
  ring?: number;
  className?: string;
}) {
  return (
    <div className={`grid w-full grid-cols-3 gap-0.5 ${className}`} style={{ maxWidth: max }}>
      {TILES.map((_, i) => (
        <Tile
          key={i}
          index={i}
          mark={marks ? (PENDING.has(i) ? "wait" : "ok") : undefined}
          className={i === ring ? `relative z-10 ${HL}` : ""}
        />
      ))}
    </div>
  );
}

function Armar() {
  const { tr } = useLocale();
  const reduce = useReducedMotion();
  return (
    <div className="flex h-full flex-col items-center gap-3 p-5">
      <div className="w-full max-w-[240px]">
        <ProfileHeader approved={0} />
      </div>
      <div className="relative w-full max-w-[240px]">
        <div className="grid grid-cols-3 gap-0.5">
          {TILES.map((_, i) => (
            // Post 05 is lifted out of its place (the hole) and carried toward post 03.
            <Tile key={i} index={i} className={i === 2 || i === 4 ? "opacity-30" : ""} />
          ))}
        </div>
        <motion.div
          className="absolute w-[calc((100%-4px)/3)]"
          style={{ left: "calc((100% - 4px) / 3 + 2px)", top: "calc((100% - 4px) / 3 + 2px)" }}
          animate={reduce ? undefined : { x: [0, 60, 60, 0], y: [0, -60, -60, 0], rotate: [0, 4, 4, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Tile
            index={4}
            className={`z-10 scale-110 shadow-[0_10px_24px_rgba(0,0,0,0.35)] ${HL}`}
          />
        </motion.div>
      </div>
      <p className="max-w-[240px] text-center text-[11px] leading-snug text-black/65">
        {tr(
          "Arrastra un post para cambiar su lugar: el 01 es el más antiguo, arriba a la izquierda.",
          "Drag a post to change its place: 01 is the oldest, top left.",
        )}
      </p>
    </div>
  );
}

function Detalle() {
  const { tr } = useLocale();
  return (
    <div className="space-y-3 p-5">
      <div className="flex gap-3">
        <div className="relative w-[104px] shrink-0">
          <Tile index={3} className="aspect-[4/5]" />
          <span className="absolute inset-x-0 -bottom-4 flex justify-center gap-1">
            {[0, 1, 2].map((d) => (
              <i key={d} className={`h-1.5 w-1.5 rounded-full ${d === 1 ? "bg-black" : "bg-black/20"}`} />
            ))}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-bold tracking-tight">{tr("Post 04", "Post 04")}</p>
          <p className="mt-0.5 text-[11px] text-black/60">{tr("Mar 11 nov · Carrusel de 3", "Tue Nov 11 · 3-image carousel")}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Pill>{tr("Pendiente", "Pending")}</Pill>
          </div>
        </div>
      </div>
      <div className="pt-3">
        <Label>Caption</Label>
        <div className={`mt-1 rounded-md border border-black/20 p-3 text-[12px] leading-snug ${HL}`}>
          {tr(
            "Nueva colección de otoño. Descúbrela esta semana en tienda y en línea.",
            "New autumn collection. Discover it this week in store and online.",
          )}
          <span className="ml-0.5 inline-block h-3.5 w-px translate-y-0.5 animate-pulse bg-black" />
        </div>
      </div>
      <div>
        <Label>{tr("Notas", "Notes")}</Label>
        <div className="mt-1 rounded-lg bg-[#f3f1ee] p-3">
          <p className="text-[10px] font-bold">
            {tr("Equipo", "Team")} · {tr("imagen 2", "image 2")}
          </p>
          <p className="mt-0.5 text-[12px] leading-snug">
            {tr("Cambiar el fondo por uno más claro.", "Swap the background for a lighter one.")}
          </p>
        </div>
      </div>
    </div>
  );
}

function Cliente() {
  const { tr } = useLocale();
  return (
    <div className="space-y-3 p-4">
      <div className={`flex h-8 items-center gap-2 rounded-full bg-black/[0.06] px-3 text-[11px] text-black/70 ${HL}`}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <rect x="4" y="11" width="16" height="10" rx="2" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
        <span className="truncate">…/c/8f3a91c2d0…</span>
        <span className="ml-auto shrink-0 text-[10px] text-black/50">{tr("vence en 30 días", "expires in 30 days")}</span>
      </div>
      <ProfileHeader approved={4} />
      <div className="flex gap-3 pt-1">
        <div className="w-[120px] shrink-0">
          <Grid max={120} ring={1} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[12px] font-bold tracking-tight">{tr("Post 02", "Post 02")}</p>
          <div className="mt-2">
            <Label>Caption</Label>
            <div className="mt-1 rounded-md border border-black/20 p-2 text-[11.5px] leading-snug">
              {tr("Nueva colección de otoño, ya disponible.", "New autumn collection, now available.")}
            </div>
            <p className="mt-1 text-[10px] text-black/55">{tr("Editado por el cliente", "Edited by the client")}</p>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Pill tone="blue">{tr("Aprobar", "Approve")}</Pill>
            <Pill>{tr("Dejar una nota", "Leave a note")}</Pill>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-black/10 pt-3">
        <p className="min-w-0 flex-1 text-[10.5px] leading-snug text-black/60">
          {tr(
            "Quien tenga el link puede revisar; vence solo y no abre nada más.",
            "Anyone with the link can review; it expires on its own and opens nothing else.",
          )}
        </p>
        <Pill className="shrink-0">{tr("Aprobar todos", "Approve all")}</Pill>
      </div>
    </div>
  );
}

function Entrega() {
  const { tr } = useLocale();
  return (
    <div className="flex h-full flex-col items-center gap-3 p-5">
      <div className="w-full max-w-[220px] space-y-1.5">
        <div className="flex items-baseline justify-between">
          <p className="text-[13px] font-bold tracking-tight">{tr("7 de 9 aprobados", "7 of 9 approved")}</p>
          <p className="text-[10px] text-black/55">Casa Lumen</p>
        </div>
        <span className="block h-1.5 rounded-full bg-black/10">
          <span className="block h-full rounded-full bg-[#1f9d55]" style={{ width: "78%" }} />
        </span>
      </div>
      <Grid max={220} marks />
      <div className="flex gap-2">
        <Pill tone="dark" className={HL}>
          {tr("Descargar ZIP", "Download ZIP")}
        </Pill>
        <Pill>{tr("Descargar PDF", "Download PDF")}</Pill>
      </div>
      <p className="max-w-[270px] text-center text-[10.5px] leading-snug text-black/60">
        {tr(
          "El cronograma se borra solo a los 30 días, con todos sus archivos.",
          "The schedule deletes itself after 30 days, along with all its files.",
        )}
      </p>
    </div>
  );
}

export default function CronogramasMock({ step }: { step: number }) {
  const { tr } = useLocale();
  const reduce = useReducedMotion();

  const frames = [
    { title: tr("Casa Lumen · noviembre", "Casa Lumen · November"), badge: tr("Equipo", "Team"), scene: <Armar /> },
    { title: tr("Post 04", "Post 04"), badge: tr("Equipo", "Team"), scene: <Detalle /> },
    { title: tr("Vista del cliente", "Client view"), badge: tr("Cliente", "Client"), scene: <Cliente /> },
    { title: tr("Casa Lumen · entrega", "Casa Lumen · delivery"), badge: tr("Equipo", "Team"), scene: <Entrega /> },
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
