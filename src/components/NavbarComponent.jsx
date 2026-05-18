import '../assets/css/NavbarComponent.css';
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

function NavbarComponent() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, []);

    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "auto";
    }, [open]);

    return (
        <>
            <nav className="navbar">
                <div className="logo">
                    <img src="/logo.png" alt="Logo" />
                </div>

                <div className="title">
                    <span className="skill">Skill</span><span className="swap">Swap</span>
                </div>

                <button
                    className={`menu-btn ${open ? "active" : ""}`}
                    onClick={() => setOpen(!open)}
                >
                    <span></span><span></span><span></span>
                </button>
            </nav>

            <div className={`overlay ${open ? "active" : ""}`} onClick={() => setOpen(false)} />

            <aside className={`sidebar ${open ? "active" : ""}`}>
                <NavLink to="/" className="nav-item">
                    {({ isActive }) => (
                        <>
                            <i className={`bi ${isActive ? "bi-house-fill" : "bi-house"}`}></i>
                            <span className="label">Home</span>
                        </>
                    )}
                </NavLink>
                <NavLink to="/profile" className="nav-item">
                    {({ isActive }) => (
                        <>
                            <i className={`bi ${isActive ? "bi-person-fill" : "bi-person"}`}></i>
                            <span className="label">Profilo</span>
                        </>
                    )}
                </NavLink>
                <NavLink to="/search" className="nav-item">
                    {({ isActive }) => (
                        <>
                            <i className={`bi ${isActive ? "bi-binoculars-fill" : "bi-binoculars"}`}></i>
                            <span className="label">Ricerca</span>
                        </>
                    )}
                </NavLink>
                <NavLink to="/chat" className="nav-item">
                    {({ isActive }) => (
                        <>
                            <i className={`bi ${isActive ? "bi-chat-right-text-fill" : "bi-chat-right-text"}`}></i>
                            <span className="label">Chat</span>
                        </>
                    )}
                </NavLink>
            </aside>
        </>
    );
}

export default NavbarComponent;