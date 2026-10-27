"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "@/components/LocaleProvider";
import { ThemeSection } from "@/lib/section-theme";
import { projectData, type Project } from "@/lib/data";
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
  const { href } = useLocale();

  return (
    <ThemeSection theme="light" className="w-full">
      <ProjectCaseStudy
        project={project}
        index={index}
        total={total}
        backHref={href("/work")}
        priority
        onPrev={() => router.push(href(`/work/${prevSlug}`))}
        onNext={() => router.push(href(`/work/${nextSlug}`))}
        onGoTo={(i) => router.push(href(`/work/${projectData[i].slug}`))}
      />
    </ThemeSection>
  );
}
