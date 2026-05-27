// import "../assets/css/SkillCard.css";

function SkillCard({
    id,
    title = "Senza titolo",
    description = "Nessuna descrizione",
    category = "-",
    type = "-",
    onDelete,
    deleting = false,
}) {
    const handleDelete = () => {
        if (!id || !onDelete) return;
        const ok = window.confirm(`Vuoi eliminare la skill "${title}"?`);
        if (ok) onDelete(id);
    };

    return (
        <article className="skill-card">
            <header className="skill-card__header">
                <h3 className="skill-card__title">{title}</h3>
                <span className={`skill-card__badge skill-card__badge--${String(type).toLowerCase()}`}>
                    {type}
                </span>
            </header>

            <p className="skill-card__description">{description}</p>
            <p><strong>Categoria:</strong> {category}</p>

            <button type="button" onClick={handleDelete} disabled={deleting}>
                {deleting ? "Eliminazione..." : "Elimina"}
            </button>
        </article>
    );
}

export default SkillCard;