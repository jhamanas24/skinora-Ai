import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  valueLabel?: string;
  size?: 'sm' | 'md' | 'lg';
  colorVariant?: 'default' | 'emerald' | 'amber' | 'gradient';
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  label,
  valueLabel,
  size = 'md',
  colorVariant = 'gradient',
  className,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  };

  const colors = {
    default: 'bg-skinora-700',
    emerald: 'bg-emerald-600',
    amber: 'bg-amber-500',
    gradient: 'bg-gradient-to-r from-skinora-500 via-rose-accent to-skinora-700',
  };

  return (
    <div className={cn('w-full space-y-1.5', className)}>
      {(label || valueLabel) && (
        <div className="flex justify-between items-center text-xs">
          {label && <span className="font-medium text-stone-700">{label}</span>}
          {valueLabel && (
            <span className="font-semibold text-skinora-900">{valueLabel}</span>
          )}
        </div>
      )}
      <div
        className={cn(
          'w-full bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200/50',
          heights[size]
        )}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-1000 ease-out',
            colors[colorVariant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
