import { useState } from "react";
import editIcon from "../assets/icons/edit.svg";
import streakIcon from "../assets/icons/streak.png";

const STREAK_EDIT_KEY = "319";

function StreakModal({ onClose, onUpdateStreak, streak }) {
  const [isEditing, setIsEditing] = useState(false);
  const [keyValue, setKeyValue] = useState("");
  const [streakValue, setStreakValue] = useState(streak);

  const handleCancel = () => {
    setIsEditing(false);
    setKeyValue("");
    setStreakValue(streak);
  };

  const handleUpdate = () => {
    if (keyValue === STREAK_EDIT_KEY) {
      onUpdateStreak(Number(streakValue));
      return;
    }

    handleCancel();
  };

  return (
    <div className="modal-backdrop" role="presentation">
      <section
        aria-label={isEditing ? "Edit streak" : "My streak"}
        aria-modal="true"
        className="points-modal"
        role="dialog"
      >
        {isEditing ? (
          <>
            <h2>Edit</h2>

            <div className="points-modal-form">
              <label>
                <span>Key</span>
                <input
                  autoFocus
                  onChange={(event) => setKeyValue(event.target.value)}
                  type="password"
                  value={keyValue}
                />
              </label>
              <label>
                <span>Streak</span>
                <input
                  min="0"
                  onChange={(event) => setStreakValue(event.target.value)}
                  type="number"
                  value={streakValue}
                />
              </label>
            </div>

            <div className="points-modal-actions">
              <button
                className="modal-secondary-button"
                onClick={handleCancel}
                type="button"
              >
                Cancel
              </button>
              <button
                className="modal-primary-button"
                onClick={handleUpdate}
                type="button"
              >
                Update
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="points-modal-title-row">
              <h2>My Streak</h2>
              <button
                aria-label="Edit streak"
                className="points-modal-edit-button"
                onClick={() => setIsEditing(true)}
                type="button"
              >
                <img src={editIcon} alt="" />
              </button>
            </div>

            <div className="points-modal-total">
              <img src={streakIcon} alt="" />
              <strong>{streak}</strong>
            </div>

            <button
              className="modal-primary-button"
              onClick={onClose}
              type="button"
            >
              OK
            </button>
          </>
        )}
      </section>
    </div>
  );
}

export default StreakModal;
