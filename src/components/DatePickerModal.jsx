import { useState } from "react";
import { todayISO } from "../utils/format";


export default function DatePickerModal({ initialIso, onPick, onClose }) {
  const base = initialIso ? new Date(initialIso + "T00:00:00") : new Date();
  const [year, setYear] = useState(base.getFullYear());
  const [month, setMonth] = useState(base.getMonth());

  function shiftMonth(delta) {
    let m = month + delta;
    let y = year;
    if (m < 0) {
      m = 11;
      y--;
    } else if (m > 11) {
      m = 0;
      y++;
    }
    setMonth(m);
    setYear(y);
  }

  const monthLabel = new Date(year, month, 1).toLocaleString("default", {
    month: "long",
    year: "numeric",
  });
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayStr = todayISO();

  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div
      className="modal-overlay open"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="date-picker-modal">
        <div className="dp-header">
          <button type="button" className="month-nav-btn" onClick={() => shiftMonth(-1)} title="Previous month">
            ‹
          </button>
          <div className="dp-month-label">{monthLabel}</div>
          <button type="button" className="month-nav-btn" onClick={() => shiftMonth(1)} title="Next month">
            ›
          </button>
        </div>
        <div className="dp-weekdays">
          <span>S</span>
          <span>M</span>
          <span>T</span>
          <span>W</span>
          <span>T</span>
          <span>F</span>
          <span>S</span>
        </div>
        <div className="dp-grid">
          {cells.map((d, i) => {
            if (d === null) return <span className="dp-day empty" key={"e" + i} />;
            const ds = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
            const cls =
              "dp-day" + (ds === todayStr ? " today" : "") + (ds === initialIso ? " selected" : "");
            return (
              <button type="button" className={cls} key={ds} onClick={() => onPick(ds)}>
                {d}
              </button>
            );
          })}
        </div>
        <div className="dp-footer">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => onPick(todayISO())}>
            Today
          </button>
        </div>
      </div>
    </div>
  );
}