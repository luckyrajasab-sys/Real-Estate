import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PropertyCard from "../components/PropertyCard.jsx";
import { useFeaturedProperties } from "../api/properties.js";

export default function Home() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [searchType, setSearchType] = useState("buy");
  const { data: featured = [], isLoading } = useFeaturedProperties();

  function handleSearch(e) {
    e.preventDefault();
    const target = searchType === "rent" ? "/rent" : "/buy";
    navigate(`${target}${q ? `?q=${encodeURIComponent(q)}` : ""}`);
  }

  return (
    <div className="page">
      <section className="hero">
        <div className="eyebrow-note">Chennai and beyond</div>
        <h1 style={{ fontSize: "2.4rem", maxWidth: 560 }}>A calmer way to buy, sell and rent a home.</h1>
        <p style={{ maxWidth: 520, fontSize: "1.05rem" }}>
          Offhome brings verified listings, straightforward pricing and real neighbourhood context
          into one place — so you can move forward with confidence.
        </p>

        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search by locality, e.g. Adyar, OMR, ECR…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
            <option value="buy">Buy</option>
            <option value="rent">Rent</option>
          </select>
          <button className="btn btn-primary" type="submit">Search homes</button>
        </form>

        <div className="stat-grid">
          <div className="stat-item">
            <div className="stat-num">12,400+</div>
            <div className="stat-label">Listings live</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">98%</div>
            <div className="stat-label">Verified owners</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">6 min</div>
            <div className="stat-label">Avg. agent reply</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">21</div>
            <div className="stat-label">Cities covered</div>
          </div>
        </div>
      </section>

      <div className="section-head">
        <h2 style={{ margin: 0 }}>Featured homes</h2>
        <a href="/buy" onClick={(e) => { e.preventDefault(); navigate("/buy"); }} style={{ color: "var(--accent)", fontWeight: 600, fontSize: "0.9rem" }}>
          View all listings
        </a>
      </div>
      <div className="property-grid">
        {isLoading ? (
          <div className="empty-state" style={{ gridColumn: "1 / -1", padding: "2rem" }}>
            <p>Loading curated homes…</p>
          </div>
        ) : (
          featured.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))
        )}
      </div>

      <div className="section-head">
        <h2 style={{ margin: 0 }}>How Offhome works</h2>
      </div>
      <div className="spec-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        <div className="spec-item">
          <div className="num">1</div>
          <div className="lbl">Search or list a home in minutes, with real photos and pricing.</div>
        </div>
        <div className="spec-item">
          <div className="num">2</div>
          <div className="lbl">Message verified owners or buyers directly — no middlemen guesswork.</div>
        </div>
        <div className="spec-item">
          <div className="num">3</div>
          <div className="lbl">Close the deal and track everything from your dashboard.</div>
        </div>
      </div>
    </div>
  );
}
