import { ThemeSection } from "@/lib/section-theme";
import HomeDesktop from "./HomeDesktop";

export default function Hero({ projectCount, clipCount }: { projectCount: number; clipCount: number }) {
  return (
    <ThemeSection theme="light" id="inicio" className="relative w-full bg-[#e9e7e3] text-[#1d1d1f]">
      <HomeDesktop projectCount={projectCount} clipCount={clipCount} />
    </ThemeSection>
  );
}
