export type ContentRating = "non-explicit" | "explicit-sexual" | "unknown";
export type ContentRated = { contentRating?: ContentRating };

// Steam's Adult Only Sexual Content descriptor. General mature content (5),
// violence (2), nudity (1) and frequent nudity (4) are deliberately not blocked.
export function classifyContent(descriptors: unknown): ContentRating {
  if (!Array.isArray(descriptors) || !descriptors.every((id) => Number.isInteger(id) && id > 0))
    return "unknown";
  return descriptors.includes(3) ? "explicit-sexual" : "non-explicit";
}
export function filterContent<T extends ContentRated>(items: T[], showExplicit: boolean): T[] {
  return showExplicit ? items : items.filter((item) => item.contentRating !== "explicit-sexual");
}
