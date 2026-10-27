"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type SectionTheme = "dark" | "light";

type SectionThemeContextValue = {
  theme: SectionTheme;
  setTheme: (theme: SectionTheme) => void;
};

const SectionThemeContext = createContext<SectionThemeContextValue | null>(null);

// Every page of the site is a light desktop now. Each page's ThemeSection confirms its
// theme once it mounts, but the menu bar is rendered before that, so the starting guess has
// to be the right one or the server-rendered bar would flash dark.
export function SectionThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<SectionTheme>("light");
  return (
    <SectionThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </SectionThemeContext.Provider>
  );
}

export function useSectionTheme() {
  const ctx = useContext(SectionThemeContext);
  if (!ctx) {
    throw new Error("useSectionTheme must be used within SectionThemeProvider");
  }
  return ctx;
}

/**
 * Each route is a single page with a single theme (dark or light), so this
 * just marks the nav's theme for the page it's mounted on and renders the
 * section wrapper — no scroll/viewport tracking needed anymore.
 */
export function ThemeSection({
  theme,
  id,
  className,
  children,
}: {
  theme: SectionTheme;
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  const { setTheme } = useSectionTheme();

  useEffect(() => {
    setTheme(theme);
  }, [theme, setTheme]);

  return (
    <section id={id} className={className} data-theme={theme}>
      {children}
    </section>
  );
}
