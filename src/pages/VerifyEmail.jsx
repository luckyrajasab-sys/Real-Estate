import { useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function VerifyEmail() {
  const { verifyEmail, resendCode, lastCode } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const inputs = useRef([]);

  function handleChange(i, val) {
    if (!/^[0-9]?$/.test(val)) return;
    const next = [...digits];
    next[i] = val;
    setDigits(next);
    if (val && i < 5) inputs.current[i + 1]?.focus();
  }

  function handleKeyDown(i, e) {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      verifyEmail(email, digits.join(""));
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1400);
    } catch (err) {
      setError(err.message);
    }
  }

  function handleResend() {
    try {
      resendCode(email);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  if (!email) {
    return (
      <div className="page">
        <div className="empty-state">
          <h3>No email to verify</h3>
          <p>Start by creating an account.</p>
          <Link to="/register" className="btn btn-primary">Create account</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page" style={{ display: "flex", alignItems: "center", minHeight: "80vh" }}>
      <div className="form-card">
        <h1 style={{ fontSize: "1.5rem", textAlign: "center" }}>Verify your email</h1>
        <p style={{ textAlign: "center" }}>
          We sent a 6-digit code to <strong style={{ color: "var(--text)" }}>{email}</strong>.
        </p>

        {lastCode && (
          <div className="badge" style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
            Demo mode — your code is {lastCode}
          </div>
        )}

        {success ? (
          <p style={{ textAlign: "center", color: "var(--success)" }}>Email verified! Redirecting to login…</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="otp-inputs">
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => (inputs.current[i] = el)}
                  value={d}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  maxLength={1}
                  inputMode="numeric"
                />
              ))}
            </div>
            {error && <div className="field-error" style={{ marginBottom: "1rem" }}>{error}</div>}
            <button className="btn btn-primary btn-block" type="submit">Verify email</button>
          </form>
        )}

        <p style={{ textAlign: "center", marginTop: "1.25rem", fontSize: "0.88rem" }}>
          Didn't get a code?{" "}
          <button type="button" onClick={handleResend} style={{ background: "none", border: "none", color: "var(--wood)", fontWeight: 600, cursor: "pointer", padding: 0 }}>
            Resend it
          </button>
        </p>
      </div>
    </div>
  );
}
