import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { appData } from "@/lib/data";
import { ThemeSection } from "@/lib/section-theme";
import { isLocale, pick, type Locale } from "@/lib/i18n/config";
import { localizeHref } from "@/lib/i18n/routes";
import { getApps } from "@/lib/i18n/projects";
import { metadataFor } from "@/lib/seo";
import AppDemo from "@/components/apps/demo/AppDemo";

export function generateStaticParams() {
  return appData.map((app) => ({ slug: app.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/apps/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const app = getApps(lang).find((a) => a.slug === slug);
  return app
    ? metadataFor(lang, `/apps/${app.slug}`, `${app.name} — Pip Ariza`, app.description)
    : { title: pick(lang, "Aplicativo", "App") };
}

export default async function AppDetailPage({
  params,
}: PageProps<"/[lang]/apps/[slug]">) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const apps = getApps(lang);
  const index = apps.findIndex((a) => a.slug === slug);
  if (index === -1) notFound();

  const app = apps[index];
  const prev = apps[(index - 1 + apps.length) % apps.length];
  const next = apps[(index + 1) % apps.length];
  const href = (path: string) => localizeHref(path, lang as Locale);

  return (
    <main id="contenido" tabIndex={-1} className="outline-none">
      <ThemeSection theme="light" className="w-full min-h-screen bg-paper text-ink">
        <div className="max-w-4xl mx-auto px-6 md:px-0 pt-36 pb-24">
          <Link
            href={href("/apps")}
            data-cursor-hover
            className="inline-block text-xs font-medium uppercase tracking-[0.05em] text-ink/60 mb-10"
          >
            ← {pick(lang, "Volver a Aplicativos", "Back to Apps")}
          </Link>

          <p className="text-[11px] uppercase tracking-[0.08em] text-ink/60 mb-3">
            {app.kicker ?? pick(lang, "Aplicativo con IA", "AI-powered app")}
          </p>
          <h1 className="text-[2.5rem] leading-tight min-[400px]:text-5xl md:text-6xl font-medium mb-8">{app.name}</h1>
          <p className="max-w-xl text-base md:text-lg text-ink/70 mb-14">{app.description}</p>

          {app.demo ? (
            <div className="mb-16">
              <AppDemo demo={app.demo} />
            </div>
          ) : (
            <div
              className="relative w-full h-[45vh] rounded-2xl mb-14 overflow-hidden"
              style={{ background: app.color }}
            >
              {app.image && (
                <Image
                  src={app.image}
                  alt={app.name}
                  fill
                  sizes="(min-width: 768px) 56rem, 100vw"
                  className="object-cover"
                />
              )}
            </div>
          )}

          <div className="grid grid-cols-3 gap-6 max-w-md mb-20">
            <div>
              <p className="text-[11px] uppercase tracking-[0.08em] text-ink/60 mb-1">{pick(lang, "Rol", "Role")}</p>
              <p className="text-sm font-medium">{app.role}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.08em] text-ink/60 mb-1">{pick(lang, "Año", "Year")}</p>
              <p className="text-sm font-medium">{app.year}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.08em] text-ink/60 mb-1">Stack</p>
              <p className="text-sm font-medium">{app.stack}</p>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-ink/10 pt-8 text-xs font-medium uppercase tracking-[0.05em]">
            <Link href={href(`/apps/${prev.slug}`)} data-cursor-hover>
              ← {prev.name}
            </Link>
            <Link href={href(`/apps/${next.slug}`)} data-cursor-hover>
              {next.name} →
            </Link>
          </div>
        </div>
      </ThemeSection>
    </main>
  );
}
