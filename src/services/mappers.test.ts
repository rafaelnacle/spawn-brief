import assert from "node:assert/strict";
import { test } from "node:test";
import { mapCheapSharkDeal, mapSteamGameToDeal, mapSteamRelease } from "./mappers.ts";
import { filterDeals, type DealFilters } from "../features/deals/filterDeals.ts";
import { steamProxyPath, steamRegion } from "./region.ts";

const steam = {
  id: 1091500,
  name: "Cyberpunk 2077",
  original_price: 19990,
  final_price: 7996,
  currency: "BRL",
  large_capsule_image: "https://example.com/image.jpg",
};
const cheap = {
  dealID: "abc%2Bdef%3D",
  title: "Cyberpunk 2077",
  storeID: "1",
  normalPrice: "59.99",
  salePrice: "23.99",
  steamAppID: "1091500",
  thumb: "https://example.com/image.jpg",
};
const stores = [{ id: "1", name: "Steam" }];
test("Steam cents become BRL amounts and correct discount", () => {
  const deal = mapSteamGameToDeal(steam);
  assert.equal(deal?.normalPrice, 199.9);
  assert.equal(deal?.salePrice, 79.96);
  assert.equal(deal?.discount, 60);
  assert.equal(deal?.currency, "BRL");
});
test("Steam US keeps the real USD price, a regional URL and a distinct identity", () => {
  const us = mapSteamGameToDeal(
    { ...steam, currency: "USD", original_price: 5999, final_price: 2399 },
    "USD",
  );
  assert.equal(us?.salePrice, 23.99);
  assert.equal(us?.currency, "USD");
  assert.equal(new URL(us!.dealUrl).searchParams.get("cc"), "us");
  assert.notEqual(us?.id, mapSteamGameToDeal(steam)?.id);
  assert.equal(mapSteamGameToDeal(steam, "USD"), null);
});
test("regional proxy permits only Brazil or US and never forwards arbitrary destinations", () => {
  assert.equal(steamRegion("pt-BR").currency, "BRL");
  assert.equal(steamRegion("en-US").currency, "USD");
  assert.equal(
    steamProxyPath("/api/steam?cc=us&l=brazilian"),
    "/api/featuredcategories?cc=us&l=english",
  );
  assert.equal(steamProxyPath("/api/steam?cc=br"), "/api/featuredcategories?cc=br&l=brazilian");
  assert.equal(
    steamProxyPath("/api/steam?cc=xx&url=https://example.com"),
    "/api/featuredcategories?cc=br&l=brazilian",
  );
});
test("CheapShark keeps USD and correctly encodes its redirect ID once", () => {
  const deal = mapCheapSharkDeal(cheap, stores);
  assert.equal(deal?.currency, "USD");
  assert.equal(deal?.store, "Steam");
  assert.equal(deal?.steamAppId, 1091500);
  assert.equal(new URL(deal!.dealUrl).searchParams.get("id"), "abc+def=");
});
test("normally free games and non-discounted games never become offers", () => {
  assert.equal(mapSteamGameToDeal({ ...steam, original_price: 0, final_price: 0 }), null);
  assert.equal(
    mapCheapSharkDeal({ ...cheap, normalPrice: "0.00", salePrice: "0.00" }, stores),
    null,
  );
  assert.equal(mapSteamGameToDeal({ ...steam, final_price: 19990 }), null);
  assert.equal(mapCheapSharkDeal({ ...cheap, salePrice: "59.99" }, stores), null);
  assert.equal(mapCheapSharkDeal({ ...cheap, salePrice: "0.00" }, stores)?.discount, 100);
});
test("invalid prices, unsupported currency and unsafe images are rejected", () => {
  for (const value of [
    null,
    {},
    "invalid",
    { ...steam, final_price: NaN },
    { ...steam, currency: "USD" },
  ])
    assert.equal(mapSteamGameToDeal(value), null);
  for (const salePrice of ["-1", "Infinity", "", "bad"])
    assert.equal(mapCheapSharkDeal({ ...cheap, salePrice }, stores), null);
  assert.equal(
    mapSteamGameToDeal({ ...steam, large_capsule_image: "javascript:alert(1)" })?.image,
    undefined,
  );
  assert.equal(mapCheapSharkDeal({ ...cheap, dealID: "%invalid" }, stores), null);
});
test("filters combine store, currency, price, discount and title", () => {
  const brl = mapSteamGameToDeal(steam)!;
  const usd = mapCheapSharkDeal(cheap, stores)!;
  const filters: DealFilters = {
    search: "CYBER",
    store: "Steam",
    currency: "BRL",
    discount: 50,
    maxPrice: 100,
    sort: "price",
  };
  assert.deepEqual(filterDeals([brl, usd], filters), [brl]);
  assert.deepEqual(filterDeals([brl, usd], { ...filters, maxPrice: 50 }), []);
  assert.deepEqual(filterDeals([brl, usd], { ...filters, currency: "USD" }), [usd]);
  assert.equal(filterDeals([usd, brl], { ...filters, currency: "All" })[0].currency, "BRL");
});
test("unknown release dates stay unknown, without invented dates", () => {
  const release = mapSteamRelease({ id: 123, name: "Upcoming game" });
  assert.equal(release?.releaseDate, undefined);
  assert.equal(release?.releaseLabel, "Em breve");
  assert.equal(
    mapSteamRelease({ id: 123, name: "Upcoming", release_date: Infinity })?.releaseDate,
    undefined,
  );
  assert.equal(mapSteamRelease(null), null);
});
