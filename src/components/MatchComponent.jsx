import { useEffect, useState } from "react";
import { Alert, Col, Container, Row, Spinner } from "react-bootstrap";
import UserCard from "./UserCard";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

function MatchComponent() {
    const [status, setStatus] = useState("loading"); // loading | success | error
    const [error, setError] = useState("");
    const [matches, setMatches] = useState([]);

    const token = localStorage.getItem("token");

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
                const onlyMatches = cards
                    .filter((c) => c.isReciprocalMatch)
                    .sort((a, b) => (b.iCanHelp.length + b.canHelpMe.length) - (a.iCanHelp.length + a.canHelpMe.length));

                setMatches(onlyMatches);
                setStatus("success");
            })
            .catch((err) => {
                setError(err.message || "Errore durante il caricamento dei match.");
                setStatus("error");
            });
    }, [token]);

    if (!token) {
        return (
            <Container className="py-4">
                <Alert variant="warning" className="mb-0">
                    Token mancante. Effettua il login.
                </Alert>
            </Container>
        );
    }

    if (status === "loading") {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" />
                <p className="mt-3 mb-0">Cerco i match migliori per te...</p>
            </Container>
        );
    }

    if (status === "error") {
        return (
            <Container className="py-4">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container className="py-4">
            <h2 className="mb-3">I tuoi Match</h2>

            {matches.length === 0 ? (
                <Alert variant="info" className="mb-0">
                    Nessun match reciproco trovato al momento.
                </Alert>
            ) : (
                <Row className="g-4">
                    {matches.map((m) => (
                        <Col key={m.user.id} xs={12} md={6} xl={4}>
                            <UserCard
                                user={m.user}
                                iCanHelp={m.iCanHelp}
                                canHelpMe={m.canHelpMe}
                                ownedSkills={m.ownedSkills}
                                wantedSkills={m.wantedSkills}
                            />
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
}

export default MatchComponent;