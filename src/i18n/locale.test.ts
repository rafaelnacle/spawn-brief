import assert from "node:assert/strict";
import { test } from "node:test";
import { translate } from "./locale.ts";
import { formatPrice, fullDate } from "../utils/format.ts";
import { gameDescriptionsEnglish, newsEnglish } from "./content.en.ts";
import { games } from "../data/games.ts";
import { news } from "../data/news.ts";

test("navigation, defaults and interpolated counts are localized", () => {
  assert.equal(translate("pt-BR", "News"), "Notícias");
  assert.equal(translate("en-US", "News"), "News");
  assert.equal(translate("en-US", "Tentar novamente"), "Try again");
  assert.equal(translate("en-US", "{count} ofertas encontradas", { count: 5 }), "5 deals found");
  assert.equal(
    translate("pt-BR", "{count} ofertas encontradas", { count: 5 }),
    "5 ofertas encontradas",
  );
  assert.equal(translate("en-US", "Custa zero. Vale o resgate…"), "Zero cost. Worth claiming…");
});
test("amounts and dates use the selected locale without relabeling currency", () => {
  assert.match(formatPrice(79.96, "BRL", "pt-BR"), /R\$\s79,96/);
  assert.equal(formatPrice(23.99, "USD", "en-US"), "$23.99");
  assert.match(formatPrice(23.99, "USD", "pt-BR"), /US\$\s23,99/);
  assert.equal(fullDate("2025-04-24", "pt-BR"), "24 abr 2025");
  assert.equal(fullDate("2025-04-24", "en-US"), "Apr 24, 2025");
});
test("all demo content has English copy while game titles remain unchanged", () => {
  for (const article of news) {
    assert.ok(newsEnglish[article.id]?.title);
    assert.ok(newsEnglish[article.id]?.description);
  }
  for (const game of games) {
    assert.ok(gameDescriptionsEnglish[game.slug]);
    assert.equal(translate("en-US", game.title), game.title);
    assert.equal(translate("pt-BR", game.title), game.title);
  }
});
