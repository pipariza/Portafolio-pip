import VideoSection from "@/components/video/VideoSection";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Edición de Video — Pip Ariza",
  description:
    "Edición de video vertical y motion de Pip Ariza: reels y clips para marcas como Bilongo, Ajisen y Tío Mao.",
  path: "/video",
});

export default function VideoPage() {
  return (
    <main id="contenido" tabIndex={-1} className="outline-none">
      <VideoSection />
    </main>
  );
}
