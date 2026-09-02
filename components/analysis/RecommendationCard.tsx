import React from 'react';
import { Sparkles, ShieldCheck, CheckCircle2, AlertTriangle, Info, ArrowUpRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { ScoreCircle } from '@/components/ui/ScoreCircle';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { CompatibilityResult, Product, SkinMetrics } from '@/types';

interface RecommendationCardProps {
  result: CompatibilityResult;
  product: Product;
  metrics: SkinMetrics;
}

export function RecommendationCard({
  result,
  product,
  metrics,
}: RecommendationCardProps) {
  return (
    <div className="space-y-6">
      {/* Primary Score & Verdict Hero Card */}
      <Card
        variant="glass"
        className="p-6 md:p-10 border-stone-200/90 shadow-xl bg-gradient-to-br from-white via-skinora-50/40 to-stone-50"
      >
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Animated Circular Score */}
          <div className="shrink-0 flex flex-col items-center">
            <ScoreCircle
              score={result.compatibilityScore}
              matchLevel={result.matchLevel}
              size={190}
              strokeWidth={14}
            />
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mt-2">
              Formula Alignment
            </span>
          </div>

          {/* Verdict Description */}
          <div className="space-y-4 text-center md:text-left flex-1">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-skinora-600">
                Skinora Compatibility Assessment
              </span>
              <h3 className="text-2xl md:text-3xl font-extrabold text-skinora-900 tracking-tight">
                {result.buyVerdict}
              </h3>
            </div>

            <p className="text-sm md:text-base text-stone-700 leading-relaxed font-normal">
              {result.explanation}
            </p>

            {/* Buy Recommendation Metric Box */}
            <div className="bg-white/90 border border-skinora-200/80 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                  Product Recommendation Score
                </span>
                <span className="text-xl font-extrabold text-skinora-900">
                  {result.buyScore}% Match Index
                </span>
              </div>
              <div className="text-xs text-stone-600 sm:text-right max-w-xs">
                Calculated across 5 cosmetic suitability dimensions
              </div>
            </div>
          </div>
        </div>

        {/* Algorithm Factor Breakdown */}
        {result.factors && (
          <div className="mt-8 pt-6 border-t border-stone-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-skinora-600" />
                Transparent Scoring Breakdown
              </span>
              <span className="text-[11px] text-stone-500">Deterministic Multi-Factor Model</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              <div className="bg-stone-50/80 p-2.5 rounded-xl border border-stone-200/60">
                <span className="text-[10px] font-semibold text-stone-500 block truncate">
                  Visible Concern (40%)
                </span>
                <span className="text-sm font-bold text-skinora-900">
                  {result.factors.concernAlignmentScore}/100
                </span>
              </div>
              <div className="bg-stone-50/80 p-2.5 rounded-xl border border-stone-200/60">
                <span className="text-[10px] font-semibold text-stone-500 block truncate">
                  Ingredient Actives (25%)
                </span>
                <span className="text-sm font-bold text-skinora-900">
                  {result.factors.ingredientRelevanceScore}/100
                </span>
              </div>
              <div className="bg-stone-50/80 p-2.5 rounded-xl border border-stone-200/60">
                <span className="text-[10px] font-semibold text-stone-500 block truncate">
                  Goal Alignment (15%)
                </span>
                <span className="text-sm font-bold text-skinora-900">
                  {result.factors.userProfileScore}/100
                </span>
              </div>
              <div className="bg-stone-50/80 p-2.5 rounded-xl border border-stone-200/60">
                <span className="text-[10px] font-semibold text-stone-500 block truncate">
                  Sensitivity Check (10%)
                </span>
                <span className="text-sm font-bold text-skinora-900">
                  {result.factors.sensitivitySafetyScore}/100
                </span>
              </div>
              <div className="bg-stone-50/80 p-2.5 rounded-xl border border-stone-200/60">
                <span className="text-[10px] font-semibold text-stone-500 block truncate">
                  Formulation Fit (10%)
                </span>
                <span className="text-sm font-bold text-skinora-900">
                  {result.factors.suitabilityScore}/100
                </span>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Two Column Section: Advantages vs Cautions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Why It May Suit You (Advantages) */}
        <Card variant="glass" className="p-6 md:p-8 space-y-4 border-emerald-200/60 bg-emerald-50/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h4 className="text-base font-bold text-skinora-900">
                Why It May Suit You
              </h4>
              <span className="text-[11px] text-stone-500">
                Formula synergy with your visible characteristics
              </span>
            </div>
          </div>

          <ul className="space-y-3">
            {result.advantages.map((adv, idx) => (
              <li key={idx} className="flex items-start gap-3 text-xs md:text-sm text-stone-700 leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  ✓
                </span>
                <span>{adv}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Things To Consider (Cautions) */}
        <Card variant="glass" className="p-6 md:p-8 space-y-4 border-amber-200/60 bg-amber-50/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h4 className="text-base font-bold text-skinora-900">
                Things To Consider
              </h4>
              <span className="text-[11px] text-stone-500">
                Important precautions and usage notes
              </span>
            </div>
          </div>

          <ul className="space-y-3">
            {result.cautions.map((caution, idx) => (
              <li key={idx} className="flex items-start gap-3 text-xs md:text-sm text-stone-700 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-2" />
                <span>{caution}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
