import { notFound } from "next/navigation";
import type { Metadata } from "next";
import WorkSection from "@/components/work/WorkSection";
import { isLocale, pick } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/work">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return pageMetadata(lang, "work");
}

export default async function WorkPage({ params }: PageProps<"/[lang]/work">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <main id="contenido" tabIndex={-1} className="outline-none">
      <h1 className="sr-only">
        {pick(lang, "Work: proyectos de diseño y desarrollo web de Pip Ariza", "Work: web design and development projects by Pip Ariza")}
      </h1>
      <WorkSection />
    </main>
  );
}
