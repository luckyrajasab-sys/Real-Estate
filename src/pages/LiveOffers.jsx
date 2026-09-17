import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// Countdown timer helper
function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(targetDate));

  function calculateTimeLeft(date) {
    const diff = new Date(date).getTime() - new Date().getTime();
    if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0, expired: true };
    return {
      hours: Math.floor(diff / (1000 * 60 * 60)),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      expired: false,
    };
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

function LiveOfferCard({ property, onReserve }) {
  const timeLeft = useCountdown(property.flashExpiresAt || new Date(Date.now() + 36 * 3600000));
  const percentClaimed = Math.round(
    (((property.totalSlots || 5) - (property.availableSlots || 0)) / (property.totalSlots || 5)) * 100
  );

  return (
    <div className="live-offer-card">
      <div className="live-card-badge-row">
        <div className="flash-badge">
          <span className="flash-dot" />
          FLASH ALLOCATION {property.discountPercent ? `• -${property.discountPercent}% OFF` : ""}
        </div>
        <div className="live-timer">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span>
            {String(timeLeft.hours).padStart(2, "0")}h : {String(timeLeft.minutes).padStart(2, "0")}m :{" "}
            {String(timeLeft.seconds).padStart(2, "0")}s
          </span>
        </div>
      </div>

      <div className="live-card-image-wrapper">
        <img
          src={
            property.images
              ? JSON.parse(property.images)[0]
              : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
          }
          alt={property.title}
          className="live-card-img"
          loading="lazy"
        />
        <div className="live-card-city-tag">
          {property.city}, {property.country || "Worldwide"}
        </div>
      </div>

      <div className="live-card-body">
        <div className="live-card-type-row">
          <span className="prop-type-badge">{property.propertyType || "Apartment"}</span>
          <span className="prop-tx-badge">{property.type}</span>
          <span className="prop-bed-badge">{property.beds} Beds • {property.baths} Baths</span>
        </div>

        <h3 className="live-card-title">{property.title}</h3>
        <p className="live-card-desc">{property.description}</p>

        {/* Scarcity meter */}
        <div className="scarcity-box">
          <div className="scarcity-header">
            <span className="scarcity-label">
              <strong style={{ color: "var(--gold)" }}>{property.availableSlots || 0}</strong> of{" "}
              {property.totalSlots || 5} slots left
            </span>
            <span className="scarcity-claim-rate">{percentClaimed}% Claimed</span>
          </div>
          <div className="scarcity-bar">
            <div className="scarcity-fill" style={{ width: `${percentClaimed}%` }} />
          </div>
        </div>

        <div className="live-card-footer">
          <div className="live-price-group">
            <div className="live-price-label">Priority Offer Price</div>
            <div className="live-price-val">{property.price}</div>
          </div>

          <button
            className="btn btn-primary live-reserve-btn"
            disabled={property.availableSlots <= 0}
            onClick={() => onReserve(property)}
          >
            {property.availableSlots > 0 ? "⚡ Reserve Slot" : "Sold Out"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LiveOffers() {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState("ALL");
  const [selectedType, setSelectedType] = useState("ALL");
  const [reserveModalProp, setReserveModalProp] = useState(null);
  const [bookingState, setBookingState] = useState({ name: user?.name || "", email: user?.email || "", phone: "" });
  const [bookingStatus, setBookingStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchLiveOffers() {
      setLoading(true);
      try {
        const res = await fetch("/api/properties?isFlashOffer=true&limit=50");
        if (res.ok) {
          const data = await res.json();
          setProperties(data.properties || []);
        }
      } catch (e) {
        console.error("Failed to load flash offers:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchLiveOffers();
  }, []);

  const filteredProperties = properties.filter((p) => {
    if (selectedCity !== "ALL" && p.city?.toLowerCase() !== selectedCity.toLowerCase()) {
      return false;
    }
    if (selectedType !== "ALL" && p.propertyType?.toLowerCase() !== selectedType.toLowerCase()) {
      return false;
    }
    return true;
  });

  async function handleConfirmReservation(e) {
    e.preventDefault();
    if (!reserveModalProp) return;
    setSubmitting(true);
    setBookingStatus(null);

    try {
      const res = await fetch(`/api/properties/${reserveModalProp.id}/reserve-slot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: bookingState.name,
          userEmail: bookingState.email,
          userPhone: bookingState.phone,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setBookingStatus({ success: true, message: data.message });
        // Update local property availableSlots
        setProperties((prev) =>
          prev.map((p) =>
            p.id === reserveModalProp.id ? { ...p, availableSlots: data.remainingSlots } : p
          )
        );
        setTimeout(() => {
          setReserveModalProp(null);
          setBookingStatus(null);
        }, 2200);
      } else {
        setBookingStatus({ success: false, message: data.error || "Reservation could not be completed." });
      }
    } catch (err) {
      setBookingStatus({ success: false, message: err.message || "Failed to book slot." });
    } finally {
      setSubmitting(false);
    }
  }

  const cities = ["ALL", ...new Set(properties.map((p) => p.city).filter(Boolean))];
  const types = ["ALL", "Villa", "Penthouse", "Studio", "1BHK", "2BHK", "3BHK", "4BHK+"];

  return (
    <div className="page live-offers-page">
      {/* Hero Header */}
      <div className="live-offers-hero">
        <div className="hero-glow" />
        <div className="live-hero-badge">
          <span className="live-ping-dot" />
          REAL-TIME WORLDWIDE FLAT ALLOCATIONS
        </div>
        <h1 className="live-hero-title">Live Flat Slots & Flash Offers</h1>
        <p className="live-hero-sub">
          Lock in pre-market builder allocations, distressed penthouse deals, and luxury villa slots across New York,
          London, Dubai, Tokyo, and Mumbai before public listing.
        </p>

        {/* Filter Controls */}
        <div className="live-filter-bar">
          <div className="filter-chip-group">
            <span className="filter-label">City:</span>
            {cities.map((city) => (
              <button
                key={city}
                className={`pill-filter-btn ${selectedCity === city ? "active" : ""}`}
                onClick={() => setSelectedCity(city)}
              >
                {city === "ALL" ? "All Locations" : city}
              </button>
            ))}
          </div>

          <div className="filter-chip-group">
            <span className="filter-label">Type:</span>
            {types.map((type) => (
              <button
                key={type}
                className={`pill-filter-btn ${selectedType === type ? "active" : ""}`}
                onClick={() => setSelectedType(type)}
              >
                {type === "ALL" ? "All Housing" : type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Live Slots */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem 1rem", color: "var(--text-dim)" }}>
          <div className="spinner" style={{ margin: "0 auto 1rem" }} />
          Loading worldwide live flash slots...
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="empty-offers-state">
          <span style={{ fontSize: "2.5rem", display: "block", marginBottom: "0.5rem" }}>⚡</span>
          <h3>No Live Slot Matches Right Now</h3>
          <p>Try clearing filters to see active slots worldwide.</p>
          <button
            className="btn btn-outline"
            onClick={() => {
              setSelectedCity("ALL");
              setSelectedType("ALL");
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="live-offers-grid">
          {filteredProperties.map((prop) => (
            <LiveOfferCard
              key={prop.id}
              property={prop}
              onReserve={(p) => {
                setReserveModalProp(p);
                setBookingStatus(null);
              }}
            />
          ))}
        </div>
      )}

      {/* Slot Reservation Modal */}
      {reserveModalProp && (
        <div className="modal-overlay" onClick={() => setReserveModalProp(null)}>
          <div className="modal-content live-reserve-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="badge-luxury">PRIORITY SLOT RESERVATION</span>
                <h2 style={{ fontSize: "1.35rem", margin: "0.35rem 0 0" }}>{reserveModalProp.title}</h2>
                <div style={{ color: "var(--text-dim)", fontSize: "0.88rem" }}>
                  {reserveModalProp.location} • {reserveModalProp.price}
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setReserveModalProp(null)}>
                ✕
              </button>
            </div>

            <div className="reserve-benefits-box">
              <div className="benefit-item">
                <span className="benefit-icon">🔒</span>
                <span>Locks offer price for 72 hours</span>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">💎</span>
                <span>Direct developer / owner priority desk</span>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">🛡️</span>
                <span>Zero obligation token hold</span>
              </div>
            </div>

            {bookingStatus ? (
              <div
                className={`booking-status-notice ${bookingStatus.success ? "success" : "error"}`}
                style={{ padding: "1.25rem", borderRadius: "10px", margin: "1rem 0", textAlign: "center" }}
              >
                <div style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>
                  {bookingStatus.success ? "🎉" : "⚠️"}
                </div>
                <strong>{bookingStatus.message}</strong>
              </div>
            ) : (
              <form onSubmit={handleConfirmReservation} style={{ marginTop: "1rem" }}>
                <div className="field">
                  <label>Full Name</label>
                  <input
                    required
                    value={bookingState.name}
                    onChange={(e) => setBookingState((s) => ({ ...s, name: e.target.value }))}
                    placeholder="Julian Sterling"
                  />
                </div>
                <div className="field">
                  <label>Email Address for Reservation Token</label>
                  <input
                    type="email"
                    required
                    value={bookingState.email}
                    onChange={(e) => setBookingState((s) => ({ ...s, email: e.target.value }))}
                    placeholder="julian@example.com"
                  />
                </div>
                <div className="field">
                  <label>Direct Phone / WhatsApp</label>
                  <input
                    type="tel"
                    required
                    value={bookingState.phone}
                    onChange={(e) => setBookingState((s) => ({ ...s, phone: e.target.value }))}
                    placeholder="+1 (555) 234-5678"
                  />
                </div>

                <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem" }}>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setReserveModalProp(null)}
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                    style={{ flex: 2 }}
                  >
                    {submitting ? "Securing Slot..." : "Confirm & Lock Slot"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
