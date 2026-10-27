import { notFound } from "next/navigation";

// Any address that does not match a page lands here so the 404 is drawn by
// app/[lang]/not-found.tsx, inside the layout (menu bar, Dock, language). Without this the
// root layout lives under [lang] and Next would show its own bare 404 instead.
export default function NoEncontrada() {
  notFound();
}
