import { useState } from "react";

export default function Contact() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="page">
      <h1>Get in touch</h1>
      <p>Questions about a listing, your account, or partnering with Offhome — we read every message.</p>

      <div className="detail-grid">
        <div className="form-card" style={{ maxWidth: "none" }}>
          {sent ? (
            <div style={{ textAlign: "center" }}>
              <h3>Message sent</h3>
              <p>Thanks for reaching out — our team replies within one business day.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="cname">Name</label>
                <input id="cname" required placeholder="Your name" />
              </div>
              <div className="field">
                <label htmlFor="cemail">Email</label>
                <input id="cemail" type="email" required placeholder="you@example.com" />
              </div>
              <div className="field">
                <label htmlFor="ctopic">Topic</label>
                <select id="ctopic" defaultValue="general">
                  <option value="general">General enquiry</option>
                  <option value="listing">A specific listing</option>
                  <option value="account">Account help</option>
                  <option value="partner">Partnerships</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="cmsg">Message</label>
                <textarea id="cmsg" rows="4" required placeholder="How can we help?" />
              </div>
              <button className="btn btn-primary btn-block" type="submit">Send message</button>
            </form>
          )}
        </div>

        <div>
          <div className="card" style={{ padding: "1.5rem" }}>
            <h3 style={{ marginTop: 0 }}>Office</h3>
            <p>Offhome Technologies<br />Chennai, Tamil Nadu, India</p>
            <h3>Support</h3>
            <p>support@offhome.app<br />Mon–Sat, 9am–7pm IST</p>
          </div>
        </div>
      </div>
    </div>
  );
}
