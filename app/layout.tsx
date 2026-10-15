import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import { SectionThemeProvider } from "@/lib/section-theme";
import CustomCursor from "@/components/CustomCursor";
import Nav from "@/components/Nav";
import { SITE_URL } from "@/lib/config";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
});

const TITLE = "Pip Ariza — Diseño & Desarrollo Web";
const DESCRIPTION =
  "Portafolio de Pip Ariza: diseño y desarrollo web con foco en aplicativos con IA, más edición de video.";

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
  themeColor: "#0a0a0a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${archivo.variable} antialiased`}>
      <body className="font-sans bg-void text-bone">
        <SectionThemeProvider>
          <CustomCursor />
          <Nav />
          {children}
        </SectionThemeProvider>
      </body>
    </html>
  );
}
