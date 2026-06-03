import { Badge, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function SearchCard({ skill }) {
    const navigate = useNavigate();

    const ownerUsername = skill.ownerUsername || "utente";
    const ownerUserId = skill.userId || null;
    const isMatch = Boolean(skill.isMatch);

    const goToMatch = () => {
        if (!isMatch || !ownerUserId) return;
        navigate(`/match?userId=${ownerUserId}`);
    };

    const handleKeyDown = (e) => {
        if (!isMatch || !ownerUserId) return;
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            goToMatch();
        }
    };

    return (
        <Card
            className={`h-100 ${isMatch ? "border-success search-card-clickable" : ""}`}
            onClick={goToMatch}
            role={isMatch && ownerUserId ? "button" : undefined}
            tabIndex={isMatch && ownerUserId ? 0 : -1}
            onKeyDown={handleKeyDown}
            style={{ cursor: isMatch && ownerUserId ? "pointer" : "default" }}
            aria-disabled={!isMatch || !ownerUserId}
        >
            <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <small className="fw-bold">@{ownerUsername}</small>
                    <Badge bg={isMatch ? "success" : "secondary"}>
                        {isMatch ? "MATCH" : "NO MATCH"}
                    </Badge>
                </div>

                <Card.Title className="mb-2">{skill.title}</Card.Title>

                <div className="mb-2">
                    <Badge bg="dark">{skill.category}</Badge>
                </div>

                <Card.Text className="mb-0">{skill.description}</Card.Text>

                {isMatch && ownerUserId && (
                    <small className="text-success d-block mt-2">
                        Clicca per vedere il match nel dettaglio
                    </small>
                )}

                {isMatch && !ownerUserId && (
                    <small className="text-warning d-block mt-2">
                        Match trovato, ma manca userId nei dati.
                    </small>
                )}
            </Card.Body>
        </Card>
    );
}

export default SearchCard;