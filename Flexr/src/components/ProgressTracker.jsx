function ProgressTracker({ activeIndex = 0, count, label, tone = "teal" }) {
  return (
    <div className="progress-tracker" aria-label={`${label} progress`}>
      <span className="progress-tracker__label">{label}</span>
      <div className={`progress-tracker__steps progress-tracker__steps--${tone}`}>
        {Array.from({ length: count }, (_, index) => (
          <span
            className={`progress-tracker__circle ${
              index === activeIndex ? "is-active" : ""
            } ${index <= activeIndex ? "is-complete" : ""}`}
            key={index}
          />
        ))}
      </div>
    </div>
  );
}

export default ProgressTracker;
