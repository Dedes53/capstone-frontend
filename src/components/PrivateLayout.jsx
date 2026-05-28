import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/UseAuth.js";
import SideBar from "./SideBar";

function PrivateLayout() {

    const token = useAuth();

    if (!token) return <Navigate to="/login" replace />;

    return (
        <div className="d-flex">
            <SideBar />
            <main className="flex-grow-1 p-3">
                <Outlet />
            </main>

        </div>
    )
}

export default PrivateLayout;