"use client";

import { useAppStore } from "@/store/useAppStore";
import { getTodayWorkout } from "@/utils/workoutPlan";
import { useState, useEffect } from "react";
import { CheckCircle2, Circle, Info } from "lucide-react";
import { motion } from "framer-motion";
import { clsx } from "clsx";
import ExerciseModal from "@/components/ExerciseModal";

export default function WorkoutTracker() {
  const [mounted, setMounted] = useState(false);
  const { workoutLogs, toggleWorkoutSet } = useAppStore();
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayWorkoutPlan = getTodayWorkout();
  const todayWorkoutLog = workoutLogs[todayStr];

  const handleToggleSet = (exerciseName: string, reps: string) => {
    toggleWorkoutSet(todayStr, exerciseName, reps);
  };

  const isSetCompleted = (exerciseName: string, reps: string) => {
    if (!todayWorkoutLog) return false;
    const s = todayWorkoutLog.sets.find(s => s.name === exerciseName && s.reps === reps);
    return s ? s.completed : false;
  };

  const isRestDay = todayWorkoutPlan.exercises.length === 0;

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500 pb-8 relative">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-white">Workout</h1>
        <p className="text-sm text-fitness-green">{todayWorkoutPlan.dayName} - {todayWorkoutPlan.title}</p>
      </header>

      {isRestDay ? (
        <section className="bg-gray-900 rounded-2xl p-8 border border-gray-800 text-center flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
          >
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🧘‍♂️</span>
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">Rest & Recover</h2>
            <p className="text-sm text-gray-400">Take it easy today. Your muscles need time to rebuild and grow stronger.</p>
          </motion.div>
        </section>
      ) : (
        <section className="flex flex-col gap-4">
          {todayWorkoutPlan.exercises.map((exercise, idx) => (
            <div key={idx} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-white text-sm">{exercise.name}</h3>
                  <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full mt-1 inline-block">
                    {exercise.sets} Sets
                  </span>
                </div>
                {exercise.datasetId && (
                  <button 
                    onClick={() => setSelectedExerciseId(exercise.datasetId || null)}
                    className="p-1.5 bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Info size={16} />
                    <span className="text-xs font-medium pr-1">How-to</span>
                  </button>
                )}
              </div>
              
              <div className="flex flex-col gap-2">
                {Array.from({ length: exercise.sets }).map((_, setIdx) => {
                  const setRepsIdentifier = `Set ${setIdx + 1} (${exercise.reps})`;
                  const completed = isSetCompleted(exercise.name, setRepsIdentifier);
                  return (
                    <motion.button
                      key={setIdx}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleToggleSet(exercise.name, setRepsIdentifier)}
                      className={clsx(
                        "flex items-center gap-3 w-full p-3 rounded-xl border text-left transition-all duration-300",
                        completed 
                          ? "bg-fitness-green/10 border-fitness-green/30 text-fitness-green" 
                          : "bg-gray-950 border-gray-800 text-gray-300 hover:border-gray-600"
                      )}
                    >
                      <motion.div
                        initial={false}
                        animate={{
                          scale: completed ? [1, 1.2, 1] : 1,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {completed ? (
                          <CheckCircle2 className="w-5 h-5 text-fitness-green" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-500" />
                        )}
                      </motion.div>
                      
                      <div className="flex justify-between flex-1 items-center">
                        <span className={clsx("text-sm font-medium transition-all", completed && "line-through opacity-80")}>
                          Set {setIdx + 1}
                        </span>
                        <span className="text-xs opacity-70 font-mono">
                          {exercise.reps}
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Info Modal */}
      <ExerciseModal 
        isOpen={!!selectedExerciseId} 
        onClose={() => setSelectedExerciseId(null)} 
        datasetId={selectedExerciseId || undefined} 
      />
    </div>
  );
}
