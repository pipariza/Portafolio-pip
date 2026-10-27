import Hero from "@/components/hero/Hero";
import { projects, videoClips } from "@/lib/data";

export default function Home() {
  return (
    <main>
      <Hero projectCount={projects.length} clipCount={videoClips.length} />
    </main>
  );
}
