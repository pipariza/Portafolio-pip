import { ThemeSection } from "@/lib/section-theme";
import { apps } from "@/lib/data";
import { DesktopAppIcon, GridAppIcon } from "./AppIcon";
import Dock from "./Dock";

const POSITIONS = [
  { top: "20%", left: "10%" },
  { top: "16%", left: "60%" },
  { top: "44%", left: "36%" },
  { top: "58%", left: "70%" },
  { top: "62%", left: "14%" },
];

export default function AppsSection() {
  return (
    <ThemeSection
      theme="light"
      id="aplicativos"
      className="relative w-full min-h-screen bg-paper text-ink overflow-hidden pt-32 pb-40"
    >
      <div
        className="pointer-events-none absolute -top-1/4 left-1/2 -translate-x-1/2 h-[70vh] w-[70vh] rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(circle, rgba(140,140,132,0.5) 0%, rgba(140,140,132,0) 70%)",
          filter: "blur(60px)",
        }}
        aria-hidden="true"
      />

      <p className="relative z-10 px-6 md:px-16 text-[11px] uppercase tracking-[0.08em] text-ink/50">
        Arrastrá los íconos · Click para abrir
      </p>

      <div className="relative z-10 hidden md:block h-[60vh] mt-8">
        {apps.map((app, i) => (
          <DesktopAppIcon key={app.slug} app={app} style={POSITIONS[i % POSITIONS.length]} />
        ))}
      </div>

      <div className="relative z-10 md:hidden grid grid-cols-2 gap-x-6 gap-y-10 px-8 mt-12">
        {apps.map((app) => (
          <GridAppIcon key={app.slug} app={app} />
        ))}
      </div>

      <Dock />
    </ThemeSection>
  );
}
