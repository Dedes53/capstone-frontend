// import { NavLink } from "react-router-dom";
// import "../assets/css/SideBar.css";


// function SideBar() {
//     return (
//         <section>
//             <aside className={`sidebar ${open ? "active" : ""}`}>


//                 <NavLink to="/" className="nav-item">
//                     {({ isActive }) => (
//                         <>
//                             <i className={`bi ${isActive ? "bi-house-fill" : "bi-house"}`}></i>
//                             <span className="label">Home</span>
//                         </>
//                     )}
//                 </NavLink> 
//                 <NavLink to="/profile" className="nav-item">
//                     {({ isActive }) => (
//                         <>
//                             <i className={`bi ${isActive ? "bi-person-fill" : "bi-person"}`}></i>
//                             <span className="label">Profile</span>
//                         </>
//                     )}
//                 </NavLink>
//                 <NavLink to="/search" className="nav-item">
//                     {({ isActive }) => (
//                         <>
//                             <i className={`bi ${isActive ? "bi-binoculars-fill" : "bi-binoculars"}`}></i>
//                             <span className="label">Search</span>
//                         </>
//                     )}
//                 </NavLink>
//                 <NavLink to="/match" className="nav-item">
//                     {({ isActive }) => (
//                         <>
//                             <i className={`bi ${isActive ? "bi-people-fill" : "bi-people"}`}></i>
//                             <span className="label">Match</span>
//                         </>
//                     )}
//                 </NavLink>
//                 <NavLink to="/login" className="nav-item">
//                     {({ isActive }) => (
//                         <>
//                             <i className={`bi ${isActive ? "bi-door-open-fill" : "bi-door-open"}`}></i>
//                             <span className="label">Logout</span>
//                         </>
//                     )}
//                 </NavLink>
//             </aside>
//         </section>
//     )
// }

// export default SideBar;



import { NavLink } from "react-router-dom";
import "../assets/css/SideBar.css";

function SideBar() {
    return (
        <aside className="sidebar">
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

            <NavLink to="/login" className="nav-item">
                {({ isActive }) => (
                    <>
                        <i className={`bi ${isActive ? "bi-door-open-fill" : "bi-door-open"}`}></i>
                        <span className="label">Logout</span>
                    </>
                )}
            </NavLink>
        </aside>
    );
}

export default SideBar;