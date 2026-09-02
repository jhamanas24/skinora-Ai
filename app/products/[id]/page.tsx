import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { Sparkles, Check, AlertTriangle, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { IngredientChip } from '@/components/analysis/IngredientChip';
import { DisclaimerBanner } from '@/components/layout/DisclaimerBanner';
import { formatCurrency } from '@/lib/utils';
import { Product } from '@/types';

export const revalidate = 0;

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const productRecord = await prisma.product.findUnique({
    where: { id: params.id },
  });

  if (!productRecord) {
    notFound();
  }

  const product: Product = {
    ...productRecord,
    ingredients: JSON.parse(productRecord.ingredients || '[]'),
    claimedBenefits: JSON.parse(productRecord.claimedBenefits || '[]'),
    skinTypes: JSON.parse(productRecord.skinTypes || '[]'),
    warnings: JSON.parse(productRecord.warnings || '[]'),
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-12">
      {/* Product Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
        {/* Product Photo */}
        <div className="md:col-span-5 bg-gradient-to-b from-stone-50 to-skinora-50 p-8 rounded-3xl border border-stone-200 shadow-md flex items-center justify-center">
          <div className="relative w-full aspect-square max-w-xs rounded-2xl overflow-hidden shadow-inner bg-white p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </div>

        {/* Product Bio & Primary Action */}
        <div className="md:col-span-7 space-y-6">
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-skinora-600 uppercase tracking-widest">
              {product.brand}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-skinora-900 tracking-tight">
              {product.name}
            </h1>
            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-2xl font-extrabold text-stone-900">
                {formatCurrency(product.price)}
              </span>
              <span className="text-xs text-stone-500 font-medium">({product.size})</span>
            </div>
          </div>

          <p className="text-sm text-stone-600 leading-relaxed">
            {product.description}
          </p>

          <div className="pt-2">
            <Link href={`/analyze?productId=${product.id}`}>
              <Button
                size="lg"
                variant="primary"
                className="w-full sm:w-auto justify-center"
                leftIcon={<Sparkles className="w-5 h-5 text-amber-200" />}
              >
                Analyze Compatibility With My Face
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap gap-4 pt-2 text-xs text-stone-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Dermatologically Safe Formula
            </span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-skinora-600" /> AI Compatibility Engine Ready
            </span>
          </div>
        </div>
      </div>

      {/* Ingredients & Benefits Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Ingredients */}
        <Card variant="glass" className="p-6 md:p-8 space-y-4">
          <h3 className="text-lg font-bold text-skinora-900">
            Active Ingredients & Purpose
          </h3>
          <div className="flex flex-wrap gap-2 pt-1">
            {product.ingredients.map((ing, idx) => (
              <IngredientChip key={idx} ingredient={ing} />
            ))}
          </div>
          <div className="space-y-2 pt-3 border-t border-stone-100">
            {product.ingredients.map((ing, idx) => (
              <div key={idx} className="text-xs text-stone-600">
                <strong className="font-semibold text-stone-900">{ing.name}:</strong>{' '}
                <span>{ing.purpose}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Claimed Benefits & Skin Types */}
        <Card variant="glass" className="p-6 md:p-8 space-y-4">
          <h3 className="text-lg font-bold text-skinora-900">
            Targeted Benefits & Suitability
          </h3>
          <ul className="space-y-2.5 text-xs sm:text-sm text-stone-700">
            {product.claimedBenefits.map((benefit, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>

          <div className="pt-4 border-t border-stone-100 space-y-2">
            <span className="text-xs font-semibold text-stone-800 block">
              Suitable Skin Types:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {product.skinTypes.map((type, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-stone-100 text-stone-700 text-xs rounded-full"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Usage & Warnings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card variant="glass" className="p-6 md:p-8 space-y-3">
          <h3 className="text-base font-bold text-skinora-900">
            Usage & Application Guide
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {product.usageInstructions}
          </p>
        </Card>

        <Card variant="glass" className="p-6 md:p-8 space-y-3 border-amber-200/60 bg-amber-50/20">
          <h3 className="text-base font-bold text-amber-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" /> Precautions & Warnings
          </h3>
          <ul className="space-y-2 text-xs text-stone-700">
            {product.warnings.map((warn, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                <span>{warn}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <DisclaimerBanner />
    </div>
  );
}
