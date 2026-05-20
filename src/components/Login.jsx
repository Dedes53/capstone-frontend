import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/UseAuth.js";

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
            <section className="login-card">
                <h1>Accedi</h1>
                <p className="subtitle">Bentornato su SkillSwap</p>

                <form className="login-form" onSubmit={onSubmit}>
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
                    />

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
                    />

                    {error && <p className="error">{error}</p>}

                    <button type="submit" disabled={loading}>
                        {loading ? "Accesso..." : "Login"}
                    </button>
                </form>
            </section>

            <section>
                <p>
                    Non hai un account?{" "}
                    <span className="link" onClick={() => navigate("/register")}>
                        Registrati
                    </span>
                </p>
            </section>
        </main>
    );
}

export default Login;