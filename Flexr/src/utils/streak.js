const MS_PER_DAY = 24 * 60 * 60 * 1000;

const toDayStart = (date) => {
  const nextDate = date instanceof Date ? date : new Date(date);

  if (Number.isNaN(nextDate.getTime())) {
    return null;
  }

  return new Date(
    nextDate.getFullYear(),
    nextDate.getMonth(),
    nextDate.getDate(),
  );
};

const getDayGap = (fromDate, toDate) => {
  const fromDay = toDayStart(fromDate);
  const toDay = toDayStart(toDate);

  if (!fromDay || !toDay) {
    return null;
  }

  return Math.floor((toDay.getTime() - fromDay.getTime()) / MS_PER_DAY);
};

export const hasMissedStreakWindow = (
  state,
  date = new Date(),
  allowedGapDays = 1,
) => {
  if (!state.lastActivityDate || state.streak <= 0) {
    return false;
  }

  const dayGap = getDayGap(state.lastActivityDate, date);

  return dayGap !== null && dayGap > allowedGapDays;
};

export const getDateStamp = (date = new Date()) => {
  if (!date) {
    return null;
  }

  const day = toDayStart(date);

  if (!day) {
    return null;
  }

  const year = day.getFullYear();
  const month = String(day.getMonth() + 1).padStart(2, "0");
  const dateOfMonth = String(day.getDate()).padStart(2, "0");

  return `${year}-${month}-${dateOfMonth}`;
};

export const getDailyStreakProgress = (state, date = new Date()) => {
  const dateStamp = getDateStamp(date);
  const savedProgress = state.dailyStreakProgress;

  if (savedProgress?.date === dateStamp) {
    return {
      date: dateStamp,
      completed: { ...(savedProgress.completed ?? {}) },
      isFrozen: Boolean(savedProgress.isFrozen),
    };
  }

  return {
    date: dateStamp,
    completed: {},
    isFrozen: false,
  };
};

export const addDailyActivityProgress = (
  state,
  activityId,
  completedAmount = 1,
  date = new Date(),
) => {
  const progress = getDailyStreakProgress(state, date);
  const currentAmount = progress.completed[activityId] ?? 0;

  return {
    ...progress,
    completed: {
      ...progress.completed,
      [activityId]: currentAmount + completedAmount,
    },
    isFrozen: progress.isFrozen,
  };
};

export const freezeDailyStreakProgress = (state, date = new Date()) => ({
  ...getDailyStreakProgress(state, date),
  isFrozen: true,
});

export const isStreakFrozenForDate = (state, date = new Date()) =>
  getDailyStreakProgress(state, date).isFrozen;

export const isActivityDoneForStreak = (activity, state, date = new Date()) => {
  const minimum = activity.minForStreak ?? 0;

  if (minimum <= 0) {
    return false;
  }

  const progress = getDailyStreakProgress(state, date);

  return (progress.completed[activity.id] ?? 0) >= minimum;
};

export const areAllActivitiesDoneForStreak = (
  activities,
  state,
  date = new Date(),
) => {
  const requiredActivities = activities.filter(
    (activity) => (activity.minForStreak ?? 0) > 0,
  );

  return requiredActivities.every((activity) =>
    isActivityDoneForStreak(activity, state, date),
  );
};

export const isDaySafeForStreak = (activities, state, date = new Date()) =>
  isStreakFrozenForDate(state, date) ||
  areAllActivitiesDoneForStreak(activities, state, date);

export function calculateNextStreak(
  currentStreak,
  lastActivityDate,
  activityDate = new Date(),
  allowedGapDays = 1,
) {
  if (!lastActivityDate) {
    return 0;
  }

  const dayGap = getDayGap(lastActivityDate, activityDate);

  if (dayGap === null || dayGap <= 0) {
    return currentStreak;
  }

  if (dayGap <= allowedGapDays) {
    return currentStreak + 1;
  }

  return 0;
}

export function applyActivityToStreak(
  state,
  activityDate = new Date(),
  allowedGapDays = 1,
) {
  const nextStreak = calculateNextStreak(
    state.streak,
    state.lastActivityDate,
    activityDate,
    allowedGapDays,
  );

  return {
    ...state,
    streak: nextStreak,
    lastActivityDate: new Date(activityDate).toISOString(),
  };
}

export function applyActivityResultToStreak(
  state,
  meetsStreakMinimum,
  activityDate = new Date(),
  allowedGapDays = 1,
) {
  if (!meetsStreakMinimum) {
    return {
      ...state,
      streak: 0,
      lastActivityDate: null,
    };
  }

  const dayGap = getDayGap(state.lastActivityDate, activityDate);
  const nextStreak =
    !state.lastActivityDate || dayGap === null
      ? 1
      : dayGap <= 0
        ? state.streak
        : dayGap <= allowedGapDays
          ? state.streak + 1
          : 1;

  return {
    ...state,
    streak: nextStreak,
    lastActivityDate: new Date(activityDate).toISOString(),
  };
}
