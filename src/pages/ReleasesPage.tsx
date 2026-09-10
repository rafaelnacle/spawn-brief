import { useLocale } from "../i18n/LocaleContext";
import { UpcomingReleases } from "../components/Games";
export default function ReleasesPage() {
  const { t } = useLocale();
  return (
    <div className="container inner-page">
      <div className="page-intro">
        <span className="eyebrow">{t("SEU PRÓXIMO SAVE COMEÇA EM BREVE")}</span>
        <h1>
          {t("Coming next")}
          <span>.</span>
        </h1>
        <p>{t("Os próximos lançamentos da Steam, direto para sua wishlist.")}</p>
      </div>
      <UpcomingReleases full />
    </div>
  );
}
