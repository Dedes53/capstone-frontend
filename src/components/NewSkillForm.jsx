import { useMemo, useState } from "react";
import { useAuth } from "../context/UseAuth.jsx";
import "../assets/css/NewSkillForm.css";

const DEFAULT_CATEGORIES = [
    "TECH",
    "CASA",
    "GIARDINAGGIO",
    "SCUOLA",
    "CUCINA",
    "FAI_DA_TE",
    "ALTRO"
];

const CATEGORY_LABELS = {
    TECH: "Tech",
    CASA: "Casa",
    GIARDINAGGIO: "Giardinaggio",
    SCUOLA: "Scuola",
    CUCINA: "Cucina",
    FAI_DA_TE: "Fai da te",
    ALTRO: "Altro",
};

function NewSkillForm({
    defaultType = "OWNED",
    categories = DEFAULT_CATEGORIES,
    onCreated,
    onClose,
}) {
    const { token } = useAuth();

    const safeCategories = useMemo(
        () =>
            Array.isArray(categories) && categories.length > 0
                ? categories
                : DEFAULT_CATEGORIES,
        [categories]
    );

    const [form, setForm] = useState({
        title: "",
        description: "",
        category: "",
        type: defaultType, // OWNED | WANTED
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const onReset = () => {
        setForm({
            title: "",
            description: "",
            category: "",
            type: defaultType,
        });
        setError("");
        setSuccess("");
    };

    const onSubmit = (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!token) {
            setError("Utente non autenticato.");
            return;
        }

        if (!form.title.trim() || !form.description.trim() || !form.category || !form.type) {
            setError("Compila tutti i campi.");
            return;
        }

        setLoading(true);

        fetch("http://localhost:3001/skills", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                title: form.title.trim(),
                description: form.description.trim(),
                category: form.category,
                type: form.type,
            }),
        })
            .then((res) => {
                if (!res.ok) {
                    return res.text().then((msg) => {
                        throw new Error(msg || "Errore creazione skill");
                    });
                }
                return null;
            })
            .then(() => {
                setSuccess("Skill creata con successo!");
                onReset();
                if (onCreated) onCreated();
                if (onClose) onClose();
            })
            .catch((err) => {
                setError(err.message || "Errore imprevisto.");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <form className="new-skill-form" onSubmit={onSubmit}>
            <h3 className="new-skill-title">Salva Nuova Skill</h3>

            <div className="new-skill-fields">
                <div className="new-skill-field">
                    <label htmlFor="skill-title">Titolo</label>
                    <input
                        id="skill-title"
                        name="title"
                        placeholder="Es. Riparazione PC"
                        value={form.title}
                        onChange={onChange}
                        disabled={loading}
                    />
                </div>

                <div className="new-skill-field">
                    <label htmlFor="skill-description">Descrizione</label>
                    <textarea
                        id="skill-description"
                        name="description"
                        placeholder="Descrivi in breve la skill..."
                        value={form.description}
                        onChange={onChange}
                        disabled={loading}
                        rows={4}
                    />
                </div>

                <div className="new-skill-field">
                    <label htmlFor="skill-category">Categoria</label>
                    <select
                        id="skill-category"
                        name="category"
                        value={form.category}
                        onChange={onChange}
                        disabled={loading}
                    >
                        <option value="" disabled>
                            Seleziona categoria
                        </option>
                        {safeCategories.map((c) => (
                            <option key={c} value={c}>
                                {CATEGORY_LABELS[c] || c}
                            </option>
                        ))}
                    </select>
                </div>

                <fieldset className="new-skill-type-fieldset">
                    <legend>Tipo skill</legend>

                    <label className={`skill-type-chip ${form.type === "OWNED" ? "active-owned" : ""}`}>
                        <input
                            type="radio"
                            name="type"
                            value="OWNED"
                            checked={form.type === "OWNED"}
                            onChange={onChange}
                            disabled={loading}
                        />
                        Possedute
                    </label>

                    <label className={`skill-type-chip ${form.type === "WANTED" ? "active-wanted" : ""}`}>
                        <input
                            type="radio"
                            name="type"
                            value="WANTED"
                            checked={form.type === "WANTED"}
                            onChange={onChange}
                            disabled={loading}
                        />
                        Ricercate
                    </label>
                </fieldset>
            </div>

            {error && <p className="new-skill-error">{error}</p>}
            {success && <p className="new-skill-success">{success}</p>}

            <div className="new-skill-actions">
                <button
                    className="btn-secondary"
                    type="button"
                    onClick={onReset}
                    disabled={loading}
                >
                    Svuota
                </button>
                <button
                    className="btn-primary"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Salvataggio..." : "Salva skill"}
                </button>
            </div>
        </form>
    );
}

export default NewSkillForm;