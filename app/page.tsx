import type { Metadata } from "next";
import Hero from "@/components/hero/Hero";
import { projects, videoClips } from "@/lib/data";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <main id="contenido" tabIndex={-1} className="outline-none">
      <Hero projectCount={projects.length} clipCount={videoClips.length} />
    </main>
  );
}
