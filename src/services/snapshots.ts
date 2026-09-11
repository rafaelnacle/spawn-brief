import { publicAsset } from "../utils/assets";
import { fetchJson, isRecord } from "./http";
export async function readSnapshot(
  name: "steam-br" | "steam-us" | "cheapshark",
  signal?: AbortSignal,
) {
  const data = await fetchJson(publicAsset(`data/${name}.json`), signal);
  if (
    !isRecord(data) ||
    data.schemaVersion !== 1 ||
    typeof data.updatedAt !== "string" ||
    !Number.isFinite(Date.parse(data.updatedAt))
  )
    throw new Error("Catálogo público indisponível ou inválido.");
  return data;
}
