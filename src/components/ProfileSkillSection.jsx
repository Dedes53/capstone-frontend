import { useEffect, useState } from "react";
import { useAuth } from "../context/UseAuth.js";
import SkillCard from "./SkillCard.jsx";

function ProfileSkillSection() {
    const { token } = useAuth();
    const [owned, setOwned] = useState([]);
    const [wanted, setWanted] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!token) return;

        Promise.all([
            fetch("http://localhost:3001/skills/me?type=OWNED", {
                headers: { Authorization: `Bearer ${token}` },
            }).then((r) => r.json()),
            fetch("http://localhost:3001/skills/me?type=WANTED", {
                headers: { Authorization: `Bearer ${token}` },
            }).then((r) => r.json()),
        ])
            .then(([ownedData, wantedData]) => {
                setOwned(ownedData || []);
                setWanted(wantedData || []);
            })
            .catch((err) => setError(err.message || "Errore caricamento skill"));
    }, [token]);

    if (error) return <p style={{ color: "crimson" }}>{error}</p>;

    return (
        <section>
            <div>
                <h2>My Skills</h2>
                <button><i className="bi bi-plus-circle"></i></button>
            </div>
            {owned.length === 0 ? <p>No owned skills</p> : owned.map((s) => <SkillCard key={s.id} skill={s} />)}

            <div>
                <h2>What I'm looking for</h2>
                <button><i className="bi bi-plus-circle"></i></button>
            </div>
            {wanted.length === 0 ? <p>No wanted skills</p> : wanted.map((s) => <SkillCard key={s.id} skill={s} />)}
        </section>
    );
}

export default ProfileSkillSection;