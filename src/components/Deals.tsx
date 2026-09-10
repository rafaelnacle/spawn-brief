import { useLocale } from "../i18n/LocaleContext";
import { Flame, Gift, ArrowUpRight } from "lucide-react";
import type { Deal } from "../types";
import {
  Artwork,
  EmptyState,
  ErrorState,
  ExternalLink,
  LoadingSkeleton,
  Price,
  SectionHeader,
  StoreBadge,
} from "./common";
import { useDeals } from "../hooks/useDeals";
export function DealBadge({ discount }: { discount: number }) {
  return <span className="deal-badge">−{discount}%</span>;
}
export function DealCard({ deal }: { deal: Deal }) {
  const { t } = useLocale();
  return (
    <article className="deal-card">
      <a
        href={deal.dealUrl}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={-1}
        aria-hidden="true"
      >
        <Artwork src={deal.image} alt="" />
      </a>
      <div className="deal-body">
        <StoreBadge store={deal.store} />
        <h3>{deal.title}</h3>
        <div className="deal-price">
          <DealBadge discount={deal.discount} />
          <div>
            <del>
              <Price value={deal.normalPrice} currency={deal.currency} />
            </del>
            <strong>
              <Price value={deal.salePrice} currency={deal.currency} />
            </strong>
          </div>
        </div>
        <ExternalLink className="deal-action" href={deal.dealUrl}>
          {t("Ver oferta")}
        </ExternalLink>
      </div>
    </article>
  );
}
export function DealGrid({ deals, compact = false }: { deals: Deal[]; compact?: boolean }) {
  return (
    <div className={`deal-grid ${compact ? "compact-deals" : ""}`}>
      {deals.map((deal) => (
        <DealCard key={deal.id} deal={deal} />
      ))}
    </div>
  );
}
export function DealsStatus({ query }: { query: ReturnType<typeof useDeals> }) {
  const { t } = useLocale();
  return query.failedSources.length > 0 && !query.isError ? (
    <p className="data-notice">
      {t("{sources} indisponível no momento. Tente novamente ou consulte outras lojas.", {
        sources: query.failedSources.join(" / "),
      })}
      <button onClick={() => void query.refetch()}>{t("Tentar novamente")}</button>
    </p>
  ) : null;
}
export function HotDeals() {
  const { t, currency } = useLocale();
  const query = useDeals();
  const paid = query.data.filter((deal) => deal.salePrice > 0);
  const regional = paid.filter((deal) => deal.currency === currency);
  const preferred = regional.length ? regional : paid;
  const unique = [
    ...new Map([...preferred].reverse().map((deal) => [deal.title.toLowerCase(), deal])).values(),
  ].slice(0, 5);
  return (
    <section className="section">
      <SectionHeader
        eyebrow={t("DÊ UM UPGRADE NA SUA BIBLIOTECA")}
        title={t("Ofertas que valem o play")}
        to="/deals"
        action={t("Todas as ofertas")}
      >
        <Flame className="section-icon" size={22} />
      </SectionHeader>
      {query.isPending ? (
        <LoadingSkeleton />
      ) : query.isError ? (
        <ErrorState
          message={t("Não conseguimos consultar as lojas agora.")}
          retry={() => void query.refetch()}
        />
      ) : unique.length ? (
        <DealGrid deals={unique} compact />
      ) : (
        <EmptyState
          title={t("Consultando as melhores ofertas")}
          description={t("As lojas ainda não retornaram promoções disponíveis.")}
        />
      )}
      <DealsStatus query={query} />
      {currency === "BRL" && !regional.length && unique.length > 0 && (
        <p className="price-note">
          {t("Sem ofertas em reais nesta seleção. Mostrando preços originais em US$.")}
        </p>
      )}
      <p className="price-note">
        {t("Preços regionais da Steam. CheapShark sempre em US$. Confira o valor final na loja.")}
      </p>
    </section>
  );
}
export function FreeGames() {
  const { t } = useLocale();
  const query = useDeals();
  const free = query.data
    .filter((deal) => deal.salePrice === 0 && deal.normalPrice > 0)
    .slice(0, 2);
  return (
    <section className="section free-section">
      <SectionHeader
        eyebrow={t("SUA BIBLIOTECA AGRADECE")}
        title={t("Custa zero. Vale o resgate…")}
        to="/deals?free=1"
        action={t("Ver jogos grátis")}
      >
        <Gift className="section-icon" size={22} />
      </SectionHeader>
      {query.isPending ? (
        <LoadingSkeleton count={2} />
      ) : query.isError ? (
        <ErrorState
          message={t("Não foi possível verificar os jogos gratuitos agora.")}
          retry={() => void query.refetch()}
        />
      ) : free.length ? (
        <div className="free-grid">
          {free.map((deal) => (
            <article className="free-card" key={deal.id}>
              <Artwork src={deal.image} alt="" />
              <div>
                <span className="free-label">{t("GRÁTIS PARA RESGATAR")}</span>
                <h3>{deal.title}</h3>
                <p className="free-meta">
                  <StoreBadge store={deal.store} />
                  <span className="free-original-price">
                    {t("Era")}
                    <Price value={deal.normalPrice} currency={deal.currency} />
                  </span>
                </p>
                <a href={deal.dealUrl} target="_blank" rel="noopener noreferrer">
                  {t("Resgatar na loja")}
                  <ArrowUpRight size={16} />
                </a>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          title={t("Nenhum resgate gratuito confirmado")}
          description={t(
            "Só entram aqui jogos pagos que estão temporariamente grátis. Volte mais tarde para conferir.",
          )}
        />
      )}
      <p className="price-note">
        {t(
          "Ofertas verificadas pelas lojas. O prazo de resgate deve ser confirmado na página da oferta.",
        )}
      </p>
    </section>
  );
}
