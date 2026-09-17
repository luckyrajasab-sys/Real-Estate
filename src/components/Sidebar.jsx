import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "./Logo.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const icons = {
  home: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 11.5 12 4l9 7.5" /><path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
    </svg>
  ),
  buy: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
    </svg>
  ),
  rent: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  sell: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  about: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" />
    </svg>
  ),
  contact: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16v16H4z" opacity="0" /><path d="m3 6 9 6 9-6" /><rect x="3" y="5" width="18" height="14" rx="2" />
    </svg>
  ),
  dashboard: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  ),
  profile: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4" /><path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" />
    </svg>
  ),
  login: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><path d="M10 17l5-5-5-5" /><path d="M15 12H3" />
    </svg>
  ),
  logout: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" />
    </svg>
  ),
  sun: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  ),
  moon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" />
    </svg>
  ),
  close: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  ),
};

function initials(name = "") {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase() || "U";
}

export default function Sidebar({ isOpen, onClose }) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [internalOpen, setInternalOpen] = useState(false);
  const navigate = useNavigate();

  const isDrawerOpen = isOpen !== undefined ? isOpen : internalOpen;
  const closeDrawer = () => {
    if (onClose) onClose();
    setInternalOpen(false);
  };

  const link = (to, icon, label) => (
    <NavLink
      to={to}
      className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}
      onClick={closeDrawer}
      end={to === "/"}
    >
      {icons[icon]} {label}
    </NavLink>
  );

  function handleLogout() {
    logout();
    closeDrawer();
    navigate("/");
  }

  return (
    <>
      {isDrawerOpen && <div className="sidebar-backdrop" onClick={closeDrawer} />}
      <aside className={"sidebar" + (isDrawerOpen ? " open" : "")}>
        <div className="sidebar-top">
          <NavLink to="/" className="sidebar-brand" onClick={closeDrawer}>
            <Logo size={32} />
          </NavLink>
          <button
            className="sidebar-close-btn"
            onClick={closeDrawer}
            aria-label="Close menu"
          >
            {icons.close}
          </button>
        </div>

        <nav className="sidebar-nav">
          {link("/", "home", "Home")}
          {link("/buy", "buy", "Buy")}
          {link("/rent", "rent", "Rent")}
          {link("/sell", "sell", "Sell")}

          <div className="sidebar-section-label">Company</div>
          {link("/about", "about", "About")}
          {link("/contact", "contact", "Contact")}

          {user && (
            <>
              <div className="sidebar-section-label">Account</div>
              {link("/dashboard", "dashboard", "Dashboard")}
              {link("/profile", "profile", "Profile")}
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <button className="theme-toggle" onClick={toggleTheme}>
            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {theme === "dark" ? icons.moon : icons.sun}
              {theme === "dark" ? "Dark mode" : "Bright mode"}
            </span>
            <span style={{ color: "var(--text-muted)" }}>Toggle</span>
          </button>

          {user ? (
            <>
              <div className="user-chip">
                <div className="user-avatar">{initials(user.name)}</div>
                <div className="user-chip-meta">
                  <div className="user-chip-name">{user.name}</div>
                  <div className="user-chip-email">{user.email}</div>
                </div>
              </div>
              <button className="btn btn-outline btn-block btn-sm" onClick={handleLogout}>
                {icons.logout} Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="btn btn-outline btn-block" onClick={closeDrawer}>
                {icons.login} Log in
              </NavLink>
              <NavLink to="/register" className="btn btn-primary btn-block" onClick={closeDrawer}>
                Sign up
              </NavLink>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
