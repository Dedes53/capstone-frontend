import '../assets/css/NavbarComponent.css';
import { useState, useEffect } from "react";

function NavbarComponent() {
    const [open, setOpen] = useState(false);

    // Chiusura con ESC
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") {
                setOpen(false);
            }
        };

        window.addEventListener("keydown", handleEsc);

        return () => {
            window.removeEventListener("keydown", handleEsc);
        };
    }, []);

    // Blocca scroll body quando il menu è aperto
    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "auto";
    }, [open]);

    return (
        <>
            <nav className="navbar">
                <div className="logo">
                    <img src="/Logo SkillSwap SS copia.png" alt="Logo" />
                </div>

                <div className="title">
                    <span className="skill">Skill</span><span className="swap">Swap</span>
                </div>

                <button
                    className={`menu-btn ${open ? "active" : ""}`}
                    onClick={() => setOpen(!open)}
                >
                    <span />
                    <span />
                    <span />
                </button>
            </nav>

            {/* Overlay */}
            <div
                className={`overlay ${open ? "active" : ""}`}
                onClick={() => setOpen(false)}
            />

            {/* Sidebar */}
            <aside className={`sidebar ${open ? "active" : ""}`}>
                <a href="/">Home</a>
                <a href="/">Chi siamo</a>
                <a href="/">Servizi</a>
                <a href="/">Contatti</a>
            </aside>
        </>
    );
}

export default NavbarComponent;