import AnimatedNumber from "./AnimatedNumber";
import { fmt, formatDate, getBalance, getTotalExpense, getTotalIncome, todayISO } from "../utils/format";
import { CAT_EMOJI } from "../data/categories";

export default function HomePage({ userName, transactions, bills, onAddBill, onEditBill, onPayBill, onDeleteBill }) {
  const balance = getBalance(transactions);
  const income = getTotalIncome(transactions);
  const expense = getTotalExpense(transactions);
  const todayStr = todayISO();
  const sortedBills = [...bills].sort((a, b) => a.due.localeCompare(b.due));

  return (
    <div className="page active" id="page-home">
      <div className="home-h1">{userName}</div>
      <div className="home-sub">Here's your financial snapshot for today</div>

      <div className="balance-card">
        <div className="balance-label">Current Balance</div>
        <AnimatedNumber value={balance} className="balance-amount" />
        <div className="balance-date">
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card income">
          <div className="stat-icon" style={{ background: "var(--green-soft)" }}>
            ↗
          </div>
          <div className="stat-info">
            <div className="label">Income</div>
            <AnimatedNumber value={income} className="amount" />
          </div>
        </div>
        <div className="stat-card expense">
          <div className="stat-icon" style={{ background: "var(--red-soft)" }}>
            ↘
          </div>
          <div className="stat-info">
            <div className="label">Expenses</div>
            <AnimatedNumber value={expense} className="amount" />
          </div>
        </div>
      </div>

      <div className="section-card">
        <div className="section-header">
          <div className="section-title">
            <span style={{ fontSize: "18px" }}>🗓️</span>
            <div>
              <h2>Upcoming Bills</h2>
              <div className="sub">
                {bills.length} bill{bills.length !== 1 ? "s" : ""}
              </div>
            </div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={onAddBill}>
            + Add Bill
          </button>
        </div>

        <div>
          {!bills.length ? (
            <div className="empty-state">
              <div className="empty-icon">🗓️</div>
              <h3>No upcoming bills</h3>
              <p>Tap "Add Bill" to track your next payment</p>
            </div>
          ) : (
            sortedBills.map((b) => {
              const overdue = b.due < todayStr;
              return (
                <div className="bill-item" key={b.id}>
                  <div className="bill-left">
                    <div className="bill-icon-wrap">{CAT_EMOJI[b.cat] || "📦"}</div>
                    <div style={{ minWidth: 0 }}>
                      <div className="bill-name">
                        {b.name}
                        {b.recurring && <span className="bill-tag"> ↻ monthly</span>}
                      </div>
                      <div className={"bill-due" + (overdue ? " overdue" : "")}>
                        {overdue ? "Overdue" : "Due"}: {formatDate(b.due)}
                      </div>
                    </div>
                  </div>
                  <div className="bill-right">
                    <div className="bill-amount">{fmt(b.amount)}</div>
                    <button className="btn btn-sm btn-green" title="Mark as paid" onClick={() => onPayBill(b.id)}>
                      ✓
                    </button>
                    <button className="btn btn-sm btn-ghost" title="Edit bill" onClick={() => onEditBill(b.id)}>
                      ✎
                    </button>
                    <button className="btn btn-sm btn-danger" title="Delete bill" onClick={() => onDeleteBill(b.id)}>
                      ✕
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
