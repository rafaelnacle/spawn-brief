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
          Ver oferta
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
  return query.failedSources.length > 0 && !query.isError ? (
    <p className="data-notice">
      {query.failedSources.join(" e ")} indisponível no momento. Mostrando as ofertas das outras
      fontes. <button onClick={() => void query.refetch()}>Tentar novamente</button>
    </p>
  ) : null;
}
export function HotDeals() {
  const query = useDeals();
  const paid = query.data.filter((deal) => deal.salePrice > 0);
  const unique = [...new Map(paid.map((deal) => [deal.title.toLowerCase(), deal])).values()]
    .sort((a, b) => Number(b.currency === "BRL") - Number(a.currency === "BRL"))
    .slice(0, 5);
  return (
    <section className="section">
      <SectionHeader
        eyebrow="DÊ UM UPGRADE NA SUA BIBLIOTECA"
        title="Ofertas que valem o play"
        to="/deals"
        action="Todas as ofertas"
      >
        <Flame className="section-icon" size={22} />
      </SectionHeader>
      {query.isPending ? (
        <LoadingSkeleton />
      ) : query.isError ? (
        <ErrorState
          message="Não conseguimos consultar as lojas agora."
          retry={() => void query.refetch()}
        />
      ) : unique.length ? (
        <DealGrid deals={unique} compact />
      ) : (
        <EmptyState
          title="Consultando as melhores ofertas"
          description="As lojas ainda não retornaram promoções disponíveis."
        />
      )}
      <DealsStatus query={query} />
      <p className="price-note">
        Preços da Steam em R$. Ofertas da CheapShark em US$. Confira preço e disponibilidade na
        loja.
      </p>
    </section>
  );
}
export function FreeGames() {
  const query = useDeals();
  const free = query.data
    .filter((deal) => deal.salePrice === 0 && deal.normalPrice > 0)
    .slice(0, 2);
  return (
    <section className="section free-section">
      <SectionHeader
        eyebrow="SUA BIBLIOTECA AGRADECE"
        title="Custa zero. Vale o resgate…"
        to="/deals?free=1"
        action="Ver jogos grátis"
      >
        <Gift className="section-icon" size={22} />
      </SectionHeader>
      {query.isPending ? (
        <LoadingSkeleton count={2} />
      ) : query.isError ? (
        <ErrorState
          message="Não foi possível verificar os jogos gratuitos agora."
          retry={() => void query.refetch()}
        />
      ) : free.length ? (
        <div className="free-grid">
          {free.map((deal) => (
            <article className="free-card" key={deal.id}>
              <Artwork src={deal.image} alt="" />
              <div>
                <span className="free-label">GRÁTIS PARA RESGATAR</span>
                <h3>{deal.title}</h3>
                <p className="free-meta">
                  <StoreBadge store={deal.store} />
                  <span className="free-original-price">
                    Era <Price value={deal.normalPrice} currency={deal.currency} />
                  </span>
                </p>
                <a href={deal.dealUrl} target="_blank" rel="noopener noreferrer">
                  Resgatar na loja <ArrowUpRight size={16} />
                </a>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Nenhum resgate gratuito confirmado"
          description="Só entram aqui jogos pagos que estão temporariamente grátis. Volte mais tarde para conferir."
        />
      )}
      <p className="price-note">
        Ofertas verificadas pelas lojas. O prazo de resgate deve ser confirmado na página da oferta.
      </p>
    </section>
  );
}
