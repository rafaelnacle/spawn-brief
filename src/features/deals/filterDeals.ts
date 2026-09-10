import type { Currency, Deal } from "../../types/index.ts";
export type DealFilters = {
  search: string;
  store: string;
  discount: number;
  maxPrice: number;
  currency: Currency | "All";
  sort: string;
};
export function filterDeals(deals: Deal[], filters: DealFilters): Deal[] {
  const filtered = deals.filter(
    (deal) =>
      deal.title.toLocaleLowerCase().includes(filters.search.toLocaleLowerCase()) &&
      (filters.store === "All" || deal.store === filters.store) &&
      deal.discount >= filters.discount &&
      (filters.currency === "All" || deal.currency === filters.currency) &&
      deal.salePrice <= filters.maxPrice,
  );
  return filtered.sort((a, b) => {
    if (filters.sort === "title") return a.title.localeCompare(b.title);
    // Never compare numeric prices between different currencies.
    if (filters.sort === "price")
      return a.currency.localeCompare(b.currency) || a.salePrice - b.salePrice;
    return b.discount - a.discount || a.title.localeCompare(b.title);
  });
}
