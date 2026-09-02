'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, ArrowRight, RefreshCw, Lock } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SkinMetricCard } from '@/components/analysis/SkinMetricCard';
import { DisclaimerBanner } from '@/components/layout/DisclaimerBanner';
import { SkinMetrics } from '@/types';
import { useAuth } from '@/context/AuthContext';

function SnapshotContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const analysisId = searchParams.get('id');
  const preselectedProductId = searchParams.get('productId');

  const { user, isLoading: authLoading } = useAuth();

  const [metrics, setMetrics] = useState<SkinMetrics | null>(null);
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedMetrics = sessionStorage.getItem('currentAnalysisMetrics');
      const storedImage = sessionStorage.getItem('currentAnalysisImage');

      if (storedMetrics) {
        setMetrics(JSON.parse(storedMetrics));
      }
      if (storedImage) {
        setImagePath(storedImage);
      }
    }
    setLoading(false);
  }, [analysisId]);

  if (authLoading || loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <RefreshCw className="w-8 h-8 animate-spin text-skinora-600" />
        <p className="text-xs text-stone-500">Loading skin snapshot...</p>
      </div>
    );
  }

  // If unauthenticated, prompt login
  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <Card variant="glass" className="p-8 border-stone-200">
          <div className="w-12 h-12 bg-skinora-100 text-skinora-800 rounded-full flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-stone-900">Authentication Required</h2>
          <p className="text-xs text-stone-600 mb-4">
            Sign in to view your skin snapshot and match formulations.
          </p>
          <Link href={`/login?redirect=${encodeURIComponent(`/analyze/snapshot?id=${analysisId || ''}`)}`}>
            <Button variant="primary">Sign In to Continue</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const displayMetrics: SkinMetrics = metrics || {
    brightness: 72,
    evenness: 63,
    darkSpots: 'Moderate',
    redness: 'Low',
    texture: 'Moderate',
    pores: 'Refined',
    appearanceNotes:
      'Visible cosmetic characteristics show mild surface dullness with some visible uneven tone across the cheeks and forehead.',
    isDemo: true,
  };

  const displayImage =
    imagePath ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';

  const proceedToProduct = () => {
    if (preselectedProductId) {
      router.push(`/analyze/select-product?analysisId=${analysisId || 'latest'}&productId=${preselectedProductId}`);
    } else {
      router.push(`/analyze/select-product?analysisId=${analysisId || 'latest'}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-8">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-skinora-100 text-skinora-800 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-skinora-600" />
            <span>Step 2 of 3: Skin Analysis Snapshot</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-skinora-900 tracking-tight">
            Your Skin Snapshot
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Visible surface characteristics extracted from your facial photo
          </p>
        </div>

        {displayMetrics.isDemo && (
          <div className="self-start sm:self-auto">
            <Badge variant="demo" size="md">
              Demo Analysis
            </Badge>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Photo Preview */}
        <div className="md:col-span-4 space-y-4">
          <Card variant="glass" className="p-3 border-stone-200">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-inner bg-stone-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={displayImage}
                alt="Your Skin Analysis Photo"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-full border border-white/20">
                Analyzed Portrait
              </div>
            </div>
            <div className="pt-3 text-center">
              <Link
                href="/analyze"
                className="text-xs text-skinora-700 hover:text-skinora-900 font-semibold inline-flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Retake or Change Photo
              </Link>
            </div>
          </Card>

          <div className="p-4 bg-white/80 rounded-2xl border border-stone-200 text-xs text-stone-600 space-y-2">
            <span className="font-bold text-skinora-900 block">Cosmetic Non-Diagnostic Notice</span>
            <p className="text-[11px] leading-relaxed">
              These scores reflect estimated surface light reflection and pigment distribution for cosmetic product matching. They do not represent dermatological diagnoses.
            </p>
          </div>
        </div>

        {/* Right Column: Cosmetic Metrics */}
        <div className="md:col-span-8 space-y-6">
          <SkinMetricCard metrics={displayMetrics} />

          {/* Action Row */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/80 p-6 rounded-3xl border border-stone-200 shadow-sm">
            <div>
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                Next Step
              </span>
              <span className="text-base font-bold text-skinora-900">
                Match with Skincare Formulation
              </span>
            </div>

            <Button
              size="lg"
              variant="primary"
              onClick={proceedToProduct}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {preselectedProductId ? 'Analyze Compatibility' : 'Select Product to Match'}
            </Button>
          </div>
        </div>
      </div>

      <DisclaimerBanner compact />
    </div>
  );
}

export default function SnapshotPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-stone-500">Loading snapshot...</div>}>
      <SnapshotContent />
    </Suspense>
  );
}
