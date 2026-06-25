import { CATEGORIES } from "../data/categories";

export default function CategoryPickerModal({ open, current, onPick, onClose }) {
  if (!open) return null;
  const list = CATEGORIES;

  return (
    <div
      className="modal-overlay open"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="date-picker-modal category-picker-modal">
        <div className="dp-header">
          <div className="dp-month-label">Select Category</div>
          <button type="button" className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="category-list">
          {list.map((c) => (
            <button
              type="button"
              key={c.key}
              className={"category-option" + (c.key === current ? " selected" : "")}
              onClick={() => onPick(c.key)}
            >
              <span className="category-option-emoji">{c.emoji}</span>
              <span>{c.key}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
