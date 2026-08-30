"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useSectionTheme } from "@/lib/section-theme";

const LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/work", label: "Work" },
  { href: "/apps", label: "Apps" },
  { href: "/video", label: "Video" },
  { href: "/about", label: "About" },
];

function isLinkActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export default function Nav() {
  const { theme } = useSectionTheme();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-5 inset-x-0 z-50 flex justify-center px-4">
      <nav
        data-theme={theme}
        className="glass-pill w-full max-w-2xl rounded-full border px-2 py-2 flex items-center justify-between"
      >
        <Link
          href="/"
          className="pl-4 text-[13px] font-bold tracking-[0.12em]"
        >
          PIP ARIZA
        </Link>

        <ul className="hidden md:flex items-center gap-5 text-[13px] font-medium uppercase tracking-[0.03em]">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`hover:opacity-60 transition-opacity ${
                  isLinkActive(pathname, link.href) ? "font-semibold" : ""
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/contacto"
          className={`hidden md:inline-flex items-center rounded-full px-5 py-2 text-[12px] font-bold uppercase tracking-[0.03em] transition-colors ${
            theme === "dark" ? "bg-bone text-void" : "bg-ink text-paper"
          }`}
        >
          Contact
        </Link>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menú"
          aria-expanded={open}
          className="md:hidden flex flex-col justify-center items-center gap-[5px] w-10 h-10"
        >
          <span
            className="block h-[1.5px] w-5 transition-transform"
            style={{
              background: "currentColor",
              transform: open ? "translateY(3.5px) rotate(45deg)" : "none",
            }}
          />
          <span
            className="block h-[1.5px] w-5 transition-transform"
            style={{
              background: "currentColor",
              transform: open ? "translateY(-3.5px) rotate(-45deg)" : "none",
            }}
          />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            data-theme={theme}
            className="glass-pill md:hidden fixed top-20 inset-x-4 z-50 rounded-3xl border p-6 flex flex-col gap-5"
          >
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`text-sm uppercase tracking-[0.03em] ${
                  isLinkActive(pathname, link.href) ? "font-semibold" : "font-medium"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contacto"
              onClick={() => setOpen(false)}
              className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-[12px] font-bold uppercase tracking-[0.03em] ${
                theme === "dark" ? "bg-bone text-void" : "bg-ink text-paper"
              }`}
            >
              Contact
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
