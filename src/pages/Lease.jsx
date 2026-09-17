import { useState, useEffect } from "react";
import PropertyCard from "../components/PropertyCard.jsx";
import CompareModal from "../components/CompareModal.jsx";

const LEASE_TYPES = ["All", "Villa", "Penthouse", "Studio", "1BHK", "2BHK", "3BHK", "4BHK+"];
const LEASE_TERMS = ["All", "1 Year Renewable", "1 to 3 Years", "2 to 5 Years", "3 Years Fixed"];

export default function Lease() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedTerm, setSelectedTerm] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [compareList, setCompareList] = useState([]);
  const [compareOpen, setCompareOpen] = useState(false);

  useEffect(() => {
    async function fetchLeaseProperties() {
      setLoading(true);
      try {
        const res = await fetch("/api/properties?type=Lease&limit=50");
        if (res.ok) {
          const data = await res.json();
          setProperties(data.properties || []);
        }
      } catch (err) {
        console.error("Failed to fetch lease properties:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaseProperties();
  }, []);

  const cities = ["All", ...new Set(properties.map((p) => p.city).filter(Boolean))];

  const filtered = properties.filter((p) => {
    if (selectedType !== "All" && p.propertyType?.toLowerCase() !== selectedType.toLowerCase()) {
      return false;
    }
    if (selectedCity !== "All" && p.city?.toLowerCase() !== selectedCity.toLowerCase()) {
      return false;
    }
    if (selectedTerm !== "All" && p.leaseTerm !== selectedTerm) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = (p.title + " " + p.location + " " + (p.city || "") + " " + (p.country || "")).toLowerCase();
      if (!match.includes(q)) return false;
    }
    return true;
  });

  function toggleCompare(prop) {
    if (compareList.some((p) => p.id === prop.id)) {
      setCompareList((prev) => prev.filter((p) => p.id !== prop.id));
    } else {
      if (compareList.length >= 3) {
        alert("You can compare up to 3 properties at a time.");
        return;
      }
      setCompareList((prev) => [...prev, prop]);
    }
  }

  return (
    <div className="page lease-page">
      {/* Lease Hero Header */}
      <div className="lease-hero-section">
        <div className="hero-glow" />
        <span className="badge-luxury">LONG TERM & CORPORATE RESIDENCES</span>
        <h1 className="page-heading" style={{ marginTop: "0.5rem" }}>
          Premium Residential & Executive Leases
        </h1>
        <p className="page-subheading" style={{ maxWidth: "680px", margin: "0.5rem auto 1.5rem" }}>
          Turnkey diplomatic residences, luxury villas, and multi-year corporate penthouses with pre-negotiated
          leasehold terms across premier global capitals.
        </p>

        {/* Global Search Bar */}
        <div className="lease-search-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search by city (New York, London, Dubai, Tokyo), building, or landmark..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="lease-search-input"
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery("")}>
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="lease-filters-toolbar">
        <div className="filter-group">
          <label>City / Country:</label>
          <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} className="filter-select">
            {cities.map((c) => (
              <option key={c} value={c}>
                {c === "All" ? "All Global Cities" : c}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Property Type:</label>
          <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="filter-select">
            {LEASE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t === "All" ? "All Housing Types" : t}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Lease Duration:</label>
          <select value={selectedTerm} onChange={(e) => setSelectedTerm(e.target.value)} className="filter-select">
            {LEASE_TERMS.map((term) => (
              <option key={term} value={term}>
                {term === "All" ? "Any Duration" : term}
              </option>
            ))}
          </select>
        </div>

        {compareList.length > 0 && (
          <button className="btn btn-primary btn-sm compare-floating-trigger" onClick={() => setCompareOpen(true)}>
            Compare ({compareList.length}/3)
          </button>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem 1rem", color: "var(--text-dim)" }}>
          <div className="spinner" style={{ margin: "0 auto 1rem" }} />
          Loading executive lease residences...
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-offers-state">
          <span style={{ fontSize: "2.5rem", display: "block", marginBottom: "0.5rem" }}>🏢</span>
          <h3>No matching lease properties found</h3>
          <p>Try clearing your search query or selecting a different city.</p>
          <button
            className="btn btn-outline"
            onClick={() => {
              setSelectedType("All");
              setSelectedCity("All");
              setSelectedTerm("All");
              setSearchQuery("");
            }}
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="property-grid">
          {filtered.map((prop) => (
            <div key={prop.id} style={{ position: "relative" }}>
              {prop.leaseTerm && (
                <div className="lease-term-tag">
                  <span>⏱️ {prop.leaseTerm}</span>
                </div>
              )}
              <PropertyCard property={prop} />
            </div>
          ))}
        </div>
      )}

      {compareOpen && (
        <CompareModal
          properties={compareList}
          onClose={() => setCompareOpen(false)}
          onRemove={(id) => setCompareList((p) => p.filter((item) => item.id !== id))}
        />
      )}
    </div>
  );
}
