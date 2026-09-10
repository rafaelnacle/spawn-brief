import { useLocale } from "../i18n/LocaleContext";
import { Link } from "react-router-dom";
import { EmptyState } from "../components/common";
export default function NotFoundPage() {
  const { t } = useLocale();
  return (
    <div className="container inner-page">
      <EmptyState
        title={t("404 — Fora do mapa")}
        description={t("Esta página não existe. Que tal voltar ao último checkpoint?")}
      >
        <Link className="button" to="/">
          {t("Voltar para Home")}
        </Link>
      </EmptyState>
    </div>
  );
}
