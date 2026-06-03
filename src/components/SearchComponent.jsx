import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/UseAuth.jsx";
import SearchCard from "./SearchCard";
import "../assets/css/SearchComponent.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";
const CATEGORIES = ["TECH", "CASA", "GIARDINAGGIO", "SCUOLA", "CUCINA", "FAI_DA_TE"];

function SearchComponent() {
    const [query, setQuery] = useState("");
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [results, setResults] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { token } = useAuth();

    const headers = useMemo(
        () => ({
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        }),
        [token]
    );

    const hasQuery = query.trim().length > 0;
    const hasCategories = selectedCategories.length > 0;
    const isIdle = !hasQuery && !hasCategories;

    const toggleCategory = (cat) => {
        setSelectedCategories((prev) =>
            prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
        );
    };

    const clearFilters = () => {
        setQuery("");
        setSelectedCategories([]);
        setResults([]);
        setError("");
        setIsLoading(false);
    };

    const categoriesSet = (skills) =>
        new Set((skills || []).map((s) => String(s.category).toUpperCase()).filter(Boolean));

    const intersection = (setA, setB) => {
        const out = [];
        setA.forEach((v) => {
            if (setB.has(v)) out.push(v);
        });
        return out;
    };

    useEffect(() => {
        if (!token || isIdle) return;

        const timeoutId = setTimeout(() => {
            setIsLoading(true);
            setError("");

            let meData;
            let myOwned = [];
            let myWanted = [];

            fetch(`${API_BASE}/users/me`, { headers })
                .then((res) => {
                    if (!res.ok) throw new Error(`Errore API ${res.status} su /users/me`);
                    return res.json();
                })
                .then((me) => {
                    meData = me;
                    return Promise.all([
                        fetch(`${API_BASE}/skills/me?type=OWNED`, { headers }).then((r) => {
                            if (!r.ok) throw new Error(`Errore API ${r.status} su /skills/me?type=OWNED`);
                            return r.json();
                        }),
                        fetch(`${API_BASE}/skills/me?type=WANTED`, { headers }).then((r) => {
                            if (!r.ok) throw new Error(`Errore API ${r.status} su /skills/me?type=WANTED`);
                            return r.json();
                        }),
                    ]);
                })
                .then(([owned, wanted]) => {
                    myOwned = owned || [];
                    myWanted = wanted || [];

                    const q = encodeURIComponent(query.trim());
                    return fetch(`${API_BASE}/skills/search?query=${q}&page=0&size=100&sortBy=title`, {
                        headers,
                    }).then((res) => {
                        if (!res.ok) throw new Error(`Errore API ${res.status} su /skills/search`);
                        return res.json();
                    });
                })
                .then((data) => {
                    const content = data?.content || [];

                    const filteredByCategory =
                        selectedCategories.length === 0
                            ? content
                            : content.filter((s) =>
                                selectedCategories.includes(String(s.category).toUpperCase())
                            );

                    const uniqueOwnerIds = [...new Set(filteredByCategory.map((s) => s.userId).filter(Boolean))];

                    return Promise.all([
                        Promise.resolve(filteredByCategory),
                        Promise.all(
                            uniqueOwnerIds.map((id) =>
                                fetch(`${API_BASE}/users/${id}`, { headers }).then((res) => {
                                    if (!res.ok) throw new Error(`Errore API ${res.status} su /users/${id}`);
                                    return res.json();
                                })
                            )
                        ),
                        Promise.resolve({ meData, myOwned, myWanted }),
                    ]);
                })
                .then(([skillsList, owners, my]) => {
                    const ownersById = {};
                    (owners || []).forEach((u) => {
                        ownersById[u.id] = u;
                    });

                    const myOwnedCats = categoriesSet(my.myOwned);
                    const myWantedCats = categoriesSet(my.myWanted);

                    const finalResults = skillsList.map((s) => {
                        const owner = ownersById[s.userId];
                        const ownerOwnedCats = categoriesSet(owner?.ownedSkills || []);
                        const ownerWantedCats = categoriesSet(owner?.wantedSkills || []);

                        const hasOwnerSkillSets = ownerOwnedCats.size > 0 || ownerWantedCats.size > 0;
                        const cat = String(s.category || "").toUpperCase();

                        const isMatch = hasOwnerSkillSets
                            ? (() => {
                                const iCanHelp = intersection(myOwnedCats, ownerWantedCats);
                                const canHelpMe = intersection(ownerOwnedCats, myWantedCats);
                                return iCanHelp.length > 0 && canHelpMe.length > 0;
                            })()
                            : myWantedCats.has(cat) || myOwnedCats.has(cat);

                        return {
                            ...s,
                            ownerUsername: owner?.username || "utente",
                            ownerUserId: s.userId,
                            isMatch,
                        };
                    });

                    setResults(finalResults);
                })
                .catch((err) => {
                    setError(err.message || "Errore durante la ricerca.");
                    setResults([]);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }, 350);

        return () => clearTimeout(timeoutId);
    }, [query, selectedCategories, token, headers, isIdle]);

    if (!token) {
        return (
            <section className="search-page">
                <div className="search-shell">
                    <div className="search-alert search-alert--warning">
                        Token mancante. Effettua il login.
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="search-page">
            <div className="search-shell">
                <header className="search-header">
                    <h2>Ricerca Competenze</h2>
                    <p>Trova skill utili e scopri utenti compatibili con i tuoi interessi.</p>
                </header>

                <div className="search-form">
                    <input
                        className="search-input"
                        type="text"
                        placeholder="Scrivi una competenza (opzionale)..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />

                    <div className="search-categories">
                        {CATEGORIES.map((cat) => {
                            const active = selectedCategories.includes(cat);
                            return (
                                <button
                                    key={cat}
                                    type="button"
                                    className={`search-chip ${active ? "is-active" : ""}`}
                                    onClick={() => toggleCategory(cat)}
                                >
                                    {cat}
                                </button>
                            );
                        })}
                    </div>

                    <div className="search-actions">
                        <button type="button" className="search-reset-btn" onClick={clearFilters}>
                            Reset filtri
                        </button>
                    </div>
                </div>

                {isIdle && (
                    <div className="search-alert search-alert--neutral">
                        Inserisci testo o seleziona categorie per avviare la ricerca automatica.
                    </div>
                )}

                {isLoading && (
                    <div className="search-loading">
                        <div className="search-spinner" aria-hidden="true"></div>
                    </div>
                )}

                {!isLoading && error && <div className="search-alert search-alert--danger">{error}</div>}

                {!isLoading && !error && !isIdle && (
                    <>
                        <p className="search-results-count">
                            Risultati trovati: <strong>{results.length}</strong>
                        </p>

                        {results.length === 0 ? (
                            <div className="search-alert search-alert--info">
                                Nessuna skill trovata con i filtri selezionati.
                            </div>
                        ) : (
                            <div className="search-grid">
                                {results.map((skill) => (
                                    <article className="search-grid-item" key={skill.id}>
                                        <SearchCard skill={skill} />
                                    </article>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}

export default SearchComponent;