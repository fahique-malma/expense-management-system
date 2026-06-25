import { formatDate } from "../utils/format";
import { CAT_EMOJI } from "../data/categories";

export default function TxModal({
  open,
  isEditing,
  form,
  onChange,
  onOpenDatePicker,
  onOpenCategoryPicker,
  onSubmit,
  onClose,
}) {
  if (!open) return null;

  return (
    <div
      className="modal-overlay open"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">{isEditing ? "Edit Transaction" : "Add Transaction"}</div>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="form-group">
          <label className="form-label">Type</label>
          <div className="type-toggle">
            <button
              type="button"
              className={"type-btn expense" + (form.type === "expense" ? " active" : "")}
              onClick={() => onChange({ type: "expense" })}
            >
              ↘ Expense
            </button>
            <button
              type="button"
              className={"type-btn income" + (form.type === "income" ? " active" : "")}
              onClick={() => onChange({ type: "income" })}
            >
              ↗ Income
            </button>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Name</label>
          <input
            className="form-input"
            value={form.name}
            placeholder="e.g. BigBasket, Salary..."
            onChange={(e) => onChange({ name: e.target.value })}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Amount (₹)</label>
            <input
              className="form-input"
              type="number"
              min="0"
              placeholder="0"
              value={form.amount}
              onChange={(e) => onChange({ amount: e.target.value })}
            />
          </div>
          <div className="form-group category-field">
            <label className="form-label">Category</label>
            <input
              className="form-input"
              readOnly
              placeholder="Select category"
              value={form.cat ? `${CAT_EMOJI[form.cat] || "📦"} ${form.cat}` : ""}
              onClick={onOpenCategoryPicker}
            />
            <span className="select-caret">▾</span>
          </div>
        </div>

        <div className="form-group date-field">
          <label className="form-label">Date</label>
          <input
            className="form-input"
            readOnly
            placeholder="Select date"
            value={form.date ? formatDate(form.date) : ""}
            onClick={onOpenDatePicker}
          />
          <span className="date-icon">📅</span>
        </div>

        <button
          className="btn btn-primary modal-submit"
          style={{ width: "100%", justifyContent: "center", padding: "12px" }}
          onClick={onSubmit}
        >
          {isEditing ? "Save Changes" : "Add Transaction"}
        </button>
      </div>
    </div>
  );
}
