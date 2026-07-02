import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Default User Base Line Data
const DEFAULT_USER_DATA = {
  weight: 69,
  height: 174,
  bodyFat: 20.3,
  calorieGoal: 2000,
  proteinGoal: 140,
  fatGoal: 55,
  carbsGoal: 236,
};

export interface UserData {
  weight: number;
  height: number;
  bodyFat: number;
  calorieGoal: number;
  proteinGoal: number;
  fatGoal: number;
  carbsGoal: number;
}

export interface DietLog {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  date: string; // YYYY-MM-DD
}

export interface WorkoutSet {
  name: string;
  reps: string;
  completed: boolean;
}

export interface WorkoutLog {
  date: string; // YYYY-MM-DD
  completed: boolean;
  sets: WorkoutSet[];
}

export interface WeightRecord {
  date: string; // YYYY-MM-DD
  weight: number;
  bodyFat?: number;
}

interface AppState {
  userData: UserData;
  dietLogs: DietLog[];
  workoutLogs: Record<string, WorkoutLog>;
  weightRecords: WeightRecord[];
  
  // Actions
  updateUserData: (data: Partial<UserData>) => void;
  addDietLog: (log: Omit<DietLog, 'id'>) => void;
  removeDietLog: (id: string) => void;
  toggleWorkoutSet: (date: string, setName: string, reps: string) => void;
  addWeightRecord: (record: WeightRecord) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      userData: DEFAULT_USER_DATA,
      dietLogs: [],
      workoutLogs: {},
      weightRecords: [
        { date: new Date().toISOString().split('T')[0], weight: 69, bodyFat: 20.3 }
      ],

      updateUserData: (data) =>
        set((state) => ({
          userData: { ...state.userData, ...data },
        })),

      addDietLog: (log) =>
        set((state) => ({
          dietLogs: [...state.dietLogs, { ...log, id: generateId() }],
        })),

      removeDietLog: (id) =>
        set((state) => ({
          dietLogs: state.dietLogs.filter((log) => log.id !== id),
        })),

      toggleWorkoutSet: (date, setName, reps) =>
        set((state) => {
          const dayLog = state.workoutLogs[date] || { date, completed: false, sets: [] };
          
          let existingSetIndex = dayLog.sets.findIndex(s => s.name === setName && s.reps === reps);
          let newSets = [...dayLog.sets];
          
          if (existingSetIndex >= 0) {
            newSets[existingSetIndex].completed = !newSets[existingSetIndex].completed;
          } else {
            newSets.push({ name: setName, reps: reps, completed: true });
          }

          return {
            workoutLogs: {
              ...state.workoutLogs,
              [date]: {
                ...dayLog,
                sets: newSets
              }
            }
          };
        }),

      addWeightRecord: (record) =>
        set((state) => {
          const newRecords = [...state.weightRecords, record];
          // Sort by date ascending
          newRecords.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          return { weightRecords: newRecords };
        }),
    }),
    {
      name: 'fit-with-me-storage',
    }
  )
);
