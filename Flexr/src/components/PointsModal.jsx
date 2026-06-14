import { useState } from "react";
import editIcon from "../assets/icons/edit.svg";
import pointsIcon from "../assets/icons/points.png";

const POINTS_EDIT_KEY = "319";

function PointsModal({ onClose, onUpdatePoints, points }) {
  const [isEditing, setIsEditing] = useState(false);
  const [keyValue, setKeyValue] = useState("");
  const [pointsValue, setPointsValue] = useState(points);

  const handleCancel = () => {
    setIsEditing(false);
    setKeyValue("");
    setPointsValue(points);
  };

  const handleUpdate = () => {
    if (keyValue === POINTS_EDIT_KEY) {
      onUpdatePoints(Number(pointsValue));
      return;
    }

    handleCancel();
  };

  return (
    <div className="modal-backdrop" role="presentation">
      <section
        aria-label={isEditing ? "Edit points" : "My points"}
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
                <span>Points</span>
                <input
                  min="0"
                  onChange={(event) => setPointsValue(event.target.value)}
                  type="number"
                  value={pointsValue}
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
              <h2>My Points</h2>
              <button
                aria-label="Edit points"
                className="points-modal-edit-button"
                onClick={() => setIsEditing(true)}
                type="button"
              >
                <img src={editIcon} alt="" />
              </button>
            </div>

            <div className="points-modal-total">
              <img src={pointsIcon} alt="" />
              <strong>{points}</strong>
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

export default PointsModal;
