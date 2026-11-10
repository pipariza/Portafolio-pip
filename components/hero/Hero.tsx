import { ThemeSection } from "@/lib/section-theme";
import type { Weather } from "@/lib/weather";
import HomeDesktop from "./HomeDesktop";

export default function Hero({
  projectCount,
  clipCount,
  weather,
}: {
  projectCount: number;
  clipCount: number;
  weather: Weather | null;
}) {
  return (
    <ThemeSection theme="light" id="inicio" className="relative w-full bg-[#e9e7e3] text-[#1d1d1f]">
      <HomeDesktop projectCount={projectCount} clipCount={clipCount} weather={weather} />
    </ThemeSection>
  );
}
