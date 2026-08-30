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
        <div className="flex items-start justify-between text-[11px] font-medium uppercase tracking-[0.08em] text-bone/60">
          <a href={CONTACT.linkedin.href} target="_blank" rel="noreferrer" data-cursor-hover>
            {CONTACT.linkedin.label}
          </a>
          <a href={CONTACT.instagram.href} target="_blank" rel="noreferrer" data-cursor-hover>
            {CONTACT.instagram.label}
          </a>
        </div>

        <div className="relative flex-1 flex flex-col justify-center gap-10 md:gap-0 py-16">
          <a
            href={`mailto:${CONTACT.email}`}
            data-cursor-hover
            className="md:absolute md:left-[8%] md:top-[38%] text-3xl md:text-[56px] font-medium leading-none hover:text-bone/70 transition-colors break-all"
          >
            {CONTACT.email}
          </a>
          <a
            href={CONTACT.whatsapp.href}
            target="_blank"
            rel="noreferrer"
            data-cursor-hover
            className="md:absolute md:right-[8%] md:top-[58%] text-3xl md:text-[56px] font-medium leading-none hover:text-bone/70 transition-colors"
          >
            {CONTACT.whatsapp.label}
          </a>
        </div>

        <div className="flex items-center justify-between text-[11px] text-bone/40">
          <span>© {new Date().getFullYear()} Pip Ariza</span>
          <span>{CONTACT.city}</span>
        </div>
      </div>
    </ThemeSection>
  );
}
