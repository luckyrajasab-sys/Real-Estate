export default function About() {
  return (
    <div className="page">
      <div className="eyebrow-note">Our story</div>
      <h1 style={{ maxWidth: 560 }}>Homes are found by people, not algorithms alone.</h1>
      <p style={{ maxWidth: 620, fontSize: "1.05rem" }}>
        Offhome started as a simple idea: buying, selling or renting a home shouldn't involve
        endless calls, vague pricing or listings that vanish the moment you're interested. We built
        a portal where every listing is checked, every owner is verified by email, and every buyer
        can message directly — no detours.
      </p>

      <div className="stat-grid">
        <div className="stat-item"><div className="stat-num">2024</div><div className="stat-label">Founded</div></div>
        <div className="stat-item"><div className="stat-num">21</div><div className="stat-label">Cities</div></div>
        <div className="stat-item"><div className="stat-num">12,400+</div><div className="stat-label">Listings</div></div>
        <div className="stat-item"><div className="stat-num">40+</div><div className="stat-label">Team members</div></div>
      </div>

      <h2 style={{ marginTop: "2.5rem" }}>What we care about</h2>
      <div className="spec-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        <div className="spec-item">
          <div className="lbl" style={{ fontSize: "0.95rem", color: "var(--text)" }}>
            <strong>Verified listings.</strong> Every owner confirms their email before a listing goes live.
          </div>
        </div>
        <div className="spec-item">
          <div className="lbl" style={{ fontSize: "0.95rem", color: "var(--text)" }}>
            <strong>Clear pricing.</strong> No hidden brokerage fees buried in the fine print.
          </div>
        </div>
        <div className="spec-item">
          <div className="lbl" style={{ fontSize: "0.95rem", color: "var(--text)" }}>
            <strong>Direct contact.</strong> Message owners and buyers without a middleman.
          </div>
        </div>
      </div>
    </div>
  );
}
