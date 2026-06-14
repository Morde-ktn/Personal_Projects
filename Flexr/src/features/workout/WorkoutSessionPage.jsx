import { useEffect, useState } from "react";
import ProgressTracker from "../../components/ProgressTracker";
import pointsIcon from "../../assets/icons/points.png";
import { activities, generalWorkoutExercises } from "../../data/activities";
import { encouragementPhrases } from "../../data/encouragementPhrases";

const getRandomEncouragementPhrase = () =>
  encouragementPhrases[
    Math.floor(Math.random() * encouragementPhrases.length)
  ];

function WorkoutSessionPage({
  awardedPoints,
  onSessionComplete,
  onWorkoutComplete,
  workoutConfig,
}) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [setCompleteBanner, setSetCompleteBanner] = useState(null);
  const [isWorkoutComplete, setIsWorkoutComplete] = useState(false);
  const [hasAwardedPoints, setHasAwardedPoints] = useState(false);
  const activity =
    activities.find((currentActivity) => currentActivity.id === workoutConfig?.activityId) ??
    activities.find((currentActivity) => currentActivity.id === "general-workout");
  const exercises = workoutConfig?.exercises?.length
    ? workoutConfig.exercises
    : generalWorkoutExercises.map((exercise) => ({ ...exercise, reps: 10 }));
  const currentExercise = exercises[currentExerciseIndex];
  const currentReps = currentExercise?.reps ?? 10;
  const totalSets = workoutConfig?.sets || 3;
  const isLastExercise = currentExerciseIndex === exercises.length - 1;
  const isFinalSet = currentSetIndex === totalSets - 1;
  const actionLabel = isLastExercise
    ? isFinalSet
      ? "Finish Workout"
      : "Next Set"
    : "Done / Next";
  const isSetCompleteTransitionRunning = Boolean(setCompleteBanner);

  useEffect(() => {
    if (!setCompleteBanner) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setCurrentSetIndex((index) => index + 1);
      setCurrentExerciseIndex(0);
      setSetCompleteBanner(null);
    }, 3100);

    return () => window.clearTimeout(timeoutId);
  }, [setCompleteBanner]);

  const handleDoneNext = () => {
    if (isSetCompleteTransitionRunning || isWorkoutComplete) {
      return;
    }

    if (!isLastExercise) {
      setCurrentExerciseIndex((index) => index + 1);
      return;
    }

    if (!isFinalSet) {
      setSetCompleteBanner({
        phrase: getRandomEncouragementPhrase(),
        setNumber: currentSetIndex + 1,
      });
      return;
    }

    console.log("Workout completed", {
      activityId: workoutConfig?.activityId ?? "general-workout",
      sets: totalSets,
      exercises,
    });
    setIsWorkoutComplete(true);
    onSessionComplete();
  };

  const handleCompletionOk = () => {
    if (hasAwardedPoints) {
      return;
    }

    setHasAwardedPoints(true);
    onWorkoutComplete({
      activity,
      workoutConfig,
    });
  };

  return (
    <section className="workout-session-card" aria-label="Active General Workout">
      <div className="workout-session-card__header">
        <h1>General Workout</h1>

        <div className="session-trackers">
          <ProgressTracker
            activeIndex={currentSetIndex}
            count={totalSets}
            label="Set"
            tone="teal"
          />
          <ProgressTracker
            activeIndex={currentExerciseIndex}
            count={exercises.length}
            label="Exercise"
            tone="purple"
          />
        </div>
      </div>

      <div className="workout-session-content">
        {isWorkoutComplete ? (
          <div className="workout-completion-panel" role="status">
            <h2>WORKOUT COMPLETE!</h2>
            <div className="workout-completion-points">
              <img src={pointsIcon} alt="" />
              <span>+{awardedPoints}</span>
            </div>
            <button
              className="completion-ok-button"
              disabled={hasAwardedPoints}
              onClick={handleCompletionOk}
              type="button"
            >
              OK
            </button>
          </div>
        ) : (
          <>
            <div className="session-exercise-list">
              {exercises.map((exercise, index) => (
                <div
                  className={`session-exercise-item ${
                    index === currentExerciseIndex ? "is-current" : ""
                  }`}
                  key={exercise.id}
                >
                  <span>{exercise.name}</span>
                  {index === currentExerciseIndex && (
                    <strong>{currentReps} Reps</strong>
                  )}
                </div>
              ))}
            </div>

            <div className="session-exercise-preview">
              {setCompleteBanner ? (
                <div className="set-complete-banner" role="status">
                  <div className="set-complete-banner__content">
                    <strong>SET {setCompleteBanner.setNumber} COMPLETE</strong>
                    <span>{setCompleteBanner.phrase}</span>
                  </div>
                </div>
              ) : (
                <img src={currentExercise.image} alt={currentExercise.name} />
              )}
              {!setCompleteBanner && (
                <button
                  className="done-next-button"
                  onClick={handleDoneNext}
                  type="button"
                >
                  {actionLabel}
                  <span aria-hidden="true" className="done-next-button__icon" />
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default WorkoutSessionPage;
