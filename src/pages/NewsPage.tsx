import { useState } from "react";
import { useNews } from "../hooks/useContent";
import {
  CategoryTabs,
  DemoNotice,
  EmptyState,
  ErrorState,
  LoadingSkeleton,
  SearchInput,
} from "../components/common";
import { NewsGrid } from "../components/News";
import { newsCategories } from "../types";
import { normalizeText } from "../utils/format";
export default function NewsPage() {
  const query = useNews();
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");
  const results = (query.data ?? [])
    .filter(
      (article) =>
        (category === "All" || article.category === category) &&
        normalizeText(article.title).includes(normalizeText(search)),
    )
    .sort((a, b) =>
      sort === "popular" ? b.popularity - a.popularity : b.publishedAt.localeCompare(a.publishedAt),
    );
  return (
    <div className="container inner-page">
      <div className="page-intro">
        <span className="eyebrow">O UNIVERSO DOS GAMES, EM DIA</span>
        <h1>
          News<span>.</span>
        </h1>
        <p>As histórias que merecem um lugar no seu radar.</p>
      </div>
      <div className="page-toolbar">
        <SearchInput value={search} onChange={setSearch} placeholder="Buscar notícias…" />
        <label className="select-label">
          Ordenar por
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="latest">Mais recentes</option>
            <option value="popular">Populares (demo)</option>
          </select>
        </label>
      </div>
      <CategoryTabs items={newsCategories} value={category} onChange={setCategory} />
      <DemoNotice />
      {query.isPending ? (
        <LoadingSkeleton count={6} />
      ) : query.isError ? (
        <ErrorState retry={() => void query.refetch()} />
      ) : results.length ? (
        <>
          <p className="result-count" aria-live="polite">
            {results.length} histórias no radar
          </p>
          <NewsGrid articles={results} />
        </>
      ) : (
        <EmptyState>
          <button
            className="button secondary"
            onClick={() => {
              setCategory("All");
              setSearch("");
            }}
          >
            Limpar filtros
          </button>
        </EmptyState>
      )}
    </div>
  );
}
