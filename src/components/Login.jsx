import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/UseAuth.jsx";
import "../assets/css/Login.css";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState({ username: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const onChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        setError("");

        const username = form.username.trim();
        const password = form.password.trim();

        if (!username || !password) {
            setError("Username e password sono obbligatori");
            return;
        }

        setLoading(true);

        fetch("http://localhost:3001/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        })
            .then((resp) =>
                resp
                    .json()
                    .catch(() => ({}))
                    .then((data) => ({ ok: resp.ok, data }))
            )
            .then(({ ok, data }) => {
                if (!ok) throw new Error(data.message || "Credenziali non valide");

                const token = data.token || data.accessToken;
                if (!token) throw new Error("Token non presente nella risposta");

                login(token);
                navigate("/profile");
            })
            .catch((err) => {
                setError(err.message || "Errore durante il login");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <main className="login-page">
            <section className="login-card" aria-labelledby="login-title">
                <h1 id="login-title">Accedi</h1>
                <p className="login-subtitle">Bentornato su SkillSwap</p>

                <form className="login-form" onSubmit={onSubmit}>
                    <div className="login-field">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            autoComplete="username"
                            value={form.username}
                            onChange={onChange}
                            placeholder="Username"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="login-field">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            value={form.password}
                            onChange={onChange}
                            placeholder="Password"
                            required
                            disabled={loading}
                        />
                    </div>

                    {error && <p className="login-error">{error}</p>}

                    <button className="login-submit" type="submit" disabled={loading}>
                        {loading ? "Accesso..." : "Login"}
                    </button>
                </form>

                <p className="login-register-text">
                    Non hai un account?{" "}
                    <button
                        type="button"
                        className="login-register-link"
                        onClick={() => navigate("/register")}
                    >
                        Registrati
                    </button>
                </p>
            </section>
        </main>
    );
}

export default Login;