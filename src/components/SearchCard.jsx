import { Badge, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function SearchCard({ skill }) {
    const navigate = useNavigate();

    const isMatch = !!skill.isMatch;
    const ownerUsername = skill.ownerUsername || "utente";
    const ownerUserId = skill.ownerUserId;

    const handleClick = () => {
        if (isMatch && ownerUserId) {
            navigate(`/match?userId=${ownerUserId}`);
        }
    };

    return (
        <Card
            className={`h-100 ${isMatch ? "border-success" : ""}`}
            onClick={handleClick}
            style={{ cursor: isMatch ? "pointer" : "default" }}
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

                {isMatch && (
                    <small className="text-success d-block mt-2">
                        Clicca per vedere il match nel dettaglio
                    </small>
                )}
            </Card.Body>
        </Card>
    );
}

export default SearchCard;