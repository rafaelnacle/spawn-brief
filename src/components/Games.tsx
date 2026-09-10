import { ArrowUpRight, Monitor, Gamepad2, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import type { Game, GameRelease, Platform } from "../types";
import {
  Artwork,
  DemoNotice,
  EmptyState,
  ErrorState,
  LoadingSkeleton,
  SectionHeader,
} from "./common";
import { useGames } from "../hooks/useContent";
import { useSteam } from "../hooks/useDeals";
import { fullDate } from "../utils/format";
export function Platforms({ platforms }: { platforms: Platform[] }) {
  return (
    <span className="platforms">
      {platforms.includes("PC") && <Monitor size={12} />}
      {platforms.some((p) => p !== "PC") && <Gamepad2 size={13} />}
      <span>{platforms.join(" · ")}</span>
    </span>
  );
}
export function GameCard({ game, rank }: { game: Game; rank?: number }) {
  return (
    <article className="game-card">
      <Link to={`/games/${game.slug}`}>
        <div className="game-cover">
          <Artwork src={game.cover} alt={`Capa de ${game.title}`} />
          <span className="rating">{game.rating}</span>
          {rank && <span className="game-rank">{String(rank).padStart(2, "0")}</span>}
        </div>
        <h3>{game.title}</h3>
        <p>{game.genres.join(" · ")}</p>
        <Platforms platforms={game.platforms} />
      </Link>
    </article>
  );
}
export function GameGrid({ games }: { games: Game[] }) {
  return (
    <div className="game-grid">
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
}
export function PopularGames() {
  const query = useGames();
  return (
    <section className="section">
      <SectionHeader
        eyebrow="NA CONVERSA. NA WISHLIST. NO SEU RADAR."
        title="Todo mundo está jogando"
        to="/games"
        action="Explorar jogos"
      />
      {query.isPending ? (
        <LoadingSkeleton />
      ) : query.isError ? (
        <ErrorState retry={() => void query.refetch()} />
      ) : (
        <div className="game-grid">
          {query.data?.slice(0, 5).map((game, index) => (
            <GameCard key={game.id} game={game} rank={index + 1} />
          ))}
        </div>
      )}
      <DemoNotice>
        Seleção editorial e notas demonstrativas. Não representa um ranking em tempo real.
      </DemoNotice>
    </section>
  );
}
export function ReleaseCard({ release }: { release: GameRelease }) {
  return (
    <article className="release-card">
      <a href={release.url} target="_blank" rel="noopener noreferrer">
        <Artwork src={release.image} alt="" />
        <div className="release-content">
          <span className="release-date">
            <CalendarDays size={12} />
            {release.releaseDate ? fullDate(release.releaseDate) : release.releaseLabel}
          </span>
          <h3>{release.title}</h3>
          <div>
            <Platforms platforms={release.platforms} />
            <ArrowUpRight size={16} />
          </div>
        </div>
      </a>
    </article>
  );
}
export function UpcomingReleases({ full = false }: { full?: boolean }) {
  const query = useSteam();
  const releases = query.data?.releases ?? [];
  return (
    <section className={full ? "" : "section"}>
      {!full && (
        <SectionHeader
          eyebrow="PREPARE A SUA WISHLIST"
          title="Os próximos capítulos"
          to="/releases"
          action="Todos os lançamentos"
        />
      )}
      {query.isPending ? (
        <LoadingSkeleton count={4} />
      ) : query.isError ? (
        <ErrorState
          message="O calendário da Steam não está disponível agora."
          retry={() => void query.refetch()}
        />
      ) : releases.length ? (
        <div className="release-grid">
          {releases.slice(0, full ? undefined : 4).map((release) => (
            <ReleaseCard key={release.id} release={release} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Novas datas a caminho"
          description="A Steam ainda não retornou próximos lançamentos."
        />
      )}
      <p className="price-note">Próximos lançamentos para PC via Steam. Datas podem mudar.</p>
    </section>
  );
}
