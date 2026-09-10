import { useQuery } from "@tanstack/react-query";
import { newsService } from "../services/news";
import { gamesService } from "../services/games";
import { useLocale } from "../i18n/LocaleContext";
import { gameDescriptionsEnglish, newsEnglish } from "../i18n/content.en";
export function useNews() {
  const { locale } = useLocale();
  return useQuery({
    queryKey: ["news"],
    queryFn: ({ signal }) => newsService.getArticles(signal),
    staleTime: 5 * 60_000,
    select: (articles) =>
      locale === "pt-BR"
        ? articles
        : articles.map((article) =>
            article.isDemo ? { ...article, ...newsEnglish[article.id] } : article,
          ),
  });
}
export function useGames() {
  const { locale, t } = useLocale();
  return useQuery({
    queryKey: ["games"],
    queryFn: ({ signal }) => gamesService.getGames(signal),
    staleTime: 60 * 60_000,
    select: (games) =>
      locale === "pt-BR"
        ? games
        : games.map((game) => ({
            ...game,
            description: gameDescriptionsEnglish[game.slug] ?? game.description,
            genres: game.genres.map((genre) => t(genre)),
          })),
  });
}
