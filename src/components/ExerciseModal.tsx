import { motion, AnimatePresence } from "framer-motion";
import { X, Info } from "lucide-react";
import exercisesData from "@/data/exercises.json";

interface ExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  datasetId?: string;
}

export default function ExerciseModal({ isOpen, onClose, datasetId }: ExerciseModalProps) {
  if (!datasetId) return null;
  
  // Find the exact exercise by ID in the dataset
  const exercise = exercisesData.find((ex: any) => ex.id === datasetId);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm max-w-md mx-auto"
          />
          
          {/* Modal Content */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md h-[85vh] bg-gray-900 border-t border-gray-800 rounded-t-3xl z-50 flex flex-col shadow-2xl"
          >
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-700 rounded-full" />
            </div>
            
            {exercise ? (
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                <div className="flex justify-between items-start gap-4">
                  <h2 className="text-2xl font-bold text-white capitalize leading-tight">
                    {exercise.name}
                  </h2>
                  <button onClick={onClose} className="p-2 bg-gray-800 text-gray-400 hover:text-white rounded-full transition">
                    <X size={20} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-fitness-orange/20 text-fitness-orange text-xs font-semibold rounded-full uppercase tracking-wider">
                    {exercise.body_part}
                  </span>
                  <span className="px-3 py-1 bg-fitness-green/20 text-fitness-green text-xs font-semibold rounded-full uppercase tracking-wider">
                    {exercise.target}
                  </span>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-semibold rounded-full uppercase tracking-wider">
                    {exercise.equipment}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider flex items-center gap-2">
                    <Info size={16} /> Instructions
                  </h3>
                  <div className="flex flex-col gap-3">
                    {exercise.instruction_steps?.en?.map((step: string, index: number) => (
                      <div key={index} className="flex gap-3 text-sm text-gray-300 leading-relaxed bg-gray-950 p-4 rounded-xl border border-gray-800">
                        <span className="text-fitness-green font-bold shrink-0">{index + 1}.</span>
                        <p>{step}</p>
                      </div>
                    ))}
                    {!exercise.instruction_steps?.en && (
                       <p className="text-sm text-gray-500 italic bg-gray-950 p-4 rounded-xl border border-dashed border-gray-800">
                         {exercise.instructions?.en || "No instructions available."}
                       </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <p className="text-gray-400">Exercise details not found in dataset.</p>
                <button onClick={onClose} className="mt-4 px-6 py-2 bg-gray-800 text-white rounded-xl">Close</button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
