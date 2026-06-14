import { useEffect, useState } from "react";
import pointsIcon from "../assets/icons/points.png";
import { rewards } from "../data/rewards";

function ShopPage({
  isDailyStreakComplete = false,
  isDailyStreakFrozen = false,
  onRedeemReward,
  points,
}) {
  const [purchasedRewardId, setPurchasedRewardId] = useState(null);
  const [exitingRewardId, setExitingRewardId] = useState(null);
  const sortedRewards = [...rewards].sort((a, b) => a.cost - b.cost);

  useEffect(() => {
    if (!purchasedRewardId) {
      return undefined;
    }

    const exitTimeoutId = window.setTimeout(() => {
      setExitingRewardId(purchasedRewardId);
    }, 1600);

    const resetTimeoutId = window.setTimeout(() => {
      setPurchasedRewardId(null);
      setExitingRewardId(null);
    }, 2100);

    return () => {
      window.clearTimeout(exitTimeoutId);
      window.clearTimeout(resetTimeoutId);
    };
  }, [purchasedRewardId]);

  const handleGetReward = (reward, canRedeem) => {
    if (!canRedeem) {
      return;
    }

    onRedeemReward(reward);
    setPurchasedRewardId(reward.id);
    setExitingRewardId(null);
  };

  return (
    <section className="shop-page" aria-label="Shop rewards">
      {sortedRewards.map((reward) => {
        const canAfford = points >= reward.cost;
        const isRestDaySecured =
          reward.id === "rest-day-keep-streak" &&
          (isDailyStreakComplete || isDailyStreakFrozen);
        const canRedeem = canAfford && !isRestDaySecured;
        const isPurchased = purchasedRewardId === reward.id;
        const isExiting = exitingRewardId === reward.id;

        return (
          <article
            className={`reward-card ${canRedeem ? "" : "is-locked"} ${
              isPurchased ? "is-purchased" : ""
            } ${isExiting ? "is-purchase-exiting" : ""}`}
            key={reward.id}
          >
            {isPurchased ? (
              <div className="reward-purchase-success" role="status">
                <strong>PURCHASED!</strong>
              </div>
            ) : (
              <>
                <div className="reward-card__top">
                  <div>
                    <h2>{reward.title}</h2>
                    {reward.description && <p>{reward.description}</p>}
                  </div>

                  <div className="reward-cost" aria-label={`${reward.cost} points`}>
                    <img src={pointsIcon} alt="" />
                    <span>{reward.cost.toLocaleString()}</span>
                  </div>
                </div>

                {isRestDaySecured ? (
                  <p className="reward-secured-message">
                    Streak secured for today
                  </p>
                ) : (
                  <button
                    className="reward-get-button"
                    disabled={!canRedeem}
                    onClick={() => handleGetReward(reward, canRedeem)}
                    type="button"
                  >
                    Get
                  </button>
                )}
              </>
            )}
          </article>
        );
      })}
    </section>
  );
}

export default ShopPage;
