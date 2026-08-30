import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { apps } from "@/lib/data";
import { ThemeSection } from "@/lib/section-theme";

export function generateStaticParams() {
  return apps.map((app) => ({ slug: app.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/apps/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const app = apps.find((a) => a.slug === slug);
  return { title: app ? `${app.name} — Pip Ariza` : "Aplicativo" };
}

export default async function AppDetailPage({
  params,
}: PageProps<"/apps/[slug]">) {
  const { slug } = await params;
  const index = apps.findIndex((a) => a.slug === slug);
  if (index === -1) notFound();

  const app = apps[index];
  const prev = apps[(index - 1 + apps.length) % apps.length];
  const next = apps[(index + 1) % apps.length];

  return (
    <ThemeSection theme="light" className="w-full min-h-screen bg-paper text-ink">
      <div className="max-w-4xl mx-auto px-6 md:px-0 pt-36 pb-24">
        <Link
          href="/apps"
          data-cursor-hover
          className="inline-block text-xs font-medium uppercase tracking-[0.05em] text-ink/60 mb-10"
        >
          ← Volver a Aplicativos
        </Link>

        <p className="text-[11px] uppercase tracking-[0.08em] text-ink/50 mb-3">
          Aplicativo con IA
        </p>
        <h1 className="text-5xl md:text-6xl font-medium mb-8">{app.name}</h1>
        <p className="max-w-xl text-base md:text-lg text-ink/70 mb-14">
          {app.description}
        </p>

        <div
          className="w-full h-[45vh] rounded-2xl mb-14"
          style={{ background: app.color }}
        />

        <div className="grid grid-cols-3 gap-6 max-w-md mb-20">
          <div>
            <p className="text-[11px] uppercase tracking-[0.08em] text-ink/50 mb-1">Rol</p>
            <p className="text-sm font-medium">{app.role}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.08em] text-ink/50 mb-1">Año</p>
            <p className="text-sm font-medium">{app.year}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.08em] text-ink/50 mb-1">Stack</p>
            <p className="text-sm font-medium">{app.stack}</p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-ink/10 pt-8 text-xs font-medium uppercase tracking-[0.05em]">
          <Link href={`/apps/${prev.slug}`} data-cursor-hover>
            ← {prev.name}
          </Link>
          <Link href={`/apps/${next.slug}`} data-cursor-hover>
            {next.name} →
          </Link>
        </div>
      </div>
    </ThemeSection>
  );
}
