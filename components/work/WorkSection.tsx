"use client";

import { useRef } from "react";
import { ThemeSection } from "@/lib/section-theme";
import { projects } from "@/lib/data";
import ProjectCaseStudy from "./ProjectCaseStudy";

export default function WorkSection() {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const scrollToIndex = (index: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const wrapped = (index + projects.length) % projects.length;
    el.scrollTo({ left: wrapped * el.clientWidth, behavior: "smooth" });
  };

  return (
    <ThemeSection theme="light" id="work" className="relative w-full bg-paper text-ink">
      <div
        ref={scrollerRef}
        className="flex w-full overflow-x-auto snap-x snap-mandatory scrollbar-none"
        style={{ scrollbarWidth: "none" }}
      >
        {projects.map((project, i) => (
          <div key={project.slug} className="w-full shrink-0 snap-start">
            <ProjectCaseStudy
              project={project}
              index={i}
              total={projects.length}
              backHref="/"
              onPrev={() => scrollToIndex(i - 1)}
              onNext={() => scrollToIndex(i + 1)}
            />
          </div>
        ))}
      </div>
    </ThemeSection>
  );
}
