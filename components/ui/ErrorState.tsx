import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryText?: string;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'We encountered an unexpected issue while processing your request. Please try again.',
  onRetry,
  retryText = 'Try Again',
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'glass-panel rounded-3xl p-8 md:p-12 text-center max-w-md mx-auto space-y-4 border-rose-200/80',
        className
      )}
    >
      <div className="w-14 h-14 bg-rose-50 border border-rose-200 text-rose-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
        <AlertCircle className="w-7 h-7" />
      </div>
      <div className="space-y-1.5">
        <h3 className="text-xl font-bold text-stone-900">{title}</h3>
        <p className="text-sm text-stone-600 leading-relaxed">{message}</p>
      </div>
      {onRetry && (
        <div className="pt-3">
          <Button
            onClick={onRetry}
            variant="outline"
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            {retryText}
          </Button>
        </div>
      )}
    </div>
  );
}
