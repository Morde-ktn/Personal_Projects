function HooverSessionPage({ activity, onComplete, onSessionComplete }) {
  const handleDone = () => {
    onSessionComplete();
    onComplete({ activity });
  };

  return (
    <section className="pullups-session-card" aria-label="Active Hoover the House">
      <h1>Hoover the House</h1>

      <div className="pullups-session-content">
        <img src={activity.exerciseImage} alt="Hoover the House" />
        <div className="pullups-controls">
          <button className="pullups-done-button" onClick={handleDone} type="button">
            Done
          </button>
        </div>
      </div>
    </section>
  );
}

export default HooverSessionPage;
