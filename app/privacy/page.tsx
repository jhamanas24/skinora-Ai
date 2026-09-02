import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, EyeOff, Trash2, ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function PrivacyPage() {
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Biometric & Image Privacy Notice</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-skinora-900 tracking-tight">
          Privacy Policy & Data Ethics
        </h1>
        <p className="text-sm text-stone-500">
          Last updated: September 2026 • Skinora AI Technologies
        </p>
      </div>

      <Card variant="glass" className="p-8 md:p-12 border-stone-200 space-y-8 text-stone-700 text-sm leading-relaxed">
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-skinora-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-skinora-700" />
            1. Facial Image Processing Policy
          </h2>
          <p>
            Your uploaded or captured face photo is processed solely to extract visible cosmetic surface characteristics (such as estimated surface brightness, tone uniformity, and general visible skin observations) and to generate your illustrative Before/After visual simulation.
          </p>
          <p className="font-semibold text-skinora-900">
            We do NOT sell, license, or publish your face photos to third parties or advertising networks.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-skinora-900 flex items-center gap-2">
            <EyeOff className="w-5 h-5 text-skinora-700" />
            2. Identity Preservation Guarantee
          </h2>
          <p>
            Our cosmetic simulation engine preserves your true facial geometry, identity, eye color, and natural features. The simulation applies solely plausible cosmetic tone brightening and spot softening approximations relevant to the selected formulation.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-skinora-900 flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-skinora-700" />
            3. Right to Delete Your Data
          </h2>
          <p>
            You have full sovereignty over your data. You can delete any saved analysis record and its corresponding face photo permanently from your account via the <Link href="/history" className="text-skinora-700 underline font-semibold">Analysis History</Link> page at any time.
          </p>
        </div>

        <div className="space-y-3 pt-4 border-t border-stone-100">
          <h2 className="text-lg font-bold text-skinora-900">
            4. Non-Medical Purpose
          </h2>
          <p>
            Skinora AI is an educational cosmetic compatibility tool. Image evaluations do not constitute diagnostic medical imaging or disease screenings.
          </p>
        </div>
      </Card>
    </div>
  );
}
