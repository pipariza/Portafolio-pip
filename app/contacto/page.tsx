import ContactSection from "@/components/contact/ContactSection";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contacto — Pip Ariza",
  description:
    "Contacta a Pip Ariza: escribe por correo, WhatsApp, LinkedIn o Instagram, o usa el formulario. Respuesta en menos de 48 horas.",
  path: "/contacto",
});

export default function ContactoPage() {
  return (
    <main id="contenido" tabIndex={-1} className="outline-none">
      <h1 className="sr-only">Contacto de Pip Ariza: escríbeme para trabajar juntos</h1>
      <ContactSection />
    </main>
  );
}
