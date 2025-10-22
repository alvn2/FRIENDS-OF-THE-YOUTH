import React from 'react';

interface ProgressRingProps {
  radius: number;
  stroke: number;
  progress: number;
  label: string;
}

const ProgressRing: React.FC<ProgressRingProps> = ({ radius, stroke, progress, label }) => {
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="-rotate-90"
      >
        <circle
          className="text-gray-200 dark:text-gray-700"
          stroke="currentColor"
          strokeWidth={stroke}
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          className="text-brand-red"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-xl font-bold text-light-text dark:text-dark-text">{progress}%</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 max-w-[80px]">{label}</div>
      </div>
    </div>
  );
};

export default ProgressRing;