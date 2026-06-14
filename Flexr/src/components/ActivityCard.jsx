import pointsIcon from "../assets/icons/points.png";
import streakIcon from "../assets/icons/streak.png";

function ActivityCard({ activity, isStreakDone = false, onOpen }) {
  const rewardLabel = `+${activity.points}${
    activity.id === "pull-ups" ? "/pp" : ""
  }`;

  return (
    <article
      className="activity-card"
      style={{ backgroundImage: `url(${activity.image})` }}
    >
      <div className="activity-card__overlay">
        <div className="activity-card__top">
          <div className="activity-card__title-group">
            <h2>{activity.name}</h2>
            <span>{activity.exerciseLabel}</span>
          </div>

          <div className="activity-card__meta" aria-label={`${activity.name} details`}>
            <span className="reward-meta">
              <img src={pointsIcon} alt="" />
              {rewardLabel}
            </span>
            <span className="streak-min-meta">
              <img src={streakIcon} alt="" />
              {isStreakDone ? (
                <strong>done</strong>
              ) : (
                <>
                  <span>min</span>
                  <strong>{activity.minForStreak ?? 1}x</strong>
                </>
              )}
            </span>
          </div>
        </div>

        <button
          className="open-button"
          onClick={() => onOpen(activity)}
          type="button"
        >
          Open
        </button>
      </div>
    </article>
  );
}

export default ActivityCard;
