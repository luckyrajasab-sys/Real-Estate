import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCreateProperty } from "../api/properties.js";

export default function Sell() {
  const { user } = useAuth();
  const createProperty = useCreateProperty();
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({
    title: "",
    type: "Apartment",
    listingType: "Buy",
    price: "",
    location: "",
    beds: "",
    baths: "",
    area: "",
    description: "",
  });

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");
    try {
      await createProperty.mutateAsync({
        title: form.title,
        type: form.listingType,
        propertyType: form.type,
        price: form.price,
        location: form.location,
        beds: form.beds,
        baths: form.baths,
        area: form.area,
        description: form.description,
        tag: "New listing",
        ownerId: user?.id || null,
        status: "ACTIVE",
      });
      setSubmitted(true);
    } catch (err) {
      setErrorMsg(err.message || "Failed to submit listing. Please try again.");
    }
  }

  if (!user) {
    return (
      <div className="page">
        <h1>List your property</h1>
        <p>Sign in to publish a listing — it only takes a minute and keeps listings trustworthy for buyers.</p>
        <div className="form-card" style={{ marginTop: "1.5rem", textAlign: "center" }}>
          <h3>You'll need an account</h3>
          <p>Create a free Offhome account to list a property for sale or rent.</p>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", marginTop: "1rem" }}>
            <Link to="/login" className="btn btn-outline">Log in</Link>
            <Link to="/register" className="btn btn-primary">Create account</Link>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="page">
        <div className="empty-state" style={{ borderStyle: "solid" }}>
          <h3>Listing submitted for review</h3>
          <p>Thanks, {user.name.split(" ")[0]} — "{form.title}" has been added to your dashboard as a draft.</p>
          <Link to="/dashboard" className="btn btn-primary">Go to dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>List your property</h1>
      <p>Give buyers or renters the details they need to say yes.</p>

      <form className="form-card" style={{ maxWidth: 640, textAlign: "left" }} onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="title">Listing title</label>
          <input id="title" required value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="e.g. Bright 2BHK near metro station" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div className="field">
            <label htmlFor="listingType">Listing type</label>
            <select id="listingType" value={form.listingType} onChange={(e) => update("listingType", e.target.value)}>
              <option>Buy</option>
              <option>Rent</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="propType">Property type</label>
            <select id="propType" value={form.type} onChange={(e) => update("type", e.target.value)}>
              <option>Apartment</option>
              <option>Villa</option>
              <option>Independent house</option>
              <option>Plot</option>
            </select>
          </div>
        </div>

        <div className="form-row-2">
          <div className="field">
            <label htmlFor="price">Price</label>
            <input
              id="price"
              required
              inputMode="text"
              value={form.price}
              onChange={(e) => update("price", e.target.value)}
              placeholder="₹85,00,000 or ₹25,000/mo"
            />
          </div>
          <div className="field">
            <label htmlFor="location">Location</label>
            <input
              id="location"
              required
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
              placeholder="Locality, City"
            />
          </div>
        </div>

        <div className="form-row-3">
          <div className="field">
            <label htmlFor="beds">Bedrooms</label>
            <input
              id="beds"
              type="number"
              inputMode="numeric"
              min="0"
              required
              value={form.beds}
              onChange={(e) => update("beds", e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="baths">Bathrooms</label>
            <input
              id="baths"
              type="number"
              inputMode="numeric"
              min="0"
              required
              value={form.baths}
              onChange={(e) => update("baths", e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="area">Area (sqft)</label>
            <input
              id="area"
              type="number"
              inputMode="numeric"
              min="0"
              required
              value={form.area}
              onChange={(e) => update("area", e.target.value)}
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="description">Description</label>
          <textarea id="description" rows="4" value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Tell buyers what makes this place worth seeing…" />
        </div>

        {errorMsg && (
          <p style={{ color: "var(--danger, #ef4444)", fontSize: "0.9rem", marginBottom: "0.75rem" }}>
            {errorMsg}
          </p>
        )}

        <button
          className="btn btn-primary btn-block"
          type="submit"
          disabled={createProperty.isPending}
        >
          {createProperty.isPending ? "Submitting listing…" : "Submit listing"}
        </button>
      </form>
    </div>
  );
}
