import WorkSection from "@/components/work/WorkSection";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Work — Pip Ariza",
  description:
    "Proyectos de diseño y desarrollo web de Pip Ariza: tiendas Shopify, sitios en WordPress y marcas como Visual Living, El Departamento y Feria EVA.",
  path: "/work",
});

export default function WorkPage() {
  return (
    <main id="contenido" tabIndex={-1} className="outline-none">
      <h1 className="sr-only">Work: proyectos de diseño y desarrollo web de Pip Ariza</h1>
      <WorkSection />
    </main>
  );
}
