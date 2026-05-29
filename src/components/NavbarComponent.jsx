import "../assets/css/NavbarComponent.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink } from "react-router-dom";

function NavbarComponent() {
    return (
        <Navbar expand="lg" className="bg-black">
            <Container className="px-2">
                <div className="d-flex align-items-center gap-3">
                    <div className="logo">
                        <img src="/logo.png" alt="Logo" />
                    </div>

                    <Navbar.Brand as={NavLink} to="/">
                        <span className="blue">Skill</span>
                        <span className="orange">Swap</span>
                    </Navbar.Brand>
                </div>

                <Navbar.Toggle id="menubtn" aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto gap-1 mt-3 mt-lg-0">
                        {/* <Nav.Link as={NavLink} to="/">Home</Nav.Link> */}
                        <Nav.Link href="#how-it-works" className="nav-link-anchor">Come funziona</Nav.Link>
                        <Nav.Link href="#categories" className="nav-link-anchor">Categorie</Nav.Link>
                        <Nav.Link href="#contatti" className="nav-link-anchor">Contatti</Nav.Link>
                        <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavbarComponent;