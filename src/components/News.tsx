import { Link } from "react-router-dom";
import { ArrowUpRight, Clock3 } from "lucide-react";
import type { NewsArticle } from "../types";
import { Artwork } from "./common";
import { relativeDate } from "../utils/format";
export function NewsMeta({ article }: { article: NewsArticle }) {
  return (
    <div className="news-meta">
      <span>{article.source}</span>
      <span className="meta-dot">·</span>
      <Clock3 size={12} />
      <time dateTime={article.publishedAt}>{relativeDate(article.publishedAt)}</time>
    </div>
  );
}
export function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <article className="news-card">
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${article.title} — ${article.isDemo ? "ver jogo na Steam" : "ler na fonte original"}`}
      >
        <Artwork src={article.image} alt="" />
        <span className={`category category-${article.category.toLowerCase()}`}>
          {article.category}
        </span>
        <h3>
          {article.title}
          <ArrowUpRight size={18} />
        </h3>
      </a>
      <p>{article.description}</p>
      <NewsMeta article={article} />
    </article>
  );
}
export function NewsGrid({ articles }: { articles: NewsArticle[] }) {
  return (
    <div className="news-grid">
      {articles.map((article) => (
        <NewsCard key={article.id} article={article} />
      ))}
    </div>
  );
}
export function NewsList({ articles }: { articles: NewsArticle[] }) {
  return (
    <div className="news-list">
      {articles.map((article) => (
        <article className="small-story" key={article.id}>
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            <div>
              <span className={`category category-${article.category.toLowerCase()}`}>
                {article.category}
              </span>
              <h3>{article.title}</h3>
              <span className="small-source">{article.source}</span>
            </div>
            <Artwork src={article.image} alt="" />
          </a>
        </article>
      ))}
    </div>
  );
}
export function HeroNews({ articles }: { articles: NewsArticle[] }) {
  const main = articles[0];
  if (!main) return null;
  return (
    <div className="editorial-hero">
      <article className="lead-story">
        <Artwork src={main.image} alt="Artwork de Clair Obscur: Expedition 33" eager />
        <div className="hero-shade" />
        <div className="hero-content">
          <div className="hero-labels">
            <span className="featured-label">
              <span /> EM DESTAQUE
            </span>
            <span>RPG · PC & CONSOLES</span>
          </div>
          <a href={main.url} target="_blank" rel="noopener noreferrer">
            <h1>{main.title}</h1>
          </a>
          <p>{main.description}</p>
          <div className="hero-bottom">
            <NewsMeta article={main} />
            <a
              className="round-link"
              href={main.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Conhecer Expedition 33 na Steam"
            >
              <ArrowUpRight size={24} />
            </a>
          </div>
        </div>
      </article>
      <aside className="hero-sidebar">
        <div className="sidebar-title">
          <span>NO RADAR</span>
          <span className="live-dot" />
        </div>
        <NewsList articles={articles.slice(1, 4)} />
        <LinkToNews />
      </aside>
    </div>
  );
}
function LinkToNews() {
  return (
    <Link className="sidebar-footer" to="/news">
      Seu próximo assunto começa aqui <ArrowUpRight size={16} />
    </Link>
  );
}
