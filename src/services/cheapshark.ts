import type { Deal, Store } from "../types";
import { isRecord } from "./http";
import { mapCheapSharkDeal } from "./mappers";
import { readSnapshot } from "./snapshots";
export async function getCheapSharkDeals(signal?: AbortSignal): Promise<Deal[]> {
  const snapshot = await readSnapshot("cheapshark", signal);
  const deals = snapshot.deals,
    storeData = snapshot.stores;
  if (!Array.isArray(deals) || !Array.isArray(storeData))
    throw new Error("Resposta da CheapShark inválida.");
  const stores: Store[] = storeData.flatMap((value) =>
    isRecord(value) && typeof value.storeID === "string" && typeof value.storeName === "string"
      ? [{ id: value.storeID, name: value.storeName }]
      : [],
  );
  return deals
    .map((value) => mapCheapSharkDeal(value, stores))
    .filter((value): value is Deal => value !== null)
    .map((deal) => ({ ...deal, checkedAt: snapshot.updatedAt as string }));
}
