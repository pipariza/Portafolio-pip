import { ThemeSection } from "@/lib/section-theme";
import NotFoundAlert from "@/components/NotFoundAlert";

export default function NotFound() {
  return (
    <main id="contenido" tabIndex={-1} className="outline-none">
      <ThemeSection theme="light" className="w-full">
        <NotFoundAlert />
      </ThemeSection>
    </main>
  );
}
