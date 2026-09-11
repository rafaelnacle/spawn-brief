import { mkdir, readFile, writeFile, rename } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout as delay } from "node:timers/promises";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = resolve(root, "public/data");
const cacheFile = resolve(root, ".cache/content-descriptors.json");
const maxCacheAge = 7 * 24 * 60 * 60_000;
const categories = ["specials", "top_sellers", "new_releases", "coming_soon"];
const userAgent = "SpawnBrief/0.1 (public gaming news and deals catalog)";
const record = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const descriptorsValid = (ids) =>
  Array.isArray(ids) && ids.every((id) => Number.isInteger(id) && id > 0);

async function requestJson(url) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(url, {
        headers: { "User-Agent": userAgent },
        signal: AbortSignal.timeout(20_000),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      if (attempt === 2)
        throw new Error(`Public source ${new URL(url).hostname} unavailable`, { cause: error });
      await delay(1500 * (attempt + 1));
    }
  }
}
function validateSteam(value) {
  if (
    !record(value) ||
    categories.some((key) => !record(value[key]) || !Array.isArray(value[key].items))
  )
    throw new Error("Invalid Steam catalog");
  return value;
}
function select(value, keys) {
  return Object.fromEntries(
    keys.filter((key) => value[key] !== undefined).map((key) => [key, value[key]]),
  );
}
async function writeJson(path, value) {
  await mkdir(dirname(path), { recursive: true });
  const temporary = `${path}.tmp`;
  await writeFile(temporary, `${JSON.stringify(value)}\n`);
  await rename(temporary, path);
}

console.log("Fetching regional Steam catalogs and CheapShark offers…");
const [brazil, usa, cheapDeals, stores] = await Promise.all([
  requestJson("https://store.steampowered.com/api/featuredcategories?cc=br&l=brazilian").then(
    validateSteam,
  ),
  requestJson("https://store.steampowered.com/api/featuredcategories?cc=us&l=english").then(
    validateSteam,
  ),
  requestJson("https://www.cheapshark.com/api/1.0/deals?pageSize=60&onSale=1&sortBy=Deal%20Rating"),
  requestJson("https://www.cheapshark.com/api/1.0/stores"),
]);
if (!Array.isArray(cheapDeals) || !Array.isArray(stores))
  throw new Error("Invalid CheapShark catalog");
const updatedAt = new Date().toISOString();
const appIds = [
  ...new Set([
    ...[brazil, usa].flatMap((catalog) =>
      categories.flatMap((key) => catalog[key].items.map((item) => item.id)),
    ),
    ...cheapDeals.map((deal) => Number(deal.steamAppID)),
  ]),
]
  .filter((id) => Number.isSafeInteger(id) && id > 0)
  .slice(0, 180);
let cache = {};
try {
  const saved = JSON.parse(await readFile(cacheFile, "utf8"));
  if (record(saved)) cache = saved;
} catch {
  /* First sync. */
}
const ratings = {};
let index = 0;
console.log(`Checking content descriptors for ${appIds.length} unique Steam apps…`);
async function worker() {
  while (index < appIds.length) {
    const id = appIds[index++];
    const saved = cache[id];
    if (
      record(saved) &&
      descriptorsValid(saved.ids) &&
      Date.now() - Date.parse(saved.checkedAt) >= 0 &&
      Date.now() - Date.parse(saved.checkedAt) < maxCacheAge
    ) {
      ratings[id] = saved.ids;
      continue;
    }
    try {
      const response = await requestJson(
        `https://store.steampowered.com/api/appdetails?appids=${id}&cc=us&l=english&filters=content_descriptors`,
      );
      const app = record(response) ? response[id] : null;
      const ids = app?.success === true ? app.data?.content_descriptors?.ids : null;
      if (descriptorsValid(ids)) {
        ratings[id] = ids;
        cache[id] = { ids, checkedAt: new Date().toISOString() };
      }
    } catch {
      /* Unknown stays unknown; age ratings and title keywords are never substituted. */
    }
    await delay(400);
  }
}
await Promise.all([worker(), worker()]);
const withRating = (item, id) => ({ ...item, content_descriptors: { ids: ratings[id] ?? null } });
const steamKeys = [
  "id",
  "name",
  "currency",
  "original_price",
  "final_price",
  "discount_percent",
  "large_capsule_image",
  "header_image",
  "release_date",
  "discount_expiration",
];
function steamSnapshot(catalog) {
  return {
    schemaVersion: 1,
    updatedAt,
    ...Object.fromEntries(
      categories.map((key) => [
        key,
        {
          items: catalog[key].items
            .filter(record)
            .map((item) => withRating(select(item, steamKeys), item.id)),
        },
      ]),
    ),
  };
}
const cheapKeys = [
  "dealID",
  "title",
  "storeID",
  "normalPrice",
  "salePrice",
  "savings",
  "thumb",
  "steamAppID",
];
const cheapSnapshot = {
  schemaVersion: 1,
  updatedAt,
  stores: stores.filter(record).map((store) => select(store, ["storeID", "storeName"])),
  deals: cheapDeals
    .filter(record)
    .map((deal) => withRating(select(deal, cheapKeys), Number(deal.steamAppID))),
};
// Do not deploy an entirely unclassified catalog during an upstream metadata failure.
if (appIds.length && Object.keys(ratings).length === 0)
  throw new Error("Content metadata unavailable; keeping the previously deployed catalog");
await writeJson(cacheFile, cache);
await writeJson(resolve(output, "steam-br.json"), steamSnapshot(brazil));
await writeJson(resolve(output, "steam-us.json"), steamSnapshot(usa));
await writeJson(resolve(output, "cheapshark.json"), cheapSnapshot);
console.log(
  `Catalog updated at ${updatedAt}: ${Object.keys(ratings).length}/${appIds.length} apps classified. Unknown entries are marked explicitly.`,
);
