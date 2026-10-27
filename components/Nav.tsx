"use client";

import { usePathname } from "next/navigation";
import { useLocale } from "@/components/LocaleProvider";
import { useSectionTheme } from "@/lib/section-theme";
import { parsePathname } from "@/lib/i18n/routes";
import MacMenuBar from "./MacMenuBar";

// The pages of the menu: their internal path and their label in each language.
const LINKS = [
  { path: "/", es: "Inicio", en: "Home" },
  { path: "/work", es: "Work", en: "Work" },
  { path: "/apps", es: "Apps", en: "Apps" },
  { path: "/video", es: "Video", en: "Video" },
  { path: "/about", es: "About", en: "About" },
  { path: "/contacto", es: "Contact", en: "Contact" },
];

function isLinkActive(pathname: string, path: string) {
  return path === "/" ? pathname === "/" : pathname.startsWith(path);
}

// The whole site is a macOS desktop, so its menu is a macOS menu bar.
export default function Nav() {
  const { theme } = useSectionTheme();
  const { lang, href } = useLocale();
  const { path: pathname } = parsePathname(usePathname());

  return (
    <MacMenuBar
      theme={theme}
      links={LINKS.map((link) => ({
        path: link.path,
        href: href(link.path),
        label: link[lang],
        active: isLinkActive(pathname, link.path),
      }))}
    />
  );
}
