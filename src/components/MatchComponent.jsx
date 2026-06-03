import { useEffect, useState } from "react";
import { useAuth } from "../context/UseAuth.jsx";
import UserCard from "./UserCard";
import "../assets/css/MatchComponent.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

function MatchComponent() {
    const [status, setStatus] = useState("idle"); // idle | loading | success | error
    const [error, setError] = useState("");
    const [matches, setMatches] = useState([]);

    const { token } = useAuth();

    const fetchJson = (url, headers) => {
        return fetch(url, { headers }).then((res) => {
            if (!res.ok) throw new Error(`Errore API ${res.status} su ${url}`);
            return res.json();
        });
    };

    const categoriesSet = (skills) => {
        const safeSkills = skills || [];
        return new Set(safeSkills.map((s) => s.category).filter(Boolean));
    };

    const intersection = (setA, setB) => {
        const out = [];
        setA.forEach((v) => {
            if (setB.has(v)) out.push(v);
        });
        return out;
    };

    useEffect(() => {
        if (!token) return;

        let cancelled = false;

        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        };

        let meData;
        let myOwned = [];
        let myWanted = [];

        fetchJson(`${API_BASE}/users/me`, headers)
            .then((me) => {
                meData = me;
                return Promise.all([
                    fetchJson(`${API_BASE}/skills/me?type=OWNED`, headers),
                    fetchJson(`${API_BASE}/skills/me?type=WANTED`, headers),
                ]);
            })
            .then(([owned, wanted]) => {
                myOwned = owned || [];
                myWanted = wanted || [];
                return fetchJson(`${API_BASE}/users?page=0&size=100&sortBy=username`, headers);
            })
            .then((usersPage) => {
                const users = (usersPage && usersPage.content) || [];
                const otherUsers = users.filter((u) => u.id !== meData.id);

                const cardsPromises = otherUsers.map((u) =>
                    Promise.all([
                        fetchJson(`${API_BASE}/skills/user/${u.id}?type=OWNED`, headers),
                        fetchJson(`${API_BASE}/skills/user/${u.id}?type=WANTED`, headers),
                    ]).then(([uOwned, uWanted]) => {
                        const myOwnedCats = categoriesSet(myOwned);
                        const myWantedCats = categoriesSet(myWanted);
                        const uOwnedCats = categoriesSet(uOwned);
                        const uWantedCats = categoriesSet(uWanted);

                        const iCanHelp = intersection(myOwnedCats, uWantedCats);
                        const canHelpMe = intersection(uOwnedCats, myWantedCats);

                        return {
                            user: u,
                            isReciprocalMatch: iCanHelp.length > 0 && canHelpMe.length > 0,
                            iCanHelp,
                            canHelpMe,
                            ownedSkills: uOwned || [],
                            wantedSkills: uWanted || [],
                        };
                    })
                );

                return Promise.all(cardsPromises);
            })
            .then((cards) => {
                if (cancelled) return;

                const onlyMatches = cards
                    .filter((c) => c.isReciprocalMatch)
                    .sort(
                        (a, b) =>
                            b.iCanHelp.length +
                            b.canHelpMe.length -
                            (a.iCanHelp.length + a.canHelpMe.length)
                    );

                setMatches(onlyMatches);
                setError("");
                setStatus("success");
            })
            .catch((err) => {
                if (cancelled) return;
                setError(err.message || "Errore durante il caricamento dei match.");
                setStatus("error");
            });

        return () => {
            cancelled = true;
        };
    }, [token]);

    if (!token) {
        return (
            <section className="match-page">
                <div className="match-shell">
                    <div className="match-alert match-alert--warning">
                        Token mancante. Effettua il login.
                    </div>
                </div>
            </section>
        );
    }

    if (status === "idle") {
        return (
            <section className="match-page">
                <div className="match-shell">
                    <div className="match-loading">
                        <div className="match-spinner" aria-hidden="true"></div>
                        <p>Cerco i match migliori per te...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (status === "error") {
        return (
            <section className="match-page">
                <div className="match-shell">
                    <div className="match-alert match-alert--danger">{error}</div>
                </div>
            </section>
        );
    }

    return (
        <section className="match-page">
            <div className="match-shell">
                <header className="match-header">
                    <h2>I tuoi Match</h2>
                    <p>Persone con cui puoi scambiare competenze in modo reciproco.</p>
                </header>

                {matches.length === 0 ? (
                    <div className="match-alert match-alert--info">
                        Nessun match reciproco trovato al momento.
                    </div>
                ) : (
                    <div className="match-grid">
                        {matches.map((m) => (
                            <article key={m.user.id} className="match-grid-item">
                                <UserCard
                                    user={m.user}
                                    iCanHelp={m.iCanHelp}
                                    canHelpMe={m.canHelpMe}
                                    ownedSkills={m.ownedSkills}
                                    wantedSkills={m.wantedSkills}
                                />
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

export default MatchComponent;