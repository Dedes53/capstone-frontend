import "../assets/css/NavbarComponent.css";
import { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

function NavbarComponent() {
    const [expanded, setExpanded] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const closeMenuMobileOnly = () => {
        if (window.innerWidth < 992) {
            setExpanded(false);
        }
    };

    const handleAnchorClick = (e, targetId) => {
        e.preventDefault();

        const goToAnchor = () => {
            const el = document.getElementById(targetId);
            if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        };


        if (location.pathname !== "/") {
            navigate("/");
            setTimeout(goToAnchor, 100);
        } else {
            goToAnchor();
        }

        closeMenuMobileOnly();
    };

    return (
        <Navbar
            expand="lg"
            fixed="top"
            className="bg-black"
            expanded={expanded}
            onToggle={(isOpen) => setExpanded(isOpen)}
        >
            <Container className="px-2">
                <div className="d-flex align-items-center gap-3">
                    <div className="logo">
                        <img src="/logo.png" alt="Logo" />
                    </div>

                    <Navbar.Brand
                        as={NavLink}
                        to="/"
                        className="site-title"
                        onClick={closeMenuMobileOnly}
                    >
                        <span className="blue">Skill</span>
                        <span className="orange">Swap</span>
                    </Navbar.Brand>
                </div>

                <Navbar.Toggle id="menubtn" aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto gap-1 mt-3 mt-lg-0">
                        <Nav.Link
                            href="#come-funziona"
                            className="nav-link-anchor"
                            onClick={(e) => handleAnchorClick(e, "come-funziona")}
                        >
                            Come funziona
                        </Nav.Link>

                        <Nav.Link
                            href="#categorie"
                            className="nav-link-anchor"
                            onClick={(e) => handleAnchorClick(e, "categorie")}
                        >
                            Categorie
                        </Nav.Link>

                        <Nav.Link
                            href="#contatti"
                            className="nav-link-anchor"
                            onClick={(e) => handleAnchorClick(e, "contatti")}
                        >
                            Contatti
                        </Nav.Link>

                        <Nav.Link as={NavLink} to="/login" onClick={closeMenuMobileOnly}>
                            Login
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavbarComponent;