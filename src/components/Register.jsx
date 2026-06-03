import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/Register.css";

function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        name: "",
        surname: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const onChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const validate = () => {
        if (!form.username || !form.name || !form.surname || !form.email || !form.password || !form.confirmPassword) {
            return "Compila tutti i campi.";
        }

        if (form.username.length < 2) return "Username troppo corto (minimo 2).";
        if (form.name.length < 2) return "Nome troppo corto (minimo 2).";
        if (form.surname.length < 2) return "Cognome troppo corto (minimo 2).";

        if (form.password.length < 8) return "La password deve avere almeno 8 caratteri.";

        const strongPwd = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        if (!strongPwd.test(form.password)) {
            return "La password deve contenere almeno una maiuscola, una minuscola e un numero.";
        }

        if (form.password !== form.confirmPassword) return "Le password non coincidono.";

        return null;
    };

    const onSubmit = (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);

        fetch("http://localhost:3001/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: form.username.trim(),
                password: form.password,
                email: form.email.trim(),
                name: form.name.trim(),
                surname: form.surname.trim(),
            }),
        })
            .then((res) => {
                if (res.ok) return { ok: true };

                return res
                    .json()
                    .then((data) => {
                        throw new Error(data.message || "Registrazione fallita");
                    })
                    .catch(() =>
                        res.text().then((text) => {
                            throw new Error(text || "Registrazione fallita");
                        })
                    );
            })
            .then(() => {
                setSuccess("Registrazione completata! Reindirizzamento al login...");
                setTimeout(() => navigate("/login"), 900);
            })
            .catch((err) => {
                setError(err.message || "Errore durante la registrazione.");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <main className="register-page">
            <section className="register-card" aria-labelledby="register-title">
                <div className="register-left">
                    <h1 id="register-title">Registrati</h1>
                    <p className="register-subtitle">
                        Crea il tuo profilo SkillSwap e inizia a scambiare competenze.
                    </p>

                    <p className="register-login-text">
                        Hai già un account?{" "}
                        <button
                            type="button"
                            className="register-login-link"
                            onClick={() => navigate("/login")}
                        >
                            Accedi
                        </button>
                    </p>
                </div>

                <form className="register-form" onSubmit={onSubmit}>
                    <div className="register-grid">
                        <div className="register-field">
                            <label htmlFor="username">Username</label>
                            <input
                                id="username"
                                name="username"
                                placeholder="Username"
                                value={form.username}
                                onChange={onChange}
                                disabled={loading}
                            />
                        </div>

                        <div className="register-field">
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Email"
                                value={form.email}
                                onChange={onChange}
                                disabled={loading}
                            />
                        </div>

                        <div className="register-field">
                            <label htmlFor="name">Nome</label>
                            <input
                                id="name"
                                name="name"
                                placeholder="Nome"
                                value={form.name}
                                onChange={onChange}
                                disabled={loading}
                            />
                        </div>

                        <div className="register-field">
                            <label htmlFor="surname">Cognome</label>
                            <input
                                id="surname"
                                name="surname"
                                placeholder="Cognome"
                                value={form.surname}
                                onChange={onChange}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="register-field">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={onChange}
                            disabled={loading}
                        />
                    </div>

                    <div className="register-field">
                        <label htmlFor="confirmPassword">Conferma password</label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="Conferma password"
                            value={form.confirmPassword}
                            onChange={onChange}
                            disabled={loading}
                        />
                    </div>

                    {error && <p className="register-error">{error}</p>}
                    {success && <p className="register-success">{success}</p>}

                    <button className="register-submit" type="submit" disabled={loading}>
                        {loading ? "Registrazione..." : "Registrati"}
                    </button>
                </form>
            </section>
        </main>
    );
}

export default Register;