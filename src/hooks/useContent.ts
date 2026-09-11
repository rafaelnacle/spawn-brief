import { useQuery } from "@tanstack/react-query";
import { newsService } from "../services/news";
import { gamesService } from "../services/games";
import { useLocale } from "../i18n/LocaleContext";
import { gameDescriptionsEnglish, newsEnglish } from "../i18n/content.en";
import { useContentPreferences } from "../features/content/ContentPreferences";
import { filterContent } from "../features/content/contentPolicy";
export function useNews() {
  const { locale } = useLocale();
  const { showExplicit } = useContentPreferences();
  return useQuery({
    queryKey: ["news"],
    queryFn: ({ signal }) => newsService.getArticles(signal),
    staleTime: 5 * 60_000,
    select: (articles) =>
      locale === "pt-BR"
        ? filterContent(articles, showExplicit)
        : filterContent(articles, showExplicit).map((article) =>
            article.isDemo ? { ...article, ...newsEnglish[article.id] } : article,
          ),
  });
}
export function useGames() {
  const { locale, t } = useLocale();
  const { showExplicit } = useContentPreferences();
  return useQuery({
    queryKey: ["games"],
    queryFn: ({ signal }) => gamesService.getGames(signal),
    staleTime: 60 * 60_000,
    select: (games) =>
      locale === "pt-BR"
        ? filterContent(games, showExplicit)
        : filterContent(games, showExplicit).map((game) => ({
            ...game,
            description: gameDescriptionsEnglish[game.slug] ?? game.description,
            genres: game.genres.map((genre) => t(genre)),
          })),
  });
}
