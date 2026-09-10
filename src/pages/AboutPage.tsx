import { useLocale } from "../i18n/LocaleContext";
import { ExternalLink } from "../components/common";
export default function AboutPage() {
  const { t } = useLocale();
  return (
    <div className="container inner-page about-page">
      <div className="page-intro">
        <span className="eyebrow">{t("MENOS RUÍDO. MAIS JOGO.")}</span>
        <h1>
          {t("Sobre o SpawnBrief")}
          <span>.</span>
        </h1>
        <p>{t("Um checkpoint para quem gosta de jogar.")}</p>
      </div>
      <div className="prose">
        <p>
          {t(
            "Notícias, promoções e descobertas do universo dos games em um só lugar. Sem conta, sem complicação: o SpawnBrief conecta você ao seu próximo jogo.",
          )}
        </p>
        <h2>{t("Uma primeira edição")}</h2>
        <p>
          {t(
            "As notícias, avaliações e informações do catálogo são demonstrativas. Os resumos foram escritos para apresentar a experiência do portal e não são atribuídos a veículos reais. Seus links levam às páginas oficiais dos jogos na Steam.",
          )}
        </p>
        <h2 id="sources">{t("Fontes e créditos")}</h2>
        <p>
          {t(
            "As promoções vêm da Steam e da CheapShark. Português consulta a Steam brasileira em reais; inglês consulta a loja americana em dólares. A CheapShark só fornece dólares. Nenhuma conversão cambial é aplicada.",
          )}
        </p>
        <div className="source-links">
          <ExternalLink href="https://store.steampowered.com/">Steam</ExternalLink>
          <ExternalLink href="https://www.cheapshark.com/">CheapShark</ExternalLink>
        </div>
        <p>
          {t(
            "Imagens promocionais e nomes dos jogos pertencem às respectivas desenvolvedoras e publishers. News belongs to their respective publishers.",
          )}
        </p>
        <h2>{t("Notícias no horizonte")}</h2>
        <p>
          {t(
            "O portal está preparado para receber feeds de PC Gamer, IGN, GameSpot, Eurogamer, Polygon e Game Developer. Quando conectados, cada resumo terá fonte, data e link para a matéria original.",
          )}
        </p>
        <h2 id="github">GitHub</h2>
        <p>
          {t(
            "O código desta primeira versão está no projeto local. O endereço do repositório será adicionado quando o projeto for publicado pelo responsável.",
          )}
        </p>
      </div>
    </div>
  );
}
