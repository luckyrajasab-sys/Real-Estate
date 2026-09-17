import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Profile() {
  const { user, logout } = useAuth();
  const [name, setName] = useState(user.name);
  const [saved, setSaved] = useState(false);

  function handleSave(e) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="page">
      <h1>Profile settings</h1>
      <p>Update how you appear to owners and buyers on Offhome.</p>

      <div className="detail-grid">
        <div className="form-card" style={{ maxWidth: "none" }}>
          <form onSubmit={handleSave}>
            <div className="field">
              <label htmlFor="pname">Full name</label>
              <input id="pname" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="pemail">Email</label>
              <input id="pemail" value={user.email} disabled />
              <div className="field-hint">Contact support to change your email address.</div>
            </div>
            <div className="field">
              <label htmlFor="pphone">Phone number</label>
              <input id="pphone" placeholder="+91 " />
            </div>
            {saved && <div className="badge" style={{ marginBottom: "1rem" }}>Saved</div>}
            <button className="btn btn-primary btn-block" type="submit">Save changes</button>
          </form>
        </div>

        <div>
          <div className="card" style={{ padding: "1.5rem" }}>
            <h3 style={{ marginTop: 0 }}>Account</h3>
            <p>Your email is verified and your account is in good standing.</p>
            <button className="btn btn-danger btn-block" onClick={logout}>Log out</button>
          </div>
        </div>
      </div>
    </div>
  );
}
