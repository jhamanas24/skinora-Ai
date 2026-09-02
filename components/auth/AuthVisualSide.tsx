import React from 'react';
import { Sparkles, Scan, Eye, FlaskConical, CheckCircle2, ShieldCheck } from 'lucide-react';

export function AuthVisualSide() {
  const steps = [
    {
      icon: Scan,
      title: '1. Face Scan & Alignment',
      desc: 'Mobile-guided capture of visible surface characteristics and lighting.',
    },
    {
      icon: Eye,
      title: '2. AI Surface Analysis',
      desc: 'Visual evaluation of estimated radiance, tone uniformity, and texture.',
    },
    {
      icon: FlaskConical,
      title: '3. Formulation Active Matching',
      desc: 'Deep 5-factor compatibility model against product active concentrations.',
    },
    {
      icon: Sparkles,
      title: '4. Cosmetic Visual Simulation',
      desc: 'Identity-preserving before/after preview of plausible cosmetic improvements.',
    },
  ];

  return (
    <div className="relative hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-stone-950 via-stone-900 to-skinora-950 text-white rounded-3xl overflow-hidden shadow-2xl border border-stone-800">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-skinora-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-80 h-80 bg-rose-quartz/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Brand Header */}
      <div className="relative z-10 space-y-2">
        <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span className="text-xs font-semibold tracking-wider uppercase text-stone-200">
            Intelligent Skincare Tech
          </span>
        </div>

        <div className="pt-2">
          <h2 className="text-3xl font-extrabold tracking-tight text-white">
            SKINORA <span className="text-skinora-400 font-light">AI</span>
          </h2>
          <p className="text-xs uppercase tracking-widest text-skinora-300 font-medium mt-0.5">
            &quot;Know Before You Buy&quot;
          </p>
        </div>
      </div>

      {/* Center 4-Step Visual Journey */}
      <div className="relative z-10 my-8 space-y-5">
        <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block">
          Your Personalized Analysis Experience
        </span>

        <div className="space-y-4">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-4 p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm transition-all hover:bg-white/[0.08] hover:border-skinora-500/40"
              >
                <div className="w-9 h-9 rounded-xl bg-skinora-900/80 border border-skinora-500/40 text-amber-200 flex items-center justify-center shrink-0 shadow-sm">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-stone-100">{step.title}</h4>
                  <p className="text-[11px] text-stone-400 leading-snug">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Trust Quote */}
      <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-stone-400">
        <span className="flex items-center gap-1.5 font-medium text-stone-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Identity-Preserving Simulation
        </span>
        <span className="italic text-stone-400">See. Analyze. Choose.</span>
      </div>
    </div>
  );
}
