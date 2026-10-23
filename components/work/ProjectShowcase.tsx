"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { Project } from "@/lib/data";

type Shots = NonNullable<Project["shots"]>;

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
 * The finished site inside a browser frame, with the phone version in front.
 * Both captures keep their own proportions (height is automatic), so nothing
 * is ever cropped; the stage only scales. Sizes use container units, so the
 * chrome around the screenshots scales with the stage.
 */
function DeviceStage({ shots, name, priority }: { shots: Shots; name: string; priority: boolean }) {
  const reduce = useReducedMotion();
  const enter = (delay: number, y: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay, ease: EASE },
        };

  return (
    <div
      className="@container relative w-full max-w-[780px] lg:w-[min(100cqw,135cqh)] lg:max-w-none"
      style={{ aspectRatio: "100 / 74" }}
    >
      <motion.div
        {...enter(0.05, 18)}
        className="absolute left-0 top-0 w-[80%] overflow-hidden rounded-[1.4cqw] bg-white shadow-[0_3cqw_6cqw_-2cqw_rgba(20,19,16,0.35)] ring-1 ring-black/10"
      >
        <div className="flex h-[3.6cqw] items-center gap-[0.9cqw] bg-[#ecebe7] px-[1.6cqw]">
          <span className="h-[1cqw] w-[1cqw] rounded-full bg-black/20" />
          <span className="h-[1cqw] w-[1cqw] rounded-full bg-black/20" />
          <span className="h-[1cqw] w-[1cqw] rounded-full bg-black/20" />
          <span className="ml-[2cqw] hidden h-[2.2cqw] items-center rounded-full bg-white px-[1.6cqw] text-[1.4cqw] leading-none text-black/50 @md:flex">
            visualliving.co
          </span>
        </div>
        <Image
          src={shots.desktop.src}
          alt={`Captura de ${name} en escritorio`}
          width={shots.desktop.width}
          height={shots.desktop.height}
          sizes="(min-width: 768px) 45vw, 90vw"
          priority={priority}
          className="block h-auto w-full"
        />
      </motion.div>

      <motion.div
        {...enter(0.2, 28)}
        className="absolute bottom-0 right-0 w-[24%] overflow-hidden rounded-[3.2cqw] border-[0.7cqw] border-[#1b1b1a] bg-[#1b1b1a] shadow-[0_3cqw_6cqw_-1cqw_rgba(20,19,16,0.45)]"
      >
        <Image
          src={shots.mobile.src}
          alt={`Captura de ${name} en celular`}
          width={shots.mobile.width}
          height={shots.mobile.height}
          sizes="(min-width: 768px) 12vw, 25vw"
          priority={priority}
          className="block h-auto w-full rounded-[2.5cqw]"
        />
      </motion.div>
    </div>
  );
}

export default function ProjectShowcase({
  project,
  shots,
  index,
  total,
  onPrev,
  onNext,
  backHref,
}: {
  project: Project;
  shots: Shots;
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
        <DeviceStage shots={shots} name={project.name} priority={index === 0} />
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
