const createId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const toDateStamp = (timestamp) => timestamp.slice(0, 10);

export function createHistoryEntry({
  balanceAfter,
  details = "-",
  isModified = false,
  item,
  pointsChange,
  streakAfter,
  timestamp = new Date().toISOString(),
  type,
}) {
  return {
    id: createId(),
    date: toDateStamp(timestamp),
    timestamp,
    type,
    item,
    pointsChange,
    streakAfter,
    balanceAfter,
    details,
    isModified,
  };
}
