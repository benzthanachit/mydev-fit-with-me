"use client";

import { useState, useMemo } from "react";
import exercisesData from "@/data/exercises.json";
import { Search, ChevronRight } from "lucide-react";
import ExerciseModal from "@/components/ExerciseModal";
import { motion } from "framer-motion";

export default function ExercisesLibrary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBodyPart, setFilterBodyPart] = useState("all");
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);

  // Extract unique body parts for filter
  const bodyParts = useMemo(() => {
    const parts = new Set(exercisesData.map((ex: any) => ex.body_part));
    return ["all", ...Array.from(parts).sort()];
  }, []);

  const filteredExercises = useMemo(() => {
    return exercisesData.filter((ex: any) => {
      const matchSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchBodyPart = filterBodyPart === "all" || ex.body_part === filterBodyPart;
      return matchSearch && matchBodyPart;
    }).slice(0, 50); // Limit to 50 for performance on mobile
  }, [searchTerm, filterBodyPart]);

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500 pb-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-white">Exercise Library</h1>
        <p className="text-sm text-gray-400">Search from 1,300+ exercises.</p>
      </header>

      {/* Search and Filter */}
      <section className="flex flex-col gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-fitness-green"
          />
        </div>
        
        <select
          value={filterBodyPart}
          onChange={(e) => setFilterBodyPart(e.target.value)}
          className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-fitness-green appearance-none capitalize"
        >
          {bodyParts.map(part => (
             <option key={part as string} value={part as string}>
               {part === "all" ? "All Body Parts" : part}
             </option>
          ))}
        </select>
      </section>

      {/* Results */}
      <section className="flex flex-col gap-2">
        <p className="text-xs text-gray-500 mb-1">Showing top {filteredExercises.length} results</p>
        
        {filteredExercises.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No exercises found.</p>
          </div>
        ) : (
          filteredExercises.map((ex: any) => (
            <motion.button
              key={ex.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedExerciseId(ex.id)}
              className="flex items-center justify-between bg-gray-900 hover:bg-gray-800 border border-gray-800 p-4 rounded-xl text-left transition-colors"
            >
              <div>
                <h3 className="font-semibold text-white text-sm capitalize mb-1 line-clamp-1">{ex.name}</h3>
                <div className="flex gap-2">
                  <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded uppercase">{ex.body_part}</span>
                  <span className="text-[10px] bg-gray-800 text-fitness-green px-2 py-0.5 rounded uppercase">{ex.target}</span>
                </div>
              </div>
              <ChevronRight className="text-gray-500 w-5 h-5 shrink-0 ml-2" />
            </motion.button>
          ))
        )}
      </section>

      {/* Info Modal */}
      <ExerciseModal 
        isOpen={!!selectedExerciseId} 
        onClose={() => setSelectedExerciseId(null)} 
        datasetId={selectedExerciseId || undefined} 
      />
    </div>
  );
}
