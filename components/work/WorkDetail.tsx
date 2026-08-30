"use client";

import { useRouter } from "next/navigation";
import { ThemeSection } from "@/lib/section-theme";
import type { Project } from "@/lib/data";
import ProjectCaseStudy from "./ProjectCaseStudy";

export default function WorkDetail({
  project,
  index,
  total,
  prevSlug,
  nextSlug,
}: {
  project: Project;
  index: number;
  total: number;
  prevSlug: string;
  nextSlug: string;
}) {
  const router = useRouter();

  return (
    <ThemeSection theme="light" className="w-full">
      <ProjectCaseStudy
        project={project}
        index={index}
        total={total}
        backHref="/work"
        onPrev={() => router.push(`/work/${prevSlug}`)}
        onNext={() => router.push(`/work/${nextSlug}`)}
      />
    </ThemeSection>
  );
}
