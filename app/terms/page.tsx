import React from 'react';
import Link from 'next/link';
import { ShieldAlert, Info, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-10">
      <div className="flex items-center gap-2">
        <Link href="/">
          <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Home
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
          <span>Cosmetic Disclaimer & Terms of Use</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-skinora-900 tracking-tight">
          Terms of Use & Safety Disclaimer
        </h1>
        <p className="text-sm text-stone-500">
          Educational Skincare Assessment & Cosmetic Simulation Platform
        </p>
      </div>

      <Card variant="glass" className="p-8 md:p-12 border-stone-200 space-y-8 text-stone-700 text-sm leading-relaxed">
        <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200 text-amber-900 text-xs md:text-sm font-medium leading-relaxed">
          <strong>Mandatory Statement:</strong> Skinora AI provides an AI-generated educational and cosmetic product compatibility assessment. It does not provide medical diagnosis or professional dermatological advice. AI visualizations are illustrative and do not guarantee actual results. Individual results may vary. Always review product instructions and perform a patch test when appropriate.
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-skinora-900">
            1. Non-Diagnostic Scope
          </h2>
          <p>
            Skinora AI analyses visible skin characteristics (e.g. surface radiance, tone distribution, and appearance of dark spots) purely for matching cosmetic formulations. Never rely on this service to detect, diagnose, or treat dermatological medical diseases such as skin cancer, melanoma, rosacea, severe cystic acne, eczema, or fungal infections.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-skinora-900">
            2. Simulation Disclaimer
          </h2>
          <p>
            All generated images are designated as <em>&quot;AI Visual Simulation — Actual results may vary.&quot;</em> They represent illustrative approximations of cosmetic product claims and should not be construed as definitive medical forecasts or promises.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-skinora-900">
            3. Patch Testing & Active Ingredients
          </h2>
          <p>
            Certain active cosmetic ingredients, including 10% Vitamin C derivatives (3-O-Ethyl Ascorbic Acid) and Niacinamide, may cause mild transient tingling on sensitive skin. Users are advised to conduct a 24-hour patch test prior to full facial application and to maintain daily broad-spectrum SPF sunscreen usage.
          </p>
        </div>
      </Card>
    </div>
  );
}
