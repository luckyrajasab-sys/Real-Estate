import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) {
      setError("Passwords don't match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Use at least 6 characters for your password.");
      return;
    }
    try {
      register({ name: form.name, email: form.email, password: form.password });
      navigate("/verify-email", { state: { email: form.email } });
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="page" style={{ display: "flex", alignItems: "center", minHeight: "80vh" }}>
      <div className="form-card">
        <h1 style={{ fontSize: "1.6rem", textAlign: "center" }}>Create your account</h1>
        <p style={{ textAlign: "center" }}>List properties, save homes, and message owners directly.</p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              autoComplete="name"
              required
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Your name"
            />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              placeholder="At least 6 characters"
            />
          </div>
          <div className="field">
            <label htmlFor="confirm">Confirm password</label>
            <input
              id="confirm"
              type="password"
              autoComplete="new-password"
              required
              value={form.confirm}
              onChange={(e) => update("confirm", e.target.value)}
              placeholder="Re-enter password"
            />
          </div>
          {error && <div className="field-error" style={{ marginBottom: "1rem" }}>{error}</div>}
          <button className="btn btn-primary btn-block" type="submit">Create account</button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.25rem", fontSize: "0.88rem" }}>
          Already have an account? <Link to="/login" style={{ color: "var(--wood)", fontWeight: 600 }}>Log in</Link>
        </p>
      </div>
    </div>
  );
}
