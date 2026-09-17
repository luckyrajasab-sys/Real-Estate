import { useState, useRef, useEffect } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "./Logo.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const WORLD_LOCATIONS = [
  { code: "ALL", name: "Worldwide", flag: "🌐" },
  { code: "US", city: "New York", name: "New York, USA", flag: "🇺🇸", currency: "USD" },
  { code: "GB", city: "London", name: "London, UK", flag: "🇬🇧", currency: "GBP" },
  { code: "AE", city: "Dubai", name: "Dubai, UAE", flag: "🇦🇪", currency: "AED" },
  { code: "JP", city: "Tokyo", name: "Tokyo, Japan", flag: "🇯🇵", currency: "JPY" },
  { code: "FR", city: "Paris", name: "Paris, France", flag: "🇫🇷", currency: "EUR" },
  { code: "SG", city: "Singapore", name: "Singapore", flag: "🇸🇬", currency: "USD" },
  { code: "AU", city: "Sydney", name: "Sydney, Australia", flag: "🇦🇺", currency: "AUD" },
  { code: "IN", city: "Mumbai", name: "Mumbai, India", flag: "🇮🇳", currency: "INR" },
  { code: "CH", city: "Geneva", name: "Geneva, Switzerland", flag: "🇨🇭", currency: "EUR" },
];

const CURRENCIES = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "AED", symbol: "AED" },
  { code: "JPY", symbol: "¥" },
  { code: "INR", symbol: "₹" },
];

function initials(name = "") {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase() || "U";
}

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locationMenuOpen, setLocationMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [selectedLoc, setSelectedLoc] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("offhome_selected_loc")) || WORLD_LOCATIONS[0];
    } catch {
      return WORLD_LOCATIONS[0];
    }
  });
  const [selectedCurrency, setSelectedCurrency] = useState(() => {
    return localStorage.getItem("offhome_currency") || "USD";
  });

  const locRef = useRef(null);
  const userRef = useRef(null);

  // Close popovers on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (locRef.current && !locRef.current.contains(e.target)) {
        setLocationMenuOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setLocationMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  function handleSelectLocation(loc) {
    setSelectedLoc(loc);
    localStorage.setItem("offhome_selected_loc", JSON.stringify(loc));
    if (loc.currency) {
      setSelectedCurrency(loc.currency);
      localStorage.setItem("offhome_currency", loc.currency);
    }
    setLocationMenuOpen(false);

    // If on browse pages, can update query
    if (loc.city) {
      navigate(`/buy?city=${encodeURIComponent(loc.city)}`);
    } else {
      navigate(`/buy`);
    }
  }

  function handleSelectCurrency(curr) {
    setSelectedCurrency(curr);
    localStorage.setItem("offhome_currency", curr);
    window.dispatchEvent(new CustomEvent("currencyChange", { detail: curr }));
  }

  function handleLogout() {
    logout();
    setUserMenuOpen(false);
    navigate("/");
  }

  return (
    <header className="top-navbar-container">
      {/* Luxury Ticker Bar */}
      <div className="top-ticker-bar">
        <div className="top-ticker-content">
          <span className="ticker-highlight">⚡ LIVE GLOBAL OFFERS:</span>
          <span>Limited flat slot allocations open in New York, London, Dubai & Tokyo — Reserve with 1-click token</span>
          <Link to="/live-offers" className="ticker-link">
            Explore Slots →
          </Link>
        </div>
      </div>

      {/* Main Top Navigation */}
      <nav className="top-navbar">
        <div className="top-navbar-inner">
          {/* Brand Logo */}
          <div className="navbar-brand-group">
            <Link to="/" className="navbar-brand">
              <Logo size={32} />
            </Link>
            <span className="navbar-badge">GLOBAL</span>
          </div>

          {/* Worldwide Location Dropdown Pill */}
          <div className="nav-dropdown-wrapper" ref={locRef}>
            <button
              className={`location-pill-btn ${locationMenuOpen ? "active" : ""}`}
              onClick={() => setLocationMenuOpen((v) => !v)}
              aria-label="Select Worldwide Location"
            >
              <span className="location-flag">{selectedLoc.flag}</span>
              <span className="location-name">{selectedLoc.name}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {locationMenuOpen && (
              <div className="navbar-dropdown-menu location-menu animate-dropdown">
                <div className="dropdown-header">Select Global Market</div>
                <div className="dropdown-scroll-list">
                  {WORLD_LOCATIONS.map((loc) => (
                    <button
                      key={loc.code}
                      className={`dropdown-item ${selectedLoc.code === loc.code ? "selected" : ""}`}
                      onClick={() => handleSelectLocation(loc)}
                    >
                      <span className="item-flag">{loc.flag}</span>
                      <span className="item-label">{loc.name}</span>
                      {loc.currency && <span className="item-currency">{loc.currency}</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Center Navigation Links */}
          <div className="nav-links-center">
            <NavLink
              to="/buy"
              className={({ isActive }) => "nav-item-link" + (isActive ? " active" : "")}
            >
              Buy
            </NavLink>
            <NavLink
              to="/rent"
              className={({ isActive }) => "nav-item-link" + (isActive ? " active" : "")}
            >
              Rent
            </NavLink>
            <NavLink
              to="/lease"
              className={({ isActive }) => "nav-item-link" + (isActive ? " active" : "")}
            >
              Lease
            </NavLink>
            <NavLink
              to="/live-offers"
              className={({ isActive }) => "nav-item-link live-offers-link" + (isActive ? " active" : "")}
            >
              <span className="live-pulse-dot" />
              Live Offers
            </NavLink>
            <NavLink
              to="/sell"
              className={({ isActive }) => "nav-item-link sell-link" + (isActive ? " active" : "")}
            >
              Sell Property
            </NavLink>
          </div>

          {/* Right Action Controls */}
          <div className="nav-actions-right">
            {/* Currency Switcher */}
            <div className="currency-selector">
              <select
                value={selectedCurrency}
                onChange={(e) => handleSelectCurrency(e.target.value)}
                className="currency-select"
                aria-label="Currency"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.symbol} {c.code}
                  </option>
                ))}
              </select>
            </div>

            {/* Dark / Light Mode Toggle */}
            <button
              className="navbar-icon-btn"
              onClick={toggleTheme}
              title={`Switch to ${theme === "dark" ? "Light" : "Dark"} mode`}
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" />
                </svg>
              )}
            </button>

            {/* User Profile or Login/Signup */}
            {user ? (
              <div className="nav-dropdown-wrapper" ref={userRef}>
                <button
                  className="user-nav-avatar-btn"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  aria-label="User profile menu"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="nav-user-img" />
                  ) : (
                    <span className="nav-user-initials">{initials(user.name)}</span>
                  )}
                  <span className="nav-user-firstname">{user.name.split(" ")[0]}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>

                {userMenuOpen && (
                  <div className="navbar-dropdown-menu user-menu animate-dropdown">
                    <div className="user-dropdown-info">
                      <div className="user-name-title">{user.name}</div>
                      <div className="user-email-subtitle">{user.email}</div>
                      {user.provider && (
                        <span className="user-provider-tag">
                          {user.provider === "GOOGLE" ? "Google Account" : user.provider === "APPLE" ? "Apple ID" : "Standard Account"}
                        </span>
                      )}
                    </div>
                    <div className="dropdown-divider" />
                    <Link to="/dashboard" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" />
                        <rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" />
                      </svg>
                      Dashboard & Deals
                    </Link>
                    <Link to="/profile" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="8" r="4" /><path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" />
                      </svg>
                      Account Profile
                    </Link>
                    <div className="dropdown-divider" />
                    <button className="dropdown-item logout-btn" onClick={handleLogout}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-btn-group">
                <Link to="/login" className="btn btn-sm btn-ghost">
                  Log in
                </Link>
                <Link to="/register" className="btn btn-sm btn-primary">
                  Sign up
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              className="navbar-hamburger-btn"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Menu */}
        {mobileMenuOpen && (
          <div className="mobile-navbar-drawer animate-slide-down">
            <div className="mobile-nav-section">
              <div className="mobile-section-label">Explore Worldwide</div>
              <div className="mobile-locations-chips">
                {WORLD_LOCATIONS.map((loc) => (
                  <button
                    key={loc.code}
                    className={`loc-chip ${selectedLoc.code === loc.code ? "active" : ""}`}
                    onClick={() => handleSelectLocation(loc)}
                  >
                    <span>{loc.flag}</span>
                    <span>{loc.city || loc.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mobile-nav-links">
              <NavLink to="/buy" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                Buy Homes & Villas
              </NavLink>
              <NavLink to="/rent" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                Rent Apartments & 1-4 BHK
              </NavLink>
              <NavLink to="/lease" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                Corporate & Residential Lease
              </NavLink>
              <NavLink to="/live-offers" className="mobile-nav-link highlight" onClick={() => setMobileMenuOpen(false)}>
                ⚡ Live Slot Offers (Limited)
              </NavLink>
              <NavLink to="/sell" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                List Your Property
              </NavLink>
              <NavLink to="/about" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                About Offhome
              </NavLink>
              <NavLink to="/contact" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                Contact Concierge
              </NavLink>
            </div>

            <div className="mobile-drawer-footer">
              {user ? (
                <>
                  <div className="mobile-user-row">
                    <span className="user-name">{user.name}</span>
                    <span className="user-email">{user.email}</span>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
                    <Link to="/dashboard" className="btn btn-outline btn-block" onClick={() => setMobileMenuOpen(false)}>
                      Dashboard
                    </Link>
                    <button className="btn btn-ghost btn-block" onClick={handleLogout}>
                      Log out
                    </button>
                  </div>
                </>
              ) : (
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <Link to="/login" className="btn btn-outline btn-block" onClick={() => setMobileMenuOpen(false)}>
                    Log in
                  </Link>
                  <Link to="/register" className="btn btn-primary btn-block" onClick={() => setMobileMenuOpen(false)}>
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
