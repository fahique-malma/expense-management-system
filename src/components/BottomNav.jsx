export default function BottomNav({ currentPage, onNavigate }) {
  const items = [
    {
      key: "home",
      label: "Home",
      icon: (
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      key: "transactions",
      label: "Transactions",
      icon: (
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
      ),
    },
    {
      key: "forecast",
      label: "Forecast",
      icon: (
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
    },
  ];

  return (
    <div className="bottom-nav">
      {items.map((it) => (
        <button
          key={it.key}
          className={"bottom-nav-item" + (currentPage === it.key ? " active" : "")}
          onClick={() => onNavigate(it.key)}
        >
          {it.icon}
          <span className="bottom-nav-label">{it.label}</span>
        </button>
      ))}
    </div>
  );
}
