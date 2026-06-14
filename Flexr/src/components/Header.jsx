import { useEffect, useRef, useState } from "react";
import streakIcon from "../assets/icons/streak.png";
import pointsIcon from "../assets/icons/points.png";
import logoFlexr from "../assets/icons/logo-flexr.png";

const tabs = ["Activities", "Reports", "Shop"];
const confettiPieces = Array.from({ length: 10 }, (_, index) => index);

function Header({
  activeTab,
  isDailyStreakComplete = false,
  isDailyStreakFrozen = false,
  isSessionMode = false,
  onEndEarly,
  onLogoClick,
  onPointsClick,
  onStreakClick,
  onTabChange,
  streak = 3,
  points = 2000,
}) {
  const wasDailyStreakComplete = useRef(isDailyStreakComplete);
  const [showStreakCelebration, setShowStreakCelebration] = useState(false);

  useEffect(() => {
    if (isDailyStreakComplete && !wasDailyStreakComplete.current) {
      setShowStreakCelebration(true);

      const timeoutId = window.setTimeout(() => {
        setShowStreakCelebration(false);
      }, 1500);

      wasDailyStreakComplete.current = isDailyStreakComplete;
      return () => window.clearTimeout(timeoutId);
    }

    wasDailyStreakComplete.current = isDailyStreakComplete;
    return undefined;
  }, [isDailyStreakComplete]);

  return (
    <header className={`app-header ${isSessionMode ? "is-session-mode" : ""}`}>
      <button className="brand brand-button" onClick={onLogoClick} type="button">
        <img src={logoFlexr} alt="Flexr" />
      </button>

      {isSessionMode ? (
        <div className="session-header-actions">
          <div className="session-status" aria-live="polite">
            <span className="session-status__dot" />
            <span>Exercise in Progress</span>
          </div>
          <button
            className="end-early-button"
            onClick={onEndEarly}
            type="button"
          >
            End Early
          </button>
        </div>
      ) : (
        <nav className="nav-tabs" aria-label="Primary navigation">
          {tabs.map((tab) => (
            <button
              className={`nav-tab ${activeTab === tab ? "is-active" : ""}`}
              key={tab}
              onClick={() => onTabChange(tab)}
              type="button"
            >
              {tab}
            </button>
          ))}
        </nav>
      )}

      <div className="header-stats" aria-label="User stats">
        <button
          className={`stat-pill stat-pill-button ${
            isDailyStreakComplete ? "is-daily-streak-complete" : ""
          } ${isDailyStreakFrozen ? "is-daily-streak-frozen" : ""}`}
          onClick={onStreakClick}
          type="button"
        >
          {showStreakCelebration && (
            <span className="streak-confetti" aria-hidden="true">
              {confettiPieces.map((piece) => (
                <span key={piece} />
              ))}
            </span>
          )}
          <img src={streakIcon} alt="" />
          <span>{streak}</span>
        </button>
        <button className="stat-pill stat-pill-button" onClick={onPointsClick} type="button">
          <img src={pointsIcon} alt="" />
          <span>{points}</span>
        </button>
      </div>
    </header>
  );
}

export default Header;
