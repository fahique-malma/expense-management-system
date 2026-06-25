import { fmt, formatDate } from "../utils/format";
import { CAT_COLORS, CAT_EMOJI } from "../data/categories";

export default function TransactionsPage({
  transactions,
  filter,
  onFilterChange,
  onAddTransaction,
  onEditTransaction,
  onDeleteTransaction,
  onAddTxAsBill,
}) {
  const list = filter === "all" ? transactions : transactions.filter((t) => t.type === filter);

  return (
    <div className="page active" id="page-transactions">
      <div className="page-header page-header-row">
        <div>
          <h1>Transactions</h1>
          <p>Track and categorize your expenses</p>
        </div>
        <button className="btn btn-primary" onClick={onAddTransaction}>
          + Add Transaction
        </button>
      </div>

      <div className="section-card">
        <div className="section-header">
          <div className="filter-bar">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ color: "var(--text3)", flexShrink: 0 }}
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            <div className="filter-tabs">
              {["all", "income", "expense"].map((f) => (
                <button
                  key={f}
                  className={"filter-tab" + (filter === f ? " active" : "")}
                  onClick={() => onFilterChange(f)}
                >
                  {f === "all" ? "All" : f[0].toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <span className="tx-count">
            {list.length} transaction{list.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div
          style={{
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 700,
            fontSize: "14px",
            padding: "2px 0 10px",
            color: "var(--text2)",
          }}
        >
          Recent Transactions
        </div>

        <div>
          {!list.length ? (
            <div className="empty-state">
              <div className="empty-icon">💸</div>
              <h3>No transactions</h3>
              <p>Add a transaction to get started</p>
            </div>
          ) : (
            list.map((tx) => (
              <div className="tx-item" key={tx.id}>
                <div className="tx-left">
                  <div className="tx-icon" style={{ background: (CAT_COLORS[tx.cat] || "#9ca3b0") + "22" }}>
                    {CAT_EMOJI[tx.cat] || "📦"}
                  </div>
                  <div className="tx-info">
                    <div className="tx-name">{tx.name}</div>
                    <div className="tx-cat">
                      {tx.cat} · {formatDate(tx.date)}
                    </div>
                  </div>
                </div>
                <div className="tx-right">
                  <div className={"tx-amount " + tx.type}>
                    {tx.type === "income" ? "+" : "-"}
                    {fmt(tx.amount)}
                  </div>
                  <div className="tx-actions">
                    {tx.type === "expense" && (
                      <button
                        className="btn btn-sm btn-orange"
                        title="Track as upcoming bill"
                        onClick={() => onAddTxAsBill(tx.id)}
                      >
                        🗓
                      </button>
                    )}
                    <button className="btn btn-sm btn-ghost" title="Edit" onClick={() => onEditTransaction(tx.id)}>
                      ✎
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      title="Delete"
                      onClick={() => onDeleteTransaction(tx.id)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
