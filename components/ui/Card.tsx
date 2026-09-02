import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  variant?: 'default' | 'glass' | 'subtle' | 'outline' | 'dark';
}

export function Card({
  className,
  children,
  hoverEffect = false,
  variant = 'glass',
  ...props
}: CardProps) {
  const variants = {
    default: 'bg-white border border-stone-200/80 shadow-sm',
    glass: 'glass-panel shadow-sm',
    subtle: 'glass-panel-subtle',
    outline: 'bg-transparent border border-skinora-200',
    dark: 'bg-stone-900 text-stone-100 border border-stone-800 shadow-xl',
  };

  return (
    <div
      className={cn(
        'rounded-3xl p-6 md:p-8 transition-all duration-300',
        variants[variant],
        hoverEffect && 'glass-card-hover cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mb-4 space-y-1.5', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        'text-xl md:text-2xl font-semibold tracking-tight text-skinora-900',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-sm text-stone-500 leading-relaxed', className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('space-y-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('mt-6 pt-4 border-t border-stone-100 flex items-center justify-between', className)}
      {...props}
    >
      {children}
    </div>
  );
}
