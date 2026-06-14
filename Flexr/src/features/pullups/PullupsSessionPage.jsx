import { useState } from "react";
import addIcon from "../../assets/icons/add.svg";
import pointsIcon from "../../assets/icons/points.png";
import removeIcon from "../../assets/icons/remove.svg";

function PullupsSessionPage({
  activity,
  awardedPoints,
  onComplete,
  onSessionComplete,
}) {
  const [pullupCount, setPullupCount] = useState(1);
  const [completedPullupCount, setCompletedPullupCount] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [hasAwardedPoints, setHasAwardedPoints] = useState(false);
  const finalPullupCount = completedPullupCount ?? pullupCount;
  const basePoints = finalPullupCount * activity.points;
  const earnedPoints = awardedPoints(basePoints, finalPullupCount);

  const handleDone = () => {
    setCompletedPullupCount(pullupCount);
    setIsComplete(true);
    onSessionComplete();
  };

  const handleOk = () => {
    if (hasAwardedPoints) {
      return;
    }

    setHasAwardedPoints(true);
    onComplete({
      activity,
      earnedPoints,
      pullupCount: finalPullupCount,
    });
  };

  return (
    <section className="pullups-session-card" aria-label="Active Pull-ups">
      <h1>Pull-ups</h1>

      {isComplete ? (
        <div className="pullups-completion-panel" role="status">
          <h2>PULL-UPS COMPLETE!</h2>
          <div className="workout-completion-points">
            <img src={pointsIcon} alt="" />
            <span>+{earnedPoints}</span>
          </div>
          <button
            className="completion-ok-button"
            disabled={hasAwardedPoints}
            onClick={handleOk}
            type="button"
          >
            OK
          </button>
        </div>
      ) : (
        <div className="pullups-session-content">
          <img src={activity.exerciseImage} alt="Pull-ups" />

          <div className="pullups-controls" aria-label="Pull-up counter">
            <button
              className="pullups-count-button pullups-count-button--minus"
              disabled={pullupCount === 1}
              onClick={() => setPullupCount((count) => Math.max(1, count - 1))}
              type="button"
            >
              <img src={removeIcon} alt="" />
            </button>
            <strong>{pullupCount}</strong>
            <button
              className="pullups-count-button pullups-count-button--plus"
              onClick={() => setPullupCount((count) => count + 1)}
              type="button"
            >
              <img src={addIcon} alt="" />
            </button>
            <button
              className="pullups-done-button"
              onClick={handleDone}
              type="button"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default PullupsSessionPage;
