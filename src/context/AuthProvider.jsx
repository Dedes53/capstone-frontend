import { useMemo, useState } from "react";
import { AuthContext } from "./auth-context.js";

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem("token"));

    const login = (newToken) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
    };

    const value = useMemo(
        () => ({ token, isAuthenticated: !!token, login, logout }),
        [token]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}