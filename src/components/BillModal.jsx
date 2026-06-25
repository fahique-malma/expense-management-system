import { formatDate } from "../utils/format";
import { CAT_EMOJI } from "../data/categories";

export default function BillModal({
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
          <div className="modal-title">{isEditing ? "Edit Bill" : "Add Upcoming Bill"}</div>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="form-group">
          <label className="form-label">Bill Name</label>
          <input
            className="form-input"
            value={form.name}
            placeholder="e.g. Netflix, Electricity..."
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
          <div className="form-group date-field">
            <label className="form-label">Due Date</label>
            <input
              className="form-input"
              readOnly
              placeholder="Select date"
              value={form.due ? formatDate(form.due) : ""}
              onClick={onOpenDatePicker}
            />
            <span className="date-icon">📅</span>
          </div>
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

        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={form.recurring}
            onChange={(e) => onChange({ recurring: e.target.checked })}
          />
          <span>Repeats monthly</span>
        </label>

        <button
          className="btn btn-primary modal-submit"
          style={{ width: "100%", justifyContent: "center", padding: "12px", marginTop: "14px" }}
          onClick={onSubmit}
        >
          {isEditing ? "Save Changes" : "Add Bill"}
        </button>
      </div>
    </div>
  );
}
