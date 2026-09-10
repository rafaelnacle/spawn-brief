import type { Deal, GameRelease } from "../types";
import { fetchJson, isRecord } from "./http";
import { mapSteamGameToDeal, mapSteamRelease } from "./mappers";
import type { SteamGameResponse } from "./mappers";
import { steamParameters, steamRegion } from "./region";
import type { Locale } from "../i18n/locale";
export interface SteamFeaturedResponse {
  specials?: { items: SteamGameResponse[] };
  top_sellers?: { items: SteamGameResponse[] };
  new_releases?: { items: SteamGameResponse[] };
  coming_soon?: { items: SteamGameResponse[] };
}
export type SteamCatalog = { deals: Deal[]; releases: GameRelease[] };
const items = (value: unknown): unknown[] =>
  isRecord(value) && Array.isArray(value.items) ? value.items : [];
export async function getSteamCatalog(locale: Locale, signal?: AbortSignal): Promise<SteamCatalog> {
  const region = steamRegion(locale);
  const base =
    import.meta.env.VITE_STEAM_PROXY_URL ||
    (import.meta.env.DEV ? "/api/steam" : "https://store.steampowered.com/api/featuredcategories");
  const endpoint = new URL(base, window.location.origin);
  for (const [key, value] of new URLSearchParams(steamParameters(region)))
    endpoint.searchParams.set(key, value);
  const raw = await fetchJson(endpoint.href, signal);
  if (!isRecord(raw) || !isRecord(raw.specials)) throw new Error("Resposta da Steam indisponível.");
  const deals = [...items(raw.specials), ...items(raw.top_sellers), ...items(raw.new_releases)]
    .map((value) => mapSteamGameToDeal(value, region.currency))
    .filter((item): item is Deal => item !== null);
  return {
    deals: [...new Map(deals.map((deal) => [deal.id, deal])).values()],
    releases: items(raw.coming_soon)
      .map(mapSteamRelease)
      .filter((item): item is GameRelease => item !== null),
  };
}
