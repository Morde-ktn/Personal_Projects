import generalWorkoutImage from "../assets/images/general_workout-example.png";
import hooverImage from "../assets/images/hoover.png";
import pullupExerciseImage from "../assets/images/pullup-example.png";
import pullupPreviewImage from "../assets/images/pullup-preview.png";
import bicycleCrunchImage from "../assets/images/Bicycle-Crunch-example.png";
import dumbbellBicepCurlImage from "../assets/images/Dumbbell_Bicep_Curl-example.png";
import kneePushUpImage from "../assets/images/Knee_PushUp-example.png";
import oneArmDumbbellRowImage from "../assets/images/OneArm_Dumbbell_row-example.png";
import romanianDeadliftImage from "../assets/images/Romanian_Deadlift-example.png";
import squatImage from "../assets/images/Squat-example.png";

export const generalWorkoutExercises = [
  {
    id: "dumbbell-bicep-curl",
    name: "Dumbbell Bicep Curl",
    defaultReps: 10,
    image: dumbbellBicepCurlImage,
  },
  {
    id: "squat",
    name: "Squat",
    defaultReps: 10,
    image: squatImage,
  },
  {
    id: "romanian-dumbbell-deadlift",
    name: "Romanian Dumbbell Deadlift",
    defaultReps: 10,
    image: romanianDeadliftImage,
  },
  {
    id: "bicycle-crunch",
    name: "Bicycle Crunch",
    defaultReps: 10,
    image: bicycleCrunchImage,
  },
  {
    id: "one-arm-dumbbell-row",
    name: "One-Arm Dumbbell Row",
    defaultReps: 10,
    image: oneArmDumbbellRowImage,
  },
  {
    id: "knee-push-up",
    name: "Knee Push-Up",
    defaultReps: 10,
    image: kneePushUpImage,
  },
];

export const activities = [
  {
    id: "general-workout",
    name: "General Workout",
    exerciseCount: 6,
    exerciseLabel: "6 Exercises",
    points: 410,
    minForStreak: 1,
    defaultSets: 3,
    image: generalWorkoutImage,
    exercises: generalWorkoutExercises,
    description: "Complete a general workout session.",
  },
  {
    id: "pull-ups",
    name: "Pull-ups",
    exerciseCount: 1,
    exerciseLabel: "1 Exercise",
    points: 75,
    minForStreak: 2,
    image: pullupPreviewImage,
    exerciseImage: pullupExerciseImage,
    description: "Complete a pull-up set.",
  },
  {
    id: "hoover-the-house",
    name: "Hoover the House",
    exerciseCount: 1,
    exerciseLabel: "1 Activity",
    points: 200,
    minForStreak: 0,
    image: hooverImage,
    exerciseImage: hooverImage,
    description: "Complete 1 activity.",
  },
];
