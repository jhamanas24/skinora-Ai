import React from 'react';
import { Sparkles, Info } from 'lucide-react';
import { ProductIngredient } from '@/types';
import { cn } from '@/lib/utils';

interface IngredientChipProps {
  ingredient: ProductIngredient;
  className?: string;
}

export function IngredientChip({ ingredient, className }: IngredientChipProps) {
  return (
    <div
      className={cn(
        'group relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
        ingredient.keyActive
          ? 'bg-amber-50/90 text-amber-900 border-amber-200/90 shadow-sm'
          : 'bg-stone-50 text-stone-700 border-stone-200',
        className
      )}
    >
      {ingredient.keyActive && <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
      <span className="font-semibold">{ingredient.name}</span>
      {ingredient.concentration && (
        <span className="text-[10px] opacity-75 font-mono">({ingredient.concentration})</span>
      )}

      {/* Hover Tooltip for purpose */}
      {ingredient.purpose && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-30 w-52 p-2.5 bg-stone-900 text-stone-100 text-[11px] rounded-xl shadow-xl pointer-events-none text-center">
          <p className="font-semibold text-amber-200 mb-0.5">{ingredient.name}</p>
          <p className="text-stone-300 leading-tight">{ingredient.purpose}</p>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-stone-900" />
        </div>
      )}
    </div>
  );
}
