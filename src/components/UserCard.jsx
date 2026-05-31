import { Badge, Button, Card } from "react-bootstrap";

function UserCard({ user, iCanHelp, canHelpMe, ownedSkills, wantedSkills }) {
    const fullName = `${user.name || ""} ${user.surname || ""}`.trim();

    return (
        <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex flex-column">
                <div className="d-flex align-items-center gap-3 mb-3">
                    <img
                        src={user.avatarUrl || "https://placehold.co/64x64?text=U"}
                        alt={user.username}
                        width={56}
                        height={56}
                        style={{ borderRadius: "50%", objectFit: "cover" }}
                    />
                    <div>
                        <h5 className="mb-0">{fullName || user.username}</h5>
                        <small className="text-muted">@{user.username}</small>
                    </div>
                </div>

                <div className="mb-2">
                    <small className="text-muted d-block mb-1">Tu puoi aiutarlo in:</small>
                    {iCanHelp.map((c) => (
                        <Badge bg="primary" className="me-1 mb-1" key={`help-${user.id}-${c}`}>
                            {c}
                        </Badge>
                    ))}
                </div>

                <div className="mb-3">
                    <small className="text-muted d-block mb-1">Lui può aiutarti in:</small>
                    {canHelpMe.map((c) => (
                        <Badge bg="success" className="me-1 mb-1" key={`get-${user.id}-${c}`}>
                            {c}
                        </Badge>
                    ))}
                </div>

                <details className="mb-3">
                    <summary>Vedi skill</summary>
                    <div className="mt-2">
                        <small className="fw-bold d-block">Offre:</small>
                        <ul className="mb-2">
                            {ownedSkills.map((s) => (
                                <li key={s.id}>
                                    {s.title} ({s.category})
                                </li>
                            ))}
                        </ul>

                        <small className="fw-bold d-block">Cerca:</small>
                        <ul className="mb-0">
                            {wantedSkills.map((s) => (
                                <li key={s.id}>
                                    {s.title} ({s.category})
                                </li>
                            ))}
                        </ul>
                    </div>
                </details>

                <Button
                    className="mt-auto"
                    variant="outline-dark"
                    href={`mailto:${user.email}?subject=SkillSwap%20-%20Proposta%20di%20scambio`}
                >
                    Contatta via email
                </Button>
            </Card.Body>
        </Card>
    );
}

export default UserCard;