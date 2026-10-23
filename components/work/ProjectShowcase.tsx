"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Project, ProjectScreen, ShotImage } from "@/lib/data";

// Height / width of what each device frame shows (a 16:10 laptop, a 390x844 phone).
const DESKTOP_RATIO = 10 / 16;
const PHONE_RATIO = 844 / 390;

const EASE = [0.16, 0.84, 0.44, 1] as const;

function ArrowButton({
  dir,
  label,
  onClick,
  className = "",
}: {
  dir: "prev" | "next";
  label: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      data-cursor-hover
      className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors lg:h-12 lg:w-12 ${className}`}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d={dir === "prev" ? "M13 8H3m0 0l4-4m-4 4l4 4" : "M3 8h10m0 0l-4-4m4 4l-4 4"}
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

/**
 * One full-page capture inside a device screen. The image keeps its own
 * proportions; when the page is taller than the screen it scrolls slowly top
 * to bottom and back, so the whole page is seen and nothing is cropped. With
 * "reduce motion" it does not move and the screen scrolls by hand instead.
 */
function ScrollShot({
  shot,
  alt,
  viewportRatio,
  sizes,
  priority,
}: {
  shot: ShotImage;
  alt: string;
  viewportRatio: number;
  sizes: string;
  priority: boolean;
}) {
  const reduce = useReducedMotion();
  // Longer pages take longer, so the speed feels the same on every page.
  const seconds = Math.min(24, Math.max(6, (shot.height / shot.width - viewportRatio) * 7));

  return (
    <div
      className={`absolute inset-0 [container-type:size] ${
        reduce ? "overflow-y-auto" : "overflow-hidden"
      }`}
    >
      <Image
        src={shot.src}
        alt={alt}
        width={shot.width}
        height={shot.height}
        sizes={sizes}
        priority={priority}
        className={`block h-auto w-full ${
          reduce ? "" : "shot-scroll group-hover/device:[animation-play-state:paused]"
        }`}
        style={reduce ? undefined : ({ "--shot-seconds": `${seconds}s` } as CSSProperties)}
      />
    </div>
  );
}

/**
 * The finished site inside a browser frame, with the phone version in front
 * and a tab for each page. Sizes use container units, so the chrome around the
 * screenshots scales with the stage.
 */
function DeviceStage({
  screens,
  name,
  priority,
}: {
  screens: ProjectScreen[];
  name: string;
  priority: boolean;
}) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const screen = screens[active];

  const enter = (delay: number, y: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay, ease: EASE },
        };
  const fade = reduce
    ? {}
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.4 },
      };

  return (
    <div className="w-full max-w-[780px] lg:w-[min(100cqw,calc((100cqh_-_4.5rem)*1.6))] lg:max-w-none">
      <div className="@container relative w-full" style={{ aspectRatio: "100 / 62" }}>
        <motion.div
          {...enter(0.05, 18)}
          className="group/device absolute left-0 top-0 w-[80%] overflow-hidden rounded-[1.4cqw] bg-white shadow-[0_3cqw_6cqw_-2cqw_rgba(20,19,16,0.35)] ring-1 ring-black/10"
        >
          <div className="flex h-[3.6cqw] items-center gap-[0.9cqw] bg-[#ecebe7] px-[1.6cqw]">
            <span className="h-[1cqw] w-[1cqw] rounded-full bg-black/20" />
            <span className="h-[1cqw] w-[1cqw] rounded-full bg-black/20" />
            <span className="h-[1cqw] w-[1cqw] rounded-full bg-black/20" />
            <span className="ml-[2cqw] hidden h-[2.2cqw] items-center rounded-full bg-white px-[1.6cqw] text-[1.4cqw] leading-none text-black/50 @md:flex">
              visualliving.co{screen.path}
            </span>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden bg-white">
            <AnimatePresence initial={false}>
              <motion.div key={screen.id} {...fade} className="absolute inset-0">
                <ScrollShot
                  shot={screen.desktop}
                  alt={`${name}: ${screen.label}, en escritorio`}
                  viewportRatio={DESKTOP_RATIO}
                  sizes="(min-width: 1024px) 45vw, 90vw"
                  priority={priority && active === 0}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div
          {...enter(0.2, 28)}
          className="group/device absolute bottom-0 right-0 w-[24%] overflow-hidden rounded-[3.2cqw] border-[0.7cqw] border-[#1b1b1a] bg-[#1b1b1a] shadow-[0_3cqw_6cqw_-1cqw_rgba(20,19,16,0.45)]"
        >
          <div className="relative aspect-[390/844] overflow-hidden rounded-[2.5cqw] bg-white">
            <AnimatePresence initial={false}>
              <motion.div key={screen.id} {...fade} className="absolute inset-0">
                <ScrollShot
                  shot={screen.mobile}
                  alt={`${name}: ${screen.label}, en celular`}
                  viewportRatio={PHONE_RATIO}
                  sizes="(min-width: 1024px) 12vw, 25vw"
                  priority={priority && active === 0}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <div
        role="tablist"
        aria-label="Pantallas del proyecto"
        className="mt-4 flex flex-wrap justify-center gap-x-3 sm:gap-x-5"
      >
        {screens.map((s, i) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            data-cursor-hover
            className={`flex min-h-11 items-center border-b text-[10px] font-medium uppercase tracking-[0.08em] sm:text-[11px] transition-colors ${
              i === active
                ? "border-ink text-ink"
                : "border-transparent text-ink/45 hover:text-ink"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ProjectShowcase({
  project,
  screens,
  index,
  total,
  onPrev,
  onNext,
  backHref,
}: {
  project: Project;
  screens: ProjectScreen[];
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  backHref: string;
}) {
  const counter = `${String(index + 1).padStart(2, "0")} // ${String(total).padStart(2, "0")}`;
  const category = project.category === "diseno-web" ? "Diseño web" : "Aplicativo";

  return (
    <div className="relative grid min-h-screen w-full grid-cols-1 overflow-hidden lg:h-screen lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      {/* Stage: container-type lets the stage fit both the width and the height of the panel. */}
      <div
        className="relative flex items-center justify-center px-6 pb-8 pt-24 lg:px-24 lg:pb-24 lg:pt-28 lg:[container-type:size]"
        style={{ background: project.color }}
      >
        <DeviceStage screens={screens} name={project.name} priority={index === 0} />
      </div>

      <div className="relative flex flex-col justify-center gap-6 bg-paper px-6 pb-24 pt-8 text-ink lg:gap-8 lg:overflow-y-auto lg:pl-16 lg:pr-24 lg:pb-24 lg:pt-28">
        <div>
          <p className="mb-4 text-[11px] uppercase tracking-[0.08em] text-ink/50">{category}</p>
          <h2 className="text-[clamp(2.25rem,10vw,3.5rem)] font-medium uppercase leading-[0.95] tracking-tight lg:text-[clamp(2.5rem,4.4vw,4.5rem)]">
            {project.name}
          </h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-ink/70">{project.summary}</p>
        </div>

        <div className="grid max-w-md grid-cols-3 gap-4">
          <div>
            <p className="mb-1 text-[11px] uppercase tracking-[0.08em] text-ink/50">Rol</p>
            <p className="text-sm font-medium">{project.role}</p>
          </div>
          <div>
            <p className="mb-1 text-[11px] uppercase tracking-[0.08em] text-ink/50">Año</p>
            <p className="text-sm font-medium">{project.year}</p>
          </div>
          <div>
            <p className="mb-1 text-[11px] uppercase tracking-[0.08em] text-ink/50">Stack</p>
            <p className="text-sm font-medium">{project.stack}</p>
          </div>
        </div>

        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor-hover
            className="inline-flex w-fit items-center gap-2 rounded-full border border-ink/30 px-6 py-3 text-xs font-medium uppercase tracking-[0.05em] transition-colors hover:border-ink hover:bg-ink hover:text-paper"
          >
            Ver sitio
            <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>

      {/* Desktop controls: back and the left arrow sit on the stage, the counter and right arrow on the paper. */}
      <Link
        href={backHref}
        data-cursor-hover
        className="absolute bottom-8 left-16 z-10 hidden text-sm font-medium uppercase tracking-[0.05em] text-ink lg:block"
      >
        ← Volver
      </Link>
      <span className="absolute bottom-8 right-16 z-10 hidden text-sm font-medium tracking-[0.05em] text-ink lg:block">
        {counter}
      </span>
      <ArrowButton
        dir="prev"
        label="Proyecto anterior"
        onClick={onPrev}
        className="absolute left-6 top-1/2 z-10 hidden -translate-y-1/2 border-ink/30 text-ink hover:border-ink/70 lg:flex"
      />
      <ArrowButton
        dir="next"
        label="Siguiente proyecto"
        onClick={onNext}
        className="absolute right-6 top-1/2 z-10 hidden -translate-y-1/2 border-ink/30 text-ink hover:border-ink/70 lg:flex"
      />

      {/* Mobile controls: one bottom row on the paper. */}
      <div className="absolute inset-x-6 bottom-6 z-10 flex items-center justify-between lg:hidden">
        <Link
          href={backHref}
          data-cursor-hover
          className="text-xs font-medium uppercase tracking-[0.05em] text-ink"
        >
          ← Volver
        </Link>
        <div className="flex items-center gap-3">
          <span className="mr-1 text-xs font-medium tracking-[0.05em] text-ink">{counter}</span>
          <ArrowButton
            dir="prev"
            label="Proyecto anterior"
            onClick={onPrev}
            className="border-ink/30 text-ink"
          />
          <ArrowButton
            dir="next"
            label="Siguiente proyecto"
            onClick={onNext}
            className="border-ink/30 text-ink"
          />
        </div>
      </div>
    </div>
  );
}
