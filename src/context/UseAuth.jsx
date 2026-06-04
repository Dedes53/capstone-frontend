import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const initialToken =
        sessionStorage.getItem("token") || localStorage.getItem("token") || null;

    const initialUserRaw =
        sessionStorage.getItem("user") || localStorage.getItem("user") || null;
    let initialUser = null;
    try {
        initialUser = initialUserRaw ? JSON.parse(initialUserRaw) : null;
    } catch {
        initialUser = null;
    }

    const [token, setToken] = useState(initialToken);
    const [user, setUser] = useState(initialUser);

    const login = ({ token: newToken, user: newUser = null, remember = false }) => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        if (remember) {
            localStorage.setItem("token", newToken);
            if (newUser) localStorage.setItem("user", JSON.stringify(newUser));
        } else {
            sessionStorage.setItem("token", newToken);
            if (newUser) sessionStorage.setItem("user", JSON.stringify(newUser));
        }

        setToken(newToken);
        setUser(newUser);
    };

    const logout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
    };

    const value = useMemo(
        () => ({ token, user, setToken, setUser, login, logout }),
        [token, user]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}