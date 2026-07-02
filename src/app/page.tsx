"use client";

import { useAppStore } from "@/store/useAppStore";
import CircularProgress from "@/components/CircularProgress";
import { getTodayWorkout } from "@/utils/workoutPlan";
import { CheckCircle2, Circle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const { userData, dietLogs, workoutLogs } = useAppStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Avoid hydration mismatch

  const todayStr = new Date().toISOString().split('T')[0];
  
  // Diet calculations
  const todaysDiet = dietLogs.filter(log => log.date === todayStr);
  const totalCalories = todaysDiet.reduce((sum, log) => sum + log.calories, 0);
  const totalProtein = todaysDiet.reduce((sum, log) => sum + log.protein, 0);

  // Workout calculations
  const todayWorkoutPlan = getTodayWorkout();
  const todayWorkoutLog = workoutLogs[todayStr];
  
  const totalExpectedSets = todayWorkoutPlan.exercises.reduce((sum, ex) => sum + ex.sets, 0);
  const completedSets = todayWorkoutLog?.sets?.filter(s => s.completed).length || 0;
  
  const isWorkoutCompleted = totalExpectedSets > 0 && completedSets >= totalExpectedSets;
  const isRestDay = totalExpectedSets === 0;

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-white">Today's Overview</h1>
        <p className="text-sm text-gray-400">Stay on track with your recomposition.</p>
      </header>

      {/* Progress Rings */}
      <section className="bg-gray-900 rounded-2xl p-5 border border-gray-800 shadow-lg">
        <h2 className="text-lg font-semibold mb-4 text-white">Nutrition</h2>
        <div className="flex justify-around items-center">
          <CircularProgress 
            value={totalCalories} 
            max={userData.calorieGoal} 
            label={`${totalCalories}`} 
            subLabel="kcal"
            colorClass="text-fitness-orange"
          />
          <CircularProgress 
            value={totalProtein} 
            max={userData.proteinGoal} 
            label={`${totalProtein}g`} 
            subLabel="Protein"
            colorClass="text-fitness-green"
          />
        </div>
        <div className="mt-4 text-center">
          <Link href="/diet" className="text-sm text-fitness-green font-medium hover:underline">
            + Add Food
          </Link>
        </div>
      </section>

      {/* Workout Summary */}
      <section className="bg-gray-900 rounded-2xl p-5 border border-gray-800 shadow-lg mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Workout</h2>
            <p className="text-xs text-fitness-green">{todayWorkoutPlan.title}</p>
          </div>
          {isRestDay ? (
            <span className="text-xs font-medium px-2 py-1 bg-gray-800 text-gray-300 rounded-full">
              Rest
            </span>
          ) : (
            <span className="text-xs font-medium px-2 py-1 bg-gray-800 text-gray-300 rounded-full">
              {completedSets} / {totalExpectedSets} Sets
            </span>
          )}
        </div>

        {!isRestDay && (
          <div className="flex items-center gap-3 bg-gray-950 p-3 rounded-xl border border-gray-800">
            {isWorkoutCompleted ? (
              <CheckCircle2 className="text-fitness-green w-6 h-6" />
            ) : (
              <Circle className="text-gray-600 w-6 h-6" />
            )}
            <div className="flex-1">
              <p className={isWorkoutCompleted ? "text-fitness-green font-medium line-through" : "text-gray-200 font-medium"}>
                {isWorkoutCompleted ? "Workout Completed!" : "Pending Exercises"}
              </p>
            </div>
            <Link href="/workout" className="text-xs bg-gray-800 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-gray-700 transition">
              {isWorkoutCompleted ? "View" : "Start"}
            </Link>
          </div>
        )}
        {isRestDay && (
          <div className="flex items-center gap-3 bg-gray-950 p-3 rounded-xl border border-gray-800">
             <p className="text-gray-400 text-sm">No workout scheduled for today. Enjoy your rest!</p>
          </div>
        )}
      </section>
    </div>
  );
}
