import assert from "node:assert/strict";
import { test } from "node:test";
import { classifyContent, filterContent } from "./contentPolicy.ts";
import { mapSteamGameToDeal, mapCheapSharkDeal, mapSteamRelease } from "../../services/mappers.ts";

test("18+ age ratings, violence and nudity do not classify GTA as pornography", () => {
  const gta = mapSteamGameToDeal({
    id: 271590,
    name: "Grand Theft Auto V",
    currency: "BRL",
    original_price: 10000,
    final_price: 5000,
    required_age: 18,
    content_descriptors: { ids: [5] },
  })!;
  assert.equal(gta.contentRating, "non-explicit");
  assert.deepEqual(filterContent([gta], false), [gta]);
  for (const ids of [[], [1], [2], [4], [5], [1, 2, 4, 5]])
    assert.equal(classifyContent(ids), "non-explicit");
});
test("only the explicit sexual content descriptor is hidden; opting in restores it", () => {
  const explicit = { title: "Explicit test game", contentRating: classifyContent([1, 3, 4, 5]) };
  const ordinary = { title: "Regular mature game", contentRating: classifyContent([2, 5]) };
  assert.deepEqual(filterContent([ordinary, explicit], false), [ordinary]);
  assert.deepEqual(filterContent([ordinary, explicit], true), [ordinary, explicit]);
});
test("missing or malformed metadata remains unknown and is not mislabeled as pornography", () => {
  for (const ids of [undefined, null, "3", ["3"], [NaN], [0]])
    assert.equal(classifyContent(ids), "unknown");
  const unknown = { contentRating: classifyContent(null) };
  assert.deepEqual(filterContent([unknown], false), [unknown]);
});
test("all external mappers preserve the sexual content classification", () => {
  const content_descriptors = { ids: [3, 5] };
  const steam = mapSteamGameToDeal({
    id: 123,
    name: "Test game",
    currency: "BRL",
    original_price: 1000,
    final_price: 500,
    content_descriptors,
  });
  const cheap = mapCheapSharkDeal(
    {
      dealID: "123",
      title: "Test game",
      storeID: "1",
      normalPrice: "10.00",
      salePrice: "5.00",
      content_descriptors,
    },
    [{ id: "1", name: "Steam" }],
  );
  const release = mapSteamRelease({ id: 123, name: "Test game", content_descriptors });
  for (const item of [steam, cheap, release]) assert.equal(item?.contentRating, "explicit-sexual");
});
test("Steam discounts known to have ended are not advertised by snapshots", () => {
  assert.equal(
    mapSteamGameToDeal({
      id: 123,
      name: "Expired deal",
      currency: "BRL",
      original_price: 1000,
      final_price: 0,
      discount_expiration: 1,
    }),
    null,
  );
});
