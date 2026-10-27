import { defaultLocale, type Locale } from "./config";

/*
 * Internal paths always use the Spanish names ("/contacto", "/work/mar-de-palma"); the
 * address in the browser depends on the language: Spanish has no prefix ("/contacto"),
 * English has "/en" and an English name for the one page whose name is Spanish ("/en/contact").
 * proxy.ts turns the addresses of the browser into the folders of app/[lang].
 */
const EN_NAME: Record<string, string> = { contacto: "contact" };
const ES_NAME: Record<string, string> = { contact: "contacto" };

/** The address of an internal path in a language. External links, mailto and "#hash" pass through. */
export function localizeHref(href: string, lang: Locale): string {
  if (!href.startsWith("/")) return href;
  const match = href.match(/^([^?#]*)(.*)$/);
  const pathPart = match?.[1] ?? "/";
  const rest = match?.[2] ?? "";
  const segments = pathPart.split("/").filter(Boolean);
  if (lang === defaultLocale) return `/${segments.join("/")}${rest}`;
  if (segments[0] && EN_NAME[segments[0]]) segments[0] = EN_NAME[segments[0]];
  return `/en${segments.length ? `/${segments.join("/")}` : ""}${rest}`;
}

/** The language and the internal (Spanish) path of an address of the browser: "/en/contact" → en, "/contacto". */
export function parsePathname(pathname: string): { lang: Locale; path: string } {
  const segments = pathname.split("/").filter(Boolean);
  let lang: Locale = defaultLocale;
  if (segments[0] === "en") {
    lang = "en";
    segments.shift();
    if (segments[0] && ES_NAME[segments[0]]) segments[0] = ES_NAME[segments[0]];
  } else if (segments[0] === "es") {
    segments.shift();
  }
  return { lang, path: `/${segments.join("/")}` };
}

export { EN_NAME, ES_NAME };
