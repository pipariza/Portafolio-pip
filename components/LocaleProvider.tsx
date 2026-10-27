"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { pick, type Locale } from "@/lib/i18n/config";
import { localizeHref } from "@/lib/i18n/routes";

type LocaleValue = {
  lang: Locale;
  /** The text of the current language: tr("Texto", "Text"). */
  tr: (es: string, en: string) => string;
  /** The address of an internal path in the current language: href("/work") → "/en/work" in English. */
  href: (path: string) => string;
};

const LocaleContext = createContext<LocaleValue | null>(null);

export function LocaleProvider({ lang, children }: { lang: Locale; children: ReactNode }) {
  const value = useMemo<LocaleValue>(
    () => ({
      lang,
      tr: (es, en) => pick(lang, es, en),
      href: (path) => localizeHref(path, lang),
    }),
    [lang],
  );
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
