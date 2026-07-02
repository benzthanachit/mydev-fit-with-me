import { clsx } from "clsx";

interface CircularProgressProps {
  value: number;
  max: number;
  label: string;
  subLabel: string;
  colorClass?: string;
  size?: number;
  strokeWidth?: number;
}

export default function CircularProgress({
  value,
  max,
  label,
  subLabel,
  colorClass = "text-fitness-green",
  size = 120,
  strokeWidth = 10,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const safeValue = Math.min(Math.max(value, 0), max);
  const percent = max > 0 ? safeValue / max : 0;
  const strokeDashoffset = circumference - percent * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90 w-full h-full">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-800"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={clsx("transition-all duration-1000 ease-in-out", colorClass)}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-xl font-bold">{label}</span>
        <span className="text-xs text-gray-400">{subLabel}</span>
      </div>
    </div>
  );
}
