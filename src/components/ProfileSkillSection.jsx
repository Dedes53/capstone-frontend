import { useEffect, useCallback, useState } from "react";
import { useAuth } from "../context/UseAuth.js";
import SkillCard from "./SkillCard.jsx";
import NewSkillForm from "./NewSkillForm.jsx";

function ProfileSkillSection() {
    const { token } = useAuth();
    const [owned, setOwned] = useState([]);
    const [wanted, setWanted] = useState([]);
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const safeRead = async (res, fallbackError) => {
        const raw = await res.text();
        if (!res.ok) throw new Error(raw || fallbackError);
        try {
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    };

    const fetchSkills = useCallback(() => {
        if (!token) return Promise.resolve();

        return Promise.all([
            fetch("http://localhost:3001/skills/me?type=OWNED", {
                headers: { Authorization: `Bearer ${token}` },
            }).then((r) => safeRead(r, "Errore caricamento skill possedute")),

            fetch("http://localhost:3001/skills/me?type=WANTED", {
                headers: { Authorization: `Bearer ${token}` },
            }).then((r) => safeRead(r, "Errore caricamento skill ricercate")),
        ])
            .then(([ownedData, wantedData]) => {
                setOwned(Array.isArray(ownedData) ? ownedData : []);
                setWanted(Array.isArray(wantedData) ? wantedData : []);
                setError("");
            })
            .catch((err) => setError(err.message || "Errore caricamento skill"));
    }, [token]);

    useEffect(() => {
        fetchSkills();
    }, [fetchSkills]);

    const handleDeleteSkill = async (skillId) => {
        if (!token || !skillId) return;
        setError("");
        setDeletingId(skillId);

        try {
            const res = await fetch(`http://localhost:3001/skills/${skillId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg || "Errore eliminazione skill");
            }

            setOwned((prev) => prev.filter((s) => s.id !== skillId));
            setWanted((prev) => prev.filter((s) => s.id !== skillId));
        } catch (err) {
            setError(err.message || "Errore eliminazione skill");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <section>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <h2 style={{ margin: 0 }}>Le tue skill</h2>

                <button
                    type="button"
                    onClick={() => setShowForm((v) => !v)}
                    aria-label={showForm ? "Chiudi form nuova skill" : "Apri form nuova skill"}
                    title={showForm ? "Chiudi" : "Aggiungi nuova"}
                    className="btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: "38px", height: "38px", padding: 0 }}
                >
                    <i className={`bi ${showForm ? "bi-x-lg" : "bi-plus-lg"}`}></i>
                </button>
            </div>

            {showForm && (
                <NewSkillForm
                    onCreated={() => {
                        fetchSkills();
                        setShowForm(false);
                    }}
                    onClose={() => setShowForm(false)}
                />
            )}

            {error && <p style={{ color: "crimson" }}>{error}</p>}

            <h2>Possedute</h2>
            {owned.length === 0
                ? <p>Non ci sono skill possedute</p>
                : owned.map((s) => (
                    <SkillCard
                        key={s.id}
                        id={s.id}
                        title={s.title}
                        description={s.description}
                        category={s.category}
                        type={s.type}
                        onDelete={handleDeleteSkill}
                        deleting={deletingId === s.id}
                    />
                ))}

            <h2>Ricercate</h2>
            {wanted.length === 0
                ? <p>Non ci sono skill ricercate</p>
                : wanted.map((s) => (
                    <SkillCard
                        key={s.id}
                        id={s.id}
                        title={s.title}
                        description={s.description}
                        category={s.category}
                        type={s.type}
                        onDelete={handleDeleteSkill}
                        deleting={deletingId === s.id}
                    />
                ))}
        </section>
    );
}

export default ProfileSkillSection;