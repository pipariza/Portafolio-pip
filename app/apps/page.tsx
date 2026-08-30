import type { Metadata } from "next";
import AppsSection from "@/components/apps/AppsSection";

export const metadata: Metadata = {
  title: "Aplicativos — Pip Ariza",
};

export default function AppsPage() {
  return (
    <main>
      <AppsSection />
    </main>
  );
}
