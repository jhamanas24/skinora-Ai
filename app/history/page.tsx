'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  History,
  Trash2,
  ExternalLink,
  RefreshCw,
  Sparkles,
  Camera,
  AlertCircle,
  Lock,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DisclaimerBanner } from '@/components/layout/DisclaimerBanner';
import { formatDate } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

interface HistoryItem {
  id: string;
  imagePath: string;
  brightness: number;
  evenness: number;
  createdAt: string;
  isDemo: boolean;
  recommendations: Array<{
    id: string;
    compatibilityScore: number;
    matchLevel: string;
    buyScore: number;
    product: {
      id: string;
      brand: string;
      name: string;
    };
  }>;
}

export default function HistoryPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/analyses/history');
      if (!res.ok) {
        if (res.status === 401) {
          router.push('/login?redirect=/history');
          return;
        }
        throw new Error('Failed to load history');
      }
      const data = await res.json();
      setItems(data.analyses || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        fetchHistory();
      } else {
        setLoading(false);
      }
    }
  }, [user, authLoading]);

  const handleDelete = async (analysisId: string) => {
    if (!confirm('Are you sure you want to delete this analysis and associated face photo?')) return;
    setDeletingId(analysisId);

    try {
      const res = await fetch('/api/analyses/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysisId }),
      });

      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.id !== analysisId));
      } else {
        alert('Failed to delete analysis record.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <RefreshCw className="w-8 h-8 animate-spin text-skinora-600" />
        <p className="text-xs text-stone-500">Loading analysis archive...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <Card variant="glass" className="p-8 border-stone-200">
          <div className="w-12 h-12 bg-skinora-100 text-skinora-800 rounded-full flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-stone-900">Sign In to View History</h2>
          <p className="text-xs text-stone-600 mb-4">
            Access your archived skin analyses and saved product compatibility reports.
          </p>
          <Link href="/login?redirect=/history">
            <Button variant="primary">Sign In to Continue</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-skinora-100 text-skinora-800 text-xs font-semibold mb-2">
            <History className="w-3.5 h-3.5 text-skinora-600" />
            <span>Analysis Archive</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-skinora-900 tracking-tight">
            Your Analysis History
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Review previous facial scans, compatibility calculations, and visual cosmetic simulations
          </p>
        </div>

        <Link href="/analyze">
          <Button variant="primary" size="sm" leftIcon={<Camera className="w-4 h-4 text-amber-200" />}>
            New Skin Analysis
          </Button>
        </Link>
      </div>

      {items.length > 0 ? (
        <div className="space-y-4">
          {items.map((item) => {
            const rec = item.recommendations[0];
            return (
              <Card
                key={item.id}
                variant="glass"
                className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6 border-stone-200"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="relative w-16 h-20 rounded-xl overflow-hidden shadow-inner bg-stone-900 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imagePath}
                      alt="Analysis thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-stone-400 font-mono block">
                      {formatDate(item.createdAt)}
                    </span>
                    <h4 className="text-sm font-bold text-skinora-900">
                      {rec ? `${rec.product.brand} - ${rec.product.name}` : 'Skin Snapshot'}
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-stone-600">
                        Radiance: <strong>{item.brightness}/100</strong>
                      </span>
                      <span>•</span>
                      <span className="text-xs text-stone-600">
                        Evenness: <strong>{item.evenness}/100</strong>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  {rec && (
                    <Badge matchLevel={rec.matchLevel as any} size="sm" />
                  )}

                  {rec && (
                    <Link href={`/analyze/result/${rec.id}`}>
                      <Button variant="secondary" size="sm" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                        View Report
                      </Button>
                    </Link>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    isLoading={deletingId === item.id}
                    className="text-stone-400 hover:text-rose-600"
                    title="Delete for privacy"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card variant="glass" className="p-12 text-center space-y-4 border-stone-200">
          <div className="w-12 h-12 rounded-full bg-skinora-100 text-skinora-800 flex items-center justify-center mx-auto">
            <History className="w-6 h-6 text-skinora-700" />
          </div>
          <h3 className="text-base font-bold text-skinora-900">
            No Previous Analyses Found
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Run your first skin compatibility scan to start building your personal formulation log.
          </p>
          <div className="pt-2">
            <Link href="/analyze">
              <Button variant="primary" size="sm">
                Start Skin Analysis
              </Button>
            </Link>
          </div>
        </Card>
      )}

      <DisclaimerBanner compact />
    </div>
  );
}
