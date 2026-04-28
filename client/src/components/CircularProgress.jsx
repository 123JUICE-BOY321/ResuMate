import React from 'react';

const CircularProgress = ({ value, label, size = "lg", color = "text-sky-400" }) => {
  const radius = size === "lg" ? 45 : size === "md" ? 35 : 24;
  const stroke = size === "lg" ? 8 : size === "md" ? 6 : 4;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center relative">
      <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
        <circle stroke="rgba(255,255,255,0.05)" fill="transparent" strokeWidth={stroke} r={normalizedRadius} cx={radius} cy={radius} />
        <circle stroke="currentColor" fill="transparent" strokeWidth={stroke} strokeDasharray={circumference + ' ' + circumference} style={{ strokeDashoffset, transition: "stroke-dashoffset 1s ease-in-out" }} r={normalizedRadius} cx={radius} cy={radius} className={`${color} drop-shadow-md`} />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`font-bold ${size === "lg" ? "text-3xl" : size === "md" ? "text-2xl" : "text-sm"} text-white tracking-tight`}>{value}</span>
      </div>
      {label && <span className="mt-2 text-sm text-slate-400 font-medium tracking-wide">{label}</span>}
    </div>
  );
};

export default CircularProgress;
