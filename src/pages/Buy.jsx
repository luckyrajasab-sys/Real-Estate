import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PropertyCard from "../components/PropertyCard.jsx";
import { useProperties } from "../api/properties.js";

const filters = ["All", "Apartment", "Villa", "Under ₹1 Cr", "Ready to move"];

export default function Buy() {
  const [params] = useSearchParams();
  const [active, setActive] = useState("All");
  const [query, setQuery] = useState(params.get("q") || "");

  const queryParams = useMemo(() => {
    const p = { type: "Buy", q: query };
    if (active === "Apartment") p.propertyType = "Apartment";
    else if (active === "Villa") p.propertyType = "Villa";
    else if (active === "Under ₹1 Cr") p.maxPrice = 10000000;
    else if (active === "Ready to move") p.tag = "Ready to move";
    return p;
  }, [query, active]);

  const { data: listings = [], isLoading } = useProperties(queryParams);

  return (
    <div className="page">
      <h1>Buy a home</h1>
      <p>Browse verified properties for sale across the city.</p>

      <div className="search-bar" style={{ marginTop: "1rem" }}>
        <input
          placeholder="Search by locality or title…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn btn-outline">Filters</button>
      </div>

      <div className="filter-row" style={{ marginTop: "1.25rem" }}>
        {filters.map((f) => (
          <button
            key={f}
            className={"filter-chip" + (active === f ? " active" : "")}
            onClick={() => setActive(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="empty-state" style={{ padding: "3rem" }}>
          <p>Finding homes matching your criteria…</p>
        </div>
      ) : listings.length ? (
        <div className="property-grid">
          {listings.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No homes match your search</h3>
          <p>Try a different locality or clear your filters.</p>
        </div>
      )}
    </div>
  );
}
