import { useLocale } from "../i18n/LocaleContext";
import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { ArrowUpRight, Menu, Search, X } from "lucide-react";
const navigation = [
  ["/", "Home"],
  ["/news", "News"],
  ["/deals", "Deals"],
  ["/releases", "Releases"],
  ["/games", "Games"],
];
export function Logo() {
  const { t } = useLocale();
  return (
    <Link to="/" className="logo" aria-label={t("SpawnBrief — Home")}>
      <span className="logo-spawn">spawn</span>
      <span className="logo-brief">
        brief
        <span className="logo-rule" />
      </span>
    </Link>
  );
}
export function Header() {
  const { t, locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const anchor = location.hash ? document.getElementById(location.hash.slice(1)) : null;
    if (anchor) anchor.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);
  useEffect(() => {
    const label = navigation.find(([path]) => path === location.pathname)?.[1];
    document.title = label
      ? `${t(label)} — SpawnBrief`
      : `SpawnBrief — ${t("Encontre seu próximo play")}`;
  }, [location.pathname, t]);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Logo />
        <nav aria-label={t("Navegação principal")} className={open ? "main-nav open" : "main-nav"}>
          {navigation.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === "/"} onClick={() => setOpen(false)}>
              {t(label)}
              {label === "Deals" && <span className="nav-dot" />}
            </NavLink>
          ))}
        </nav>
        <form
          className="header-search"
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            navigate(`/search?q=${encodeURIComponent(search.trim())}`);
            setOpen(false);
          }}
        >
          <Search size={17} />
          <input
            aria-label={t("Busca global")}
            placeholder={t("Buscar no SpawnBrief")}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <button aria-label={t("Pesquisar")} type="submit">
            <ArrowUpRight size={17} />
          </button>
        </form>
        <div className="language-switch" role="group" aria-label={t("Idioma do site")}>
          <button
            type="button"
            lang="pt-BR"
            aria-label="Português"
            aria-pressed={locale === "pt-BR"}
            onClick={() => setLocale("pt-BR")}
          >
            PT
          </button>
          <span aria-hidden="true">/</span>
          <button
            type="button"
            lang="en"
            aria-label="English"
            aria-pressed={locale === "en-US"}
            onClick={() => setLocale("en-US")}
          >
            EN
          </button>
        </div>
        <button
          className="menu-button"
          aria-expanded={open}
          aria-label={t(open ? "Fechar menu" : "Abrir menu")}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}
export function Footer() {
  const { t } = useLocale();
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div>
          <Logo />
          <p>{t("Gaming news, releases and deals in one place.")}</p>
          <span className="footer-tagline">{t("Menos ruído. Mais jogo.")}</span>
        </div>
        <nav aria-label={t("Navegação do rodapé")}>
          <Link to="/news">{t("News")}</Link>
          <Link to="/deals">{t("Deals")}</Link>
          <Link to="/games">{t("Games")}</Link>
        </nav>
        <nav aria-label={t("Sobre o projeto")}>
          <Link to="/about#sources">{t("Sources")}</Link>
          <Link to="/about">{t("About")}</Link>
          <Link to="/about#github">GitHub</Link>
        </nav>
        <div className="footer-note">
          <span className="eyebrow">{t("FEITO PARA QUEM JOGA")}</span>
          <p>
            {t("Descubra o próximo mundo")}
            <br />
            {t("em que você vai se perder.")}
          </p>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} SpawnBrief</span>
        <span>{t("News belongs to their respective publishers.")}</span>
        <span>{t("Dados: Steam & CheapShark")}</span>
      </div>
    </footer>
  );
}
export function Layout() {
  const { t } = useLocale();
  return (
    <>
      <a className="skip-link" href="#main">
        {t("Pular para o conteúdo")}
      </a>
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
