import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import {
  ShieldAlert,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Package,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Product } from '@/types';

export const revalidate = 0;

export default async function AdminPage() {
  const user = await getCurrentUser();

  // If not logged in or not admin, redirect
  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <Card variant="glass" className="p-8 border-rose-200">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-2">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-stone-900">Admin Authorization Required</h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            You must be logged in as an administrator to access the product catalog manager.
          </p>
          <div className="pt-3">
            <Link href="/login">
              <Button variant="primary" size="sm">
                Sign In as Admin
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900 text-stone-100 text-xs font-semibold mb-2">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-300" />
            <span>Admin Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-skinora-900 tracking-tight">
            Product Catalog Management
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Create, modify, and audit active ingredient formulations and compatibility rules
          </p>
        </div>

        <Link href="/admin/products/new">
          <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
            Add New Product
          </Button>
        </Link>
      </div>

      {/* Catalog Table Card */}
      <Card variant="glass" className="p-0 overflow-hidden border-stone-200 shadow-md">
        <div className="p-6 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-skinora-700" />
            <h3 className="font-bold text-skinora-900 text-base">
              Active Catalog Formulations ({parsedProducts.length})
            </h3>
          </div>
        </div>

        <div className="divide-y divide-stone-100">
          {parsedProducts.map((p) => (
            <div
              key={p.id}
              className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-stone-50/50 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0 p-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-skinora-600 uppercase tracking-wider block">
                    {p.brand} • {p.category}
                  </span>
                  <h4 className="text-sm md:text-base font-bold text-skinora-900">
                    {p.name}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-stone-500">
                    <span>{formatCurrency(p.price)}</span>
                    <span>•</span>
                    <span>{p.size}</span>
                    <span>•</span>
                    <span>{p.ingredients.length} Ingredients</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-auto">
                <Link href={`/products/${p.id}`} target="_blank">
                  <Button variant="ghost" size="sm" title="View Public Page">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href={`/admin/products/${p.id}/edit`}>
                  <Button variant="outline" size="sm" leftIcon={<Edit className="w-3.5 h-3.5" />}>
                    Edit Product
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
