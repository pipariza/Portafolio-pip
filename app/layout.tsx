import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import { SectionThemeProvider } from "@/lib/section-theme";
import Nav from "@/components/Nav";
import Spotlight from "@/components/Spotlight";
import { CONTACT, NAME, SITE_URL } from "@/lib/config";
import { projects } from "@/lib/data";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
});

const TITLE = "Pip Ariza — Diseño & Desarrollo Web";
const DESCRIPTION =
  "Pip Ariza (Duvan Felipe Colmenares Ariza): diseñador y desarrollador web con foco en aplicativos con IA y edición de video. Disponible para trabajo remoto.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: "Pip Ariza",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: { card: "summary", title: TITLE, description: DESCRIPTION },
};

export const viewport: Viewport = {
  // The color of the browser bar on phones: the site's light menu bar, not the old dark theme.
  themeColor: "#f6f4f0",
  // Light only: stops browsers from forcing their own dark mode over the desktop look.
  colorScheme: "light",
};

// Who the site is about, for search engines: the name Pip works under, with the full name as an alias.
const PERSON = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: NAME.alias,
  alternateName: NAME.full,
  url: SITE_URL,
  jobTitle: "Diseñador y desarrollador web",
  email: CONTACT.email,
  address: { "@type": "PostalAddress", addressLocality: "Bogotá", addressCountry: "CO" },
  knowsAbout: ["Diseño web", "Desarrollo web", "Shopify", "Aplicativos con IA", "Edición de video"],
  sameAs: [CONTACT.instagram.href, ...(CONTACT.linkedin ? [CONTACT.linkedin.href] : [])],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${archivo.variable} antialiased`}>
      <body className="font-sans bg-void text-bone">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON) }} />
        {/* First stop of the keyboard: jumps over the menu bar to the page. */}
        <a
          href="#contenido"
          className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-3 focus-visible:top-[44px] focus-visible:z-[100] focus-visible:rounded-lg focus-visible:bg-[#0a64d8] focus-visible:px-4 focus-visible:py-2.5 focus-visible:text-[14px] focus-visible:font-semibold focus-visible:text-white focus-visible:shadow-lg"
        >
          Saltar al contenido
        </a>
        <SectionThemeProvider>
          <Nav />
          <Spotlight projects={projects.map(({ slug, name }) => ({ slug, name }))} />
          {children}
        </SectionThemeProvider>
      </body>
    </html>
  );
}
