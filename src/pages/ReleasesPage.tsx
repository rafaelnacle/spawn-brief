import { UpcomingReleases } from "../components/Games";
export default function ReleasesPage() {
  return (
    <div className="container inner-page">
      <div className="page-intro">
        <span className="eyebrow">SEU PRÓXIMO SAVE COMEÇA EM BREVE</span>
        <h1>
          Coming next<span>.</span>
        </h1>
        <p>Os próximos lançamentos da Steam, direto para sua wishlist.</p>
      </div>
      <UpcomingReleases full />
    </div>
  );
}
