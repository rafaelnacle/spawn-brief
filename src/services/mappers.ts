import type { Currency, Deal, GameRelease, Store } from "../types/index.ts";
import { isRecord, safeImage } from "./http.ts";

export type SteamGameResponse = {
  id: number;
  name: string;
  large_capsule_image?: string;
  header_image?: string;
  currency: string;
  original_price: number;
  final_price: number;
  discount_percent: number;
};
export type CheapSharkDealResponse = {
  dealID: string;
  title: string;
  storeID: string;
  normalPrice: string;
  salePrice: string;
  savings: string;
  thumb: string;
  steamAppID: string | null;
};
export function mapSteamGameToDeal(value: unknown, currency: Currency = "BRL"): Deal | null {
  if (
    !isRecord(value) ||
    !Number.isInteger(value.id) ||
    typeof value.id !== "number" ||
    value.id <= 0 ||
    typeof value.name !== "string" ||
    value.currency !== currency
  )
    return null;
  const normal = value.original_price,
    sale = value.final_price;
  if (
    typeof normal !== "number" ||
    typeof sale !== "number" ||
    !Number.isFinite(normal) ||
    !Number.isFinite(sale) ||
    normal <= 0 ||
    sale < 0 ||
    sale >= normal
  )
    return null;
  return {
    id: `steam-${currency}-${value.id}`,
    title: value.name,
    image: safeImage(value.large_capsule_image) ?? safeImage(value.header_image),
    store: "Steam",
    normalPrice: normal / 100,
    salePrice: sale / 100,
    discount: Math.round((1 - sale / normal) * 100),
    currency,
    dealUrl: `https://store.steampowered.com/app/${value.id}/?cc=${currency === "BRL" ? "br" : "us"}`,
    steamAppId: value.id,
    provider: "Steam",
  };
}
export function mapCheapSharkDeal(value: unknown, stores: Store[]): Deal | null {
  if (
    !isRecord(value) ||
    typeof value.dealID !== "string" ||
    typeof value.title !== "string" ||
    typeof value.storeID !== "string" ||
    typeof value.normalPrice !== "string" ||
    typeof value.salePrice !== "string"
  )
    return null;
  if (!/^\d+(\.\d+)?$/.test(value.normalPrice) || !/^\d+(\.\d+)?$/.test(value.salePrice))
    return null;
  const normal = Number(value.normalPrice),
    sale = Number(value.salePrice);
  if (
    !Number.isFinite(normal) ||
    !Number.isFinite(sale) ||
    normal <= 0 ||
    sale < 0 ||
    sale >= normal
  )
    return null;
  // CheapShark deal IDs are already URI encoded. Decode once before URLSearchParams encodes them.
  let id: string;
  try {
    id = decodeURIComponent(value.dealID);
  } catch {
    return null;
  }
  const params = new URLSearchParams({ id });
  const steamId =
    typeof value.steamAppID === "string" && /^\d+$/.test(value.steamAppID)
      ? Number(value.steamAppID)
      : undefined;
  return {
    id: `cheapshark-${value.dealID}`,
    title: value.title,
    image: safeImage(value.thumb),
    store: stores.find((store) => store.id === value.storeID)?.name ?? `Loja ${value.storeID}`,
    normalPrice: normal,
    salePrice: sale,
    discount: Math.round((1 - sale / normal) * 100),
    currency: "USD",
    dealUrl: `https://www.cheapshark.com/redirect?${params}`,
    steamAppId: steamId,
    provider: "CheapShark",
  };
}
export function mapSteamRelease(value: unknown): GameRelease | null {
  if (
    !isRecord(value) ||
    typeof value.id !== "number" ||
    !Number.isInteger(value.id) ||
    value.id <= 0 ||
    typeof value.name !== "string"
  )
    return null;
  const date =
    typeof value.release_date === "number" && value.release_date > 0
      ? new Date(value.release_date * 1000)
      : null;
  const releaseDate = date && Number.isFinite(date.getTime()) ? date.toISOString() : undefined;
  return {
    id: `steam-release-${value.id}`,
    title: value.name,
    image: safeImage(value.large_capsule_image) ?? safeImage(value.header_image),
    releaseDate,
    releaseLabel: releaseDate ? "" : "Em breve",
    platforms: ["PC"],
    url: `https://store.steampowered.com/app/${value.id}/`,
    isDemo: false,
  };
}
