import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DisclaimerBannerProps {
  compact?: boolean;
  className?: string;
}

export function DisclaimerBanner({
  compact = false,
  className,
}: DisclaimerBannerProps) {
  if (compact) {
    return (
      <div
        className={cn(
          'bg-stone-50 border border-stone-200/80 rounded-2xl p-4 flex items-start gap-3 text-xs text-stone-600',
          className
        )}
      >
        <Info className="w-4 h-4 text-skinora-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="font-semibold text-stone-800">Educational & Cosmetic Notice:</strong> Skinora AI provides visual cosmetic compatibility estimates and does not diagnose medical conditions, allergies, or replace professional dermatological advice. AI simulations are illustrative. Always patch test before application.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'glass-panel rounded-3xl p-6 md:p-8 border-stone-200/90 shadow-sm relative overflow-hidden',
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="space-y-1.5">
          <h4 className="text-base font-bold text-skinora-900 tracking-tight">
            Important Medical & Cosmetic Safety Disclaimer
          </h4>
          <p className="text-xs md:text-sm text-stone-600 leading-relaxed">
            Skinora AI is an educational and cosmetic product compatibility platform designed to help consumers assess formulation suitability based on visible surface skin characteristics. It does <strong>NOT</strong> provide medical diagnosis, treat dermatological diseases (such as eczema, rosacea, or infections), or guarantee product efficacy. AI visual simulations are illustrative cosmetic approximations — actual results vary by individual biology, sunscreen usage, and routine consistency. Always review official packaging instructions and perform a patch test before regular use.
          </p>
        </div>
      </div>
    </div>
  );
}
