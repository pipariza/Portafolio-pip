import type { Metadata } from "next";
import VideoSection from "@/components/video/VideoSection";

export const metadata: Metadata = {
  title: "Edición de Video — Pip Ariza",
};

export default function VideoPage() {
  return (
    <main>
      <VideoSection />
    </main>
  );
}
