import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import {
  Sparkles,
  Camera,
  History,
  Bookmark,
  ArrowRight,
  Sun,
  ShieldCheck,
  CheckCircle2,
  Scan,
  Layers,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ScoreCircle } from '@/components/ui/ScoreCircle';
import { DisclaimerBanner } from '@/components/layout/DisclaimerBanner';
import { formatCurrency, formatDate } from '@/lib/utils';

export const revalidate = 0;

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login?redirect=/dashboard');
  }

  // Fetch user's analyses and saved recommendations
  const analyses = await prisma.skinAnalysis.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      recommendations: {
        include: {
          product: true,
        },
      },
    },
    take: 5,
  });

  const savedList = await prisma.savedAnalysis.findMany({
    where: { userId: user.id },
    include: {
      recommendation: {
        include: {
          product: true,
          skinAnalysis: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const latestAnalysis = analyses[0];
  const latestRecommendation = latestAnalysis?.recommendations[0];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-12">
      {/* Welcome Hero */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-skinora-100 text-skinora-800 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-skinora-600" />
            <span>Member Workspace</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-skinora-900 tracking-tight">
            Welcome back, {user.name}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Manage your personal skin profile, formulation matches, and saved simulations
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/analyze">
            <Button
              variant="primary"
              size="md"
              leftIcon={<Camera className="w-4 h-4 text-amber-200" />}
            >
              Analyze My Skin
            </Button>
          </Link>
        </div>
      </div>

      {/* Prominent "YOUR SKIN JOURNEY" Hero Card */}
      <Card
        variant="glass"
        className="p-8 md:p-10 border-stone-200/90 shadow-xl bg-gradient-to-r from-stone-900 via-stone-850 to-skinora-950 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-skinora-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-200 text-xs font-semibold">
              <Scan className="w-3.5 h-3.5" />
              <span>YOUR SKIN JOURNEY</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Your personalized skincare analysis is just a scan away.
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-xl leading-relaxed">
              Capture or upload your facial portrait to compute ingredient synergy against your visible skin characteristics and preview before/after cosmetic simulations.
            </p>
            <div className="pt-2">
              <Link href="/analyze">
                <Button
                  size="md"
                  variant="primary"
                  className="bg-white text-stone-950 hover:bg-stone-100 font-bold"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Analyze My Skin
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 text-center space-y-1 max-w-xs">
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-300 block">
                Total Face Scans
              </span>
              <span className="text-4xl font-extrabold text-white font-mono">
                {analyses.length}
              </span>
              <p className="text-[11px] text-stone-300">
                {savedList.length} bookmarked product formulations
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Latest Analysis Feature Box */}
      {latestAnalysis && latestRecommendation ? (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-skinora-900 tracking-tight">
              Latest Skinora Score & Recommendation
            </h2>
            <Link
              href={`/analyze/result/${latestRecommendation.id}`}
              className="text-xs font-semibold text-skinora-700 hover:text-skinora-900 flex items-center gap-1"
            >
              Open Full Report <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <Card variant="glass" className="p-6 md:p-8 border-stone-200 shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Photo */}
              <div className="md:col-span-3 flex justify-center">
                <div className="relative aspect-[3/4] w-36 rounded-2xl overflow-hidden shadow-inner bg-stone-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={latestAnalysis.imagePath}
                    alt="Latest Analysis"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-black/60 text-white text-[9px] px-2 py-0.5 rounded-full">
                    {formatDate(latestAnalysis.createdAt)}
                  </div>
                </div>
              </div>

              {/* Match Details */}
              <div className="md:col-span-6 space-y-3">
                <span className="text-xs font-bold text-skinora-600 uppercase tracking-widest block">
                  Evaluated with {latestRecommendation.product.brand}
                </span>
                <h3 className="text-lg font-bold text-skinora-900">
                  {latestRecommendation.product.name}
                </h3>
                <p className="text-xs text-stone-600 line-clamp-2">
                  {latestRecommendation.explanation}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <Badge matchLevel={latestRecommendation.matchLevel as any} size="sm" />
                  <span className="text-xs text-stone-500">
                    Buy recommendation: {latestRecommendation.buyScore}%
                  </span>
                </div>
              </div>

              {/* Circle Gauge */}
              <div className="md:col-span-3 flex justify-center">
                <ScoreCircle
                  score={latestRecommendation.compatibilityScore}
                  matchLevel={latestRecommendation.matchLevel as any}
                  size={130}
                  strokeWidth={10}
                />
              </div>
            </div>
          </Card>
        </section>
      ) : null}

      {/* Saved Analysis Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-skinora-900 tracking-tight">
            Saved Product Results
          </h2>
          <Link
            href="/products"
            className="text-xs font-semibold text-skinora-700 hover:text-skinora-900"
          >
            Explore More Products
          </Link>
        </div>

        {savedList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedList.map((item) => (
              <Card
                key={item.id}
                variant="glass"
                className="p-6 space-y-4 border-stone-200"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-skinora-600 block">
                      {item.recommendation.product.brand}
                    </span>
                    <h4 className="text-base font-bold text-skinora-900">
                      {item.recommendation.product.name}
                    </h4>
                  </div>
                  <Badge
                    matchLevel={item.recommendation.matchLevel as any}
                    size="sm"
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-stone-600 pt-2 border-t border-stone-100">
                  <span>Score: <strong>{item.recommendation.compatibilityScore}%</strong></span>
                  <span>Saved: {formatDate(item.createdAt)}</span>
                </div>

                <div className="pt-2 flex justify-end">
                  <Link href={`/analyze/result/${item.recommendation.id}`}>
                    <Button variant="secondary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                      View Report
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card variant="glass" className="p-8 text-center text-xs text-stone-500">
            No saved product results yet. When you run an analysis, click &quot;Save Analysis&quot; to bookmark it here.
          </Card>
        )}
      </section>

      <DisclaimerBanner compact />
    </div>
  );
}
