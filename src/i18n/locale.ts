import { english, portuguese } from "./messages.ts";
export type Locale = "pt-BR" | "en-US";
export type TranslationValues = Record<string, string | number>;
export function translate(locale: Locale, key: string, values: TranslationValues = {}): string {
  const message = (locale === "en-US" ? english[key] : portuguese[key]) ?? key;
  return message.replace(/\{(\w+)\}/g, (placeholder, name: string) =>
    String(values[name] ?? placeholder),
  );
}
