export const STORAGE_KEY = "flexr:user-state";

export const defaultUserState = {
  points: 0,
  streak: 0,
  lastActivityDate: null,
  history: [],
  dailyStreakProgress: {
    date: null,
    completed: {},
    isFrozen: false,
  },
};

const isBrowserStorageAvailable = () =>
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const getDefaultState = () => ({
  ...defaultUserState,
  dailyStreakProgress: {
    ...defaultUserState.dailyStreakProgress,
    completed: { ...defaultUserState.dailyStreakProgress.completed },
  },
  history: [...defaultUserState.history],
});

export function loadState() {
  if (!isBrowserStorageAvailable()) {
    return getDefaultState();
  }

  const savedState = window.localStorage.getItem(STORAGE_KEY);

  if (!savedState) {
    return getDefaultState();
  }

  try {
    return {
      ...getDefaultState(),
      ...JSON.parse(savedState),
    };
  } catch {
    return getDefaultState();
  }
}

export function saveState(state) {
  const nextState = {
    ...getDefaultState(),
    ...state,
  };

  if (isBrowserStorageAvailable()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  }

  return nextState;
}

export function resetState() {
  if (isBrowserStorageAvailable()) {
    window.localStorage.removeItem(STORAGE_KEY);
  }

  return getDefaultState();
}
