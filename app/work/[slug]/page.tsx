import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { projects } from "@/lib/data";
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
    ? { title: `${project.name} — Pip Ariza`, description: project.summary }
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
    <WorkDetail
      project={project}
      index={index}
      total={projects.length}
      prevSlug={prevSlug}
      nextSlug={nextSlug}
    />
  );
}
