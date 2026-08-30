import type { Metadata } from "next";
import AboutSection from "@/components/about/AboutSection";

export const metadata: Metadata = {
  title: "About — Pip Ariza",
};

export default function AboutPage() {
  return (
    <main>
      <AboutSection />
    </main>
  );
}
