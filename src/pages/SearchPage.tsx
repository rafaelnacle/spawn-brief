import { useLocale } from "../i18n/LocaleContext";
import { useSearchParams } from "react-router-dom";
import { useDeals } from "../hooks/useDeals";
import { useGames, useNews } from "../hooks/useContent";
import { DealGrid, DealsStatus } from "../components/Deals";
import { GameGrid } from "../components/Games";
import { NewsGrid } from "../components/News";
import {
  EmptyState,
  ErrorState,
  LoadingSkeleton,
  SearchInput,
  SectionHeader,
} from "../components/common";
import { normalizeText } from "../utils/format";
export default function SearchPage() {
  const { t } = useLocale();
  const [params, setParams] = useSearchParams();
  const term = params.get("q") ?? "";
  const match = (title: string) => normalizeText(title).includes(normalizeText(term.trim()));
  const games = useGames(),
    news = useNews(),
    deals = useDeals();
  const gameResults = (games.data ?? []).filter((game) => match(game.title));
  const newsResults = (news.data ?? []).filter((article) => match(article.title));
  const dealResults = deals.data.filter((deal) => match(deal.title));
  return (
    <div className="container inner-page">
      <div className="page-intro">
        <span className="eyebrow">{t("SIGA SUA CURIOSIDADE")}</span>
        <h1>
          {t("Encontre seu próximo play")}
          <span>.</span>
        </h1>
      </div>
      <SearchInput
        value={term}
        onChange={(value) => setParams(value ? { q: value } : {}, { replace: true })}
        placeholder={t("Busque por jogos, notícias e ofertas…")}
      />
      {!term.trim() ? (
        <div className="section">
          <EmptyState
            title={t("O que está no seu radar?")}
            description={t(
              "Digite o nome de um jogo ou um assunto para pesquisar no conteúdo carregado.",
            )}
          />
        </div>
      ) : (
        <>
          <section className="section">
            <SectionHeader title={`${t("Games")} (${gameResults.length})`} />
            {games.isPending ? (
              <LoadingSkeleton />
            ) : games.isError ? (
              <ErrorState retry={() => void games.refetch()} />
            ) : gameResults.length ? (
              <GameGrid games={gameResults} />
            ) : (
              <EmptyState title={t("Nenhum jogo encontrado")} />
            )}
          </section>
          <section className="section">
            <SectionHeader title={`${t("News")} (${newsResults.length})`} />
            {news.isPending ? (
              <LoadingSkeleton />
            ) : news.isError ? (
              <ErrorState retry={() => void news.refetch()} />
            ) : newsResults.length ? (
              <NewsGrid articles={newsResults} />
            ) : (
              <EmptyState title={t("Nenhuma notícia encontrada")} />
            )}
          </section>
          <section className="section">
            <SectionHeader title={`${t("Deals")} (${dealResults.length})`} />
            {deals.isPending ? (
              <LoadingSkeleton />
            ) : deals.isError ? (
              <ErrorState retry={() => void deals.refetch()} />
            ) : dealResults.length ? (
              <DealGrid deals={dealResults} />
            ) : (
              <EmptyState title={t("Nenhuma oferta encontrada")} />
            )}
            <DealsStatus query={deals} />
          </section>
        </>
      )}
    </div>
  );
}
