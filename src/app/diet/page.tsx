"use client";

import { useAppStore } from "@/store/useAppStore";
import { Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const QUICK_ADDS = [
  { name: "เวย์โปรตีน 1 สกู๊ป", calories: 120, protein: 25, carbs: 2, fat: 1 },
  { name: "อกไก่ 100g", calories: 110, protein: 23, carbs: 0, fat: 1.5 },
  { name: "ไข่ต้ม 1 ฟอง", calories: 70, protein: 6, carbs: 0.5, fat: 5 },
  { name: "ข้าวสวย 1 ทัพพี", calories: 80, protein: 2, carbs: 18, fat: 0 },
];

export default function DietTracker() {
  const [mounted, setMounted] = useState(false);
  const { dietLogs, addDietLog, removeDietLog } = useAppStore();

  const [customName, setCustomName] = useState("");
  const [customCals, setCustomCals] = useState("");
  const [customProtein, setCustomProtein] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const todaysDiet = dietLogs.filter(log => log.date === todayStr);
  const totalCalories = todaysDiet.reduce((sum, log) => sum + log.calories, 0);
  const totalProtein = todaysDiet.reduce((sum, log) => sum + log.protein, 0);

  const handleQuickAdd = (food: typeof QUICK_ADDS[0]) => {
    addDietLog({
      name: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      date: todayStr,
    });
  };

  const handleCustomAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName || !customCals || !customProtein) return;
    
    addDietLog({
      name: customName,
      calories: Number(customCals),
      protein: Number(customProtein),
      carbs: 0,
      fat: 0,
      date: todayStr,
    });
    
    setCustomName("");
    setCustomCals("");
    setCustomProtein("");
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500 pb-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-white">Diet Tracker</h1>
        <p className="text-sm text-gray-400">Log your meals and hit your macros.</p>
      </header>

      {/* Summary */}
      <section className="flex gap-4">
        <div className="flex-1 bg-gray-900 rounded-2xl p-4 border border-gray-800 text-center">
          <p className="text-sm text-gray-400 mb-1">Calories</p>
          <p className="text-xl font-bold text-fitness-orange">{totalCalories} <span className="text-sm font-normal text-gray-500">kcal</span></p>
        </div>
        <div className="flex-1 bg-gray-900 rounded-2xl p-4 border border-gray-800 text-center">
          <p className="text-sm text-gray-400 mb-1">Protein</p>
          <p className="text-xl font-bold text-fitness-green">{totalProtein} <span className="text-sm font-normal text-gray-500">g</span></p>
        </div>
      </section>

      {/* Quick Add */}
      <section>
        <h2 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">Quick Add</h2>
        <div className="grid grid-cols-2 gap-3">
          {QUICK_ADDS.map((food, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickAdd(food)}
              className="flex flex-col text-left bg-gray-900 hover:bg-gray-800 border border-gray-800 p-3 rounded-xl transition-colors active:scale-95"
            >
              <span className="font-medium text-sm text-white mb-1">{food.name}</span>
              <div className="flex gap-2 text-xs">
                <span className="text-fitness-orange">{food.calories} kcal</span>
                <span className="text-fitness-green">{food.protein}g P</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Custom Add */}
      <section className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
        <h2 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">Custom Entry</h2>
        <form onSubmit={handleCustomAdd} className="flex flex-col gap-3">
          <input 
            type="text" 
            placeholder="Food name..." 
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-fitness-green"
          />
          <div className="flex gap-3">
            <input 
              type="number" 
              placeholder="Calories" 
              value={customCals}
              onChange={(e) => setCustomCals(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-fitness-orange"
            />
            <input 
              type="number" 
              placeholder="Protein (g)" 
              value={customProtein}
              onChange={(e) => setCustomProtein(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-fitness-green"
            />
          </div>
          <button type="submit" className="w-full mt-1 bg-gray-800 text-white font-medium py-2.5 rounded-xl hover:bg-gray-700 transition active:scale-95 flex items-center justify-center gap-2">
            <Plus size={18} /> Add Custom
          </button>
        </form>
      </section>

      {/* Today's Log */}
      <section>
        <h2 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">Today's Log</h2>
        {todaysDiet.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4 bg-gray-950 rounded-xl border border-dashed border-gray-800">No food logged yet today.</p>
        ) : (
          <div className="flex flex-col gap-2">
            <AnimatePresence>
              {todaysDiet.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex justify-between items-center bg-gray-900 border border-gray-800 p-3 rounded-xl"
                >
                  <div>
                    <p className="text-sm font-medium text-white">{log.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      <span className="text-fitness-orange">{log.calories} kcal</span>
                      <span className="mx-1.5">•</span>
                      <span className="text-fitness-green">{log.protein}g Protein</span>
                    </p>
                  </div>
                  <button 
                    onClick={() => removeDietLog(log.id)}
                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-gray-800 rounded-lg transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>
    </div>
  );
}
