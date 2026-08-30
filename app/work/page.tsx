import type { Metadata } from "next";
import WorkSection from "@/components/work/WorkSection";

export const metadata: Metadata = {
  title: "Work — Pip Ariza",
};

export default function WorkPage() {
  return (
    <main>
      <WorkSection />
    </main>
  );
}
