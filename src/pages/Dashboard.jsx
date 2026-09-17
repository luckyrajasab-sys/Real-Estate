import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useUserProfile, useSavedListings } from "../api/users.js";
import { useUpdateProperty, useDeleteProperty } from "../api/properties.js";
import { useOffers, useRespondOffer } from "../api/offers.js";
import { useEnquiries, useReplyToEnquiry } from "../api/enquiries.js";
import PropertyCard from "../components/PropertyCard.jsx";
import CompareModal from "../components/CompareModal.jsx";
import { formatINR } from "../components/EMICalculator.jsx";

export default function Dashboard() {
  const { user } = useAuth();

  // Active Dashboard Tab: "listings" | "offers" | "enquiries" | "saved"
  const [activeTab, setActiveTab] = useState("listings");

  // Queries
  const { data: profileData, refetch: refetchProfile } = useUserProfile(user?.email || user?.id);
  const { data: saved = [] } = useSavedListings(user?.id);
  const { data: allOffers = [], refetch: refetchOffers } = useOffers();
  const { data: allEnquiries = [], refetch: refetchEnquiries } = useEnquiries({ ownerId: user?.id || "demo" });

  // Mutations
  const updateProperty = useUpdateProperty();
  const deleteProperty = useDeleteProperty();
  const respondOffer = useRespondOffer();
  const replyEnquiry = useReplyToEnquiry();

  // Compare selection state
  const [compareSelected, setCompareSelected] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Edit property modal state
  const [editingProp, setEditingProp] = useState(null);

  // Counter offer modal/input state
  const [counteringOfferId, setCounteringOfferId] = useState(null);
  const [counterAmt, setCounterAmt] = useState("");
  const [counterNote, setCounterNote] = useState("");

  // Enquiry reply state
  const [replyingEnqId, setReplyingEnqId] = useState(null);
  const [replyText, setReplyText] = useState("");

  // Deal Checklist completion states (persisted in session)
  const [closingChecklist, setClosingChecklist] = useState({
    agreement: true,
    tokenDeposit: true,
    taxClearance: false,
    handover: false,
  });

  const listings = profileData?.listings || [];

  // Filter offers received vs sent
  const receivedOffers = useMemo(() => {
    return allOffers.filter((o) => o.property?.ownerId === user?.id || !o.buyerId || o.buyerId !== user?.id);
  }, [allOffers, user]);

  const sentOffers = useMemo(() => {
    return allOffers.filter((o) => o.buyerId === user?.id || o.buyerEmail === user?.email);
  }, [allOffers, user]);

  // Handle comparison toggle
  function handleToggleCompare(prop) {
    setCompareSelected((prev) => {
      const exists = prev.find((p) => p.id === prop.id);
      if (exists) return prev.filter((p) => p.id !== prop.id);
      if (prev.length >= 3) {
        alert("You can compare up to 3 properties at a time.");
        return prev;
      }
      return [...prev, prop];
    });
  }

  // Handle property status change
  async function handleStatusChange(propId, newStatus) {
    try {
      await updateProperty.mutateAsync({ id: propId, status: newStatus });
      refetchProfile();
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  }

  // Handle property delete
  async function handleDeleteListing(propId) {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    try {
      await deleteProperty.mutateAsync(propId);
      refetchProfile();
    } catch (err) {
      alert("Failed to delete listing: " + err.message);
    }
  }

  // Handle respond to offer
  async function handleOfferAction(offerId, action, extra = {}) {
    try {
      await respondOffer.mutateAsync({
        id: offerId,
        action,
        counterAmount: extra.counterAmount,
        counterNote: extra.counterNote,
      });
      setCounteringOfferId(null);
      setCounterAmt("");
      setCounterNote("");
      refetchOffers();
      refetchProfile();
    } catch (err) {
      alert("Failed to respond to offer: " + err.message);
    }
  }

  // Handle reply to enquiry
  async function handleSendReply(enqId) {
    if (!replyText.trim()) return;
    try {
      await replyEnquiry.mutateAsync({ id: enqId, replyMessage: replyText });
      setReplyingEnqId(null);
      setReplyText("");
      refetchEnquiries();
    } catch (err) {
      alert("Failed to send reply: " + err.message);
    }
  }

  // Handle edit save
  async function handleSaveEdit(e) {
    e.preventDefault();
    if (!editingProp) return;
    try {
      await updateProperty.mutateAsync(editingProp);
      setEditingProp(null);
      refetchProfile();
    } catch (err) {
      alert("Failed to save changes: " + err.message);
    }
  }

  return (
    <div className="page dashboard-page">
      <div className="dashboard-header-row">
        <div>
          <span className="eyebrow-note">Account Portal</span>
          <h1>Welcome back, {user?.name?.split(" ")[0] || "Friend"}</h1>
          <p>Manage your listings, review offers, schedule visits, and track deals.</p>
        </div>
        <div>
          <Link to="/sell" className="btn btn-primary">
            + List New Property
          </Link>
        </div>
      </div>

      {/* Snapshot Stats */}
      <div className="stat-grid dashboard-stats">
        <div className="stat-item" onClick={() => setActiveTab("listings")} style={{ cursor: "pointer" }}>
          <div className="stat-num">{listings.length}</div>
          <div className="stat-label">Active listings</div>
        </div>
        <div className="stat-item" onClick={() => setActiveTab("offers")} style={{ cursor: "pointer" }}>
          <div className="stat-num">{receivedOffers.length + sentOffers.length}</div>
          <div className="stat-label">Offers in progress</div>
        </div>
        <div className="stat-item" onClick={() => setActiveTab("enquiries")} style={{ cursor: "pointer" }}>
          <div className="stat-num">{allEnquiries.length}</div>
          <div className="stat-label">Enquiries & visits</div>
        </div>
        <div className="stat-item" onClick={() => setActiveTab("saved")} style={{ cursor: "pointer" }}>
          <div className="stat-num">{saved.length}</div>
          <div className="stat-label">Saved homes</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="dashboard-tabs" role="tablist">
        <button
          className={`dash-tab-btn ${activeTab === "listings" ? "active" : ""}`}
          onClick={() => setActiveTab("listings")}
        >
          My Listings ({listings.length})
        </button>
        <button
          className={`dash-tab-btn ${activeTab === "offers" ? "active" : ""}`}
          onClick={() => setActiveTab("offers")}
        >
          Offers Hub ({receivedOffers.length + sentOffers.length})
        </button>
        <button
          className={`dash-tab-btn ${activeTab === "enquiries" ? "active" : ""}`}
          onClick={() => setActiveTab("enquiries")}
        >
          Enquiries & Visits ({allEnquiries.length})
        </button>
        <button
          className={`dash-tab-btn ${activeTab === "saved" ? "active" : ""}`}
          onClick={() => setActiveTab("saved")}
        >
          Saved Homes ({saved.length})
        </button>
      </div>

      {/* TAB 1: MY LISTINGS */}
      {activeTab === "listings" && (
        <section className="dashboard-section">
          <div className="section-head">
            <div>
              <h2 style={{ margin: 0 }}>Properties you've listed</h2>
              <p style={{ margin: "0.25rem 0 0", fontSize: "0.9rem" }}>
                Update pricing, transition status (Active, Under Offer, Sold), or manage closing steps.
              </p>
            </div>
            <Link to="/sell" className="btn btn-outline btn-sm">+ Add property</Link>
          </div>

          {listings.length ? (
            <div className="listing-manage-grid">
              {listings.map((prop) => (
                <div key={prop.id} className="card listing-manage-card">
                  <div className="listing-manage-header">
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span className={`status-pill status-${(prop.status || "ACTIVE").toLowerCase()}`}>
                          {prop.status === "UNDER_OFFER" ? "Under Offer" : prop.status === "SOLD" ? "Sold" : "Active"}
                        </span>
                        <span className="badge">{prop.type}</span>
                      </div>
                      <h3 className="listing-manage-title">{prop.title}</h3>
                      <div className="listing-manage-loc">{prop.location}</div>
                    </div>
                    <div className="listing-manage-price">{prop.price}</div>
                  </div>

                  {/* Actions row */}
                  <div className="listing-actions-strip">
                    <div className="status-selector-group">
                      <label htmlFor={`status-${prop.id}`} className="field-hint">Status:</label>
                      <select
                        id={`status-${prop.id}`}
                        value={prop.status || "ACTIVE"}
                        onChange={(e) => handleStatusChange(prop.id, e.target.value)}
                        className="status-dropdown"
                      >
                        <option value="ACTIVE">Active (Live)</option>
                        <option value="UNDER_OFFER">Under Offer</option>
                        <option value="SOLD">Sold</option>
                        <option value="DRAFT">Draft / Paused</option>
                      </select>
                    </div>

                    <div className="listing-btn-group">
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => setEditingProp(prop)}
                      >
                        Edit Details
                      </button>
                      <Link to={`/property/${prop.id}`} className="btn btn-outline btn-sm">
                        View Page
                      </Link>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteListing(prop.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Deal Closing Checklist (shown when UNDER_OFFER or SOLD) */}
                  {(prop.status === "UNDER_OFFER" || prop.status === "SOLD") && (
                    <div className="deal-closing-box">
                      <div className="deal-closing-head">
                        <span className="deal-closing-badge">Deal In Progress</span>
                        <h4>Deal Closing & Handover Checklist</h4>
                      </div>
                      <p className="deal-closing-sub">
                        Complete diligence steps and exchange documents to finalize the transaction.
                      </p>
                      <div className="checklist-items">
                        <label className="checklist-label">
                          <input
                            type="checkbox"
                            checked={closingChecklist.agreement}
                            onChange={(e) =>
                              setClosingChecklist((c) => ({ ...c, agreement: e.target.checked }))
                            }
                          />
                          <span><strong>Agreement of Sale drafted & signed:</strong> Verified bilateral contract.</span>
                        </label>
                        <label className="checklist-label">
                          <input
                            type="checkbox"
                            checked={closingChecklist.tokenDeposit}
                            onChange={(e) =>
                              setClosingChecklist((c) => ({ ...c, tokenDeposit: e.target.checked }))
                            }
                          />
                          <span><strong>Token & escrow payment received:</strong> Initial booking advance secured.</span>
                        </label>
                        <label className="checklist-label">
                          <input
                            type="checkbox"
                            checked={closingChecklist.taxClearance}
                            onChange={(e) =>
                              setClosingChecklist((c) => ({ ...c, taxClearance: e.target.checked }))
                            }
                          />
                          <span><strong>NOC & property tax clearance:</strong> Encumbrance certificates verified.</span>
                        </label>
                        <label className="checklist-label">
                          <input
                            type="checkbox"
                            checked={closingChecklist.handover}
                            onChange={(e) =>
                              setClosingChecklist((c) => ({ ...c, handover: e.target.checked }))
                            }
                          />
                          <span><strong>Possession handover & keys:</strong> Final registration completed at sub-registrar.</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>No listings yet</h3>
              <p>Publish your property for sale or rent to start receiving buyer visits and offers.</p>
              <Link to="/sell" className="btn btn-primary">List your first property</Link>
            </div>
          )}
        </section>
      )}

      {/* TAB 2: OFFERS HUB */}
      {activeTab === "offers" && (
        <section className="dashboard-section">
          <div className="section-head">
            <div>
              <h2 style={{ margin: 0 }}>Offers & Negotiations</h2>
              <p style={{ margin: "0.25rem 0 0", fontSize: "0.9rem" }}>
                Accept, counter, or decline purchase proposals directly without intermediaries.
              </p>
            </div>
          </div>

          <div className="offers-container">
            {/* Offers Received (Seller) */}
            <div className="offers-column">
              <h3>Offers Received on Your Listings ({receivedOffers.length})</h3>
              {receivedOffers.length ? (
                receivedOffers.map((offer) => (
                  <div key={offer.id} className="card offer-card">
                    <div className="offer-card-top">
                      <div>
                        <span className={`status-pill status-${offer.status.toLowerCase()}`}>
                          {offer.status}
                        </span>
                        <div className="offer-buyer-name">{offer.buyerName}</div>
                        <div className="offer-buyer-contact">
                          {offer.buyerPhone} {offer.buyerEmail ? `• ${offer.buyerEmail}` : ""}
                        </div>
                      </div>
                      <div className="offer-amount-badge">
                        {offer.amountDisplay || formatINR(offer.amount)}
                      </div>
                    </div>

                    <div className="offer-property-ref">
                      For: <strong>{offer.property?.title || "Property"}</strong> ({offer.property?.location})
                    </div>

                    {offer.message && (
                      <div className="offer-note-box">
                        "{offer.message}"
                      </div>
                    )}

                    {offer.counterNote && (
                      <div className="offer-counter-box">
                        <strong>Counter-Offer Sent:</strong> {offer.counterNote}
                      </div>
                    )}

                    {/* Action buttons if PENDING */}
                    {offer.status === "PENDING" && (
                      <div className="offer-actions-row">
                        {counteringOfferId === offer.id ? (
                          <div className="counter-form-box">
                            <label className="field-hint">Your Counter Price (₹)</label>
                            <input
                              type="number"
                              placeholder="e.g. 18000000"
                              value={counterAmt}
                              onChange={(e) => setCounterAmt(e.target.value)}
                              className="counter-input"
                            />
                            <label className="field-hint">Note to Buyer</label>
                            <input
                              type="text"
                              placeholder="e.g. Lowest acceptable price including parking."
                              value={counterNote}
                              onChange={(e) => setCounterNote(e.target.value)}
                              className="counter-input"
                            />
                            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() =>
                                  handleOfferAction(offer.id, "COUNTER", {
                                    counterAmount: counterAmt,
                                    counterNote: `Owner countered with ₹${Number(counterAmt).toLocaleString("en-IN")}. ${counterNote}`,
                                  })
                                }
                              >
                                Send Counter-Offer
                              </button>
                              <button
                                className="btn btn-outline btn-sm"
                                onClick={() => setCounteringOfferId(null)}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleOfferAction(offer.id, "ACCEPT")}
                            >
                              ✓ Accept Offer
                            </button>
                            <button
                              className="btn btn-outline btn-sm"
                              onClick={() => {
                                setCounteringOfferId(offer.id);
                                setCounterAmt(offer.amount);
                              }}
                            >
                              ⇄ Counter-Offer
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleOfferAction(offer.id, "REJECT")}
                            >
                              ✕ Decline
                            </button>
                          </>
                        )}
                      </div>
                    )}

                    {offer.status === "ACCEPTED" && (
                      <div className="offer-accepted-banner">
                        ✓ Offer Accepted! The listing is now marked Under Offer. Review the closing checklist.
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="empty-state" style={{ padding: "2rem" }}>
                  <p>No offers received yet.</p>
                </div>
              )}
            </div>

            {/* Offers Sent (Buyer) */}
            <div className="offers-column">
              <h3>Offers You've Made ({sentOffers.length})</h3>
              {sentOffers.length ? (
                sentOffers.map((offer) => (
                  <div key={offer.id} className="card offer-card">
                    <div className="offer-card-top">
                      <div>
                        <span className={`status-pill status-${offer.status.toLowerCase()}`}>
                          {offer.status}
                        </span>
                        <div className="offer-buyer-name">{offer.property?.title || "Home"}</div>
                        <div className="offer-buyer-contact">{offer.property?.location}</div>
                      </div>
                      <div className="offer-amount-badge">
                        {offer.amountDisplay || formatINR(offer.amount)}
                      </div>
                    </div>

                    {offer.counterNote && (
                      <div className="offer-counter-box" style={{ background: "var(--accent-soft)" }}>
                        <strong>Seller's Counter:</strong> {offer.counterNote}
                      </div>
                    )}

                    {offer.status === "COUNTERED" && (
                      <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleOfferAction(offer.id, "ACCEPT")}
                        >
                          Accept Counter-Offer
                        </button>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => handleOfferAction(offer.id, "REJECT")}
                        >
                          Decline
                        </button>
                      </div>
                    )}

                    {offer.status === "ACCEPTED" && (
                      <div className="offer-accepted-banner">
                        🎉 Offer Accepted! Next steps: proceed to token deposit and sale agreement.
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="empty-state" style={{ padding: "2rem" }}>
                  <p>You haven't submitted any offers yet.</p>
                  <Link to="/buy" className="btn btn-outline btn-sm">Explore Homes</Link>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* TAB 3: ENQUIRIES & VISITS */}
      {activeTab === "enquiries" && (
        <section className="dashboard-section">
          <div className="section-head">
            <div>
              <h2 style={{ margin: 0 }}>Buyer Enquiries & Site Visits</h2>
              <p style={{ margin: "0.25rem 0 0", fontSize: "0.9rem" }}>
                Direct inquiries and scheduled in-person visit appointments.
              </p>
            </div>
          </div>

          {allEnquiries.length ? (
            <div className="enquiry-list">
              {allEnquiries.map((enq) => (
                <div key={enq.id} className="card enquiry-card">
                  <div className="enquiry-card-head">
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <span className={`badge ${enq.type === "SITE_VISIT" ? "badge-visit" : ""}`}>
                        {enq.type === "SITE_VISIT" ? "📅 Site Visit" : "💬 Message"}
                      </span>
                      <span className={`status-pill status-${enq.status.toLowerCase()}`}>
                        {enq.status}
                      </span>
                    </div>
                    <div className="enquiry-time">
                      {new Date(enq.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="enquiry-sender-meta">
                    <strong>{enq.name}</strong> • <a href={`tel:${enq.phone}`}>{enq.phone}</a>
                    {enq.email && <span> • <a href={`mailto:${enq.email}`}>{enq.email}</a></span>}
                  </div>

                  <div className="enquiry-prop-ref">
                    Regarding: <strong>{enq.property?.title || "Property"}</strong> ({enq.property?.location})
                  </div>

                  {enq.type === "SITE_VISIT" && enq.visitDate && (
                    <div className="visit-scheduled-strip">
                      <span><strong>Requested Date:</strong> {enq.visitDate}</span>
                      {enq.visitTime && <span> • <strong>Slot:</strong> {enq.visitTime}</span>}
                    </div>
                  )}

                  <div className="enquiry-msg-text">
                    "{enq.message}"
                  </div>

                  {/* Existing Reply */}
                  {enq.replyMessage ? (
                    <div className="enquiry-reply-done">
                      <strong>Your Reply:</strong> {enq.replyMessage}
                    </div>
                  ) : replyingEnqId === enq.id ? (
                    <div className="enquiry-reply-box">
                      <textarea
                        rows="2"
                        placeholder="Type your response to the buyer…"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                      />
                      <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleSendReply(enq.id)}
                        >
                          Send Reply
                        </button>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => setReplyingEnqId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ marginTop: "0.75rem" }}>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => {
                          setReplyingEnqId(enq.id);
                          setReplyText("");
                        }}
                      >
                        Reply to Buyer
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>No enquiries yet</h3>
              <p>When buyers message you or book a site visit, they'll appear right here.</p>
            </div>
          )}
        </section>
      )}

      {/* TAB 4: SAVED HOMES & COMPARE */}
      {activeTab === "saved" && (
        <section className="dashboard-section">
          <div className="section-head">
            <div>
              <h2 style={{ margin: 0 }}>Saved Homes ({saved.length})</h2>
              <p style={{ margin: "0.25rem 0 0", fontSize: "0.9rem" }}>
                Select 2–3 homes and click Compare to evaluate specs side by side.
              </p>
            </div>
            {compareSelected.length >= 2 && (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setShowCompareModal(true)}
              >
                Compare Selected ({compareSelected.length})
              </button>
            )}
          </div>

          {saved.length ? (
            <div className="property-grid">
              {saved.map((prop) => (
                <PropertyCard
                  key={prop.id}
                  property={prop}
                  isSaved={true}
                  showCompare={true}
                  isSelectedForCompare={Boolean(compareSelected.find((p) => p.id === prop.id))}
                  onToggleCompare={handleToggleCompare}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>Nothing saved yet</h3>
              <p>Tap the heart on any listing to bookmark homes you like and compare them side by side.</p>
              <Link to="/buy" className="btn btn-outline">Browse Homes for Sale</Link>
            </div>
          )}
        </section>
      )}

      {/* Compare Modal */}
      {showCompareModal && (
        <CompareModal
          properties={compareSelected}
          onClose={() => setShowCompareModal(false)}
          onRemove={(id) => setCompareSelected((p) => p.filter((item) => item.id !== id))}
        />
      )}

      {/* Edit Property Details Modal */}
      {editingProp && (
        <div className="modal-overlay" onClick={() => setEditingProp(null)}>
          <div className="modal-content form-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 540 }}>
            <div className="modal-header">
              <h3 style={{ margin: 0 }}>Edit Property Details</h3>
              <button className="btn-icon" onClick={() => setEditingProp(null)}>✕</button>
            </div>
            <form onSubmit={handleSaveEdit}>
              <div className="field">
                <label>Listing Title</label>
                <input
                  required
                  value={editingProp.title}
                  onChange={(e) => setEditingProp({ ...editingProp, title: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Price Display</label>
                <input
                  required
                  value={editingProp.price}
                  onChange={(e) => setEditingProp({ ...editingProp, price: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Location</label>
                <input
                  required
                  value={editingProp.location}
                  onChange={(e) => setEditingProp({ ...editingProp, location: e.target.value })}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
                <div className="field">
                  <label>Beds</label>
                  <input
                    type="number"
                    min="0"
                    value={editingProp.beds}
                    onChange={(e) => setEditingProp({ ...editingProp, beds: Number(e.target.value) })}
                  />
                </div>
                <div className="field">
                  <label>Baths</label>
                  <input
                    type="number"
                    min="0"
                    value={editingProp.baths}
                    onChange={(e) => setEditingProp({ ...editingProp, baths: Number(e.target.value) })}
                  />
                </div>
                <div className="field">
                  <label>Area (sqft)</label>
                  <input
                    type="number"
                    min="0"
                    value={editingProp.area}
                    onChange={(e) => setEditingProp({ ...editingProp, area: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                <button className="btn btn-primary btn-block" type="submit">
                  Save Changes
                </button>
                <button
                  className="btn btn-outline btn-block"
                  type="button"
                  onClick={() => setEditingProp(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
