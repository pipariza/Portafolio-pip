import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import { SectionThemeProvider } from "@/lib/section-theme";
import CustomCursor from "@/components/CustomCursor";
import Nav from "@/components/Nav";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Pip Ariza — Diseño & Desarrollo Web",
  description:
    "Portafolio de Pip Ariza: diseño y desarrollo web con foco en aplicativos con IA, más edición de video.",
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
