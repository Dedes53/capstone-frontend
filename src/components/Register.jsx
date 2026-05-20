import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
                username: form.username,
                password: form.password,
                email: form.email,
                name: form.name,
                surname: form.surname,
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
        <section>
            <h1>Registrati</h1>

            <form onSubmit={onSubmit}>
                <input name="username" placeholder="Username" value={form.username} onChange={onChange} disabled={loading} />
                <input name="name" placeholder="Nome" value={form.name} onChange={onChange} disabled={loading} />
                <input name="surname" placeholder="Cognome" value={form.surname} onChange={onChange} disabled={loading} />
                <input name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} disabled={loading} />
                <input name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} disabled={loading} />
                <input
                    name="confirmPassword"
                    type="password"
                    placeholder="Conferma password"
                    value={form.confirmPassword}
                    onChange={onChange}
                    disabled={loading}
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Registrazione..." : "Registrati"}
                </button>
            </form>

            {error && <p style={{ color: "crimson" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}
        </section>
    );
}

export default Register;