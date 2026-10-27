import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ContactSection from "@/components/contact/ContactSection";
import { isLocale, pick } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/contacto">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return pageMetadata(lang, "contact");
}

export default async function ContactoPage({ params }: PageProps<"/[lang]/contacto">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <main id="contenido" tabIndex={-1} className="outline-none">
      <h1 className="sr-only">{pick(lang, "Contacto de Pip Ariza: escríbeme para trabajar juntos", "Contact Pip Ariza: write to me so we can work together")}</h1>
      <ContactSection />
    </main>
  );
}
