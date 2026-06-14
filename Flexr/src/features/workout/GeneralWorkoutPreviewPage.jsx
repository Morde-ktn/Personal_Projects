import { useState } from "react";
import { activities, generalWorkoutExercises } from "../../data/activities";

const generalWorkoutActivity = activities.find(
  (activity) => activity.id === "general-workout",
);

const defaultReps = generalWorkoutExercises.reduce((repsByExercise, exercise) => {
  repsByExercise[exercise.id] = exercise.defaultReps;
  return repsByExercise;
}, {});

function GeneralWorkoutPreviewPage({ onStartWorkout }) {
  const [sets, setSets] = useState(generalWorkoutActivity.defaultSets);
  const [repsByExercise, setRepsByExercise] = useState(defaultReps);

  const handleRepsChange = (exerciseId, value) => {
    setRepsByExercise((currentReps) => ({
      ...currentReps,
      [exerciseId]: value,
    }));
  };

  const handleStart = () => {
    const configuredWorkout = {
      activityId: "general-workout",
      activityPoints: generalWorkoutActivity.points,
      sets: Number(sets),
      exercises: generalWorkoutExercises.map((exercise) => ({
        ...exercise,
        reps: Number(repsByExercise[exercise.id]),
      })),
    };

    console.log(configuredWorkout);
    onStartWorkout(configuredWorkout);
  };

  return (
    <section className="workout-preview-card" aria-label="General Workout preview">
      <div className="workout-preview-card__header">
        <h1>General Workout</h1>

        <label className="sets-control">
          <input
            min="1"
            onChange={(event) => setSets(event.target.value)}
            type="number"
            value={sets}
          />
          <span>Sets</span>
        </label>
      </div>

      <div className="workout-preview-card__divider" />

      <div className="exercise-config-list">
        {generalWorkoutExercises.map((exercise) => (
          <div className="exercise-config-row" key={exercise.id}>
            <span className="exercise-config-row__name">{exercise.name}</span>

            <label className="reps-control">
              <input
                min="1"
                onChange={(event) =>
                  handleRepsChange(exercise.id, event.target.value)
                }
                type="number"
                value={repsByExercise[exercise.id]}
              />
              <span>Reps</span>
            </label>
          </div>
        ))}
      </div>

      <button className="start-button" onClick={handleStart} type="button">
        Start
      </button>
    </section>
  );
}

export default GeneralWorkoutPreviewPage;
