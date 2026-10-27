import AppsSection from "@/components/apps/AppsSection";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Aplicativos — Pip Ariza",
  description:
    "Escritorio interactivo de Pip Ariza: aplicativos con IA, CV, piezas de diseño y contacto. Abre cada ícono para ver su ventana.",
  path: "/apps",
});

export default function AppsPage() {
  return (
    <main id="contenido" tabIndex={-1} className="outline-none">
      <h1 className="sr-only">Aplicativos con IA, CV y piezas de Pip Ariza</h1>
      <AppsSection />
    </main>
  );
}
