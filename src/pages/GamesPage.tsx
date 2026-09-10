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
        <span className="eyebrow">O PRÓXIMO MUNDO ESTÁ AQUI</span>
        <h1>
          Discover games<span>.</span>
        </h1>
        <p>Grandes aventuras, pequenas descobertas e muitas horas pela frente.</p>
      </div>
      <div className="page-toolbar">
        <SearchInput value={search} onChange={setSearch} placeholder="Encontrar um jogo…" />
        <span className="result-count" aria-live="polite">
          {games.length} jogos para descobrir
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
        Catálogo demonstrativo: plataformas, datas e avaliações de exemplo. Confira os detalhes
        atuais na loja oficial.
      </DemoNotice>
    </div>
  );
}
