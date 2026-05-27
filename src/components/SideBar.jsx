import { NavLink } from "react-router-dom";
import "../assets/css/SideBar.css";


function SideBar() {
    return (
        <section>
            <aside className={`sidebar ${open ? "active" : ""}`}>
                <NavLink to="/login" className="nav-item">
                    {({ isActive }) => (
                        <>
                            <i className={`bi ${isActive ? "bi-door-open-fill" : "bi-door-open"}`}></i>
                            <span className="label">Login</span>
                        </>
                    )}
                </NavLink>
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
                <NavLink to="/chat" className="nav-item">
                    {({ isActive }) => (
                        <>
                            <i className={`bi ${isActive ? "bi-chat-right-text-fill" : "bi-chat-right-text"}`}></i>
                            <span className="label">Chat</span>
                        </>
                    )}
                </NavLink>
            </aside>
        </section>
    )
}

export default SideBar;