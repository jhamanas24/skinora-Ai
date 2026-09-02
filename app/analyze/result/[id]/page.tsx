'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Bookmark,
  BookmarkCheck,
  RefreshCw,
  Share2,
  Check,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Camera,
  Layers,
  Info,
  Lock,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BeforeAfterSlider } from '@/components/ui/BeforeAfterSlider';
import { SkinMetricCard } from '@/components/analysis/SkinMetricCard';
import { RecommendationCard } from '@/components/analysis/RecommendationCard';
import { DisclaimerBanner } from '@/components/layout/DisclaimerBanner';
import { IngredientChip } from '@/components/analysis/IngredientChip';
import { FullAnalysisReport } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

export default function AnalysisResultPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const [report, setReport] = useState<FullAnalysisReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchReport() {
      try {
        const res = await fetch(`/api/analyses/${params.id}`);
        const data = await res.json();
        if (res.ok && data.report) {
          setReport(data.report);
        } else {
          if (res.status === 401) {
            setError('Please sign in to view this personalized skin analysis report.');
          } else {
            setError(data.error || 'Failed to fetch analysis report');
          }
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      fetchReport();
    }
  }, [params.id, authLoading]);

  const handleSave = async () => {
    if (!report) return;
    setSaveLoading(true);

    try {
      const res = await fetch('/api/analyses/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recommendationId: report.id }),
      });

      const data = await res.json();
      if (res.status === 401) {
        router.push(`/login?redirect=/analyze/result/${params.id}`);
        return;
      }

      if (res.ok) {
        setIsSaved(true);
      } else {
        alert(data.error || 'Could not save report');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="w-10 h-10 animate-spin text-skinora-600" />
        <p className="text-sm font-semibold text-stone-600">
          Loading your personalized Skinora report...
        </p>
      </div>
    );
  }

  // If unauthenticated or forbidden
  if (!user || error?.includes('sign in')) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <Card variant="glass" className="p-8 border-stone-200">
          <div className="w-12 h-12 bg-skinora-100 text-skinora-800 rounded-full flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-stone-900">Sign In to View Report</h2>
          <p className="text-xs text-stone-600 mb-4">
            Analysis results and cosmetic simulations are protected. Please sign in to your Skinora account.
          </p>
          <Link href={`/login?redirect=${encodeURIComponent(`/analyze/result/${params.id}`)}`}>
            <Button variant="primary">Sign In to View Result</Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <Card variant="glass" className="p-8 border-rose-200">
          <h2 className="text-xl font-bold text-stone-900 mb-2">Report Unavailable</h2>
          <p className="text-xs text-stone-600 mb-4">{error || 'The requested analysis report could not be found.'}</p>
          <Link href="/analyze">
            <Button variant="primary">Start New Analysis</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-12">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="match" size="sm">
              Compatibility Assessment Report
            </Badge>
            {report.isDemo && (
              <Badge variant="demo" size="sm">
                Demo Analysis
              </Badge>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-skinora-900 tracking-tight">
            Your Skinora AI Compatibility Result
          </h1>
          <span className="text-xs text-stone-500">
            Generated on {new Date(report.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            leftIcon={copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          >
            {copied ? 'Link Copied!' : 'Share'}
          </Button>

          <Button
            variant={isSaved ? 'secondary' : 'primary'}
            size="sm"
            onClick={handleSave}
            isLoading={saveLoading}
            leftIcon={isSaved ? <BookmarkCheck className="w-4 h-4 text-emerald-600" /> : <Bookmark className="w-4 h-4" />}
          >
            {isSaved ? 'Saved to Dashboard' : 'Save Analysis'}
          </Button>
        </div>
      </div>

      {/* 1. PRIMARY COMPATIBILITY VERDICT CARD */}
      <RecommendationCard
        result={{
          compatibilityScore: report.recommendation.compatibilityScore,
          matchLevel: report.recommendation.matchLevel,
          buyScore: report.recommendation.buyScore,
          buyVerdict: report.recommendation.buyVerdict,
          advantages: report.recommendation.advantages,
          cautions: report.recommendation.cautions,
          explanation: report.recommendation.explanation,
          factors: {
            concernAlignmentScore: 85,
            ingredientRelevanceScore: 90,
            userProfileScore: 80,
            sensitivitySafetyScore: 85,
            suitabilityScore: 88,
          },
        }}
        product={report.product}
        metrics={report.metrics}
      />

      {/* 2. SIGNATURE AI VISUAL SIMULATION SECTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-skinora-600 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Cosmetic Simulation
            </span>
            <h2 className="text-2xl font-bold text-skinora-900 tracking-tight">
              AI Visual Simulation
            </h2>
          </div>
          <span className="text-[11px] text-stone-500 hidden sm:inline">
            Identity-Preserving Cosmetic Render
          </span>
        </div>

        <Card variant="glass" className="p-6 md:p-10 border-stone-200/90 shadow-lg space-y-6">
          <BeforeAfterSlider
            originalImage={report.imagePath}
            simulatedImage={report.simulationImagePath || report.imagePath}
            productName={report.product.name}
          />

          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs text-stone-600 space-y-1">
            <span className="font-semibold text-skinora-900 block">Simulation Methodology:</span>
            <p className="leading-relaxed">
              This simulation demonstrates plausible cosmetic brightening and tone uniformity improvements associated with topical 10% Vitamin C and 5% Niacinamide. Facial geometry, eye color, and natural features are strictly preserved.
            </p>
          </div>
        </Card>
      </section>

      {/* 3. PRODUCT INFORMATION & INGREDIENTS BREAKDOWN */}
      <section className="space-y-4">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-skinora-600">
            Target Formulation
          </span>
          <h2 className="text-2xl font-bold text-skinora-900 tracking-tight">
            Matched Skincare Product
          </h2>
        </div>

        <Card variant="glass" className="p-6 md:p-8 border-stone-200 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-4 flex justify-center">
              <div className="w-44 h-52 rounded-2xl overflow-hidden shadow-inner bg-stone-50 p-2 border border-stone-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={report.product.image}
                  alt={report.product.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </div>

            <div className="md:col-span-8 space-y-4">
              <div>
                <span className="text-xs font-bold text-skinora-600 uppercase tracking-wider">
                  {report.product.brand}
                </span>
                <h3 className="text-xl font-bold text-skinora-900">
                  {report.product.name}
                </h3>
                <span className="text-sm font-extrabold text-stone-900 mt-1 block">
                  {formatCurrency(report.product.price)} • {report.product.size}
                </span>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed">
                {report.product.description}
              </p>

              {/* Ingredients */}
              <div className="space-y-1.5 pt-1">
                <span className="text-xs font-semibold text-stone-700 block">
                  Active Ingredients Evaluated:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {report.product.ingredients.map((ing, idx) => (
                    <IngredientChip key={idx} ingredient={ing} />
                  ))}
                </div>
              </div>

              {/* How to use */}
              <div className="pt-2 border-t border-stone-100 text-xs text-stone-600 space-y-1">
                <span className="font-semibold text-stone-800 block">Suggested Application:</span>
                <p className="leading-relaxed">{report.product.usageInstructions}</p>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* 4. USER SKIN SNAPSHOT METRICS */}
      <section className="space-y-4">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-skinora-600">
            Detected Skin Attributes
          </span>
          <h2 className="text-2xl font-bold text-skinora-900 tracking-tight">
            Your Skin Snapshot
          </h2>
        </div>

        <SkinMetricCard metrics={report.metrics} />
      </section>

      {/* 5. BOTTOM CALL TO ACTIONS */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 border-t border-stone-200">
        <Link href="/analyze/select-product">
          <Button variant="outline" size="md" leftIcon={<Layers className="w-4 h-4" />}>
            Compare Another Product
          </Button>
        </Link>
        <Link href="/analyze">
          <Button variant="secondary" size="md" leftIcon={<Camera className="w-4 h-4" />}>
            Scan New Photo
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Go to My Dashboard
          </Button>
        </Link>
      </div>

      {/* 6. SAFETY & MEDICAL DISCLAIMER */}
      <DisclaimerBanner />
    </div>
  );
}
