import { notFound } from "next/navigation";
import type { Metadata } from "next";
import AppsSection from "@/components/apps/AppsSection";
import { isLocale, pick } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/apps">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return pageMetadata(lang, "apps");
}

export default async function AppsPage({ params }: PageProps<"/[lang]/apps">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <main id="contenido" tabIndex={-1} className="outline-none">
      <h1 className="sr-only">
        {pick(lang, "Aplicativos con IA, CV y piezas de Pip Ariza", "AI-powered apps, resume and pieces by Pip Ariza")}
      </h1>
      <AppsSection lang={lang} />
    </main>
  );
}
