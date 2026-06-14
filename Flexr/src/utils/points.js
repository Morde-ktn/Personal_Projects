const toPointAmount = (amount) => {
  const points = Number(amount);
  return Number.isFinite(points) && points > 0 ? Math.floor(points) : 0;
};

const createId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const createHistoryEntry = (type, points, label) => ({
  id: createId(),
  type,
  points,
  label,
  createdAt: new Date().toISOString(),
});

export function getStreakBonusRate(streak) {
  if (streak >= 14) {
    return 0.15;
  }

  if (streak >= 7) {
    return 0.1;
  }

  return 0;
}

export function calculateActivityPoints(basePoints, streak = 0) {
  const points = toPointAmount(basePoints);
  const bonusRate = getStreakBonusRate(streak);

  return Math.floor(points * (1 + bonusRate));
}

export function addPoints(state, amount, label = "Activity completed") {
  const pointsToAdd = toPointAmount(amount);

  if (pointsToAdd === 0) {
    return state;
  }

  return {
    ...state,
    points: state.points + pointsToAdd,
    history: [
      ...state.history,
      createHistoryEntry("points-added", pointsToAdd, label),
    ],
  };
}

export function spendPoints(state, amount, label = "Reward redeemed") {
  const pointsToSpend = toPointAmount(amount);

  if (pointsToSpend === 0 || state.points < pointsToSpend) {
    return state;
  }

  return {
    ...state,
    points: state.points - pointsToSpend,
    history: [
      ...state.history,
      createHistoryEntry("points-spent", pointsToSpend, label),
    ],
  };
}
