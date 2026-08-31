import { ThemeSection } from "@/lib/section-theme";
import { CONTACT } from "@/lib/config";
import ContactForm from "./ContactForm";

export default function ContactSection() {
  return (
    <ThemeSection
      theme="dark"
      id="contacto"
      className="relative w-full bg-void text-bone"
    >
      <div className="max-w-4xl mx-auto px-6 md:px-0 pt-40 pb-28">
        <p className="text-[11px] uppercase tracking-[0.08em] text-bone/50 mb-4">
          ¿Hablamos?
        </p>
        <h2 className="text-4xl md:text-6xl font-medium mb-6 max-w-xl">
          Creemos algo juntos
        </h2>
        <p className="max-w-md text-bone/60 mb-14">
          Contame en qué estás pensando — trabajo, colaboración o simple
          curiosidad. Te respondo en menos de 48 horas.
        </p>

        <ContactForm />
      </div>

      <div className="relative w-full min-h-screen bg-void border-t border-bone/10 px-6 md:px-16 py-10 flex flex-col">
        {/* Mobile: single stacked block */}
        <div className="flex md:hidden flex-1 flex-col items-center justify-center gap-6 text-center text-xl font-medium">
          <span className="text-bone/70">LinkedIn</span>
          <span className="text-bone/70">{CONTACT.city}</span>
          <a href={`mailto:${CONTACT.email}`} data-cursor-hover className="hover:text-bone/70 transition-colors">
            Email
          </a>
          <a
            href={CONTACT.whatsapp.href}
            target="_blank"
            rel="noreferrer"
            data-cursor-hover
            className="hover:text-bone/70 transition-colors"
          >
            WhatsApp
          </a>
          <a
            href={CONTACT.instagram.href}
            target="_blank"
            rel="noreferrer"
            data-cursor-hover
            className="hover:text-bone/70 transition-colors"
          >
            Instagram
          </a>
        </div>

        {/* Desktop: scattered layout */}
        <div className="hidden md:flex flex-1 flex-col">
          <div className="flex items-start justify-between text-xl md:text-2xl font-medium">
            <span className="text-bone/70">LinkedIn</span>
            <span className="text-bone/70">{CONTACT.city}</span>
          </div>

          <div className="relative flex-1">
            <a
              href={`mailto:${CONTACT.email}`}
              data-cursor-hover
              className="absolute left-[8%] top-[38%] text-xl md:text-2xl font-medium hover:text-bone/70 transition-colors"
            >
              Email
            </a>
            <a
              href={CONTACT.whatsapp.href}
              target="_blank"
              rel="noreferrer"
              data-cursor-hover
              className="absolute right-[8%] top-[58%] text-xl md:text-2xl font-medium hover:text-bone/70 transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-bone/40">
          <span>© {new Date().getFullYear()} Pip Ariza</span>
          <a
            href={CONTACT.instagram.href}
            target="_blank"
            rel="noreferrer"
            data-cursor-hover
            className="hidden md:inline text-xl md:text-2xl font-medium text-bone hover:text-bone/70 transition-colors"
          >
            Instagram
          </a>
        </div>
      </div>
    </ThemeSection>
  );
}
