import { getImageProps } from "next/image";
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

// Art direction: a portrait wallpaper for tall screens (phones, tablets held
// upright) and a landscape one otherwise. Keep both files in /public/apps.
const WALLPAPER = { alt: "", fill: true, priority: true, sizes: "100vw" } as const;

export default function AppsSection() {
  const {
    props: { srcSet: landscapeSet, ...wallpaperProps },
  } = getImageProps({ ...WALLPAPER, src: "/apps/wallpaper.jpg" });
  const {
    props: { srcSet: portraitSet },
  } = getImageProps({ ...WALLPAPER, src: "/apps/wallpaper-movil.jpg" });

  return (
    <ThemeSection
      theme="light"
      id="aplicativos"
      className="relative w-full min-h-screen bg-paper text-ink overflow-hidden pt-32 pb-40"
    >
      {/* Wallpaper: a soft glow centered in the frame, so the crop stays on it at any size. */}
      <picture>
        <source media="(orientation: portrait)" srcSet={portraitSet} />
        <source media="(orientation: landscape)" srcSet={landscapeSet} />
        <img
          {...wallpaperProps}
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none object-cover object-center"
        />
      </picture>

      <p className="relative z-10 px-6 max-md:portrait:pl-[76px] md:px-16 text-[11px] uppercase tracking-[0.08em] text-ink/60">
        Arrastrá los íconos · Click para abrir
      </p>

      <div className="relative z-10 hidden md:block h-[60vh] mt-8">
        {apps.map((app, i) => (
          <DesktopAppIcon key={app.slug} app={app} style={POSITIONS[i % POSITIONS.length]} />
        ))}
      </div>

      <div className="relative z-10 md:hidden grid grid-cols-2 gap-x-6 gap-y-10 px-8 max-md:portrait:pl-[84px] max-md:portrait:pr-6 mt-12">
        {apps.map((app) => (
          <GridAppIcon key={app.slug} app={app} />
        ))}
      </div>

      <Dock />
    </ThemeSection>
  );
}
