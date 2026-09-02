'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Scan, FlaskConical, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingAnimationProps {
  stage?: 'skin' | 'compatibility' | 'simulation' | 'generic';
  className?: string;
}

const STAGES = [
  {
    icon: Scan,
    title: 'Scanning facial characteristics...',
    subtitle: 'Assessing visible brightness, tone distribution, and texture',
  },
  {
    icon: FlaskConical,
    title: 'Matching formulation actives...',
    subtitle: 'Evaluating 10% Vitamin C, 5% Niacinamide & Kakadu Plum interactions',
  },
  {
    icon: Sparkles,
    title: 'Synthesizing visual simulation...',
    subtitle: 'Rendering identity-preserving cosmetic before/after preview',
  },
];

export function LoadingAnimation({
  stage = 'generic',
  className,
}: LoadingAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % STAGES.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  const ActiveIcon = STAGES[currentStep].icon;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 md:p-12 text-center max-w-md mx-auto',
        className
      )}
    >
      {/* Animated Orb */}
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-skinora-300 via-rose-quartz to-skinora-500 animate-pulse-slow p-1 shadow-glow-rose flex items-center justify-center">
          <div className="w-full h-full bg-white rounded-full flex items-center justify-center shadow-inner">
            <ActiveIcon className="w-10 h-10 text-skinora-700 animate-float" />
          </div>
        </div>
        <div className="absolute -inset-2 rounded-full border border-skinora-400/40 animate-ping opacity-25 pointer-events-none" />
      </div>

      {/* Dynamic Stage Copy */}
      <h3 className="text-xl md:text-2xl font-bold text-skinora-900 mb-2 transition-all duration-300">
        {STAGES[currentStep].title}
      </h3>
      <p className="text-sm text-stone-500 max-w-xs transition-all duration-300">
        {STAGES[currentStep].subtitle}
      </p>

      {/* Step Indicators */}
      <div className="flex items-center gap-2 mt-8">
        {STAGES.map((_, idx) => (
          <div
            key={idx}
            className={cn(
              'h-1.5 rounded-full transition-all duration-500',
              idx === currentStep
                ? 'w-8 bg-skinora-800'
                : 'w-2 bg-stone-200'
            )}
          />
        ))}
      </div>
    </div>
  );
}
