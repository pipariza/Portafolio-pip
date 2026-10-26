import { ThemeSection } from "@/lib/section-theme";
import ContactDesktop from "./ContactDesktop";

export default function ContactSection() {
  return (
    <ThemeSection theme="dark" id="contacto" className="relative w-full bg-void text-bone">
      <ContactDesktop />
    </ThemeSection>
  );
}
