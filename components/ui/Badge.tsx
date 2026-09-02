import React from 'react';
import { cn } from '@/lib/utils';
import { MatchLevel } from '@/types';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'demo' | 'neutral' | 'match';
  matchLevel?: MatchLevel;
  size?: 'sm' | 'md' | 'lg';
}

export function Badge({
  className,
  children,
  variant = 'default',
  matchLevel,
  size = 'md',
  ...props
}: BadgeProps) {
  let resolvedVariant = variant;

  if (matchLevel) {
    if (matchLevel === 'Strong Match') resolvedVariant = 'success';
    else if (matchLevel === 'Good Match') resolvedVariant = 'default';
    else if (matchLevel === 'Consider Carefully') resolvedVariant = 'warning';
    else resolvedVariant = 'danger';
  }

  const variants = {
    default:
      'bg-skinora-100 text-skinora-800 border border-skinora-200/80',
    success:
      'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-sm shadow-emerald-500/10',
    warning:
      'bg-amber-50 text-amber-800 border border-amber-200 shadow-sm shadow-amber-500/10',
    danger:
      'bg-rose-50 text-rose-800 border border-rose-200 shadow-sm shadow-rose-500/10',
    demo:
      'bg-purple-50 text-purple-700 border border-purple-200 uppercase tracking-wider font-semibold',
    neutral:
      'bg-stone-100 text-stone-700 border border-stone-200',
    match:
      'bg-skinora-900 text-white shadow-sm',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 font-medium rounded-full',
    md: 'text-xs px-3 py-1 font-medium rounded-full',
    lg: 'text-sm px-4 py-1.5 font-semibold rounded-full',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 transition-colors select-none',
        variants[resolvedVariant],
        sizes[size],
        className
      )}
      {...props}
    >
      {matchLevel ? matchLevel : children}
    </span>
  );
}
