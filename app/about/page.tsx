import AboutSection from "@/components/about/AboutSection";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About — Pip Ariza",
  description:
    "Quién es Pip Ariza (Duvan Felipe Colmenares Ariza): más de tres años en diseño y desarrollo web, e-commerce, pauta digital y edición de video, desde Bogotá.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <main id="contenido" tabIndex={-1} className="outline-none">
      <AboutSection />
    </main>
  );
}
