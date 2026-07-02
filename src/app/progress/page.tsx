"use client";

import { useAppStore } from "@/store/useAppStore";
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Plus } from "lucide-react";

export default function ProgressTracker() {
  const [mounted, setMounted] = useState(false);
  const { userData, weightRecords, addWeightRecord, updateUserData } = useAppStore();

  const [weight, setWeight] = useState("");
  const [bodyFat, setBodyFat] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleAddProgress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight) return;

    const record = {
      date: new Date().toISOString().split('T')[0],
      weight: Number(weight),
      bodyFat: bodyFat ? Number(bodyFat) : undefined,
    };
    
    addWeightRecord(record);
    
    // Update current baseline in user data
    updateUserData({
      weight: Number(weight),
      ...(bodyFat && { bodyFat: Number(bodyFat) })
    });

    setWeight("");
    setBodyFat("");
  };

  // Format date for chart (e.g. "YYYY-MM-DD" to "MM/DD")
  const chartData = weightRecords.map(record => ({
    ...record,
    displayDate: record.date.substring(5).replace('-', '/')
  }));

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500 pb-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-white">Progress</h1>
        <p className="text-sm text-gray-400">Track your body recomposition journey.</p>
      </header>

      {/* Current Stats */}
      <section className="flex gap-4">
        <div className="flex-1 bg-gray-900 rounded-2xl p-4 border border-gray-800 text-center">
          <p className="text-sm text-gray-400 mb-1">Current Weight</p>
          <p className="text-xl font-bold text-white">{userData.weight} <span className="text-sm font-normal text-gray-500">kg</span></p>
        </div>
        <div className="flex-1 bg-gray-900 rounded-2xl p-4 border border-gray-800 text-center">
          <p className="text-sm text-gray-400 mb-1">Body Fat</p>
          <p className="text-xl font-bold text-fitness-orange">{userData.bodyFat} <span className="text-sm font-normal text-gray-500">%</span></p>
        </div>
      </section>

      {/* Chart */}
      <section className="bg-gray-900 rounded-2xl p-4 border border-gray-800 shadow-sm h-[300px] w-full flex flex-col">
        <h2 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">Weight Trend</h2>
        <div className="flex-1 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <XAxis 
                dataKey="displayDate" 
                stroke="#6b7280" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke="#6b7280" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                domain={['auto', 'auto']}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', color: '#fff' }}
                itemStyle={{ color: '#10B981' }}
              />
              <Line 
                type="monotone" 
                dataKey="weight" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ r: 4, fill: '#10B981', strokeWidth: 2, stroke: '#030712' }}
                activeDot={{ r: 6, fill: '#10B981', strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Add Progress */}
      <section className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
        <h2 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">Log Update</h2>
        <form onSubmit={handleAddProgress} className="flex flex-col gap-3">
          <div className="flex gap-3">
            <input 
              type="number" 
              step="0.1"
              placeholder="Weight (kg)" 
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-fitness-green"
              required
            />
            <input 
              type="number" 
              step="0.1"
              placeholder="Body Fat (%)" 
              value={bodyFat}
              onChange={(e) => setBodyFat(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-fitness-orange"
            />
          </div>
          <button type="submit" className="w-full mt-1 bg-gray-800 text-white font-medium py-2.5 rounded-xl hover:bg-gray-700 transition active:scale-95 flex items-center justify-center gap-2">
            <Plus size={18} /> Save Progress
          </button>
        </form>
      </section>
    </div>
  );
}
