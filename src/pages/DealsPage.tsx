import { formatPrice } from "../utils/format";
import { useLocale } from "../i18n/LocaleContext";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, RotateCw } from "lucide-react";
import { useDeals } from "../hooks/useDeals";
import { DealGrid, DealsStatus } from "../components/Deals";
import { EmptyState, ErrorState, LoadingSkeleton, SearchInput } from "../components/common";
import { filterDeals, type DealFilters } from "../features/deals/filterDeals";
export default function DealsPage() {
  const { t, currency, locale } = useLocale();
  const query = useDeals();
  const [params, setParams] = useSearchParams();
  const onlyFree = params.get("free") === "1";
  const initial: DealFilters = {
    search: "",
    store: "All",
    discount: 0,
    maxPrice: Infinity,
    currency: onlyFree ? "All" : currency,
    sort: "discount",
  };
  const [filters, setFilters] = useState<DealFilters>(initial);
  useEffect(() => {
    setFilters((previous) => ({
      ...previous,
      currency: onlyFree ? "All" : currency,
      maxPrice: Infinity,
    }));
  }, [currency, onlyFree]);
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
          <span className="eyebrow">{t("MAIS JOGOS. MENOS NO CARRINHO.")}</span>
          <h1>
            {t("Hot deals")}
            <span>.</span>
          </h1>
          <p>{t("Encontre seu próximo jogo por um preço que vale o play.")}</p>
        </div>
        <button
          className="button secondary"
          disabled={query.isFetching}
          onClick={() => void query.refetch()}
        >
          <RotateCw size={15} className={query.isFetching ? "spin" : ""} />
          {t(query.isFetching ? "Atualizando" : "Atualizar ofertas")}
        </button>
      </div>
      <div className="deals-layout">
        <aside className="filter-panel">
          <h2>
            <SlidersHorizontal size={16} />
            {t("Filtrar ofertas")}
          </h2>
          <SearchInput
            value={filters.search}
            onChange={(value) => update("search", value)}
            placeholder={t("Buscar jogo…")}
          />
          <label>
            {t("Loja")}
            <select value={filters.store} onChange={(e) => update("store", e.target.value)}>
              <option value="All">{t("Todas as lojas")}</option>
              {stores.map((store) => (
                <option key={store}>{store}</option>
              ))}
            </select>
          </label>
          <label>
            {t("Desconto mínimo")}
            <select
              value={filters.discount}
              onChange={(e) => update("discount", Number(e.target.value))}
            >
              {[0, 25, 50, 75].map((value) => (
                <option key={value} value={value}>
                  {value === 0 ? t("Qualquer desconto") : t("{value}% ou mais", { value })}
                </option>
              ))}
            </select>
          </label>
          <label>
            {t("Moeda")}
            <select
              value={filters.currency}
              onChange={(e) => {
                update("currency", e.target.value as DealFilters["currency"]);
                update("maxPrice", Infinity);
              }}
            >
              <option value="All">{t("Todas as moedas")}</option>
              <option value="BRL">{t("Real brasileiro (R$)")}</option>
              <option value="USD">{t("Dólar americano (US$)")}</option>
            </select>
          </label>
          <label>
            {t("Preço máximo")}
            <select
              disabled={filters.currency === "All" || onlyFree}
              value={onlyFree ? 0 : filters.maxPrice}
              onChange={(e) => update("maxPrice", Number(e.target.value))}
            >
              <option value={Infinity}>{t("Qualquer preço")}</option>
              {[20, 50, 100].map((value) => (
                <option key={value} value={value}>
                  {t("Até {price}", {
                    price: formatPrice(value, filters.currency === "USD" ? "USD" : "BRL", locale),
                  })}
                </option>
              ))}
              {onlyFree && <option value={0}>{t("Grátis")}</option>}
            </select>
          </label>
          {filters.currency === "All" && (
            <p className="filter-help">{t("Escolha uma moeda para filtrar por preço.")}</p>
          )}
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={onlyFree}
              onChange={(e) => setParams(e.target.checked ? { free: "1" } : {})}
            />
            {t("Só jogos temporariamente grátis")}
          </label>
          <button
            className="reset-filters"
            onClick={() => {
              setFilters(initial);
              setParams({});
            }}
          >
            {t("Limpar filtros")}
          </button>
        </aside>
        <div className="deals-results">
          <div className="results-toolbar">
            <span aria-live="polite">
              {t("{count} ofertas encontradas", { count: results.length })}
            </span>
            <label className="select-label">
              {t("Ordenar")}
              <select value={filters.sort} onChange={(e) => update("sort", e.target.value)}>
                <option value="discount">{t("Maior desconto")}</option>
                <option value="price">{t("Menor preço (por moeda)")}</option>
                <option value="title">{t("Título A–Z")}</option>
              </select>
            </label>
          </div>
          <DealsStatus query={query} />
          {query.isPending ? (
            <LoadingSkeleton count={6} />
          ) : query.isError ? (
            <ErrorState
              message={t("As lojas não responderam. Tente novamente em instantes.")}
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
                {t("Ver todas as ofertas")}
              </button>
            </EmptyState>
          )}
          <p className="price-note">
            {t(
              "Preços regionais da Steam (Brasil em R$, Estados Unidos em US$) e ofertas da CheapShark sempre em US$. Sem conversão cambial. Confira a disponibilidade e o valor final na loja. A seleção inclui até 60 ofertas da CheapShark e os destaques da Steam.",
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
