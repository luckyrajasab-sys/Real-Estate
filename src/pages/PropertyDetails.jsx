import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useProperty } from "../api/properties.js";
import { useCreateEnquiry } from "../api/enquiries.js";
import { useCreateOffer } from "../api/offers.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useToggleSaved } from "../api/users.js";
import EMICalculator, { formatINR } from "../components/EMICalculator.jsx";

const heartIcon = (filled) => (
  <svg
    width="20"
    height="20"
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

export default function PropertyDetails() {
  const { id } = useParams();
  const { data: property, isLoading, isError } = useProperty(id);
  const createEnquiry = useCreateEnquiry();
  const createOffer = useCreateOffer();
  const toggleSaved = useToggleSaved();
  const { user } = useAuth();

  // Action card mode: "message" | "visit" | "offer"
  const [actionTab, setActionTab] = useState("message");

  // Form states
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [email, setEmail] = useState(user?.email || "");
  const [message, setMessage] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [visitTime, setVisitTime] = useState("Morning (10 AM - 12 PM)");
  const [offerAmount, setOfferAmount] = useState("");

  // Result states
  const [submittedType, setSubmittedType] = useState(null); // "message" | "visit" | "offer"
  const [errorMsg, setErrorMsg] = useState("");

  // Save/Heart state
  const [isSaved, setIsSaved] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("offhome-saved") || "[]");
      return saved.includes(id);
    } catch {
      return false;
    }
  });

  function handleToggleSave() {
    const next = !isSaved;
    setIsSaved(next);
    try {
      let saved = JSON.parse(localStorage.getItem("offhome-saved") || "[]");
      if (next) {
        if (!saved.includes(id)) saved.push(id);
      } else {
        saved = saved.filter((sid) => sid !== id);
      }
      localStorage.setItem("offhome-saved", JSON.stringify(saved));
    } catch {}

    if (user?.id) {
      toggleSaved.mutate({ propertyId: id, userId: user.id });
    }
  }

  if (isLoading) {
    return (
      <div className="page">
        <div className="empty-state" style={{ padding: "4rem 2rem" }}>
          <h3>Loading property details…</h3>
          <p>Please wait while we retrieve the latest home information.</p>
        </div>
      </div>
    );
  }

  if (isError || !property) {
    return (
      <div className="page">
        <div className="empty-state">
          <h3>Listing not found</h3>
          <p>This property may have been sold or taken down.</p>
          <Link to="/buy" className="btn btn-primary">Browse listings</Link>
        </div>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");

    try {
      if (actionTab === "offer") {
        if (!offerAmount || Number(offerAmount) <= 0) {
          setErrorMsg("Please enter a valid offer amount.");
          return;
        }
        await createOffer.mutateAsync({
          propertyId: property.id,
          buyerId: user?.id || null,
          buyerName: name || user?.name || "Interested Buyer",
          buyerEmail: email || user?.email || null,
          buyerPhone: phone,
          amount: parseFloat(offerAmount),
          amountDisplay: formatINR(parseFloat(offerAmount)),
          message: message || `Offer of ${formatINR(parseFloat(offerAmount))} submitted for ${property.title}.`,
        });
        setSubmittedType("offer");
      } else {
        await createEnquiry.mutateAsync({
          propertyId: property.id,
          name: name || user?.name || "Interested Buyer",
          phone,
          email: email || user?.email || null,
          message: message || (actionTab === "visit" ? `Site visit requested for ${visitDate}` : `Hi, I'm interested in "${property.title}".`),
          userId: user?.id || null,
          type: actionTab === "visit" ? "SITE_VISIT" : "MESSAGE",
          visitDate: actionTab === "visit" ? visitDate : null,
          visitTime: actionTab === "visit" ? visitTime : null,
        });
        setSubmittedType(actionTab);
      }
    } catch (err) {
      setErrorMsg(err.message || "Action failed. Please try again.");
    }
  }

  const statusLabel =
    property.status === "UNDER_OFFER"
      ? "Under Offer"
      : property.status === "SOLD"
      ? "Sold"
      : null;

  return (
    <div className="page">
      <div className="property-header-row">
        <div>
          <div className="property-eyebrow">
            <span className="eyebrow-note">{property.type === "Buy" ? "For sale" : "For rent"}</span>
            {statusLabel && (
              <span className={`status-pill status-${property.status.toLowerCase()}`}>
                {statusLabel}
              </span>
            )}
          </div>
          <h1 className="property-headline">{property.title}</h1>
          <p className="property-subhead">{property.location}</p>
        </div>

        <div className="property-header-actions">
          <button
            className={`btn btn-outline btn-save-action ${isSaved ? "saved" : ""}`}
            onClick={handleToggleSave}
            aria-label={isSaved ? "Remove from saved" : "Save home"}
          >
            {heartIcon(isSaved)}
            <span>{isSaved ? "Saved" : "Save home"}</span>
          </button>
        </div>
      </div>

      <div className="detail-grid">
        {/* Left main column */}
        <div className="detail-main-col">
          <div className="property-media detail-hero-media">
            <span className="property-badge">{property.tag || property.propertyType}</span>
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 11.5 12 4l9 7.5" />
              <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
            </svg>
          </div>

          <div className="spec-grid">
            <div className="spec-item"><div className="num">{property.beds} BHK</div><div className="lbl">Bedrooms</div></div>
            <div className="spec-item"><div className="num">{property.baths}</div><div className="lbl">Bathrooms</div></div>
            <div className="spec-item"><div className="num">{property.area}</div><div className="lbl">Sqft living area</div></div>
            <div className="spec-item"><div className="num">{property.price}</div><div className="lbl">{property.type === "Buy" ? "Target price" : "Monthly rent"}</div></div>
          </div>

          <div className="card" style={{ padding: "1.5rem", marginTop: "1.5rem" }}>
            <h3 style={{ marginTop: 0 }}>About this property</h3>
            <p>
              {property.description ||
                `This ${property.type === "Buy" ? "home" : "rental"} in ${property.location} offers ${property.beds} bedrooms and ${property.area} sqft of thoughtfully planned space. It includes title verification and direct owner communications.`}
            </p>

            <div className="verified-strip">
              <div className="verified-item">
                <span className="verified-check">✓</span>
                <span>Verified ownership & clear title</span>
              </div>
              <div className="verified-item">
                <span className="verified-check">✓</span>
                <span>Zero brokerage hidden fees</span>
              </div>
              <div className="verified-item">
                <span className="verified-check">✓</span>
                <span>Direct negotiation with owner</span>
              </div>
            </div>
          </div>

          {/* EMI Loan Calculator (for Buy listings) */}
          {property.type === "Buy" && (
            <EMICalculator propertyPriceNum={property.priceNum} title={property.title} />
          )}
        </div>

        {/* Right side contact & offer panel */}
        <div className="detail-side-col">
          <div className="form-card action-panel-card">
            <div className="action-tabs-nav" role="tablist">
              <button
                type="button"
                className={`action-tab-btn ${actionTab === "message" ? "active" : ""}`}
                onClick={() => { setActionTab("message"); setSubmittedType(null); }}
              >
                Message
              </button>
              <button
                type="button"
                className={`action-tab-btn ${actionTab === "visit" ? "active" : ""}`}
                onClick={() => { setActionTab("visit"); setSubmittedType(null); }}
              >
                Site Visit
              </button>
              {property.type === "Buy" && (
                <button
                  type="button"
                  className={`action-tab-btn ${actionTab === "offer" ? "active" : ""}`}
                  onClick={() => { setActionTab("offer"); setSubmittedType(null); }}
                >
                  Make Offer
                </button>
              )}
            </div>

            {submittedType ? (
              <div className="action-success-box">
                <div className="success-icon-badge">✓</div>
                <h3>
                  {submittedType === "offer"
                    ? "Offer Submitted!"
                    : submittedType === "visit"
                    ? "Site Visit Requested!"
                    : "Message Sent!"}
                </h3>
                <p>
                  {submittedType === "offer"
                    ? `Your offer has been delivered to the owner. Track responses and counter-offers in your Dashboard.`
                    : submittedType === "visit"
                    ? `Your visit request for ${visitDate || "the upcoming weekend"} has been sent. The owner will confirm details.`
                    : "Your enquiry has been delivered. The owner typically replies within a few hours."}
                </p>
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => setSubmittedType(null)}
                  >
                    Send another
                  </button>
                  <Link to="/dashboard" className="btn btn-primary btn-sm">
                    View in Dashboard
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="action-panel-form">
                <div className="action-form-intro">
                  {actionTab === "message" && <p>Send a direct enquiry to the owner regarding availability or pricing.</p>}
                  {actionTab === "visit" && <p>Schedule an in-person walkthrough at a time convenient for you.</p>}
                  {actionTab === "offer" && <p>Submit a formal purchase offer directly to the seller for consideration.</p>}
                </div>

                {errorMsg && (
                  <div className="form-error-banner">
                    {errorMsg}
                  </div>
                )}

                {/* Offer specific fields */}
                {actionTab === "offer" && (
                  <div className="field">
                    <label htmlFor="offerAmt">Your Offer Amount (₹)</label>
                    <input
                      id="offerAmt"
                      type="number"
                      inputMode="numeric"
                      required
                      min="100000"
                      step="50000"
                      placeholder={`e.g. ${property.priceNum || 15000000}`}
                      value={offerAmount}
                      onChange={(e) => setOfferAmount(e.target.value)}
                    />
                    {offerAmount && Number(offerAmount) > 0 && (
                      <div className="field-hint" style={{ color: "var(--wood)", fontWeight: 600 }}>
                        Offer: {formatINR(Number(offerAmount))}
                      </div>
                    )}
                  </div>
                )}

                {/* Site visit specific fields */}
                {actionTab === "visit" && (
                  <div className="visit-fields-row">
                    <div className="field">
                      <label htmlFor="visitDate">Preferred Date</label>
                      <input
                        id="visitDate"
                        type="date"
                        required
                        min={new Date().toISOString().split("T")[0]}
                        value={visitDate}
                        onChange={(e) => setVisitDate(e.target.value)}
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="visitTime">Time Window</label>
                      <select
                        id="visitTime"
                        value={visitTime}
                        onChange={(e) => setVisitTime(e.target.value)}
                      >
                        <option>Morning (10 AM - 12 PM)</option>
                        <option>Afternoon (2 PM - 4 PM)</option>
                        <option>Evening (5 PM - 7 PM)</option>
                        <option>Weekend Flexible</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="field">
                  <label htmlFor="actName">Your Name</label>
                  <input
                    id="actName"
                    required
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="field">
                  <label htmlFor="actPhone">Phone Number</label>
                  <input
                    id="actPhone"
                    type="tel"
                    inputMode="tel"
                    required
                    placeholder="+91 98400 00000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="field">
                  <label htmlFor="actMsg">
                    {actionTab === "offer" ? "Terms & Note to Seller (Optional)" : "Note / Questions"}
                  </label>
                  <textarea
                    id="actMsg"
                    rows="3"
                    value={message}
                    placeholder={
                      actionTab === "offer"
                        ? "e.g. Pre-approved loan in hand, can close in 30 days."
                        : actionTab === "visit"
                        ? "Any specific details you'd like to inspect (e.g. parking, terrace)."
                        : `Hi, I'm interested in "${property.title}". Is it still available?`
                    }
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <button
                  className="btn btn-primary btn-block"
                  type="submit"
                  disabled={createEnquiry.isPending || createOffer.isPending}
                >
                  {createEnquiry.isPending || createOffer.isPending
                    ? "Submitting…"
                    : actionTab === "offer"
                    ? "Submit Purchase Offer"
                    : actionTab === "visit"
                    ? "Request Site Visit"
                    : "Send Enquiry"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
