import type { Currency } from "../types/index.ts";
export type SteamRegion = {
  country: "br" | "us";
  language: "brazilian" | "english";
  currency: Currency;
};
export function steamRegion(locale: "pt-BR" | "en-US"): SteamRegion {
  return locale === "pt-BR"
    ? { country: "br", language: "brazilian", currency: "BRL" }
    : { country: "us", language: "english", currency: "USD" };
}
export function steamParameters(region: SteamRegion): string {
  return new URLSearchParams({ cc: region.country, l: region.language }).toString();
}
// Development proxy accepts only these two regional combinations and a fixed upstream path.
export function steamProxyPath(path: string): string {
  const country = new URL(path, "http://localhost").searchParams.get("cc");
  return `/api/featuredcategories?${steamParameters(steamRegion(country === "us" ? "en-US" : "pt-BR"))}`;
}
