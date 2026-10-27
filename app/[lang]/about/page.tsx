import { notFound } from "next/navigation";
import type { Metadata } from "next";
import AboutSection from "@/components/about/AboutSection";
import { isLocale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return pageMetadata(lang, "about");
}

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <main id="contenido" tabIndex={-1} className="outline-none">
      <AboutSection />
    </main>
  );
}
