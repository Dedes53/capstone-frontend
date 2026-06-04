import "../assets/css/PrivateLayout.css";

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/UseAuth.jsx";
import SideBar from "./SideBar";

function PrivateLayout() {
    const { token } = useAuth();

    if (!token) return <Navigate to="/login" replace />;

    return (
        <>
            <SideBar />
            <main className="private-main">
                <Outlet />
            </main>
        </>
    );
}

export default PrivateLayout;