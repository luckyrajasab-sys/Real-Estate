import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      login(email, password);
      navigate(location.state?.from || "/dashboard");
    } catch (err) {
      if (err.needsVerification) {
        navigate("/verify-email", { state: { email } });
        return;
      }
      setError(err.message);
    }
  }

  return (
    <div className="page" style={{ display: "flex", alignItems: "center", minHeight: "80vh" }}>
      <div className="form-card">
        <h1 style={{ fontSize: "1.6rem", textAlign: "center" }}>Welcome back</h1>
        <p style={{ textAlign: "center" }}>Log in to manage your listings and saved homes.</p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          {error && <div className="field-error" style={{ marginBottom: "1rem" }}>{error}</div>}
          <button className="btn btn-primary btn-block" type="submit">Log in</button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.25rem", fontSize: "0.88rem" }}>
          New to Offhome? <Link to="/register" style={{ color: "var(--wood)", fontWeight: 600 }}>Create an account</Link>
        </p>
      </div>
    </div>
  );
}
