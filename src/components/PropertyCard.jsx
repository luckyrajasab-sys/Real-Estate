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

  const imageMap = {
    Penthouse: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    Villa: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
    Studio: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    "1BHK": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
    "2BHK": "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
    "3BHK": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    "4BHK+": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
  };

  const cardImage = property.images
    ? (typeof property.images === "string" && property.images.startsWith("[")
        ? JSON.parse(property.images)[0]
        : property.images)
    : imageMap[property.propertyType] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80";

  return (
    <div className="card property-card-wrapper">
      <Link to={`/property/${property.id}`} className="property-card-link">
        <div className="property-media" style={{ height: "200px", position: "relative", overflow: "hidden" }}>
          <img
            src={cardImage}
            alt={property.title}
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />

          <div className="property-badges-row">
            {property.isFlashOffer ? (
              <span className="property-badge" style={{ background: "#EF4444", color: "#FFF", fontWeight: 700 }}>
                ⚡ {property.availableSlots || 0} SLOTS LEFT
              </span>
            ) : statusLabel ? (
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
        </div>

        <div className="property-body">
          <div className="property-price-row">
            <div className="property-price">{property.price}</div>
            {property.propertyType && <span className="property-type-pill">{property.propertyType}</span>}
          </div>
          <div className="property-title">{property.title}</div>
          <div className="property-loc">
            {property.city ? `${property.city} • ${property.location}` : property.location}
          </div>
          <div className="property-meta">
            <span>{property.beds} bd</span>
            <span>{property.baths} ba</span>
            <span>{property.area} sqft</span>
            {property.type && <span style={{ marginLeft: "auto", color: "var(--gold)", fontWeight: 600 }}>{property.type}</span>}
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
