import { useQuery } from "@tanstack/react-query";
import { newsService } from "../services/news";
import { gamesService } from "../services/games";
export const useNews = () =>
  useQuery({
    queryKey: ["news"],
    queryFn: ({ signal }) => newsService.getArticles(signal),
    staleTime: 5 * 60_000,
  });
export const useGames = () =>
  useQuery({
    queryKey: ["games"],
    queryFn: ({ signal }) => gamesService.getGames(signal),
    staleTime: 60 * 60_000,
  });
