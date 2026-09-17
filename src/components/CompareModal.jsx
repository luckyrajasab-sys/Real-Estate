import { Link } from "react-router-dom";
import { formatINR } from "./EMICalculator.jsx";

function calcPricePerSqft(priceNum, area) {
  if (!priceNum || !area) return "—";
  return `₹${Math.round(priceNum / area).toLocaleString("en-IN")}/sqft`;
}

export default function CompareModal({ properties = [], onClose, onRemove }) {
  if (!properties || properties.length === 0) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content compare-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="eyebrow-note">Decision Assistant</span>
            <h2 style={{ margin: 0 }}>Compare Homes ({properties.length})</h2>
          </div>
          <button className="btn-icon" onClick={onClose} aria-label="Close comparison">
            ✕
          </button>
        </div>

        <div className="compare-scroll-area">
          <table className="compare-table">
            <thead>
              <tr>
                <th className="compare-feature-col">Feature</th>
                {properties.map((p) => (
                  <th key={p.id} className="compare-prop-col">
                    <div className="compare-prop-header">
                      {onRemove && (
                        <button
                          className="compare-remove-btn"
                          onClick={() => onRemove(p.id)}
                          title="Remove from comparison"
                          aria-label={`Remove ${p.title}`}
                        >
                          ✕
                        </button>
                      )}
                      <div className="compare-media-thumb">
                        <span className="property-badge">{p.tag || p.type}</span>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M3 11.5 12 4l9 7.5" />
                          <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
                        </svg>
                      </div>
                      <div className="compare-prop-title">{p.title}</div>
                      <div className="compare-prop-price">{p.price}</div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="compare-feature-col">Property Type</td>
                {properties.map((p) => (
                  <td key={p.id}>{p.propertyType || p.type}</td>
                ))}
              </tr>
              <tr>
                <td className="compare-feature-col">Location</td>
                {properties.map((p) => (
                  <td key={p.id}>{p.location}</td>
                ))}
              </tr>
              <tr>
                <td className="compare-feature-col">Bedrooms</td>
                {properties.map((p) => (
                  <td key={p.id}>{p.beds} BHK</td>
                ))}
              </tr>
              <tr>
                <td className="compare-feature-col">Bathrooms</td>
                {properties.map((p) => (
                  <td key={p.id}>{p.baths} Baths</td>
                ))}
              </tr>
              <tr>
                <td className="compare-feature-col">Carpet Area</td>
                {properties.map((p) => (
                  <td key={p.id}>{p.area} sqft</td>
                ))}
              </tr>
              <tr>
                <td className="compare-feature-col">Rate / Sqft</td>
                {properties.map((p) => (
                  <td key={p.id}>{calcPricePerSqft(p.priceNum, p.area)}</td>
                ))}
              </tr>
              <tr>
                <td className="compare-feature-col">Status</td>
                {properties.map((p) => (
                  <td key={p.id}>
                    <span className={`status-badge status-${(p.status || "ACTIVE").toLowerCase()}`}>
                      {p.status === "UNDER_OFFER" ? "Under Offer" : p.status === "SOLD" ? "Sold" : "Available"}
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="compare-feature-col">Action</td>
                {properties.map((p) => (
                  <td key={p.id}>
                    <Link
                      to={`/property/${p.id}`}
                      className="btn btn-primary btn-sm btn-block"
                      onClick={onClose}
                    >
                      View Details
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
