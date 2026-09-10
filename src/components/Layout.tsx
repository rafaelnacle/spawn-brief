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
  return (
    <Link to="/" className="logo" aria-label="SpawnBrief — Home">
      <span className="logo-spawn">spawn</span>
      <span className="logo-brief">brief<span className="logo-rule" /></span>
    </Link>
  );
}
export function Header() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const anchor = location.hash ? document.getElementById(location.hash.slice(1)) : null;
    if (anchor) anchor.scrollIntoView();
    else window.scrollTo(0, 0);
    const label = navigation.find(([path]) => path === location.pathname)?.[1];
    document.title = label ? `${label} — SpawnBrief` : "SpawnBrief — Seu próximo jogo começa aqui";
  }, [location.pathname, location.hash]);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Logo />
        <nav aria-label="Navegação principal" className={open ? "main-nav open" : "main-nav"}>
          {navigation.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === "/"} onClick={() => setOpen(false)}>
              {label}
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
            aria-label="Busca global"
            placeholder="Buscar no SpawnBrief"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <button aria-label="Pesquisar" type="submit">
            <ArrowUpRight size={17} />
          </button>
        </form>
        <button
          className="menu-button"
          aria-expanded={open}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div>
          <Logo />
          <p>Gaming news, releases and deals in one place.</p>
          <span className="footer-tagline">Menos ruído. Mais jogo.</span>
        </div>
        <nav aria-label="Navegação do rodapé">
          <Link to="/news">News</Link>
          <Link to="/deals">Deals</Link>
          <Link to="/games">Games</Link>
        </nav>
        <nav aria-label="Sobre o projeto">
          <Link to="/about#sources">Sources</Link>
          <Link to="/about">About</Link>
          <Link to="/about#github">GitHub</Link>
        </nav>
        <div className="footer-note">
          <span className="eyebrow">FEITO PARA QUEM JOGA</span>
          <p>
            Descubra o próximo mundo
            <br />
            em que você vai se perder.
          </p>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} SpawnBrief</span>
        <span>News belongs to their respective publishers.</span>
        <span>Dados: Steam & CheapShark</span>
      </div>
    </footer>
  );
}
export function Layout() {
  return (
    <>
      <a className="skip-link" href="#main">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
