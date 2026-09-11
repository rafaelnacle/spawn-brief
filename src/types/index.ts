import type { ContentRating } from "../features/content/contentPolicy";
export const newsCategories = [
  "All",
  "PC",
  "PlayStation",
  "Xbox",
  "Nintendo",
  "Industry",
  "Indie",
] as const;
export type NewsCategory = Exclude<(typeof newsCategories)[number], "All">;
export type Platform = "PC" | "PlayStation" | "Xbox" | "Nintendo";
export type Currency = "BRL" | "USD";
export type Store = { id: string; name: string };
export type NewsArticle = {
  contentRating?: ContentRating;
  id: string;
  title: string;
  description: string;
  image?: string;
  url: string;
  source: string;
  publishedAt: string;
  category: NewsCategory;
  gameSlug?: string;
  popularity: number;
  isDemo: boolean;
};
export type Deal = {
  contentRating?: ContentRating;
  checkedAt?: string;
  id: string;
  title: string;
  image?: string;
  store: string;
  normalPrice: number;
  salePrice: number;
  discount: number;
  currency: Currency;
  dealUrl: string;
  steamAppId?: number;
  provider: "Steam" | "CheapShark";
};
export type Game = {
  contentRating?: ContentRating;
  id: number;
  slug: string;
  title: string;
  image: string;
  cover: string;
  description: string;
  platforms: Platform[];
  genres: string[];
  rating: number;
  releaseDate: string;
  developer: string;
  publisher: string;
};
export type GameRelease = {
  contentRating?: ContentRating;
  id: string;
  title: string;
  image?: string;
  releaseDate?: string;
  releaseLabel: string;
  platforms: Platform[];
  url: string;
  isDemo: boolean;
};
