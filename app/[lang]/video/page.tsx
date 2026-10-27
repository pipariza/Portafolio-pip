import { notFound } from "next/navigation";
import type { Metadata } from "next";
import VideoSection from "@/components/video/VideoSection";
import { isLocale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/video">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return pageMetadata(lang, "video");
}

export default async function VideoPage({ params }: PageProps<"/[lang]/video">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <main id="contenido" tabIndex={-1} className="outline-none">
      <VideoSection />
    </main>
  );
}
