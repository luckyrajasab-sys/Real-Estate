import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PropertyCard from "../components/PropertyCard.jsx";
import { useProperties } from "../api/properties.js";

const HOUSING_TYPES = ["All", "Villa", "Penthouse", "Studio", "1BHK", "2BHK", "3BHK", "4BHK+"];
const GLOBAL_CITIES = [
  "All",
  "New York",
  "London",
  "Dubai",
  "Tokyo",
  "Paris",
  "Singapore",
  "Sydney",
  "Mumbai",
  "Geneva",
  "Chennai",
  "Bangalore",
];

export default function Buy() {
  const [params] = useSearchParams();
  const [activeType, setActiveType] = useState("All");
  const [activeCity, setActiveCity] = useState("All");
  const [query, setQuery] = useState(params.get("q") || "");

  useEffect(() => {
    const urlCity = params.get("city");
    if (urlCity) setActiveCity(urlCity);
    const urlType = params.get("propertyType");
    if (urlType) setActiveType(urlType);
    const urlQ = params.get("q");
    if (urlQ) setQuery(urlQ);
  }, [params]);

  const queryParams = useMemo(() => {
    const p = { type: "Buy" };
    if (query) p.q = query;
    if (activeType !== "All") p.propertyType = activeType;
    if (activeCity !== "All") p.city = activeCity;
    return p;
  }, [query, activeType, activeCity]);

  const { data: listings = [], isLoading } = useProperties(queryParams);

  return (
    <div className="page">
      <div style={{ marginBottom: "1.5rem" }}>
        <span className="badge-luxury">WORLDWIDE ACQUISITIONS</span>
        <h1 style={{ marginTop: "0.35rem" }}>Buy Luxury Homes & Properties</h1>
        <p>Explore villas, penthouses, and residences across premier global capitals.</p>
      </div>

      <div className="search-bar" style={{ marginTop: "1rem" }}>
        <input
          placeholder="Search by city, neighbourhood, or residence name…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button className="btn btn-outline btn-sm" onClick={() => setQuery("")}>
            Clear
          </button>
        )}
      </div>

      {/* Global Cities Filter */}
      <div style={{ marginTop: "1.25rem" }}>
        <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase", marginBottom: "0.4rem" }}>
          Global Market:
        </div>
        <div className="filter-row" style={{ overflowX: "auto", paddingBottom: "0.25rem" }}>
          {GLOBAL_CITIES.map((c) => (
            <button
              key={c}
              className={"filter-chip" + (activeCity === c ? " active" : "")}
              onClick={() => setActiveCity(c)}
            >
              {c === "All" ? "🌐 All Worldwide" : c}
            </button>
          ))}
        </div>
      </div>

      {/* Housing Types Filter */}
      <div style={{ marginTop: "0.85rem" }}>
        <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase", marginBottom: "0.4rem" }}>
          Property Type:
        </div>
        <div className="filter-row">
          {HOUSING_TYPES.map((t) => (
            <button
              key={t}
              className={"filter-chip" + (activeType === t ? " active" : "")}
              onClick={() => setActiveType(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="empty-state" style={{ padding: "3rem" }}>
          <p>Finding worldwide homes matching your criteria…</p>
        </div>
      ) : listings.length ? (
        <div className="property-grid" style={{ marginTop: "2rem" }}>
          {listings.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      ) : (
        <div className="empty-state" style={{ marginTop: "2rem" }}>
          <h3>No properties match your current filters</h3>
          <p>Try selecting a different city or housing type.</p>
          <button
            className="btn btn-outline"
            onClick={() => {
              setActiveType("All");
              setActiveCity("All");
              setQuery("");
            }}
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}

