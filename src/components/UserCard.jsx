import { useState } from "react";
import "../assets/css/UserCard.css";

function UserCard({ user, iCanHelp = [], canHelpMe = [], ownedSkills = [], wantedSkills = [] }) {
    const [isOpen, setIsOpen] = useState(false);

    const fullName = `${user?.name || ""} ${user?.surname || ""}`.trim();
    const displayName = fullName || user?.username || "Utente";
    const avatar = user?.avatarUrl || "https://placehold.co/64x64?text=U";

    return (
        <article className="user-card">
            <header className="user-card__header">
                <img
                    src={avatar}
                    alt={user?.username || "user"}
                    width={60}
                    height={60}
                    className="user-card__avatar"
                />

                <div className="user-card__identity">
                    <h3 className="user-card__name">{displayName}</h3>
                    <p className="user-card__username">@{user?.username}</p>
                </div>
            </header>

            <section className="user-card__block">
                <p className="user-card__label user-card__label--blue">Tu puoi aiutarlo in:</p>
                <div className="user-card__chips">
                    {iCanHelp.length === 0 ? (
                        <span className="user-card__empty">Nessuna categoria in comune</span>
                    ) : (
                        iCanHelp.map((c) => (
                            <span className="chip chip--blue" key={`help-${user?.id}-${c}`}>
                                {c}
                            </span>
                        ))
                    )}
                </div>
            </section>

            <section className="user-card__block">
                <p className="user-card__label user-card__label--orange">Lui può aiutarti in:</p>
                <div className="user-card__chips">
                    {canHelpMe.length === 0 ? (
                        <span className="user-card__empty">Nessuna categoria in comune</span>
                    ) : (
                        canHelpMe.map((c) => (
                            <span className="chip chip--orange" key={`get-${user?.id}-${c}`}>
                                {c}
                            </span>
                        ))
                    )}
                </div>
            </section>

            <div className="user-card__details">
                <button
                    type="button"
                    className="user-card__details-toggle"
                    onClick={() => setIsOpen((v) => !v)}
                    aria-expanded={isOpen}
                >
                    {isOpen ? "Nascondi skill" : "Vedi skill"}
                </button>

                {isOpen && (
                    <div className="user-card__details-content">
                        <p className="details-title details-title--blue">Offre:</p>
                        <ul>
                            {ownedSkills.length === 0 ? (
                                <li className="user-card__empty">Nessuna skill offerta</li>
                            ) : (
                                ownedSkills.map((s) => (
                                    <li key={s.id}>
                                        <span>{s.title}</span> <em>({s.category})</em>
                                    </li>
                                ))
                            )}
                        </ul>

                        <p className="details-title details-title--orange">Cerca:</p>
                        <ul>
                            {wantedSkills.length === 0 ? (
                                <li className="user-card__empty">Nessuna skill ricercata</li>
                            ) : (
                                wantedSkills.map((s) => (
                                    <li key={s.id}>
                                        <span>{s.title}</span> <em>({s.category})</em>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                )}
            </div>

            <a
                className="user-card__contact-btn"
                href={`mailto:${user?.email}?subject=SkillSwap%20-%20Proposta%20di%20scambio`}
            >
                Contatta via email
            </a>
        </article>
    );
}

export default UserCard;