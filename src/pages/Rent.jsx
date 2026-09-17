import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PropertyCard from "../components/PropertyCard.jsx";
import { useProperties } from "../api/properties.js";

const filters = ["All", "Furnished", "Pet friendly", "Under ₹25,000"];

export default function Rent() {
  const [params] = useSearchParams();
  const [active, setActive] = useState("All");
  const [query, setQuery] = useState(params.get("q") || "");

  const queryParams = useMemo(() => {
    const p = { type: "Rent", q: query };
    if (active === "Furnished") p.tag = "Furnished";
    else if (active === "Pet friendly") p.tag = "Pet friendly";
    else if (active === "Under ₹25,000") p.maxPrice = 25000;
    return p;
  }, [query, active]);

  const { data: listings = [], isLoading } = useProperties(queryParams);

  return (
    <div className="page">
      <h1>Rent a home</h1>
      <p>Find move-in ready rentals with transparent monthly pricing.</p>

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
          <p>Finding rental homes matching your criteria…</p>
        </div>
      ) : listings.length ? (
        <div className="property-grid">
          {listings.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No rentals match your search</h3>
          <p>Try a different locality or clear your filters.</p>
        </div>
      )}
    </div>
  );
}
