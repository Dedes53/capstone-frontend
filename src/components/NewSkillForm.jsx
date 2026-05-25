import { useState } from "react";
import { useAuth } from "../context/UseAuth.js";

function NewSkillForm({ defaultType = "OWNED", categories = [], onCreated, onClose }) {
    const { token } = useAuth();

    const [form, setForm] = useState({
        title: "",
        description: "",
        category: categories[0] || "",
        type: defaultType, // OWNED | WANTED
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((p) => ({ ...p, [name]: value }));
    };

    const onReset = () => {
        setForm({
            title: "",
            description: "",
            category: categories[0] || "",
            type: defaultType,
        });
        setError("");
    };

    const onSubmit = (e) => {
        e.preventDefault();
        setError("");

        if (!form.title.trim() || !form.description.trim() || !form.category || !form.type) {
            setError("Compila tutti i campi");
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
            .then((res) =>
                res.text().then((text) => {
                    if (!res.ok) throw new Error(text || "Errore creazione skill");
                    return text ? JSON.parse(text) : null;
                })
            )
            .then((createdSkill) => {
                if (onCreated && createdSkill) onCreated(createdSkill);
                onReset();
                if (onClose) onClose();
            })
            .catch((err) => setError(err.message || "Errore imprevisto"))
            .finally(() => setLoading(false));
    };

    return (
        <form onSubmit={onSubmit}>
            <h3>Nuova Skill</h3>

            <input
                name="title"
                placeholder="Titolo"
                value={form.title}
                onChange={onChange}
            />

            <textarea
                name="description"
                placeholder="Descrizione"
                value={form.description}
                onChange={onChange}
            />

            <select name="category" value={form.category} onChange={onChange}>
                <option value="" disabled>Seleziona categoria</option>
                {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
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
                    />
                    Owned
                </label>

                <label>
                    <input
                        type="radio"
                        name="type"
                        value="WANTED"
                        checked={form.type === "WANTED"}
                        onChange={onChange}
                    />
                    Wanted
                </label>
            </div>

            {error && <p style={{ color: "crimson" }}>{error}</p>}

            <button type="button" onClick={onReset} disabled={loading}>
                Svuota
            </button>
            <button type="submit" disabled={loading}>
                {loading ? "Salvataggio..." : "Salva skill"}
            </button>
        </form>
    );
}

export default NewSkillForm;