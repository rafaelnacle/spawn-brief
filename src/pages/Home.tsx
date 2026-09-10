import { useState } from "react";
import { ArrowUpRight, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useNews } from "../hooks/useContent";
import { HeroNews, NewsGrid } from "../components/News";
import {
  CategoryTabs,
  DemoNotice,
  EmptyState,
  ErrorState,
  LoadingSkeleton,
  SectionHeader,
} from "../components/common";
import { newsCategories } from "../types";
import { HotDeals, FreeGames } from "../components/Deals";
import { PopularGames, UpcomingReleases } from "../components/Games";
export default function Home() {
  const query = useNews();
  const [category, setCategory] = useState("All");
  const articles = query.data ?? [];
  const filtered =
    category === "All"
      ? articles.slice(4)
      : articles.filter((article) => article.category === category);
  return (
    <div className="container home">
      <div className="edition-bar">
        <span>
          <span className="live-dot" /> SEU CHECKPOINT DIÁRIO
        </span>
        <span>Games. Sem perder o fio.</span>
        <span>
          BRASIL <span className="edition-separator">/</span> PT-BR
        </span>
      </div>
      <HeroNews articles={articles} />
      <div className="trending-strip">
        <span>
          <Zap size={15} /> EM ALTA
        </span>
        {["Clair Obscur", "Silksong", "Hades II", "Cyberpunk 2077"].map((term) => (
          <Link key={term} to={`/search?q=${encodeURIComponent(term)}`}>
            {term}
            <ArrowUpRight size={13} />
          </Link>
        ))}
      </div>
      <section className="section">
        <SectionHeader
          eyebrow="O QUE ESTÁ ACONTECENDO"
          title="Últimas notícias"
          to="/news"
          action="Todas as notícias"
        />
        <CategoryTabs items={newsCategories} value={category} onChange={setCategory} />
        {query.isPending ? (
          <LoadingSkeleton count={6} />
        ) : query.isError ? (
          <ErrorState retry={() => void query.refetch()} />
        ) : filtered.length ? (
          <NewsGrid articles={filtered} />
        ) : (
          <EmptyState description="Sem notícias nesta categoria na edição demonstrativa." />
        )}
        <DemoNotice />
      </section>
      <HotDeals />
      <FreeGames />
      <PopularGames />
      <UpcomingReleases />
    </div>
  );
}
