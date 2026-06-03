import { useEffect, useCallback, useState } from "react";
import { useAuth } from "../context/UseAuth.jsx";
import SkillCard from "./SkillCard.jsx";
import NewSkillForm from "./NewSkillForm.jsx";
import "../assets/css/ProfileSkillSection.css";

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
        <section className="profile-skill-section">
            <div className="skill-header-row">
                <h2 className="skill-main-title">Le tue skill</h2>

                <button
                    type="button"
                    onClick={() => setShowForm((v) => !v)}
                    aria-label={showForm ? "Chiudi form nuova skill" : "Apri form nuova skill"}
                    title={showForm ? "Chiudi" : "Aggiungi nuova"}
                    className="skill-toggle-btn"
                >
                    <i className={`bi ${showForm ? "bi-x-lg" : "bi-plus-lg"}`}></i>
                </button>
            </div>

            {showForm && (
                <div className="new-skill-form-wrap">
                    <NewSkillForm
                        onCreated={() => {
                            fetchSkills();
                            setShowForm(false);
                        }}
                        onClose={() => setShowForm(false)}
                    />
                </div>
            )}

            {error && <p className="skill-error">{error}</p>}

            <div className="skills-grid">
                <div className="skill-column skill-column-owned">
                    <div className="skill-column-head">
                        <h3>Possedute</h3>
                    </div>

                    <div className="skill-list">
                        {owned.length === 0 ? (
                            <p className="skill-empty">Non ci sono skill possedute</p>
                        ) : (
                            owned.map((s) => (
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
                            ))
                        )}
                    </div>
                </div>

                <div className="skill-column skill-column-wanted">
                    <div className="skill-column-head">
                        <h3>Ricercate</h3>
                    </div>

                    <div className="skill-list">
                        {wanted.length === 0 ? (
                            <p className="skill-empty">Non ci sono skill ricercate</p>
                        ) : (
                            wanted.map((s) => (
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
                            ))
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ProfileSkillSection;