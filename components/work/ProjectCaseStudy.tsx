import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/data";
import ProjectShowcase from "./ProjectShowcase";

export default function ProjectCaseStudy({
  project,
  index,
  total,
  onPrev,
  onNext,
  backHref,
}: {
  project: Project;
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  backHref: string;
}) {
  if (project.screens?.length) {
    return (
      <ProjectShowcase
        project={project}
        screens={project.screens}
        index={index}
        total={total}
        onPrev={onPrev}
        onNext={onNext}
        backHref={backHref}
      />
    );
  }

  const counter = `${String(index + 1).padStart(2, "0")} // ${String(total).padStart(2, "0")}`;

  return (
    <div className="relative w-full h-screen shrink-0 grid grid-cols-1 md:grid-cols-2 overflow-hidden">
      <div
        className="relative hidden md:block h-full overflow-hidden"
        style={{ background: project.color }}
      >
        {project.image ? (
          <Image
            src={project.image}
            alt={project.name}
            fill
            sizes="50vw"
            className="object-cover"
            priority={index === 0}
          />
        ) : (
          <div className="absolute inset-0 tech-grid opacity-40" />
        )}
      </div>
      <div className="relative h-[38vh] md:hidden overflow-hidden" style={{ background: project.color }}>
        {project.image && (
          <Image
            src={project.image}
            alt={project.name}
            fill
            sizes="100vw"
            className="object-cover"
            priority={index === 0}
          />
        )}
      </div>

      <div className="relative flex-1 bg-paper text-ink h-full flex flex-col justify-end px-6 md:px-16 pb-24 pt-32">
        <div className="grid grid-cols-3 gap-4 max-w-md">
          <div>
            <p className="text-[11px] uppercase tracking-[0.08em] text-ink/50 mb-1">Rol</p>
            <p className="text-sm font-medium">{project.role}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.08em] text-ink/50 mb-1">Año</p>
            <p className="text-sm font-medium">{project.year}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.08em] text-ink/50 mb-1">Stack</p>
            <p className="text-sm font-medium">{project.stack}</p>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none px-4">
        <h2
          className="absolute inset-0 flex items-center justify-center text-[11vw] md:text-[96px] leading-none font-medium uppercase tracking-tight whitespace-nowrap text-bone"
          style={{ clipPath: "inset(0 50% 0 0)" }}
        >
          {project.name}
        </h2>
        <h2
          className="absolute inset-0 flex items-center justify-center text-[11vw] md:text-[96px] leading-none font-medium uppercase tracking-tight whitespace-nowrap text-ink"
          style={{ clipPath: "inset(0 0 0 50%)" }}
        >
          {project.name}
        </h2>
      </div>

      <Link
        href={backHref}
        data-cursor-hover
        className="absolute bottom-8 left-6 md:left-16 text-xs md:text-sm font-medium uppercase tracking-[0.05em] text-bone z-10"
      >
        ← Volver
      </Link>

      <span className="absolute bottom-8 right-6 md:right-16 text-xs md:text-sm font-medium tracking-[0.05em] text-ink z-10">
        {counter}
      </span>

      <button
        type="button"
        onClick={onPrev}
        aria-label="Proyecto anterior"
        className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full border border-bone/40 text-bone hover:border-bone transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M13 8H3m0 0l4-4m-4 4l4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <button
        type="button"
        onClick={onNext}
        aria-label="Siguiente proyecto"
        className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full border border-ink/30 text-ink hover:border-ink/70 transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 8h10m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
