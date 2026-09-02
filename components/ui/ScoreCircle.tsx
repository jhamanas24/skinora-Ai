'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { MatchLevel } from '@/types';

interface ScoreCircleProps {
  score: number; // 0 - 100
  size?: number;
  strokeWidth?: number;
  matchLevel?: MatchLevel;
  label?: string;
  className?: string;
}

export function ScoreCircle({
  score,
  size = 180,
  strokeWidth = 12,
  matchLevel,
  label = 'Compatibility Score',
  className,
}: ScoreCircleProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 100);
    return () => clearTimeout(timer);
  }, [score]);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  let strokeColor = '#059669'; // Emerald default for high
  if (score < 50) strokeColor = '#E11D48'; // Rose
  else if (score < 65) strokeColor = '#D97706'; // Amber
  else if (score < 80) strokeColor = '#8C6C55'; // Skinora Warm Bronze

  return (
    <div
      className={cn(
        'relative inline-flex flex-col items-center justify-center select-none',
        className
      )}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#F3EDE8"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Animated Progress Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="score-circle-path transition-all duration-1000 ease-out"
        />
      </svg>

      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
        <span className="text-3xl md:text-4xl font-extrabold text-skinora-900 tracking-tight">
          {animatedScore}%
        </span>
        {matchLevel && (
          <span
            className="text-[11px] md:text-xs font-semibold uppercase tracking-wider mt-0.5 px-2 py-0.5 rounded-full"
            style={{ color: strokeColor }}
          >
            {matchLevel}
          </span>
        )}
      </div>
    </div>
  );
}
