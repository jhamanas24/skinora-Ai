import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { Sparkles, ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/analysis/ProductCard';
import { DisclaimerBanner } from '@/components/layout/DisclaimerBanner';
import { Product } from '@/types';

export const revalidate = 0; // Dynamic server render

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const parsedProducts: Product[] = products.map((p) => ({
    ...p,
    ingredients: JSON.parse(p.ingredients || '[]'),
    claimedBenefits: JSON.parse(p.claimedBenefits || '[]'),
    skinTypes: JSON.parse(p.skinTypes || '[]'),
    warnings: JSON.parse(p.warnings || '[]'),
  }));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-skinora-100 text-skinora-800 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-skinora-600" />
          <span>Skincare Catalog</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-skinora-900 tracking-tight">
          Curated Skincare Formulations
        </h1>
        <p className="text-sm sm:text-base text-stone-600">
          Explore products scientifically formulated for visible radiance, tone evening, and hydration. Test any product against your face photo.
        </p>
      </div>

      <div className="space-y-8">
        {parsedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <DisclaimerBanner compact />
    </div>
  );
}
