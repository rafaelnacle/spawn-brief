import { useId } from "react";
import { SlidersHorizontal } from "lucide-react";
import { useLocale } from "../i18n/LocaleContext";
import { useContentPreferences } from "../features/content/ContentPreferences";
export function ContentSettings() {
  const { t } = useLocale();
  const { showExplicit, setShowExplicit } = useContentPreferences();
  const descriptionId = useId();
  return (
    <details className="content-settings">
      <summary aria-label={t("Conteúdo")}>
        <SlidersHorizontal size={16} />
        <span>{t("Conteúdo")}</span>
      </summary>
      <div className="content-settings-panel">
        <label className="content-toggle">
          <span>{t("Exibir jogos com conteúdo sexual explícito")}</span>
          <input
            type="checkbox"
            role="switch"
            checked={showExplicit}
            onChange={(event) => setShowExplicit(event.target.checked)}
            aria-describedby={descriptionId}
          />
        </label>
        <p id={descriptionId}>
          {t(
            "Filtra jogos pornográficos identificados pelas lojas. GTA, violência e classificação +18 não são bloqueados por esse motivo.",
          )}
        </p>
        <p className="content-classification-note">
          {t(
            "A classificação depende da fonte. Jogos sem informação podem aparecer e são marcados como não classificados.",
          )}
        </p>
      </div>
    </details>
  );
}
