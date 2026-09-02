import React from 'react';
import { Sun, Palette, Sparkles, AlertCircle, Layers, Dot } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { SkinMetrics } from '@/types';

interface SkinMetricCardProps {
  metrics: SkinMetrics;
}

export function SkinMetricCard({ metrics }: SkinMetricCardProps) {
  const metricItems = [
    {
      label: 'Estimated Radiance / Brightness',
      score: metrics.brightness,
      displayVal: `${metrics.brightness}/100`,
      icon: Sun,
      description: metrics.brightness >= 75 ? 'Healthy, luminous surface appearance' : 'Mild visible surface dullness detected',
    },
    {
      label: 'Skin Tone Uniformity',
      score: metrics.evenness,
      displayVal: `${metrics.evenness}/100`,
      icon: Palette,
      description: metrics.evenness >= 70 ? 'Relatively even complexion distribution' : 'Visible uneven tone across cheek & forehead areas',
    },
  ];

  const categoricalItems = [
    {
      label: 'Visible Dark Spots',
      level: metrics.darkSpots,
      color: metrics.darkSpots === 'Low' ? 'text-emerald-700 bg-emerald-50' : 'text-amber-700 bg-amber-50',
    },
    {
      label: 'Visible Redness',
      level: metrics.redness,
      color: metrics.redness === 'Low' ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50',
    },
    {
      label: 'Surface Texture',
      level: metrics.texture,
      color: 'text-stone-800 bg-stone-100',
    },
    {
      label: 'Visible Pores',
      level: metrics.pores,
      color: 'text-stone-800 bg-stone-100',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Primary Numerical Visual Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {metricItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Card key={idx} variant="glass" className="p-5 md:p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-skinora-100 text-skinora-800 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-skinora-700" />
                  </div>
                  <span className="text-xs font-semibold text-stone-700">{item.label}</span>
                </div>
                <span className="text-lg font-bold text-skinora-900">{item.displayVal}</span>
              </div>
              <ProgressBar value={item.score} size="md" />
              <p className="text-[11px] text-stone-500 leading-snug">{item.description}</p>
            </Card>
          );
        })}
      </div>

      {/* Categorical Surface Observations */}
      <Card variant="glass" className="p-5 md:p-6 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600">
          Visible Surface Characteristics
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {categoricalItems.map((cat, idx) => (
            <div
              key={idx}
              className="bg-white/80 border border-stone-200/80 rounded-2xl p-3 text-center space-y-1"
            >
              <span className="text-[11px] font-medium text-stone-500 block truncate">
                {cat.label}
              </span>
              <span
                className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full ${cat.color}`}
              >
                {cat.level}
              </span>
            </div>
          ))}
        </div>

        {metrics.appearanceNotes && (
          <div className="pt-2 border-t border-stone-100 text-xs text-stone-600 leading-relaxed bg-skinora-50/50 p-3 rounded-2xl border border-skinora-100">
            <span className="font-semibold text-skinora-900 block mb-0.5">Visual Observation Summary:</span>
            {metrics.appearanceNotes}
          </div>
        )}
      </Card>
    </div>
  );
}
