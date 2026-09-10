import { Link } from "react-router-dom";
import { EmptyState } from "../components/common";
export default function NotFoundPage() {
  return (
    <div className="container inner-page">
      <EmptyState
        title="404 — Fora do mapa"
        description="Esta página não existe. Que tal voltar ao último checkpoint?"
      >
        <Link className="button" to="/">
          Voltar para Home
        </Link>
      </EmptyState>
    </div>
  );
}
