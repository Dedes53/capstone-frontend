import { useEffect, useMemo, useState } from "react";
import { Alert, Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { useAuth } from "../context/UseAuth.jsx";
import SearchCard from "./SearchCard";

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
            <Container className="py-4">
                <Alert variant="warning" className="mb-0">
                    Token mancante. Effettua il login.
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="py-4">
            <h2 className="mb-3">Ricerca Competenze</h2>

            <Form className="mb-4">
                <Row className="g-3">
                    <Col xs={12}>
                        <Form.Control
                            type="text"
                            placeholder="Scrivi una competenza (opzionale)..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </Col>
                </Row>

                <div className="mt-3 d-flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => {
                        const active = selectedCategories.includes(cat);
                        return (
                            <Button
                                key={cat}
                                type="button"
                                size="sm"
                                variant={active ? "dark" : "outline-dark"}
                                onClick={() => toggleCategory(cat)}
                            >
                                {cat}
                            </Button>
                        );
                    })}
                </div>

                <div className="mt-3">
                    <Button type="button" variant="outline-secondary" onClick={clearFilters}>
                        Reset filtri
                    </Button>
                </div>
            </Form>

            {isIdle && (
                <Alert variant="light" className="border">
                    Inserisci testo o seleziona categorie per avviare la ricerca automatica.
                </Alert>
            )}

            {isLoading && (
                <div className="text-center py-4">
                    <Spinner animation="border" />
                </div>
            )}

            {!isLoading && error && <Alert variant="danger">{error}</Alert>}

            {!isLoading && !error && !isIdle && (
                <>
                    <p className="mb-3">
                        Risultati trovati: <strong>{results.length}</strong>
                    </p>

                    {results.length === 0 ? (
                        <Alert variant="info" className="mb-0">
                            Nessuna skill trovata con i filtri selezionati.
                        </Alert>
                    ) : (
                        <Row className="g-3">
                            {results.map((skill) => (
                                <Col xs={12} md={6} lg={4} key={skill.id}>
                                    <SearchCard skill={skill} />
                                </Col>
                            ))}
                        </Row>
                    )}
                </>
            )}
        </Container>
    );
}

export default SearchComponent;