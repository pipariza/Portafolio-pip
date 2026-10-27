"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState, type ComponentType } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLocale } from "@/components/LocaleProvider";
import { CONTACT } from "@/lib/config";
import { OPEN_SPOTLIGHT } from "@/lib/spotlight";
import { localizeHref, parsePathname } from "@/lib/i18n/routes";
import { zoomOutThen } from "@/lib/zoom";
import { ChatGlyph, InstagramGlyph, LinkedInGlyph } from "@/components/contact/icons";
import {
  BrowserGlyph,
  FileGlyph,
  FilmGlyph,
  GridGlyph,
  HomeGlyph,
  MailGlyph,
  SearchGlyph,
  UserGlyph,
} from "@/components/hero/icons";

/*
 * Spotlight: a small search window to jump anywhere on the site, opened with ⌘K /
 * Ctrl+K or with the magnifier of the menu bar (the phone menu has a "Buscar" row).
 * Arrow keys move, Enter opens, Esc closes. Searching works in both languages.
 */

type Kind = "page" | "project" | "document" | "contact" | "language";

type Item = {
  id: string;
  title: string;
  kind: Kind;
  /** An internal path (it gets the language of the address), a mailto: or an external link. */
  href: string;
  /** Opens in a new tab (or the mail app) instead of navigating. */
  external?: boolean;
  keywords: string;
  Glyph: ComponentType<{ className?: string }>;
};

/** The items of Spotlight in a language; the keywords hold the words of both languages. */
function buildItems(tr: (es: string, en: string) => string, lang: "es" | "en", projects: { slug: string; name: string }[]): Item[] {
  const pages: Item[] = [
    { id: "inicio", title: tr("Inicio", "Home"), kind: "page", href: "/", keywords: "inicio home principal escritorio finder pip ariza", Glyph: HomeGlyph },
    { id: "work", title: "Work", kind: "page", href: "/work", keywords: "work trabajo diseño web design projects proyectos sitios websites shopify wordpress marcas brands", Glyph: BrowserGlyph },
    { id: "apps", title: "Apps", kind: "page", href: "/apps", keywords: "apps aplicativos web productos products ia ai inteligencia artificial", Glyph: GridGlyph },
    { id: "video", title: "Video", kind: "page", href: "/video", keywords: "video edición editing reels motion clips vertical", Glyph: FilmGlyph },
    { id: "about", title: "About", kind: "page", href: "/about", keywords: "about sobre mí quién soy who experiencia experience años years duvan felipe colmenares ariza pip", Glyph: UserGlyph },
    { id: "contacto", title: "Contact", kind: "page", href: "/contacto", keywords: "contact contacto escribir write mensaje message correo email formulario form", Glyph: MailGlyph },
  ];
  const projectItems: Item[] = projects.map(({ slug, name }) => ({
    id: `p-${slug}`,
    title: name,
    kind: "project",
    href: `/work/${slug}`,
    keywords: "proyecto project marca brand sitio web website diseño design tienda store",
    Glyph: BrowserGlyph,
  }));
  const other: Item[] = [
    { id: "cv", title: tr("Currículum (CV)", "Resume (CV)"), kind: "document", href: "/apps#cv", keywords: "cv resume curriculum currículum hoja de vida notas notes experiencia experience duvan felipe colmenares ariza", Glyph: FileGlyph },
    { id: "correo", title: tr("Escribir un correo", "Write an email"), kind: "contact", href: `mailto:${CONTACT.email}`, external: true, keywords: `email mail correo ${CONTACT.email}`, Glyph: MailGlyph },
    { id: "whatsapp", title: "WhatsApp", kind: "contact", href: CONTACT.whatsapp.href, external: true, keywords: `whatsapp wa celular phone chat ${CONTACT.whatsapp.label}`, Glyph: ChatGlyph },
    { id: "instagram", title: "Instagram", kind: "contact", href: CONTACT.instagram.href, external: true, keywords: "instagram ig redes social", Glyph: InstagramGlyph },
    ...(CONTACT.linkedin
      ? [{ id: "linkedin", title: "LinkedIn", kind: "contact" as const, href: CONTACT.linkedin.href, external: true, keywords: "linkedin redes social perfil profile", Glyph: LinkedInGlyph }]
      : []),
    {
      id: "language",
      title: lang === "es" ? "English" : "Español",
      kind: "language",
      href: "#language",
      keywords: "english inglés español spanish idioma language ingles",
      Glyph: SearchGlyph,
    },
  ];
  return [...pages, ...projectItems, ...other];
}

// Accents and capitals do not matter when searching.
const plain = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

function search(items: Item[], query: string): Item[] {
  const words = plain(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) return items;
  return items.filter((item) => {
    const hay = plain(`${item.title} ${item.keywords}`);
    return words.every((w) => hay.includes(w));
  }).sort((a, b) => {
    // Titles that start with what you typed come first.
    const starts = (i: Item) => (plain(i.title).startsWith(words[0]) ? 0 : 1);
    return starts(a) - starts(b);
  });
}

/** `projects`: name and slug of each Work project (passed from the layout so the site's data stays out of the bundle). */
export default function Spotlight({ projects }: { projects: { slug: string; name: string }[] }) {
  const router = useRouter();
  const { lang, tr, href } = useLocale();
  const { path: pathname } = parsePathname(usePathname());
  const reduce = useReducedMotion();
  const uid = useId();
  const listId = `${uid}-list`;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  // The ⌘K listener lives for the whole page, so it reads the state through a ref.
  const isOpen = useRef(false);

  const items = useMemo(() => buildItems(tr, lang, projects), [tr, lang, projects]);
  const results = useMemo(() => search(items, query), [items, query]);

  const show = useCallback(() => {
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setQuery("");
    setIndex(0);
    setOpen(true);
  }, []);
  const hide = useCallback(() => {
    setOpen(false);
    returnFocus.current?.focus({ preventScroll: true });
  }, []);

  // ⌘K / Ctrl+K toggles it from anywhere; the menu bar's magnifier asks for it with an event.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen.current) hide();
        else show();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_SPOTLIGHT, show);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_SPOTLIGHT, show);
    };
  }, [show, hide]);

  useEffect(() => {
    isOpen.current = open;
  }, [open]);

  // While it is open: Esc closes, the page behind does not scroll and the field has the focus.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") hide();
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    inputRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, hide]);

  // The highlighted row stays in view when the list scrolls.
  useEffect(() => {
    listRef.current?.children[index]?.scrollIntoView({ block: "nearest" });
  }, [index, results]);

  const go = (item: Item) => {
    setOpen(false);
    if (item.id === "language") {
      // The same page in the other language, keeping the #hash.
      router.push(`${localizeHref(pathname, lang === "es" ? "en" : "es")}${window.location.hash}`);
    } else if (item.href.startsWith("mailto:")) {
      window.location.href = item.href;
    } else if (item.external) {
      window.open(item.href, "_blank", "noopener,noreferrer");
    } else if (pathname === "/apps" && item.href === "/apps#cv") {
      // The Apps desktop only reads the hash when it loads.
      window.location.hash = "cv";
      window.location.reload();
    } else if (item.href === "/" && pathname !== "/") {
      zoomOutThen(pathname, () => router.push(href("/")));
    } else {
      router.push(href(item.href));
    }
  };

  const kindLabel: Record<Kind, string> = {
    page: tr("Página", "Page"),
    project: tr("Proyecto", "Project"),
    document: tr("Documento", "Document"),
    contact: tr("Contacto", "Contact"),
    language: tr("Idioma", "Language"),
  };

  const onInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (e.key === "Enter" && results[index]) {
      e.preventDefault();
      go(results[index]);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="spotlight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[90] flex items-start justify-center bg-black/20 px-3 pt-[14vh] backdrop-blur-[2px]"
          onClick={hide}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={tr("Buscar", "Search")}
            initial={reduce ? false : { opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 0.84, 0.44, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[620px] overflow-hidden rounded-[20px] bg-[#f6f4f0]/80 text-[#1d1d1f] shadow-[0_0_0_0.5px_rgba(0,0,0,0.2),0_40px_90px_-20px_rgba(20,25,25,0.55)] backdrop-blur-[40px] backdrop-saturate-[1.6]"
          >
            <div className="flex items-center gap-3 px-5 py-4">
              <SearchGlyph className="h-6 w-6 shrink-0 text-black/60" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setIndex(0);
                }}
                onKeyDown={onInputKey}
                type="text"
                role="combobox"
                aria-expanded="true"
                aria-controls={listId}
                aria-activedescendant={results[index] ? `${uid}-${results[index].id}` : undefined}
                aria-label={tr("Buscar o ir a", "Search or go to")}
                placeholder={tr("Buscar o ir a…", "Search or go to…")}
                autoComplete="off"
                spellCheck={false}
                className="min-w-0 flex-1 bg-transparent text-[20px] outline-none placeholder:text-black/60"
              />
              <kbd className="hidden shrink-0 rounded-md bg-black/[0.07] px-1.5 py-0.5 font-sans text-[11px] text-black/60 sm:block">
                esc
              </kbd>
            </div>

            {results.length > 0 ? (
              <ul
                ref={listRef}
                id={listId}
                role="listbox"
                aria-label={tr("Resultados", "Results")}
                className="max-h-[min(52vh,380px)] overflow-y-auto border-t border-black/[0.09] p-2"
              >
                {results.map((item, i) => (
                  <li
                    key={item.id}
                    id={`${uid}-${item.id}`}
                    role="option"
                    aria-selected={i === index}
                    onMouseMove={() => i !== index && setIndex(i)}
                    onClick={() => go(item)}
                    data-cursor-hover
                    className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-3 py-2 ${
                      i === index ? "bg-[#0a64d8] text-white" : ""
                    }`}
                  >
                    <span
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
                        i === index ? "bg-white/20" : "bg-black/[0.06]"
                      }`}
                    >
                      <item.Glyph className="h-[18px] w-[18px]" />
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[15px] font-medium">{item.title}</span>
                    <span className={`shrink-0 text-[12.5px] ${i === index ? "text-white/80" : "text-black/60"}`}>
                      {kindLabel[item.kind]}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="border-t border-black/[0.09] px-5 py-6 text-[14px] text-black/60">
                {tr(`Sin resultados para «${query}».`, `No results for “${query}”.`)}
              </p>
            )}

            <p className="sr-only" aria-live="polite">
              {tr(`${results.length} resultados`, `${results.length} results`)}
            </p>
            <div className="hidden items-center justify-end gap-4 border-t border-black/[0.09] px-5 py-2 text-[12px] text-black/60 sm:flex">
              <span>{tr("↑↓ moverte", "↑↓ navigate")}</span>
              <span>{tr("↵ abrir", "↵ open")}</span>
              <span>{tr("esc cerrar", "esc close")}</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
