export default function Nav({ userName, currentPage, onNavigate, onOpenProfile }) {
  const pages = ["home", "transactions", "forecast"];
  const labels = { home: "Home", transactions: "Transactions", forecast: "Forecast" };

  return (
    <nav>
      <div className="nav-brand">
        <div className="nav-avatar">W</div>
        <span className="nav-name">Wallet</span>
      </div>
      <div className="nav-links">
        {pages.map((p) => (
          <button
            key={p}
            className={"nav-link" + (currentPage === p ? " active" : "")}
            onClick={() => onNavigate(p)}
          >
            {labels[p]}
          </button>
        ))}
      </div>
      <button className="nav-icon-btn" onClick={onOpenProfile}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        </svg>
      </button>
    </nav>
  );
}
