import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { translate, type Locale, type TranslationValues } from "./locale";

type LocaleValue = {
  locale: Locale;
  currency: "BRL" | "USD";
  setLocale: (locale: Locale) => void;
  t: (key: string, values?: TranslationValues) => string;
};
const LocaleContext = createContext<LocaleValue | null>(null);
const preferenceKey = "spawnbrief-language";
export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => {
    try {
      return localStorage.getItem(preferenceKey) === "en-US" ? "en-US" : "pt-BR";
    } catch {
      return "pt-BR";
    }
  });
  useEffect(() => {
    document.documentElement.lang = locale;
    try {
      localStorage.setItem(preferenceKey, locale);
    } catch {
      /* Preference remains usable without storage. */
    }
  }, [locale]);
  const value = useMemo<LocaleValue>(
    () => ({
      locale,
      setLocale,
      currency: locale === "pt-BR" ? "BRL" : "USD",
      t: (key, values) => translate(locale, key, values),
    }),
    [locale],
  );
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}
export function useLocale() {
  const value = useContext(LocaleContext);
  if (!value) throw new Error("useLocale requires LocaleProvider");
  return value;
}
