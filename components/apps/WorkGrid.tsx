import type { WorkThumb } from "@/lib/dock";
import Thumb from "./Thumb";

/** Captioned thumbnails of featured pieces. */
export default function WorkGrid({ works }: { works: WorkThumb[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-5 @md:grid-cols-3">
      {works.map((w) => (
        <figure key={w.title}>
          <Thumb image={w.image} color={w.color} alt={w.title} label="Imagen de prueba" />
          <figcaption className="mt-2">
            <p className="font-semibold">{w.title}</p>
            <p className="mt-0.5 text-[11px] leading-snug text-black/55">{w.caption}</p>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
