import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Logo from "./Logo.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { useNotifications, useMarkNotificationRead } from "../api/notifications.js";

const icons = {
  home: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 11.5 12 4l9 7.5" /><path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
    </svg>
  ),
  buy: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
    </svg>
  ),
  rent: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  sell: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 12h8" />
    </svg>
  ),
  account: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4" /><path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" />
    </svg>
  ),
  bell: (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  sun: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  ),
  moon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" />
    </svg>
  ),
  menu: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  ),
  close: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  ),
};

export default function MobileNav({ onOpenDrawer }) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const { data: notifications = [] } = useNotifications(user?.id);
  const markRead = useMarkNotificationRead();
  const [showNotifs, setShowNotifs] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      {/* Mobile Top Header */}
      <header className="mobile-header">
        <NavLink to="/" className="mobile-header-brand" aria-label="Offhome Home">
          <Logo size={28} />
        </NavLink>

        <div className="mobile-header-actions">
          {/* Notifications button */}
          <button
            className="mobile-icon-btn"
            onClick={() => setShowNotifs(!showNotifs)}
            aria-label="Notifications"
            title="Notifications"
          >
            {icons.bell}
            {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
          </button>

          {/* Theme toggle */}
          <button
            className="mobile-icon-btn"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? icons.sun : icons.moon}
          </button>

          {/* Hamburger menu */}
          <button
            className="mobile-icon-btn mobile-menu-btn"
            onClick={onOpenDrawer}
            aria-label="Open navigation menu"
          >
            {icons.menu}
          </button>
        </div>
      </header>

      {/* Notifications Modal / Popover */}
      {showNotifs && (
        <>
          <div className="modal-backdrop" onClick={() => setShowNotifs(false)} />
          <div className="notif-popover">
            <div className="notif-header">
              <h3>Notifications</h3>
              <button
                className="btn-icon"
                onClick={() => setShowNotifs(false)}
                aria-label="Close notifications"
              >
                {icons.close}
              </button>
            </div>
            <div className="notif-body">
              {notifications.length ? (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={"notif-card" + (n.read ? " read" : " unread")}
                    onClick={() => {
                      if (!n.read) markRead.mutate(n.id);
                    }}
                  >
                    <div className="notif-title">{n.title}</div>
                    <div className="notif-text">{n.message}</div>
                    <div className="notif-time">
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="notif-empty">No new notifications</div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <nav className="bottom-nav" aria-label="Bottom Navigation">
        <NavLink
          to="/"
          className={({ isActive }) => "bottom-nav-item" + (isActive ? " active" : "")}
          end
        >
          <span className="bottom-nav-icon">{icons.home}</span>
          <span className="bottom-nav-label">Home</span>
        </NavLink>

        <NavLink
          to="/buy"
          className={({ isActive }) => "bottom-nav-item" + (isActive ? " active" : "")}
        >
          <span className="bottom-nav-icon">{icons.buy}</span>
          <span className="bottom-nav-label">Buy</span>
        </NavLink>

        <NavLink
          to="/rent"
          className={({ isActive }) => "bottom-nav-item" + (isActive ? " active" : "")}
        >
          <span className="bottom-nav-icon">{icons.rent}</span>
          <span className="bottom-nav-label">Rent</span>
        </NavLink>

        <NavLink
          to="/sell"
          className={({ isActive }) => "bottom-nav-item" + (isActive ? " active" : "")}
        >
          <span className="bottom-nav-icon">{icons.sell}</span>
          <span className="bottom-nav-label">Sell</span>
        </NavLink>

        <NavLink
          to={user ? "/dashboard" : "/login"}
          className={({ isActive }) =>
            "bottom-nav-item" + (isActive || location.pathname.startsWith("/profile") ? " active" : "")
          }
        >
          <span className="bottom-nav-icon">{icons.account}</span>
          <span className="bottom-nav-label">{user ? "Dashboard" : "Log in"}</span>
        </NavLink>
      </nav>
    </>
  );
}
