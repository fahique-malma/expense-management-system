import { useState } from "react";


export default function ProfileModal({ currentName, onSave, onClose }) {
  const [name, setName] = useState(currentName);

  function submit() {
    onSave(name);
  }

  return (
    <div
      className="modal-overlay open"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">Change Your Name</div>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="form-group">
          <label className="form-label">Your Name</label>
          <input
            className="form-input"
            placeholder="Enter your name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
          />
        </div>
        <button
          className="btn btn-primary modal-submit"
          style={{ width: "100%", justifyContent: "center", padding: "12px" }}
          onClick={submit}
        >
          Save Name
        </button>
      </div>
    </div>
  );
}
