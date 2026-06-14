import { useState } from "react";
import ActivityCard from "../components/ActivityCard";
import { activities } from "../data/activities";
import closeIcon from "../assets/icons/close.svg";
import gridIcon from "../assets/icons/grid.svg";
import listIcon from "../assets/icons/list.svg";

function ActivitiesPage({
  onDismissStreakLost,
  onOpenActivity,
  showStreakLostBanner = false,
  streakDoneActivityIds = [],
}) {
  const [viewMode, setViewMode] = useState("list");

  return (
    <>
      <div className="activity-view-toggle" aria-label="Activity view">
        <button
          aria-label="List view"
          aria-pressed={viewMode === "list"}
          className={`view-toggle-button ${
            viewMode === "list" ? "is-active" : ""
          }`}
          onClick={() => setViewMode("list")}
          type="button"
        >
          <img src={listIcon} alt="" />
        </button>
        <button
          aria-label="Grid view"
          aria-pressed={viewMode === "grid"}
          className={`view-toggle-button ${
            viewMode === "grid" ? "is-active" : ""
          }`}
          onClick={() => setViewMode("grid")}
          type="button"
        >
          <img src={gridIcon} alt="" />
        </button>
      </div>

      {showStreakLostBanner && (
        <section className="streak-lost-banner" role="status">
          <div className="streak-lost-banner__icon" aria-hidden="true">
            ;(
          </div>
          <div className="streak-lost-banner__copy">
            <h2>Streak Lost</h2>
            <p>
              Oh no, our streak was lost because it wasn&apos;t frozen, and no
              minimum activity was completed yesterday.
            </p>
          </div>
          <button
            aria-label="Close streak lost message"
            className="streak-lost-banner__close"
            onClick={onDismissStreakLost}
            type="button"
          >
            <img src={closeIcon} alt="" />
          </button>
        </section>
      )}

      <section
        className={`activities-page activities-page--${viewMode}`}
        aria-label="Activities"
      >
        {activities.map((activity) => (
          <ActivityCard
            activity={activity}
            isStreakDone={streakDoneActivityIds.includes(activity.id)}
            key={activity.id}
            onOpen={onOpenActivity}
          />
        ))}
      </section>
    </>
  );
}

export default ActivitiesPage;
