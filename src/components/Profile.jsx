import { useMemo, useState } from "react";
import { useAuth } from "../context/UseAuth.js";

const DEFAULT_CATEGORIES = [
    "TECH",
    "CASA",
    "GIARDINAGGIO",
    "SCUOLA",
    "CUCINA",
    "FAI_DA_TE",
];

const CATEGORY_LABELS = {
    TECH: "Tech",
    CASA: "Casa",
    GIARDINAGGIO: "Giardinaggio",
    SCUOLA: "Scuola",
    CUCINA: "Cucina",
    FAI_DA_TE: "Fai da te",
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
        type: defaultType,
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

        if (!safeCategories.includes(form.category)) {
            setError("Categoria non valida.");
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
        <form onSubmit={onSubmit}>
            <h3>Salva Nuova Skill</h3>

            <input
                name="title"
                placeholder="Titolo"
                value={form.title}
                onChange={onChange}
                disabled={loading}
            />

            <textarea
                name="description"
                placeholder="Descrizione"
                value={form.description}
                onChange={onChange}
                disabled={loading}
            />

            <select
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

            <div>
                <label>
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

                <label style={{ marginLeft: "1rem" }}>
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
            </div>

            {error && <p style={{ color: "crimson" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}

            <div style={{ display: "flex", gap: "0.5rem" }}>
                <button type="button" onClick={onReset} disabled={loading}>
                    Svuota
                </button>
                <button type="submit" disabled={loading}>
                    {loading ? "Salvataggio..." : "Salva skill"}
                </button>
            </div>
        </form>
    );
}

export default NewSkillForm;