'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { IngredientChip } from './IngredientChip';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

interface ProductCardProps {
  product: Product;
  onSelectForAnalysis?: (product: Product) => void;
  showFullDetails?: boolean;
}

export function ProductCard({
  product,
  onSelectForAnalysis,
  showFullDetails = false,
}: ProductCardProps) {
  const { user } = useAuth();
  const targetUrl = user
    ? `/analyze?productId=${product.id}`
    : `/login?redirect=${encodeURIComponent(`/analyze?productId=${product.id}`)}`;

  return (
    <Card variant="glass" className="overflow-hidden p-0 border-stone-200/90 shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
        {/* Product Image Column */}
        <div className="md:col-span-4 bg-gradient-to-b from-stone-50 to-skinora-50 p-6 flex flex-col items-center justify-center relative border-b md:border-b-0 md:border-r border-stone-100">
          <div className="relative w-44 h-48 md:h-56 rounded-2xl overflow-hidden shadow-inner bg-white p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover rounded-xl transition-transform duration-500 hover:scale-105"
            />
          </div>
          <span className="mt-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">
            {product.category} • {product.size}
          </span>
        </div>

        {/* Product Info Column */}
        <div className="md:col-span-8 p-6 md:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div>
              <span className="text-xs font-bold text-skinora-600 uppercase tracking-widest">
                {product.brand}
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-skinora-900 tracking-tight mt-0.5">
                {product.name}
              </h3>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-extrabold text-stone-900">
                {formatCurrency(product.price)}
              </span>
              <span className="text-xs text-stone-500 font-medium">({product.size})</span>
            </div>

            <p className="text-xs md:text-sm text-stone-600 leading-relaxed">
              {product.description}
            </p>

            {/* Key Active Ingredients */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-semibold text-stone-700 block">
                Key Actives & Formulation:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {product.ingredients.slice(0, 4).map((ing, idx) => (
                  <IngredientChip key={idx} ingredient={ing} />
                ))}
              </div>
            </div>

            {/* Claimed Benefits */}
            <div className="space-y-1.5 pt-2">
              <span className="text-xs font-semibold text-stone-700 block">
                Targeted Benefits:
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-stone-600">
                {product.claimedBenefits.slice(0, 4).map((benefit, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
            <Link
              href={`/products/${product.id}`}
              className="text-xs font-semibold text-skinora-800 hover:text-skinora-950 underline underline-offset-4"
            >
              View Full Product Profile
            </Link>

            {onSelectForAnalysis ? (
              <Button
                variant="primary"
                onClick={() => onSelectForAnalysis(product)}
                leftIcon={<Sparkles className="w-4 h-4 text-amber-200" />}
              >
                Analyze Compatibility
              </Button>
            ) : (
              <Link href={targetUrl}>
                <Button
                  variant="primary"
                  leftIcon={<Sparkles className="w-4 h-4 text-amber-200" />}
                >
                  Analyze Compatibility
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
