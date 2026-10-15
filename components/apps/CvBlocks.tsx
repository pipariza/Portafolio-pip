import type { WindowTab } from "@/lib/dock";

type Entries = NonNullable<WindowTab["entries"]>;
type Groups = NonNullable<WindowTab["groups"]>;

type Stats = NonNullable<WindowTab["stats"]>;

/** Big numbers; stacked on narrow windows, three across when there is room. */
export function StatRow({ stats }: { stats: Stats }) {
  return (
    <div className="mb-6 grid grid-cols-1 gap-2 @sm:grid-cols-3">
      {stats.map((s) => (
        <div key={s.label} className="rounded-lg bg-[#f6efe0] px-3 py-3">
          <p className="text-xl font-semibold leading-none md:text-2xl">{s.value}</p>
          <p className="mt-1.5 text-[11px] leading-snug text-black/60">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

/** Role / organization / period with bullet points, newest first. */
export function EntryList({ entries }: { entries: Entries }) {
  return (
    <ol className="space-y-6">
      {entries.map((e) => (
        <li key={`${e.title}-${e.org}-${e.period}`}>
          <div className="flex flex-wrap items-baseline justify-between gap-x-3">
            <p className="font-semibold">{e.title}</p>
            <p className="text-black/50">{e.period}</p>
          </div>
          <p className="text-black/60">{e.org}</p>
          {e.points.length > 0 && (
            <ul className="mt-2 list-disc space-y-1 pl-4">
              {e.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ol>
  );
}

/** Titled groups of short items; 2 columns when the window is wide enough. */
export function GroupGrid({ groups }: { groups: Groups }) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-5 @md:grid-cols-2">
      {groups.map((g) => (
        <div key={g.title}>
          <p className="mb-1.5 flex items-center gap-2 font-semibold">
            <span className="h-2 w-2 rounded-full bg-[#f2b63c]" aria-hidden="true" />
            {g.title}
          </p>
          <ul className="space-y-1 text-black/70">
            {g.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function Chips({ title, chips }: { title?: string; chips: string[] }) {
  return (
    <div>
      {title && <p className="mb-2.5">{title}</p>}
      <ul className="flex flex-wrap gap-2">
        {chips.map((c) => (
          <li
            key={c}
            className="rounded-full border border-black/15 px-3 py-1 text-[11px] font-medium"
          >
            {c}
          </li>
        ))}
      </ul>
    </div>
  );
}
