import { news } from "../data/news";
import type { NewsArticle } from "../types";
export interface NewsService {
  getArticles(signal?: AbortSignal): Promise<NewsArticle[]>;
}
// Replace only this adapter with the owned RSS aggregator documented in docs/data-services.md.
export const newsService: NewsService = {
  async getArticles() {
    return news;
  },
};
