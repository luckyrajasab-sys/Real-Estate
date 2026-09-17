import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useToggleSaved, useSavedListings } from "../api/users.js";

const heartIcon = (filled) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill={filled ? "var(--danger, #ef4444)" : "none"}
    stroke={filled ? "var(--danger, #ef4444)" : "currentColor"}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

export default function PropertyCard({
  property,
  isSaved: initialSaved,
  showCompare = false,
  isSelectedForCompare = false,
  onToggleCompare,
}) {
  const { user } = useAuth();
  const toggleSaved = useToggleSaved();
  const [savedLocal, setSavedLocal] = useState(() => {
    if (initialSaved !== undefined) return initialSaved;
    try {
      const savedIds = JSON.parse(localStorage.getItem("offhome-saved") || "[]");
      return savedIds.includes(property.id);
    } catch {
      return false;
    }
  });

  function handleSaveClick(e) {
    e.preventDefault();
    e.stopPropagation();

    const nextSaved = !savedLocal;
    setSavedLocal(nextSaved);

    // Update localStorage fallback
    try {
      let savedIds = JSON.parse(localStorage.getItem("offhome-saved") || "[]");
      if (nextSaved) {
        if (!savedIds.includes(property.id)) savedIds.push(property.id);
      } else {
        savedIds = savedIds.filter((id) => id !== property.id);
      }
      localStorage.setItem("offhome-saved", JSON.stringify(savedIds));
    } catch {
      // Ignored
    }

    if (user?.id) {
      toggleSaved.mutate({ propertyId: property.id, userId: user.id });
    }
  }

  const statusLabel =
    property.status === "UNDER_OFFER"
      ? "Under Offer"
      : property.status === "SOLD"
      ? "Sold"
      : null;

  return (
    <div className="card property-card-wrapper">
      <Link to={`/property/${property.id}`} className="property-card-link">
        <div className="property-media">
          <div className="property-badges-row">
            {statusLabel ? (
              <span className={`property-badge status-${(property.status || "").toLowerCase()}`}>
                {statusLabel}
              </span>
            ) : (
              <span className="property-badge">{property.tag || property.propertyType || property.type}</span>
            )}
          </div>

          {/* Heart Save Button */}
          <button
            className={`property-heart-btn ${savedLocal ? "saved" : ""}`}
            onClick={handleSaveClick}
            aria-label={savedLocal ? "Remove from saved homes" : "Save this home"}
            title={savedLocal ? "Saved" : "Save home"}
          >
            {heartIcon(savedLocal)}
          </button>

          {/* Icon placeholder or thumbnail */}
          <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 11.5 12 4l9 7.5" />
            <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
          </svg>
        </div>

        <div className="property-body">
          <div className="property-price-row">
            <div className="property-price">{property.price}</div>
            {property.propertyType && <span className="property-type-pill">{property.propertyType}</span>}
          </div>
          <div className="property-title">{property.title}</div>
          <div className="property-loc">{property.location}</div>
          <div className="property-meta">
            <span>{property.beds} bd</span>
            <span>{property.baths} ba</span>
            <span>{property.area} sqft</span>
          </div>
        </div>
      </Link>

      {showCompare && (
        <div className="property-card-compare-bar" onClick={(e) => e.stopPropagation()}>
          <label className="compare-checkbox-label">
            <input
              type="checkbox"
              checked={isSelectedForCompare}
              onChange={() => onToggleCompare && onToggleCompare(property)}
            />
            <span>Compare</span>
          </label>
        </div>
      )}
    </div>
  );
}
