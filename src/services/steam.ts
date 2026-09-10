import type { Deal, GameRelease } from "../types";
import { fetchJson, isRecord } from "./http";
import { mapSteamGameToDeal, mapSteamRelease } from "./mappers";
import type { SteamGameResponse } from "./mappers";
export interface SteamFeaturedResponse {
  specials?: { items: SteamGameResponse[] };
  top_sellers?: { items: SteamGameResponse[] };
  new_releases?: { items: SteamGameResponse[] };
  coming_soon?: { items: SteamGameResponse[] };
}
export type SteamCatalog = { deals: Deal[]; releases: GameRelease[] };
const items = (value: unknown): unknown[] =>
  isRecord(value) && Array.isArray(value.items) ? value.items : [];
export async function getSteamCatalog(signal?: AbortSignal): Promise<SteamCatalog> {
  const endpoint =
    import.meta.env.VITE_STEAM_PROXY_URL ||
    (import.meta.env.DEV
      ? "/api/steam"
      : "https://store.steampowered.com/api/featuredcategories?cc=br&l=brazilian");
  const raw = await fetchJson(endpoint, signal);
  if (!isRecord(raw) || !isRecord(raw.specials)) throw new Error("Resposta da Steam indisponível.");
  const deals = [...items(raw.specials), ...items(raw.top_sellers), ...items(raw.new_releases)]
    .map(mapSteamGameToDeal)
    .filter((item): item is Deal => item !== null);
  return {
    deals: [...new Map(deals.map((deal) => [deal.id, deal])).values()],
    releases: items(raw.coming_soon)
      .map(mapSteamRelease)
      .filter((item): item is GameRelease => item !== null),
  };
}
