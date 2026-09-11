import assert from "node:assert/strict";
import { readFile, readdir, stat, writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");
const html = await readFile(resolve(dist, "index.html"), "utf8");
const references = [...html.matchAll(/(?:src|href)="(\.\/[^"?#]+)"/g)].map((match) => match[1]);
assert.ok(
  references.some((path) => path.endsWith(".js")),
  "Pages must use relative bundle URLs",
);
for (const path of references)
  assert.ok((await stat(resolve(dist, path))).isFile(), `Missing asset ${path}`);
assert.ok(
  !/(?:src|href)="\/(?:assets|images|favicon)/.test(html),
  "Root-relative assets break repository Pages",
);
for (const name of ["steam-br", "steam-us", "cheapshark"]) {
  const data = JSON.parse(await readFile(resolve(dist, `data/${name}.json`), "utf8"));
  assert.equal(data.schemaVersion, 1, `${name}: unexpected schema`);
  const age = Date.now() - Date.parse(data.updatedAt);
  assert.ok(
    age >= -300_000 && age < 24 * 60 * 60_000,
    `${name}: refresh public data before publishing`,
  );
  const entries = name === "cheapshark" ? data.deals : data.specials.items;
  assert.ok(Array.isArray(entries) && entries.length > 0, `${name}: empty catalog`);
  assert.ok(
    entries.every((item) => Object.hasOwn(item, "content_descriptors")),
    `${name}: missing classification metadata`,
  );
}
async function checkDirectory(path) {
  for (const entry of await readdir(path, { withFileTypes: true })) {
    assert.ok(!entry.isSymbolicLink(), "Do not publish symlinks");
    assert.ok(
      !/^\.env(?:\.|$)|\.map$|\.pem$|\.key$/.test(entry.name),
      "Unexpected private or debug artifact",
    );
    if (entry.isDirectory()) await checkDirectory(resolve(path, entry.name));
  }
}
await checkDirectory(dist);
await writeFile(resolve(dist, ".nojekyll"), "");
console.log(
  "Pages package verified: relative assets, fresh regional data, classification metadata, no private/debug artifacts.",
);
