import type { Deal, GameRelease } from "../types";
import { isRecord } from "./http";
import { mapSteamGameToDeal, mapSteamRelease } from "./mappers";
import type { SteamGameResponse } from "./mappers";
import { steamRegion } from "./region";
import { readSnapshot } from "./snapshots";
import type { Locale } from "../i18n/locale";
export interface SteamFeaturedResponse {
  specials?: { items: SteamGameResponse[] };
  top_sellers?: { items: SteamGameResponse[] };
  new_releases?: { items: SteamGameResponse[] };
  coming_soon?: { items: SteamGameResponse[] };
}
export type SteamCatalog = { deals: Deal[]; releases: GameRelease[]; updatedAt: string };
const items = (value: unknown): unknown[] =>
  isRecord(value) && Array.isArray(value.items) ? value.items : [];
export async function getSteamCatalog(locale: Locale, signal?: AbortSignal): Promise<SteamCatalog> {
  const region = steamRegion(locale);
  const raw = await readSnapshot(region.country === "br" ? "steam-br" : "steam-us", signal);
  if (!isRecord(raw) || !isRecord(raw.specials)) throw new Error("Resposta da Steam indisponível.");
  const deals = [...items(raw.specials), ...items(raw.top_sellers), ...items(raw.new_releases)]
    .map((value) => mapSteamGameToDeal(value, region.currency))
    .filter((item): item is Deal => item !== null)
    .map((deal) => ({ ...deal, checkedAt: raw.updatedAt as string }));
  return {
    updatedAt: raw.updatedAt as string,
    deals: [...new Map(deals.map((deal) => [deal.id, deal])).values()],
    releases: items(raw.coming_soon)
      .map(mapSteamRelease)
      .filter((item): item is GameRelease => item !== null),
  };
}
