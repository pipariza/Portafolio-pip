import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { projects } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import WorkDetail from "@/components/work/WorkDetail";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  return project
    ? pageMetadata({
        title: `${project.name} — Pip Ariza`,
        description: project.summary,
        path: `/work/${project.slug}`,
      })
    : { title: "Proyecto" };
}

export default async function WorkDetailPage({
  params,
}: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const project = projects[index];
  const prevSlug = projects[(index - 1 + projects.length) % projects.length].slug;
  const nextSlug = projects[(index + 1) % projects.length].slug;

  return (
    <main id="contenido" tabIndex={-1} className="outline-none">
      <h1 className="sr-only">{project.name}: proyecto de diseño y desarrollo web</h1>
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
