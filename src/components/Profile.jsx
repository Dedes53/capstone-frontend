import "../assets/css/Profile.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/UseAuth.js";
import ProfileSkillSection from "./ProfileSkillSection.jsx";
import SideBar from "./SideBar.jsx";

function Profile() {
    const { token } = useAuth();
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!token) navigate("/login");
    }, [token, navigate]);

    useEffect(() => {
        if (!token) return;

        let cancelled = false;

        fetch("http://localhost:3001/users/me", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                if (!res.ok) {
                    return res.text().then((text) => {
                        throw new Error(text || "Errore nel caricamento profilo");
                    });
                }
                return res.json();
            })
            .then((data) => {
                if (!cancelled) {
                    setError("");
                    setProfile(data);
                }
            })
            .catch((err) => {
                if (!cancelled) {
                    setProfile(null);
                    setError(err.message || "Errore imprevisto");
                }
            });

        return () => {
            cancelled = true;
        };
    }, [token]);

    const isLoading = !error && profile === null;

    if (isLoading) return <p>Caricamento profilo...</p>;
    if (error) return <p style={{ color: "crimson" }}>{error}</p>;

    return (
        <>
            <div className="profile-section ">
                <SideBar />
                <div>
                    <section>
                        <h1>Profilo</h1>
                        <img
                            src={profile.avatarUrl}
                            alt={`Avatar di ${profile.username}`}
                            width={120}
                            height={120}
                            style={{ borderRadius: "50%", objectFit: "cover" }}
                        />
                        <p><strong>Username:</strong> {profile.username}</p>
                        <p><strong>Nome:</strong> {profile.name}</p>
                        <p><strong>Cognome:</strong> {profile.surname}</p>
                        <p><strong>Email:</strong> {profile.email}</p>
                    </section>
                    <section>
                        <ProfileSkillSection />
                    </section>
                </div>
            </div>
        </>
    );
}

export default Profile;