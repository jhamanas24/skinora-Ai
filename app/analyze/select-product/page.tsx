'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, ArrowRight, RefreshCw, AlertCircle, Lock } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/analysis/ProductCard';
import { LoadingAnimation } from '@/components/ui/LoadingAnimation';
import { Product } from '@/types';
import { useAuth } from '@/context/AuthContext';

function SelectProductContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const analysisId = searchParams.get('analysisId');

  const { user, isLoading: authLoading } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (res.ok && data.products) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const handleSelectProduct = async (product: Product) => {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(`/analyze/select-product?analysisId=${analysisId || ''}`)}`);
      return;
    }

    setIsEvaluating(true);
    setError(null);

    try {
      let currentAnalysisId = analysisId;
      if (!currentAnalysisId || currentAnalysisId === 'demo' || currentAnalysisId === 'latest') {
        currentAnalysisId = sessionStorage.getItem('currentAnalysisId');
      }

      // If no analysis id exists (e.g. direct nav), create a quick demo analysis first
      if (!currentAnalysisId) {
        const demoRes = await fetch('/api/analyze/skin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
            imageBase64: 'demo',
          }),
        });

        if (demoRes.status === 401) {
          router.push(`/login?redirect=${encodeURIComponent('/analyze/select-product')}`);
          return;
        }

        const demoData = await demoRes.json();
        currentAnalysisId = demoData.analysisId;
      }

      // 2. Call compatibility endpoint
      const compRes = await fetch('/api/analyze/compatibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skinAnalysisId: currentAnalysisId,
          productId: product.id,
        }),
      });

      const compData = await compRes.json();
      if (!compRes.ok) {
        if (compRes.status === 401) {
          router.push(`/login?redirect=${encodeURIComponent('/analyze/select-product')}`);
          return;
        }
        throw new Error(compData.error || 'Failed to calculate compatibility');
      }

      // 3. Route to Result Page
      router.push(`/analyze/result/${compData.recommendationId}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error running compatibility analysis');
      setIsEvaluating(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <RefreshCw className="w-8 h-8 animate-spin text-skinora-600" />
        <p className="text-xs text-stone-500">Verifying member authorization...</p>
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
          <h2 className="text-xl font-bold text-stone-900">Sign In Required</h2>
          <p className="text-xs text-stone-600 mb-4">
            Sign in to compare skincare formulations against your skin analysis.
          </p>
          <Link href={`/login?redirect=${encodeURIComponent('/analyze/select-product')}`}>
            <Button variant="primary">Sign In to Continue</Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (isEvaluating) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <LoadingAnimation stage="compatibility" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-10">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-skinora-100 text-skinora-800 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-skinora-600" />
          <span>Step 3 of 3: Select Skincare Product</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-skinora-900 tracking-tight">
          Select Product to Compare
        </h1>
        <p className="text-sm sm:text-base text-stone-600">
          Match your visible skin characteristics with active ingredient formulations to generate your compatibility score and visual simulation.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 text-rose-700 text-sm rounded-2xl border border-rose-200 text-center">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-skinora-600 mx-auto mb-2" />
          <p className="text-xs text-stone-500">Loading skincare catalog...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectForAnalysis={handleSelectProduct}
            />
          ))}

          {products.length === 0 && (
            <Card variant="glass" className="p-12 text-center text-stone-500">
              No products found in catalog.
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

export default function SelectProductPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-stone-500">Loading products...</div>}>
      <SelectProductContent />
    </Suspense>
  );
}
