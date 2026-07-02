export interface WorkoutExercise {
  name: string;
  sets: number;
  reps: string;
  datasetId?: string;
}

export interface DailyWorkout {
  dayName: string;
  title: string;
  exercises: WorkoutExercise[];
}

export const WORKOUT_PLAN: Record<number, DailyWorkout> = {
  1: {
    dayName: "Monday",
    title: "Upper Body (Chest, Back)",
    exercises: [
      { name: "Dumbbell Bench Press", sets: 4, reps: "10-12", datasetId: "0289" },
      { name: "Dumbbell Row", sets: 4, reps: "10-12/side", datasetId: "0293" },
      { name: "Push-ups", sets: 3, reps: "Failure", datasetId: "0662" },
      { name: "Dumbbell Pullover", sets: 3, reps: "12", datasetId: "0375" },
    ]
  },
  2: {
    dayName: "Tuesday",
    title: "Lower Body (Legs, Core)",
    exercises: [
      { name: "Dumbbell Goblet Squat", sets: 4, reps: "12-15", datasetId: "1760" },
      { name: "Dumbbell Lunges", sets: 3, reps: "10-12/side", datasetId: "0336" },
      { name: "Leg Extension Machine", sets: 3, reps: "15", datasetId: "0585" },
      { name: "Plank", sets: 3, reps: "60s", datasetId: "0464" }, // front plank with twist as fallback
    ]
  },
  3: {
    dayName: "Wednesday",
    title: "Active Recovery / Cardio",
    exercises: [
      { name: "Incline Treadmill Walk", sets: 1, reps: "30-40 min", datasetId: "3666" },
    ]
  },
  4: {
    dayName: "Thursday",
    title: "Upper Body (Shoulders, Arms)",
    exercises: [
      { name: "Dumbbell Overhead Press", sets: 4, reps: "10-12", datasetId: "0405" },
      { name: "Dumbbell Lateral Raise", sets: 4, reps: "15", datasetId: "0334" },
      { name: "Dumbbell Bicep Curl", sets: 3, reps: "12", datasetId: "0304" }, // 0304 is a bicep curl roughly
      { name: "Dumbbell Overhead Tricep Ext.", sets: 3, reps: "12", datasetId: "2188" },
    ]
  },
  5: {
    dayName: "Friday",
    title: "Rest Day",
    exercises: []
  },
  6: {
    dayName: "Saturday",
    title: "Full Body Circuit (Fat Burn)",
    exercises: [
      { name: "Burpees", sets: 3, reps: "15", datasetId: "1160" },
      { name: "Dumbbell Thrusters", sets: 3, reps: "12", datasetId: "0550" }, // Using kettlebell thruster
      { name: "Mountain Climbers", sets: 3, reps: "40s", datasetId: "0630" },
      { name: "Leg Curl Machine", sets: 3, reps: "15", datasetId: "0599" },
    ]
  },
  0: {
    dayName: "Sunday",
    title: "Rest & Meal Prep",
    exercises: []
  },
};

export const getTodayWorkout = (): DailyWorkout => {
  const day = new Date().getDay(); // 0 (Sun) to 6 (Sat)
  return WORKOUT_PLAN[day];
};
