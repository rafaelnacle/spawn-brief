import { useLocale } from "../i18n/LocaleContext";
import { useState } from "react";
import { useGames } from "../hooks/useContent";
import { GameGrid } from "../components/Games";
import {
  CategoryTabs,
  DemoNotice,
  EmptyState,
  ErrorState,
  LoadingSkeleton,
  SearchInput,
} from "../components/common";
import { normalizeText } from "../utils/format";
export default function GamesPage() {
  const { t } = useLocale();
  const query = useGames();
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState("All");
  const games = (query.data ?? []).filter(
    (game) =>
      normalizeText(game.title).includes(normalizeText(search)) &&
      (platform === "All" || game.platforms.some((item) => item === platform)),
  );
  return (
    <div className="container inner-page">
      <div className="page-intro">
        <span className="eyebrow">{t("O PRÓXIMO MUNDO ESTÁ AQUI")}</span>
        <h1>
          {t("Discover games")}
          <span>.</span>
        </h1>
        <p>{t("Grandes aventuras, pequenas descobertas e muitas horas pela frente.")}</p>
      </div>
      <div className="page-toolbar">
        <SearchInput value={search} onChange={setSearch} placeholder={t("Encontrar um jogo…")} />
        <span className="result-count" aria-live="polite">
          {t("{count} jogos para descobrir", { count: games.length })}
        </span>
      </div>
      <CategoryTabs
        items={["All", "PC", "PlayStation", "Xbox", "Nintendo"]}
        value={platform}
        onChange={setPlatform}
      />
      {query.isPending ? (
        <LoadingSkeleton />
      ) : query.isError ? (
        <ErrorState retry={() => void query.refetch()} />
      ) : games.length ? (
        <GameGrid games={games} />
      ) : (
        <EmptyState />
      )}
      <DemoNotice>
        {t(
          "Catálogo demonstrativo: plataformas, datas e avaliações de exemplo. Confira os detalhes atuais na loja oficial.",
        )}
      </DemoNotice>
    </div>
  );
}
