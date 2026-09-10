import { useLocale } from "../i18n/LocaleContext";
import { useState, type ReactNode } from "react";
import { ArrowUpRight, Gamepad2, Search, RotateCw, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Currency } from "../types";
import { formatPrice } from "../utils/format";
export function Artwork({
  src,
  alt,
  className = "",
  eager = false,
}: {
  src?: string;
  alt: string;
  className?: string;
  eager?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`artwork ${className}`}>
      {src && !failed ? (
        <img
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="artwork-fallback" role="img" aria-label={alt}>
          <Gamepad2 size={34} />
          <span>SpawnBrief</span>
        </div>
      )}
    </div>
  );
}
export function SectionHeader({
  eyebrow,
  title,
  to,
  action = "Ver tudo",
  children,
}: {
  eyebrow?: string;
  title: string;
  to?: string;
  action?: string;
  children?: ReactNode;
}) {
  const { t } = useLocale();
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <span className="eyebrow">{t(eyebrow)}</span>}
        <h2>
          {t(title)}
          {!/[.!?…]$/.test(title) && <span className="heading-dot">.</span>}
        </h2>
      </div>
      {children}
      {to && (
        <Link className="text-link" to={to}>
          {t(action)}
          <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
}
export function SearchInput({
  value,
  onChange,
  placeholder = "Buscar por título…",
  label = "Pesquisar",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}) {
  const { t } = useLocale();
  return (
    <label className="search-input">
      <Search size={18} />
      <input
        type="search"
        aria-label={t(label)}
        placeholder={t(placeholder)}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
export function CategoryTabs({
  items,
  value,
  onChange,
}: {
  items: readonly string[];
  value: string;
  onChange: (value: string) => void;
}) {
  const { t } = useLocale();
  return (
    <div className="category-tabs" role="group" aria-label={t("Categorias")}>
      {items.map((item) => (
        <button
          key={item}
          type="button"
          aria-pressed={value === item}
          className={value === item ? "selected" : ""}
          onClick={() => onChange(item)}
        >
          {t(item === "All" ? "Todas" : item)}
        </button>
      ))}
    </div>
  );
}
export function LoadingSkeleton({ count = 3 }: { count?: number }) {
  const { t } = useLocale();
  return (
    <div className="skeleton-grid" role="status" aria-label={t("Carregando conteúdo")}>
      {Array.from({ length: count }, (_, i) => (
        <div className="skeleton" key={i}>
          <div />
          <span />
          <span />
        </div>
      ))}
    </div>
  );
}
export function EmptyState({
  title = "Nada por aqui. Ainda.",
  description = "Tente outra busca ou ajuste os filtros.",
  children,
}: {
  title?: string;
  description?: string;
  children?: ReactNode;
}) {
  const { t } = useLocale();
  return (
    <div className="empty-state">
      <Search size={26} />
      <h3>{t(title)}</h3>
      <p>{t(description)}</p>
      {children}
    </div>
  );
}
export function ErrorState({
  retry,
  message = "Não foi possível carregar este conteúdo.",
}: {
  retry: () => void;
  message?: string;
}) {
  const { t } = useLocale();
  return (
    <div className="error-state" role="alert">
      <p>{t(message)}</p>
      <button className="button secondary" onClick={retry}>
        <RotateCw size={15} />
        {t("Tentar novamente")}
      </button>
    </div>
  );
}
export function Price({ value, currency }: { value: number; currency: Currency }) {
  const { t, locale } = useLocale();
  return <span>{value === 0 ? t("Grátis") : formatPrice(value, currency, locale)}</span>;
}
export function StoreBadge({ store }: { store: string }) {
  return (
    <span className="store-badge">
      <Gamepad2 size={13} />
      {store}
    </span>
  );
}
export function ExternalLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const { t } = useLocale();
  return (
    <a className={className} href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <ArrowUpRight size={15} />
      <span className="sr-only">{t("(abre em nova aba)")}</span>
    </a>
  );
}
export function DemoNotice({
  children = "Notícias demonstrativas para explorar o portal. As matérias ainda não são atualizadas por feeds.",
}: {
  children?: ReactNode;
}) {
  const { t } = useLocale();
  return (
    <p className="demo-notice">
      <span>{t("EDIÇÃO DEMO")}</span>
      {typeof children === "string" ? t(children) : children}
    </p>
  );
}
