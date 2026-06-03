import "../assets/css/SkillCard.css";

function SkillCard({
    id,
    title = "Senza titolo",
    description = "Nessuna descrizione",
    category = "-",
    type = "-",
    onDelete,
    deleting = false,
}) {
    const normalizedType = String(type).toUpperCase();
    const typeClass =
        normalizedType === "OWNED"
            ? "owned"
            : normalizedType === "WANTED"
                ? "wanted"
                : "default";

    const typeLabel =
        normalizedType === "OWNED"
            ? "Posseduta"
            : normalizedType === "WANTED"
                ? "Ricercata"
                : normalizedType;

    const handleDelete = () => {
        if (!id || !onDelete) return;
        const ok = window.confirm(`Vuoi eliminare la skill "${title}"?`);
        if (ok) onDelete(id);
    };

    return (
        <article className={`skill-card skill-card--${typeClass}`}>
            <header className="skill-card__header">
                <h3 className="skill-card__title">{title}</h3>
                <span className={`skill-card__badge skill-card__badge--${typeClass}`}>
                    {typeLabel}
                </span>
            </header>

            <p className="skill-card__description">{description}</p>

            <div className="skill-card__meta">
                <p className="skill-card__category">
                    <strong>Categoria:</strong>
                    <span>{category}</span>
                </p>
            </div>

            <div className="skill-card__actions">
                <button
                    type="button"
                    className="skill-card__delete-btn"
                    onClick={handleDelete}
                    disabled={deleting}
                >
                    {deleting ? "Eliminazione..." : "Elimina"}
                </button>
            </div>
        </article>
    );
}

export default SkillCard;