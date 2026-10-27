import type { ReactNode } from "react";

/*
 * Small pieces shared by the demo scenes (TareasMock, CronogramasMock):
 * a window like the ones of the rest of the site, labels, chips and the blue ring that points
 * at what the current step is about. Everything drawn here is decorative (the steps' texts
 * carry the meaning), so the scenes are aria-hidden and never interactive.
 */

/** The blue ring around the part of a screen the current step talks about. */
export const HL = "ring-2 ring-[#0a84ff]/60 ring-offset-2 ring-offset-white";

export function MockWindow({
  title,
  badge,
  children,
}: {
  title: string;
  badge?: string | null;
  children: ReactNode;
}) {
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden rounded-xl bg-white text-[#1d1d1f] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.35)] ring-1 ring-black/10"
    >
      <div className="flex h-9 items-center gap-2 border-b border-black/[0.06] bg-[#f3f1ee] px-3">
        <span className="flex shrink-0 gap-1.5">
          <i className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <i className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <i className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </span>
        <span className="min-w-0 flex-1 truncate text-center text-[11px] font-medium text-black/60">
          {title}
        </span>
        {badge ? <Badge>{badge}</Badge> : <span className="w-[42px] shrink-0" />}
      </div>
      <div className="relative h-[400px] overflow-hidden">{children}</div>
    </div>
  );
}

/** Who is looking at the screen (admin, collaborator, client): the heart of the permissions. */
export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="shrink-0 rounded-full bg-black px-2 py-0.5 text-[8.5px] font-bold uppercase tracking-[0.06em] text-white">
      {children}
    </span>
  );
}

export function Label({ children }: { children: ReactNode }) {
  return (
    <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-black/55">{children}</p>
  );
}

export function Pill({
  children,
  tone = "light",
  className = "",
}: {
  children: ReactNode;
  tone?: "light" | "dark" | "blue";
  className?: string;
}) {
  const tones = {
    light: "border border-black/20 bg-white text-black",
    dark: "bg-black text-white",
    blue: "bg-[#0a74da] text-white",
  };
  return (
    <span
      className={`inline-flex h-7 items-center justify-center rounded-full px-3 text-[11px] font-medium ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
