import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { projectData } from "@/lib/data";
import { isLocale, pick } from "@/lib/i18n/config";
import { getProjects } from "@/lib/i18n/projects";
import { metadataFor } from "@/lib/seo";
import WorkDetail from "@/components/work/WorkDetail";

export function generateStaticParams() {
  return projectData.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/work/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const project = getProjects(lang).find((p) => p.slug === slug);
  return project
    ? metadataFor(lang, `/work/${project.slug}`, `${project.name} — Pip Ariza`, project.summary)
    : { title: pick(lang, "Proyecto", "Project") };
}

export default async function WorkDetailPage({
  params,
}: PageProps<"/[lang]/work/[slug]">) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const projects = getProjects(lang);
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const project = projects[index];
  const prevSlug = projects[(index - 1 + projects.length) % projects.length].slug;
  const nextSlug = projects[(index + 1) % projects.length].slug;

  return (
    <main id="contenido" tabIndex={-1} className="outline-none">
      <h1 className="sr-only">
        {pick(lang, `${project.name}: proyecto de diseño y desarrollo web`, `${project.name}: web design and development project`)}
      </h1>
      <WorkDetail
        project={project}
        index={index}
        total={projects.length}
        prevSlug={prevSlug}
        nextSlug={nextSlug}
      />
    </main>
  );
}
