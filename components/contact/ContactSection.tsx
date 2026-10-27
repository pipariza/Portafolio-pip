import { ThemeSection } from "@/lib/section-theme";
import ContactDesktop from "./ContactDesktop";

export default function ContactSection() {
  return (
    <ThemeSection theme="light" id="contacto" className="relative w-full bg-[#e9e7e3] text-[#1d1d1f]">
      <ContactDesktop />
    </ThemeSection>
  );
}
