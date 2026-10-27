/*
 * The site is in Spanish (the first language, at the root: /work) and in English (/en/work).
 *
 * How texts work: next to every Spanish text sits its English twin, as two arguments of
 * `tr(es, en)` (or inside `{ es, en }` in the data files). Both are required by the types,
 * so a text can never be added in one language only; to change a text, change both
 * places in the same spot.
 */
export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "es";

export const isLocale = (value: string): value is Locale => (locales as readonly string[]).includes(value);

/** Picks the text of a language: used in server code; components use `useLocale().tr`. */
export const pick = (lang: Locale, es: string, en: string) => (lang === "en" ? en : es);

/** A text in both languages (data files). */
export type Bi = { es: string; en: string };
export const bi = (lang: Locale, text: Bi) => text[lang];
