import { ThemeSection } from "@/lib/section-theme";
import NotFoundAlert from "@/components/NotFoundAlert";

export default function NotFound() {
  return (
    <main>
      <ThemeSection theme="light" className="w-full">
        <NotFoundAlert />
      </ThemeSection>
    </main>
  );
}
