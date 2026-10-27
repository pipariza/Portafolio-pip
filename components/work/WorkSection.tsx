"use client";

import { useMemo, useRef } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { ThemeSection } from "@/lib/section-theme";
import { getProjects } from "@/lib/i18n/projects";
import ProjectCaseStudy from "./ProjectCaseStudy";

export default function WorkSection() {
  const { lang, href } = useLocale();
  const projects = useMemo(() => getProjects(lang), [lang]);
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
              backHref={href("/")}
              onPrev={() => scrollToIndex(i - 1)}
              onNext={() => scrollToIndex(i + 1)}
              onGoTo={scrollToIndex}
            />
          </div>
        ))}
      </div>
    </ThemeSection>
  );
}
