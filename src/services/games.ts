import { games } from "../data/games";
import type { Game } from "../types";
export interface GamesService {
  getGames(signal?: AbortSignal): Promise<Game[]>;
}
export const gamesService: GamesService = {
  async getGames() {
    return games;
  },
};
export const futureProviders = {
  rawg: { requiresServerProxy: true },
  isThereAnyDeal: { requiresServerProxy: true },
  rssAggregator: { requiresServerProxy: true },
} as const;
