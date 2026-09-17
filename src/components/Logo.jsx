export default function Logo({ size = 30, showWordmark = true }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
      <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
        <rect width="64" height="64" rx="14" fill="var(--text)" />
        <path
          d="M32 12 L54 30 H47 V50 H38 V36 H26 V50 H17 V30 H10 Z"
          fill="var(--wood)"
        />
        <circle cx="32" cy="40" r="4" fill="var(--text)" />
      </svg>
      {showWordmark && <span className="wordmark">Offhome</span>}
    </div>
  );
}
