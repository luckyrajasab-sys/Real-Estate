import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login, loginWithGoogle, loginWithApple } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [socialLoading, setSocialLoading] = useState("");

  const destination = location.state?.from || "/dashboard";

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      login(email, password);
      navigate(destination);
    } catch (err) {
      if (err.needsVerification) {
        navigate("/verify-email", { state: { email } });
        return;
      }
      setError(err.message);
    }
  }

  async function handleGoogleLogin() {
    setError("");
    setSocialLoading("google");
    try {
      await loginWithGoogle();
      navigate(destination);
    } catch (err) {
      setError(err.message || "Failed to sign in with Google.");
    } finally {
      setSocialLoading("");
    }
  }

  async function handleAppleLogin() {
    setError("");
    setSocialLoading("apple");
    try {
      await loginWithApple();
      navigate(destination);
    } catch (err) {
      setError(err.message || "Failed to sign in with Apple.");
    } finally {
      setSocialLoading("");
    }
  }

  return (
    <div className="page" style={{ display: "flex", alignItems: "center", minHeight: "80vh" }}>
      <div className="form-card">
        <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
          <span className="badge-luxury" style={{ marginBottom: "0.5rem", display: "inline-block" }}>
            OFFHOME PRIME
          </span>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, margin: "0.25rem 0" }}>Welcome Back</h1>
          <p style={{ color: "var(--text-dim)", fontSize: "0.9rem" }}>
            Access premier worldwide listings and personal client dashboard.
          </p>
        </div>

        {/* Social Authentication */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
          <button
            type="button"
            className="btn btn-social btn-google"
            onClick={handleGoogleLogin}
            disabled={!!socialLoading}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            {socialLoading === "google" ? "Connecting to Google..." : "Continue with Google"}
          </button>

          <button
            type="button"
            className="btn btn-social btn-apple"
            onClick={handleAppleLogin}
            disabled={!!socialLoading}
          >
            <svg width="18" height="18" viewBox="0 0 170 170" fill="currentColor">
              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.08-7.7-7.93-12.01-14.55-6.09-9.35-11.06-20.08-14.9-32.18-3.84-12.1-5.76-23.7-5.76-34.8 0-15.02 3.7-27.42 11.1-37.21 7.4-9.79 16.7-14.85 27.9-15.17 5.11 0 10.5 1.25 16.18 3.76 5.68 2.51 9.4 3.82 11.17 3.92 1.41-.2 5.34-1.56 11.78-4.08 6.44-2.52 11.83-3.67 16.18-3.46 12.31.62 22.37 5.39 30.17 14.31-10.78 6.53-16.05 15.54-15.82 27.05.23 9.04 3.73 16.59 10.51 22.65 6.78 6.06 14.77 9.53 23.96 10.42-2.42 7.27-5.16 14.28-8.23 21.03zM119.22 33.3c0-7.17 2.61-13.88 7.83-20.13 5.22-6.25 11.75-10.37 19.59-12.37.54 2.29.81 4.5.81 6.64 0 6.96-2.73 13.8-8.19 20.52-5.46 6.72-12.12 10.74-19.98 12.06-.06-2.29-.06-4.53-.06-6.72z" />
            </svg>
            {socialLoading === "apple" ? "Connecting to Apple..." : "Continue with Apple"}
          </button>
        </div>

        <div className="form-divider">
          <span>OR SIGN IN WITH EMAIL</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">Email address</label>
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
          <button className="btn btn-primary btn-block" type="submit">Log In</button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.25rem", fontSize: "0.88rem", color: "var(--text-dim)" }}>
          New to Offhome? <Link to="/register" style={{ color: "var(--gold)", fontWeight: 600 }}>Create an account</Link>
        </p>
      </div>
    </div>
  );
}

