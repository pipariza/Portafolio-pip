import { ThemeSection } from "@/lib/section-theme";
import AboutDesktop from "./AboutDesktop";

export default function AboutSection() {
  return (
    <ThemeSection theme="light" id="about" className="relative w-full bg-paper text-ink">
      <AboutDesktop />
    </ThemeSection>
  );
}
