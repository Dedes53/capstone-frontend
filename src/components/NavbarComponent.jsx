// import { useState, useEffect } from "react";
// // import { NavLink } from "react-router-dom";

// function NavbarComponent() {
//     const [open, setOpen] = useState(false);

//     useEffect(() => {
//         const handleEsc = (e) => {
//             if (e.key === "Escape") setOpen(false);
//         };
//         window.addEventListener("keydown", handleEsc);
//         return () => window.removeEventListener("keydown", handleEsc);
//     }, []);

//     useEffect(() => {
//         document.body.style.overflow = open ? "hidden" : "auto";
//     }, [open]);

//     return (
//         <>
//             <nav className="navbar">
//                 <div className="logo">
//                     <img src="/logo.png" alt="Logo" />
//                 </div>

//                 <div className="title">
//                     <span className="skill">Skill</span><span className="swap">Swap</span>
//                 </div>

//                 <button
//                     className={`menu-btn ${open ? "active" : ""}`}
//                     onClick={() => setOpen(!open)}
//                 >
//                     <span></span><span></span><span></span>
//                 </button>
//             </nav>

//             <div className={`overlay ${open ? "active" : ""}`} onClick={() => setOpen(false)} />


//         </>
//     );
// }

// export default NavbarComponent;


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
                        <span className="skill">Skill</span>
                        <span className="swap">Swap</span>
                    </Navbar.Brand>
                </div>

                <Navbar.Toggle id="menubtn" aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto gap-1 mt-3 mt-lg-0">
                        <Nav.Link as={NavLink} to="/">Home</Nav.Link>
                        <Nav.Link href="#contatti">Contatti</Nav.Link>
                        <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavbarComponent;