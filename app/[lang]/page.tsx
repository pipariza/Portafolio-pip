import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Hero from "@/components/hero/Hero";
import { projectData, videoClips } from "@/lib/data";
import { isLocale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo";
import { getBogotaWeather } from "@/lib/weather";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return pageMetadata(lang, "home");
}

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  // Asked on the server and kept for 15 minutes (lib/weather.ts), so the widget has its numbers on the first paint.
  const weather = await getBogotaWeather();
  return (
    <main id="contenido" tabIndex={-1} className="outline-none">
      <Hero projectCount={projectData.length} clipCount={videoClips.length} weather={weather} />
    </main>
  );
}
