import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { SectionThemeProvider } from "@/lib/section-theme";
import Nav from "@/components/Nav";
import Spotlight from "@/components/Spotlight";
import PageTransition from "@/components/PageTransition";
import { LocaleProvider } from "@/components/LocaleProvider";
import { CONTACT, NAME, SITE_URL } from "@/lib/config";
import { projectData } from "@/lib/data";
import { isLocale, locales, pick } from "@/lib/i18n/config";
import { PAGES } from "@/lib/seo";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
});

// Only the two languages exist: any other /[lang] is a 404 (the proxy sends every address here).
export const dynamicParams = false;
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { title, description } = PAGES.home;
  return {
    metadataBase: new URL(SITE_URL),
    title: title[lang],
    description: description[lang],
    openGraph: {
      type: "website",
      locale: lang === "en" ? "en_US" : "es_CO",
      siteName: "Pip Ariza",
      title: title[lang],
      description: description[lang],
    },
    twitter: { card: "summary", title: title[lang], description: description[lang] },
  };
}

export const viewport: Viewport = {
  // The color of the browser bar on phones: the site's light menu bar, not the old dark theme.
  themeColor: "#f6f4f0",
  // Light only: stops browsers from forcing their own dark mode over the desktop look.
  colorScheme: "light",
};

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  // Who the site is about, for search engines: the name Pip works under, with the full name as an alias.
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: NAME.alias,
    alternateName: NAME.full,
    url: SITE_URL,
    jobTitle: pick(lang, "Diseñador y desarrollador web", "Web designer and developer"),
    email: CONTACT.email,
    address: { "@type": "PostalAddress", addressLocality: "Bogotá", addressCountry: "CO" },
    knowsAbout:
      lang === "en"
        ? ["Web design", "Web development", "Shopify", "AI-powered apps", "Video editing"]
        : ["Diseño web", "Desarrollo web", "Shopify", "Aplicativos con IA", "Edición de video"],
    sameAs: [CONTACT.instagram.href, ...(CONTACT.linkedin ? [CONTACT.linkedin.href] : [])],
  };

  return (
    <html lang={lang} className={`${archivo.variable} antialiased`}>
      <body className="font-sans bg-void text-bone">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />
        <LocaleProvider lang={lang}>
          {/* First stop of the keyboard: jumps over the menu bar to the page. */}
          <a
            href="#contenido"
            className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-3 focus-visible:top-[44px] focus-visible:z-[100] focus-visible:rounded-lg focus-visible:bg-[#0a64d8] focus-visible:px-4 focus-visible:py-2.5 focus-visible:text-[14px] focus-visible:font-semibold focus-visible:text-white focus-visible:shadow-lg"
          >
            {pick(lang, "Saltar al contenido", "Skip to content")}
          </a>
          <SectionThemeProvider>
            <Nav />
            <Spotlight projects={projectData.map(({ slug, name }) => ({ slug, name }))} />
            <PageTransition>{children}</PageTransition>
          </SectionThemeProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
