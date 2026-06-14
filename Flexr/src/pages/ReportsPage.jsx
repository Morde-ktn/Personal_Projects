import { useEffect, useRef } from "react";

const isValidReportEntry = (entry) =>
  entry &&
  entry.timestamp &&
  entry.date &&
  entry.item &&
  Number.isFinite(entry.pointsChange) &&
  Number.isFinite(entry.streakAfter) &&
  Number.isFinite(entry.balanceAfter);

function ReportsPage({ history }) {
  const tableBodyRef = useRef(null);
  const sortedHistory = history
    .map((entry, index) => ({ entry, index }))
    .filter(({ entry }) => isValidReportEntry(entry))
    .sort((a, b) => {
      const timestampDifference =
        new Date(b.entry.timestamp).getTime() -
        new Date(a.entry.timestamp).getTime();

      return timestampDifference || b.index - a.index;
    })
    .map(({ entry }) => entry);

  useEffect(() => {
    if (tableBodyRef.current) {
      tableBodyRef.current.scrollTop = 0;
    }
  }, [history]);

  return (
    <section className="reports-card" aria-label="Reports">
      {sortedHistory.length === 0 ? (
        <p className="reports-empty">No activity yet.</p>
      ) : (
        <div className="reports-table-viewport">
          <div className="reports-table">
            <div className="reports-row reports-row--header">
              <span>Date</span>
              <span>Points</span>
              <span>Streak</span>
              <span>Balance</span>
              <span>Item</span>
              <span>Details</span>
            </div>

            <div className="reports-table-body" ref={tableBodyRef}>
              {sortedHistory.map((entry) => (
                <div className="reports-row" key={entry.id}>
                  <span>{entry.date}</span>
                  <span
                    className={`reports-points ${
                      entry.pointsChange >= 0
                        ? "reports-points--positive"
                        : "reports-points--negative"
                    }`}
                  >
                    {entry.pointsChange > 0 ? "+" : ""}
                    {entry.pointsChange}
                  </span>
                  <span>{entry.streakAfter}</span>
                  <span>{entry.balanceAfter}</span>
                  <strong>{entry.item}</strong>
                  <span
                    className={`reports-details ${
                      entry.isModified ? "is-modified" : ""
                    }`}
                  >
                    {entry.details}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default ReportsPage;
