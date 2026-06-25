import ForecastChart from "./ForecastChart";
import { fmt } from "../utils/format";
import { CAT_COLORS, CAT_EMOJI } from "../data/categories";

export default function ForecastPage({ transactions, year, month, onShiftMonth }) {
  const monthLabel = new Date(year, month, 1).toLocaleString("default", { month: "long", year: "numeric" });
  const now = new Date();
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();

  const expenses = transactions.filter((t) => t.type === "expense");
  const total = expenses.reduce((s, t) => s + t.amount, 0);
  const cats = {};
  expenses.forEach((t) => {
    if (!cats[t.cat]) cats[t.cat] = { amount: 0, count: 0 };
    cats[t.cat].amount += t.amount;
    cats[t.cat].count++;
  });
  const sorted = Object.entries(cats).sort((a, b) => b[1].amount - a[1].amount);

  return (
    <div className="page active" id="page-forecast">
      <div className="page-header">
        <h1>Cash Flow Forecast</h1>
        <p>Predictions based on your spending patterns</p>
      </div>

      <div className="chart-wrap">
        <div className="chart-header">
          <div>
            <div className="chart-title">Income vs Expenses</div>
            <div className="chart-sub">{monthLabel}</div>
          </div>
          <div className="chart-month-nav">
            <button className="month-nav-btn" onClick={() => onShiftMonth(-1)} title="Previous month">
              ‹
            </button>
            <button
              className="month-nav-btn"
              onClick={() => onShiftMonth(1)}
              title="Next month"
              disabled={isCurrentMonth}
            >
              ›
            </button>
          </div>
        </div>

        <ForecastChart transactions={transactions} year={year} month={month} />

        <div className="chart-legend">
          <div className="legend-item">
            <div className="legend-line" style={{ background: "var(--green)" }}></div>
            Income
          </div>
          <div className="legend-item">
            <div className="legend-line" style={{ background: "var(--red)" }}></div>
            Expenses
          </div>
        </div>
      </div>

      <div className="section-card">
        <div className="section-header">
          <div className="section-title">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
              <path d="M18 20V10M12 20V4M6 20v-6" />
            </svg>
            <h2>Spending Breakdown</h2>
          </div>
        </div>

        <div>
          {!expenses.length ? (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <h3>No spending data yet</h3>
              <p>Add transactions to see your breakdown</p>
            </div>
          ) : (
            sorted.map(([cat, { amount, count }]) => {
              const pct = total ? ((amount / total) * 100).toFixed(1) : 0;
              const color = CAT_COLORS[cat] || "#94a3b8";
              return (
                <div className="breakdown-item" key={cat}>
                  <div className="breakdown-row">
                    <div className="breakdown-label">
                      <div className="breakdown-dot" style={{ background: color }}></div>
                      <span>
                        {CAT_EMOJI[cat] || "📦"} {cat}
                      </span>
                      <span className="breakdown-meta">({count} tx)</span>
                    </div>
                    <div className="breakdown-vals">
                      <div className="breakdown-amount">{fmt(amount)}</div>
                      <div className="breakdown-pct">{pct}%</div>
                    </div>
                  </div>
                  <div className="breakdown-bar-bg">
                    <div className="breakdown-bar" style={{ width: pct + "%", background: color }}></div>
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
