"use client";

import { usePathname } from "next/navigation";
import { useSectionTheme } from "@/lib/section-theme";
import MacMenuBar from "./MacMenuBar";

const LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/work", label: "Work" },
  { href: "/apps", label: "Apps" },
  { href: "/video", label: "Video" },
  { href: "/about", label: "About" },
  { href: "/contacto", label: "Contact" },
];

function isLinkActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

// The whole site is a macOS desktop, so its menu is a macOS menu bar.
export default function Nav() {
  const { theme } = useSectionTheme();
  const pathname = usePathname();

  return (
    <MacMenuBar
      theme={theme}
      links={LINKS.map((link) => ({ ...link, active: isLinkActive(pathname, link.href) }))}
    />
  );
}
