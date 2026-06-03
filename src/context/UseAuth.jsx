import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";

const AuthContext = createContext(null);
const TOKEN_KEY = "token";

function parseJwtPayload(token) {
    try {
        const base64Url = token.split(".")[1];
        if (!base64Url) return null;
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );
        return JSON.parse(jsonPayload);
    } catch {
        return null;
    }
}

function isTokenExpired(token) {
    if (!token) return true;
    const payload = parseJwtPayload(token);
    if (!payload?.exp) return true;
    const nowSec = Math.floor(Date.now() / 1000);
    return payload.exp <= nowSec;
}

export function AuthProvider({ children }) {
    const [token, setTokenState] = useState(() => {
        const saved = sessionStorage.getItem(TOKEN_KEY);
        if (!saved) return null;
        if (isTokenExpired(saved)) {
            sessionStorage.removeItem(TOKEN_KEY);
            return null;
        }
        return saved;
    });

    const logout = useCallback(() => {
        sessionStorage.removeItem(TOKEN_KEY);
        setTokenState(null);
    }, []);

    const login = useCallback(
        (newToken) => {
            if (!newToken || isTokenExpired(newToken)) {
                logout();
                return false;
            }
            sessionStorage.setItem(TOKEN_KEY, newToken);
            setTokenState(newToken);
            return true;
        },
        [logout]
    );

    // auto-logout alla scadenza
    useEffect(() => {
        if (!token) return;

        const clearSession = () => {
            sessionStorage.removeItem(TOKEN_KEY);
            setTokenState(null);
        };

        const payload = parseJwtPayload(token);

        if (!payload?.exp) {
            clearSession();
            return;
        }

        const msUntilExp = payload.exp * 1000 - Date.now();

        if (msUntilExp <= 0) {
            clearSession();
            return;
        }

        const timer = setTimeout(() => {
            clearSession();
        }, msUntilExp);

        return () => clearTimeout(timer);
    }, [token]);

    const isAuthenticated = useMemo(
        () => Boolean(token && !isTokenExpired(token)),
        [token]
    );

    const value = useMemo(
        () => ({ token, login, logout, isAuthenticated }),
        [token, login, logout, isAuthenticated]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth deve essere usato dentro AuthProvider");
    return ctx;
}