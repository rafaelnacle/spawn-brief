import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, RotateCw } from "lucide-react";
import { useDeals } from "../hooks/useDeals";
import { DealGrid, DealsStatus } from "../components/Deals";
import { EmptyState, ErrorState, LoadingSkeleton, SearchInput } from "../components/common";
import { filterDeals, type DealFilters } from "../features/deals/filterDeals";
export default function DealsPage() {
  const query = useDeals();
  const [params, setParams] = useSearchParams();
  const onlyFree = params.get("free") === "1";
  const initial: DealFilters = {
    search: "",
    store: "All",
    discount: 0,
    maxPrice: Infinity,
    currency: "All",
    sort: "discount",
  };
  const [filters, setFilters] = useState<DealFilters>(initial);
  function update<K extends keyof DealFilters>(key: K, value: DealFilters[K]) {
    setFilters((previous) => ({ ...previous, [key]: value }));
  }
  const stores = [
    ...new Set([
      "Steam",
      "GOG",
      "Epic Games Store",
      "Fanatical",
      "GreenManGaming",
      ...query.data.map((deal) => deal.store),
    ]),
  ].sort();
  const results = filterDeals(query.data, {
    ...filters,
    maxPrice: onlyFree ? 0 : filters.maxPrice,
  });
  return (
    <div className="container inner-page">
      <div className="page-intro intro-with-action">
        <div>
          <span className="eyebrow">MAIS JOGOS. MENOS NO CARRINHO.</span>
          <h1>
            Hot deals<span>.</span>
          </h1>
          <p>Encontre seu próximo jogo por um preço que vale o play.</p>
        </div>
        <button
          className="button secondary"
          disabled={query.isFetching}
          onClick={() => void query.refetch()}
        >
          <RotateCw size={15} className={query.isFetching ? "spin" : ""} />
          {query.isFetching ? "Atualizando" : "Atualizar ofertas"}
        </button>
      </div>
      <div className="deals-layout">
        <aside className="filter-panel">
          <h2>
            <SlidersHorizontal size={16} />
            Filtrar ofertas
          </h2>
          <SearchInput
            value={filters.search}
            onChange={(value) => update("search", value)}
            placeholder="Buscar jogo…"
          />
          <label>
            Loja
            <select value={filters.store} onChange={(e) => update("store", e.target.value)}>
              <option value="All">Todas as lojas</option>
              {stores.map((store) => (
                <option key={store}>{store}</option>
              ))}
            </select>
          </label>
          <label>
            Desconto mínimo
            <select
              value={filters.discount}
              onChange={(e) => update("discount", Number(e.target.value))}
            >
              {[0, 25, 50, 75].map((value) => (
                <option key={value} value={value}>
                  {value === 0 ? "Qualquer desconto" : `${value}% ou mais`}
                </option>
              ))}
            </select>
          </label>
          <label>
            Moeda
            <select
              value={filters.currency}
              onChange={(e) => {
                update("currency", e.target.value as DealFilters["currency"]);
                update("maxPrice", Infinity);
              }}
            >
              <option value="All">Todas as moedas</option>
              <option value="BRL">Real brasileiro (R$)</option>
              <option value="USD">Dólar americano (US$)</option>
            </select>
          </label>
          <label>
            Preço máximo
            <select
              disabled={filters.currency === "All" || onlyFree}
              value={onlyFree ? 0 : filters.maxPrice}
              onChange={(e) => update("maxPrice", Number(e.target.value))}
            >
              <option value={Infinity}>Qualquer preço</option>
              {[20, 50, 100].map((value) => (
                <option key={value} value={value}>
                  Até {filters.currency === "USD" ? "US$" : "R$"} {value}
                </option>
              ))}
              {onlyFree && <option value={0}>Grátis</option>}
            </select>
          </label>
          {filters.currency === "All" && (
            <p className="filter-help">Escolha uma moeda para filtrar por preço.</p>
          )}
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={onlyFree}
              onChange={(e) => setParams(e.target.checked ? { free: "1" } : {})}
            />
            Só jogos temporariamente grátis
          </label>
          <button
            className="reset-filters"
            onClick={() => {
              setFilters(initial);
              setParams({});
            }}
          >
            Limpar filtros
          </button>
        </aside>
        <div className="deals-results">
          <div className="results-toolbar">
            <span aria-live="polite">{results.length} ofertas encontradas</span>
            <label className="select-label">
              Ordenar
              <select value={filters.sort} onChange={(e) => update("sort", e.target.value)}>
                <option value="discount">Maior desconto</option>
                <option value="price">Menor preço (por moeda)</option>
                <option value="title">Título A–Z</option>
              </select>
            </label>
          </div>
          <DealsStatus query={query} />
          {query.isPending ? (
            <LoadingSkeleton count={6} />
          ) : query.isError ? (
            <ErrorState
              message="As lojas não responderam. Tente novamente em instantes."
              retry={() => void query.refetch()}
            />
          ) : results.length ? (
            <DealGrid deals={results} />
          ) : (
            <EmptyState
              title={
                onlyFree
                  ? "Nenhum jogo grátis com estes filtros"
                  : "Nenhuma oferta com estes filtros"
              }
            >
              <button
                className="button secondary"
                onClick={() => {
                  setFilters(initial);
                  setParams({});
                }}
              >
                Ver todas as ofertas
              </button>
            </EmptyState>
          )}
          <p className="price-note">
            Preços reais fornecidos por Steam (BRL) e CheapShark (USD), sem conversão cambial. A
            disponibilidade e o valor final são confirmados na loja. Esta lista consulta até 60
            ofertas da CheapShark e os destaques da Steam.
          </p>
        </div>
      </div>
    </div>
  );
}
