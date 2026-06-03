import { useNavigate } from "react-router-dom";
import "../assets/css/SearchCard.css";

function SearchCard({ skill }) {
    const navigate = useNavigate();

    const ownerUsername = skill?.ownerUsername || "utente";
    const ownerUserId = skill?.userId || null;
    const isMatch = Boolean(skill?.isMatch);

    const goToMatch = () => {
        if (!isMatch || !ownerUserId) return;
        navigate(`/match?userId=${ownerUserId}`);
    };

    const handleKeyDown = (e) => {
        if (!isMatch || !ownerUserId) return;
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            goToMatch();
        }
    };

    return (
        <article
            className={`search-card ${isMatch ? "search-card--match search-card--clickable" : "search-card--no-match"}`}
            onClick={goToMatch}
            role={isMatch && ownerUserId ? "button" : undefined}
            tabIndex={isMatch && ownerUserId ? 0 : -1}
            onKeyDown={handleKeyDown}
            aria-disabled={!isMatch || !ownerUserId}
        >
            <div className="search-card__top">
                <small className="search-card__owner">@{ownerUsername}</small>

                <span className={`search-card__status ${isMatch ? "is-match" : "is-no-match"}`}>
                    {isMatch ? "MATCH" : "NO MATCH"}
                </span>
            </div>

            <h3 className="search-card__title">{skill?.title || "Senza titolo"}</h3>

            <div className="search-card__category-wrap">
                <span className="search-card__category">{skill?.category || "-"}</span>
            </div>

            <p className="search-card__description">
                {skill?.description || "Nessuna descrizione"}
            </p>

            {isMatch && ownerUserId && (
                <small className="search-card__hint search-card__hint--ok">
                    Clicca per vedere il match nel dettaglio
                </small>
            )}

            {isMatch && !ownerUserId && (
                <small className="search-card__hint search-card__hint--warn">
                    Match trovato, ma manca userId nei dati.
                </small>
            )}
        </article>
    );
}

export default SearchCard;