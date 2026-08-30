import type { Metadata } from "next";
import ContactSection from "@/components/contact/ContactSection";

export const metadata: Metadata = {
  title: "Contacto — Pip Ariza",
};

export default function ContactoPage() {
  return (
    <main>
      <ContactSection />
    </main>
  );
}
