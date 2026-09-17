import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import PropertyCard from "../components/PropertyCard.jsx";
import { useFeaturedProperties } from "../api/properties.js";

const QUICK_CITIES = [
  { name: "New York", flag: "🇺🇸" },
  { name: "London", flag: "🇬🇧" },
  { name: "Dubai", flag: "🇦🇪" },
  { name: "Tokyo", flag: "🇯🇵" },
  { name: "Paris", flag: "🇫🇷" },
  { name: "Mumbai", flag: "🇮🇳" },
  { name: "Geneva", flag: "🇨🇭" },
];

export default function Home() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [searchType, setSearchType] = useState("buy");
  const { data: featured = [], isLoading } = useFeaturedProperties();

  function handleSearch(e) {
    e.preventDefault();
    let target = "/buy";
    if (searchType === "rent") target = "/rent";
    if (searchType === "lease") target = "/lease";
    navigate(`${target}${q ? `?q=${encodeURIComponent(q)}` : ""}`);
  }

  return (
    <div className="page">
      <section className="hero">
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
          <span className="badge-luxury">GLOBAL REAL ESTATE EXCHANGE</span>
          <span style={{ fontSize: "0.82rem", color: "var(--emerald)", fontWeight: 600 }}>● 100% Escrow Protected</span>
        </div>
        <h1 style={{ fontSize: " clamp(2.2rem, 4vw, 3.2rem)", maxWidth: 720 }}>
          Worldwide Luxury Residences, Penthouses & Villas.
        </h1>
        <p style={{ maxWidth: 640, fontSize: "1.1rem", lineHeight: 1.6 }}>
          Direct transactions across New York, London, Dubai, Tokyo, Paris, Singapore, and Mumbai with multi-currency
          settlement, live pre-market slot allocations, and executive leases.
        </p>

        {/* Global Search Bar */}
        <form className="search-bar" onSubmit={handleSearch} style={{ maxWidth: "760px" }}>
          <input
            type="text"
            placeholder="Search country, city (e.g. Dubai, Manhattan, Mayfair), or property type..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
            <option value="buy">Buy</option>
            <option value="rent">Rent</option>
            <option value="lease">Lease</option>
          </select>
          <button className="btn btn-primary" type="submit">Search Global</button>
        </form>

        {/* Quick Location Pills */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "1.25rem", alignItems: "center" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--text-dim)", fontWeight: 600 }}>POPULAR MARKETS:</span>
          {QUICK_CITIES.map((c) => (
            <button
              key={c.name}
              type="button"
              className="filter-chip"
              onClick={() => navigate(`/buy?city=${encodeURIComponent(c.name)}`)}
              style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
            >
              <span>{c.flag}</span>
              <span>{c.name}</span>
            </button>
          ))}
          <Link to="/live-offers" className="filter-chip" style={{ borderColor: "var(--gold)", color: "var(--gold)", fontWeight: 700 }}>
            ⚡ Live Slot Offers
          </Link>
        </div>

        {/* Global Stats */}
        <div className="stat-grid" style={{ marginTop: "2.5rem" }}>
          <div className="stat-item">
            <div className="stat-num">$6.4B+</div>
            <div className="stat-label">Worldwide Portfolio</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">48h</div>
            <div className="stat-label">Fast Token Allocation</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">100%</div>
            <div className="stat-label">Verified Deeds & Titles</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">14 Cities</div>
            <div className="stat-label">Global Direct Hubs</div>
          </div>
        </div>
      </section>

      {/* Featured Global Residences */}
      <div className="section-head" style={{ marginTop: "3.5rem" }}>
        <div>
          <h2 style={{ margin: 0 }}>Featured Global Residences</h2>
          <p style={{ margin: "0.25rem 0 0", fontSize: "0.9rem" }}>Curated penthouses, waterfront estates & prime metropolitan homes.</p>
        </div>
        <Link to="/buy" style={{ color: "var(--gold)", fontWeight: 600, fontSize: "0.92rem" }}>
          View All Worldwide Listings →
        </Link>
      </div>

      <div className="property-grid">
        {isLoading ? (
          <div className="empty-state" style={{ gridColumn: "1 / -1", padding: "2rem" }}>
            <p>Loading curated worldwide homes…</p>
          </div>
        ) : (
          featured.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))
        )}
      </div>

      {/* Live Flat Slots Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #111117 0%, #1A1A24 100%)",
          border: "1px solid var(--gold)",
          borderRadius: "var(--radius-lg)",
          padding: "2.5rem",
          margin: "4rem 0",
          color: "#EDE6DB",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1.5rem",
        }}
      >
        <div style={{ maxWidth: "620px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "#10B981", fontWeight: 700, fontSize: "0.82rem", marginBottom: "0.5rem" }}>
            <span className="live-pulse-dot" /> LIVE TIME-SENSITIVE ALLOCATIONS
          </div>
          <h2 style={{ color: "#FFF", fontSize: "1.8rem", margin: "0 0 0.5rem" }}>Pre-Market Flat Slots & Builder Allocations</h2>
          <p style={{ color: "#A2A2B2", margin: 0, fontSize: "0.95rem", lineHeight: 1.6 }}>
            Gain direct access to exclusive inventory before public launch. Reserve your priority token slot with zero obligation and lock guaranteed pre-market discounts.
          </p>
        </div>
        <Link to="/live-offers" className="btn btn-primary" style={{ padding: "0.85rem 1.75rem", fontSize: "1rem" }}>
          Explore Live Slots (Limited) →
        </Link>
      </div>

      {/* How It Works */}
      <div className="section-head">
        <h2 style={{ margin: 0 }}>The Offhome Global Advantage</h2>
      </div>
      <div className="spec-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        <div className="spec-item">
          <div className="num">1</div>
          <div className="lbl"><strong>Worldwide Multi-Currency</strong>: Inspect and acquire in USD, EUR, GBP, AED, JPY, or INR seamlessly.</div>
        </div>
        <div className="spec-item">
          <div className="num">2</div>
          <div className="lbl"><strong>Live Flat Allocation Slots</strong>: Instant 1-click token hold on high-demand global developments.</div>
        </div>
        <div className="spec-item">
          <div className="num">3</div>
          <div className="lbl"><strong>Full Deal Lifecycle</strong>: End-to-end site scheduling, offer counters, and verified title closure.</div>
        </div>
      </div>
    </div>
  );
}

