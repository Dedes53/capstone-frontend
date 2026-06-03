import "../assets/css/Profile.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/UseAuth.js";
import ProfileSkillSection from "./ProfileSkillSection.jsx";

function Profile() {
    const { token } = useAuth();
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [error, setError] = useState("");
    const [avatarUploading, setAvatarUploading] = useState(false);
    const [avatarError, setAvatarError] = useState("");
    const [avatarSuccess, setAvatarSuccess] = useState("");

    const MAX_FILE_SIZE_MB = 2;
    const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

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

    // timeout
    useEffect(() => {
        if (!avatarSuccess && !avatarError) return;

        const timer = setTimeout(() => {
            setAvatarSuccess("");
            setAvatarError("");
        }, 3000);

        return () => clearTimeout(timer);
    }, [avatarSuccess, avatarError]);

    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if (!file || !token) return;

        setAvatarError("");
        setAvatarSuccess("");

        // Controllo tipo file
        if (!ALLOWED_TYPES.includes(file.type)) {
            setAvatarError("Formato non supportato. Usa JPG, PNG o WEBP.");
            e.target.value = "";
            return;
        }

        // Controllo dimensione
        if (file.size > MAX_FILE_SIZE_BYTES) {
            setAvatarError(`File troppo grande. Dimensione massima ${MAX_FILE_SIZE_MB}MB.`);
            e.target.value = "";
            return;
        }

        setAvatarUploading(true);

        const formData = new FormData();
        formData.append("avatar", file);

        fetch("http://localhost:3001/users/me/avatar", {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        })
            .then((res) => {
                if (!res.ok) {
                    return res.text().then((text) => {
                        throw new Error(text || "Errore upload avatar");
                    });
                }
                return res.json();
            })
            .then((updatedProfile) => {
                setProfile(updatedProfile);
                setAvatarSuccess("Avatar aggiornato con successo!");
            })
            .catch((err) => {
                setAvatarError(err.message || "Errore durante il caricamento dell'avatar.");
            })
            .finally(() => {
                setAvatarUploading(false);
                e.target.value = "";
            });
    };

    const isLoading = !error && profile === null;

    if (isLoading) return <p>Caricamento profilo...</p>;
    if (error) return <p style={{ color: "crimson" }}>{error}</p>;

    return (
        <div className="profile-section">
            <div>
                <section>
                    <h1>Profilo</h1>

                    <img
                        src={profile.avatarUrl || "https://placehold.co/120x120?text=Avatar"}
                        alt={`Avatar di ${profile.username}`}
                        width={120}
                        height={120}
                        style={{ borderRadius: "50%", objectFit: "cover" }}
                    />

                    <div style={{ marginTop: "12px" }}>
                        <label htmlFor="avatarInput"><strong>Cambia avatar:</strong></label>
                        <br />
                        <input
                            id="avatarInput"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleAvatarChange}
                            disabled={avatarUploading}
                        />
                        <small style={{ display: "block", marginTop: "4px", color: "#666" }}>
                            Formati: JPG, PNG, WEBP • Max: {MAX_FILE_SIZE_MB}MB
                        </small>
                    </div>

                    {avatarUploading && <p>Caricamento avatar in corso...</p>}
                    {avatarSuccess && <p style={{ color: "green" }}>{avatarSuccess}</p>}
                    {avatarError && <p style={{ color: "crimson" }}>{avatarError}</p>}

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
    );
}

export default Profile;