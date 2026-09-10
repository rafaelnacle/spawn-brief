import { useLocale } from "../i18n/LocaleContext";
import { Link, useParams } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useGames, useNews } from "../hooks/useContent";
import { useDeals } from "../hooks/useDeals";
import {
  Artwork,
  DemoNotice,
  EmptyState,
  ErrorState,
  ExternalLink,
  LoadingSkeleton,
  Price,
  SectionHeader,
  StoreBadge,
} from "../components/common";
import { Platforms } from "../components/Games";
import { DealBadge, DealsStatus } from "../components/Deals";
import { NewsGrid } from "../components/News";
import { fullDate } from "../utils/format";
export default function GamePage() {
  const { t, locale } = useLocale();
  const { slug } = useParams();
  const games = useGames();
  const news = useNews();
  const deals = useDeals();
  const game = games.data?.find((item) => item.slug === slug);
  if (games.isPending)
    return (
      <div className="container inner-page">
        <LoadingSkeleton />
      </div>
    );
  if (games.isError)
    return (
      <div className="container inner-page">
        <ErrorState retry={() => void games.refetch()} />
      </div>
    );
  if (!game)
    return (
      <div className="container inner-page">
        <EmptyState
          title={t("Jogo não encontrado")}
          description={t("Este jogo ainda não faz parte do catálogo.")}
        >
          <Link className="button" to="/games">
            {t("Explorar jogos")}
          </Link>
        </EmptyState>
      </div>
    );
  const offers = deals.data.filter((deal) => deal.steamAppId === game.id);
  const related = (news.data ?? []).filter((article) => article.gameSlug === game.slug);
  return (
    <>
      <div className="game-detail-hero">
        <Artwork src={game.image} alt="" eager />
        <div className="game-detail-shade" />
      </div>
      <div className="container game-detail">
        <div className="breadcrumbs">
          <Link to="/games">{t("Games")}</Link>
          <ChevronRight size={12} />
          <span>{game.title}</span>
        </div>
        <div className="game-overview">
          <Artwork
            className="detail-cover"
            src={game.cover}
            alt={t("Capa de {title}", { title: game.title })}
            eager
          />
          <div className="game-description">
            <div className="eyebrow">{game.genres.join(" / ")}</div>
            <h1>{game.title}</h1>
            <Platforms platforms={game.platforms} />
            <p>{game.description}</p>
            <div className="game-facts">
              <div>
                <span className="rating">{game.rating}</span>
                <small>{t("Nota demo")}</small>
              </div>
              <div>
                <span>{t("Lançamento")}</span>
                <strong>{fullDate(game.releaseDate, locale)}</strong>
              </div>
              <div>
                <span>{t("Desenvolvedora")}</span>
                <strong>{game.developer}</strong>
              </div>
              <div>
                <span>{t("Publisher")}</span>
                <strong>{game.publisher}</strong>
              </div>
            </div>
            <ExternalLink
              className="button secondary"
              href={`https://store.steampowered.com/app/${game.id}/`}
            >
              {t("Ver na Steam")}
            </ExternalLink>
          </div>
        </div>
        <DemoNotice>
          {t(
            "Informações do catálogo demonstrativo. Preços abaixo são consultados nas lojas em tempo real, quando disponíveis.",
          )}
        </DemoNotice>
        <section className="section">
          <SectionHeader title={t("Onde comprar")} eyebrow={t("ESCOLHA SEU PRÓXIMO SAVE")} />
          {deals.isPending ? (
            <LoadingSkeleton />
          ) : deals.isError ? (
            <ErrorState retry={() => void deals.refetch()} />
          ) : offers.length ? (
            <div className="price-table-wrap">
              <table className="price-table">
                <thead>
                  <tr>
                    <th>{t("Loja")}</th>
                    <th>{t("Preço normal")}</th>
                    <th>{t("Preço atual")}</th>
                    <th>{t("Desconto")}</th>
                    <th>
                      <span className="sr-only">{t("Oferta")}</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {offers.map((deal) => (
                    <tr key={deal.id}>
                      <td>
                        <StoreBadge store={deal.store} />
                      </td>
                      <td>
                        <del>
                          <Price value={deal.normalPrice} currency={deal.currency} />
                        </del>
                      </td>
                      <td>
                        <strong>
                          <Price value={deal.salePrice} currency={deal.currency} />
                        </strong>
                      </td>
                      <td>
                        <DealBadge discount={deal.discount} />
                      </td>
                      <td>
                        <ExternalLink className="text-link" href={deal.dealUrl}>
                          {t("Ver oferta")}
                        </ExternalLink>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title={t("Sem ofertas deste jogo nos destaques atuais")}
              description={t(
                "As lojas podem ter outros preços. Consulte a página oficial para conferir.",
              )}
            >
              <ExternalLink
                className="button secondary"
                href={`https://store.steampowered.com/app/${game.id}/`}
              >
                {t("Consultar a Steam")}
              </ExternalLink>
            </EmptyState>
          )}
          <DealsStatus query={deals} />
          <p className="price-note">
            {t(
              "A comparação inclui somente ofertas retornadas pelas fontes. O histórico de menor preço ainda não está disponível.",
            )}
          </p>
        </section>
        <section className="section">
          <SectionHeader title={t("No radar")} eyebrow={t("MAIS SOBRE ESTE JOGO")} />
          {related.length ? (
            <NewsGrid articles={related} />
          ) : (
            <EmptyState title={t("Novas histórias em breve")} />
          )}
        </section>
      </div>
    </>
  );
}
