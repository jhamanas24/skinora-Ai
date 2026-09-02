import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Camera,
  Layers,
  FlaskConical,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sun,
  Palette,
  Eye,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ScoreCircle } from '@/components/ui/ScoreCircle';
import { BeforeAfterSlider } from '@/components/ui/BeforeAfterSlider';
import { DisclaimerBanner } from '@/components/layout/DisclaimerBanner';

export default function HomePage() {
  return (
    <div className="space-y-24 md:space-y-32 pb-24 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 md:pt-20 lg:pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Subtle Ambient Glowing Background Orbs */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-rose-quartz/40 via-skinora-200/30 to-amber-100/40 blur-3xl -z-10 rounded-full pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline & CTA */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-stone-200 shadow-sm backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-skinora-600" />
              <span className="text-xs font-semibold text-skinora-900 tracking-wide uppercase">
                AI Skincare Compatibility Platform
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-skinora-900 leading-[1.15]">
              Know Before <br />
              <span className="gradient-text font-serif italic font-normal">You Buy.</span>
            </h1>

            <p className="text-base sm:text-lg text-stone-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Understand how a skincare product may suit your visible skin concerns before you spend. Compare active ingredients, compute your personalized compatibility score, and view plausible cosmetic before/after visual simulations.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link href="/analyze" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="primary"
                  className="w-full sm:w-auto"
                  leftIcon={<Sparkles className="w-5 h-5 text-amber-200" />}
                >
                  Analyze My Skin
                </Button>
              </Link>
              <Link href="#how-it-works" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  How It Works
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-6 pt-4 text-xs text-stone-500 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Non-Diagnostic & Safe
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-skinora-600" /> Transparent 5-Factor Scoring
              </span>
            </div>
          </div>

          {/* Right Column: Interactive Hero Mockup Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md">
              {/* Glass Card Showcase */}
              <Card
                variant="glass"
                className="p-6 md:p-8 space-y-6 shadow-2xl border-stone-200/90 relative z-10"
              >
                <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden border border-stone-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                        alt="Skinora Portrait"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-skinora-600 block">
                        Live Compatibility Check
                      </span>
                      <h4 className="text-sm font-bold text-skinora-900">
                        Pilgrim 10% Vitamin C Serum
                      </h4>
                    </div>
                  </div>
                  <Badge variant="success" size="sm">
                    84% Match
                  </Badge>
                </div>

                <div className="flex items-center justify-center py-2">
                  <ScoreCircle
                    score={84}
                    matchLevel="Good Match"
                    size={150}
                    strokeWidth={10}
                  />
                </div>

                <div className="space-y-2 bg-skinora-50/70 p-3.5 rounded-2xl border border-skinora-100 text-xs text-stone-700">
                  <div className="flex items-center gap-1.5 font-semibold text-skinora-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Dynamic Formulation Synergy:</span>
                  </div>
                  <p className="leading-relaxed">
                    10% 3-O-Ethyl Ascorbic Acid + 5% Niacinamide align with detected surface dullness and uneven tone.
                  </p>
                </div>

                <div className="text-center pt-1">
                  <span className="text-[11px] text-stone-400 italic">
                    AI Visual Simulation — Actual results may vary.
                  </span>
                </div>
              </Card>

              {/* Decorative Background Accent Card */}
              <div className="absolute -inset-2 bg-gradient-to-r from-skinora-200 to-rose-quartz rounded-[32px] transform rotate-1 -z-10 opacity-70 blur-sm" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW SKINORA AI WORKS */}
      <section id="how-it-works" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-28">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-skinora-600">
            Step-by-Step Experience
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-skinora-900 tracking-tight">
            How Skinora AI Works
          </h2>
          <p className="text-sm sm:text-base text-stone-600">
            Four simple steps to clarify product suitability and eliminate skincare trial-and-error.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              icon: Camera,
              title: 'Capture or Upload Photo',
              desc: 'Take a clear face photo in natural lighting. Our camera guides your alignment.',
            },
            {
              step: '02',
              icon: Eye,
              title: 'AI Skin Surface Scan',
              desc: 'Estimates visible radiance, tone consistency, redness, and texture without medical diagnosis.',
            },
            {
              step: '03',
              icon: FlaskConical,
              title: 'Formulation Matching',
              desc: 'Compares the product active ingredients against your visible priorities using a 5-factor scoring model.',
            },
            {
              step: '04',
              icon: Sparkles,
              title: 'Visual Simulation & Report',
              desc: 'Inspect interactive Before/After cosmetic simulation, tailored advantages, and buy recommendation.',
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <Card
                key={idx}
                variant="glass"
                hoverEffect
                className="relative p-6 sm:p-8 space-y-4 border-stone-200/90 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-skinora-100 text-skinora-800 flex items-center justify-center shadow-inner">
                      <Icon className="w-6 h-6 text-skinora-700" />
                    </div>
                    <span className="text-2xl font-black text-stone-200 font-mono">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-skinora-900">{item.title}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">{item.desc}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* 3. AI VISUAL SIMULATION SPOTLIGHT */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="glass-panel rounded-3xl p-8 md:p-14 border-stone-200 shadow-xl bg-gradient-to-b from-white to-skinora-50/50">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Simulation Text */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-skinora-100 text-skinora-800 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-skinora-600" /> Signature Feature
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-skinora-900 tracking-tight leading-tight">
                AI Visual Simulation: <br />
                <span className="font-serif italic font-normal text-skinora-700">
                  See the Plausible Change
                </span>
              </h2>

              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Experience identity-preserving cosmetic visualization. Our simulation maintains your natural face geometry, eye shape, and unique facial features while illustrating plausible tone brightening and radiance improvements associated with 10% Vitamin C and Niacinamide.
              </p>

              <div className="space-y-2.5 text-xs text-stone-700 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Preserves facial identity, shape, and structure</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Subtle tone evening & surface radiance enhancement</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Strictly non-medical cosmetic approximation</span>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/analyze">
                  <Button variant="primary" leftIcon={<Sparkles className="w-4 h-4 text-amber-200" />}>
                    Try Interactive Simulation
                  </Button>
                </Link>
              </div>
            </div>

            {/* Interactive Before/After Demonstration */}
            <div className="lg:col-span-7">
              <BeforeAfterSlider
                originalImage="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80"
                productName="Pilgrim 10% Vitamin C Face Serum"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. PRODUCT COMPATIBILITY SPOTLIGHT */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-skinora-600">
            Featured Compatibility Profile
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-skinora-900 tracking-tight">
            Pilgrim 10% Vitamin C Serum
          </h2>
          <p className="text-sm text-stone-600">
            Powered by 3-O-Ethyl Ascorbic Acid, 5% Niacinamide, and Kakadu Plum.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card variant="glass" className="p-8 md:p-10 border-stone-200 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="flex justify-center">
                <div className="w-48 h-56 rounded-3xl overflow-hidden shadow-md bg-white border border-stone-200 p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80"
                    alt="Pilgrim Vitamin C Serum"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
              </div>

              <div className="md:col-span-2 space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-skinora-600">
                    Flagship Product
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold text-skinora-900">
                    Pilgrim 10% Vitamin C Face Serum (30 ml)
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Formulated with stable Ethyl Ascorbic Acid to support skin radiance, Kakadu Plum antioxidant superfruit extract, and 5% Niacinamide to improve the visual appearance of uneven tone and dark spots.
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold rounded-full">
                    10% Vitamin C (Ethyl Ascorbic Acid)
                  </span>
                  <span className="px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold rounded-full">
                    5% Niacinamide
                  </span>
                  <span className="px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold rounded-full">
                    Kakadu Plum
                  </span>
                </div>

                <div className="pt-3 flex items-center gap-4">
                  <Link href="/analyze?productId=pilgrim-vitamin-c-serum-30ml">
                    <Button variant="primary" leftIcon={<Sparkles className="w-4 h-4 text-amber-200" />}>
                      Test My Compatibility
                    </Button>
                  </Link>
                  <Link href="/products/pilgrim-vitamin-c-serum-30ml">
                    <Button variant="outline">
                      View Full Details
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* 5. SAFETY & DISCLAIMER BANNER */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <DisclaimerBanner />
      </section>

      {/* 6. FINAL CALL TO ACTION */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <Card
          variant="dark"
          className="p-10 md:p-16 rounded-[36px] space-y-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-skinora-500/20 rounded-full blur-3xl -z-0 pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Ready to Know <br />
              <span className="font-serif italic font-normal text-amber-200">
                Before You Buy?
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-lg mx-auto leading-relaxed">
              Start your free skin compatibility assessment today. Get transparent active ingredient alignment and realistic cosmetic simulations in under 60 seconds.
            </p>
            <div className="pt-4">
              <Link href="/analyze">
                <Button
                  size="lg"
                  variant="primary"
                  className="bg-white text-stone-950 hover:bg-stone-100 font-bold"
                  leftIcon={<Sparkles className="w-5 h-5 text-skinora-600" />}
                >
                  Start Skin Analysis Now
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
