import { ThemeSection } from "@/lib/section-theme";

const STATS = [
  { value: "5+", label: "Años de experiencia" },
  { value: "20+", label: "Proyectos entregados" },
  { value: "IA", label: "Foco en aplicativos" },
];

export default function AboutSection() {
  return (
    <ThemeSection
      theme="light"
      id="about"
      className="relative w-full bg-paper text-ink py-28 md:py-40"
    >
      <div className="max-w-3xl mx-auto px-6 md:px-0">
        <p className="text-[11px] uppercase tracking-[0.08em] text-ink/50 mb-6">
          About
        </p>
        <h2 className="text-3xl md:text-5xl font-medium leading-tight mb-14">
          Diseño y desarrollo web con foco en aplicativos con IA — la edición
          de video, como diferencial.
        </h2>

        <div className="grid grid-cols-3 gap-6 max-w-lg">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl md:text-4xl font-medium mb-2">{stat.value}</p>
              <p className="text-xs uppercase tracking-[0.05em] text-ink/50">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </ThemeSection>
  );
}
