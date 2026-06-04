import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/UseAuth.jsx";
import "../assets/css/SideBar.css";

function SideBar() {
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;
    const { logout } = useAuth();

    const getToken = () =>
        sessionStorage.getItem("token") || localStorage.getItem("token");

    const clearAuth = () => {
        logout();
    };

    const handleLogout = () => {
        clearAuth();
        navigate("/login");
    };

    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm(
            "Sei sicuro di voler eliminare il tuo account? Questa azione è irreversibile."
        );
        if (!confirmDelete) return;

        try {
            const token = getToken();
            if (!token) throw new Error("Token mancante. Effettua di nuovo il login.");
            if (!API_URL) throw new Error("VITE_API_URL non definita.");

            const meRes = await fetch(`${API_URL}/users/me`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!meRes.ok) throw new Error(`Impossibile recuperare utente (${meRes.status}).`);
            const me = await meRes.json();

            const delRes = await fetch(`${API_URL}/users/${me.id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!delRes.ok) {
                let message = `Impossibile eliminare account (${delRes.status}).`;
                try {
                    const data = await delRes.json();
                    if (data?.message) message = data.message;
                } catch {
                    const text = await delRes.text();
                    if (text) message = text;
                }
                throw new Error(message);
            }

            clearAuth();
            alert("Account eliminato con successo.");
            navigate("/register");
        } catch (err) {
            console.error("Delete account error:", err);
            alert(err.message || "Errore durante l'eliminazione dell'account.");
        }
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-main-links">
                <NavLink to="/profile" className="nav-item">
                    {({ isActive }) => (
                        <>
                            <i className={`bi ${isActive ? "bi-person-fill" : "bi-person"}`}></i>
                            <span className="label">Profile</span>
                        </>
                    )}
                </NavLink>

                <NavLink to="/search" className="nav-item">
                    {({ isActive }) => (
                        <>
                            <i className={`bi ${isActive ? "bi-binoculars-fill" : "bi-binoculars"}`}></i>
                            <span className="label">Search</span>
                        </>
                    )}
                </NavLink>

                <NavLink to="/match" className="nav-item">
                    {({ isActive }) => (
                        <>
                            <i className={`bi ${isActive ? "bi-people-fill" : "bi-people"}`}></i>
                            <span className="label">Match</span>
                        </>
                    )}
                </NavLink>

                <button type="button" className="nav-item logout-btn" onClick={handleLogout}>
                    <i className="bi bi-door-open"></i>
                    <span className="label">Logout</span>
                </button>
            </div>

            <div className="sidebar-danger-zone">
                <button
                    type="button"
                    className="nav-item danger-item"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeleteAccount();
                    }}
                >
                    <i className="bi bi-trash3"></i>
                    <span className="label">Elimina account</span>
                </button>
            </div>
        </aside>
    );
}

export default SideBar;