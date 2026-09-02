'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowLeft, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProductIngredient } from '@/types';

export default function NewProductPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('Face Serum');
  const [price, setPrice] = useState('650');
  const [size, setSize] = useState('30 ml');
  const [image, setImage] = useState(
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80'
  );
  const [description, setDescription] = useState('');
  const [usageInstructions, setUsageInstructions] = useState('');
  const [ingredients, setIngredients] = useState<ProductIngredient[]>([
    {
      name: '3-O-Ethyl Ascorbic Acid (Vitamin C 10%)',
      concentration: '10%',
      purpose: 'Brightening antioxidant that targets surface dullness',
      keyActive: true,
    },
    {
      name: 'Niacinamide (Vitamin B3 5%)',
      concentration: '5%',
      purpose: 'Supports even skin tone appearance and pore refinement',
      keyActive: true,
    },
  ]);
  const [claimedBenefits, setClaimedBenefits] = useState<string>('Brightening, Reduces appearance of dark spots, Balances uneven tone');
  const [skinTypes, setSkinTypes] = useState<string>('All Skin Types, Dull Skin, Uneven Tone');
  const [warnings, setWarnings] = useState<string>('Patch test prior to use, Use sunscreen in AM routine, Store in cool dark place');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addIngredientRow = () => {
    setIngredients([
      ...ingredients,
      { name: '', concentration: '', purpose: '', keyActive: false },
    ]);
  };

  const removeIngredientRow = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, field: keyof ProductIngredient, val: any) => {
    const updated = [...ingredients];
    updated[index] = { ...updated[index], [field]: val };
    setIngredients(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          brand,
          category,
          price,
          size,
          image,
          description,
          usageInstructions,
          ingredients,
          claimedBenefits: claimedBenefits.split(',').map((b) => b.trim()).filter(Boolean),
          skinTypes: skinTypes.split(',').map((s) => s.trim()).filter(Boolean),
          warnings: warnings.split(',').map((w) => w.trim()).filter(Boolean),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create product');
      }

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-8">
      <div className="flex items-center gap-3">
        <Link href="/admin">
          <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Admin
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-skinora-900 tracking-tight">
          Add New Skincare Product
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          Define formulation specifications, active ingredient percentages, and benefits
        </p>
      </div>

      <Card variant="glass" className="p-6 md:p-10 border-stone-200 space-y-6">
        {error && (
          <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700">Brand Name</label>
              <input
                type="text"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Pilgrim"
                className="w-full px-4 py-2 text-sm bg-white/80 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-skinora-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700">Product Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="10% Vitamin C Face Serum"
                className="w-full px-4 py-2 text-sm bg-white/80 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-skinora-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700">Category</label>
              <input
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Face Serum"
                className="w-full px-4 py-2 text-sm bg-white/80 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-skinora-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700">Price (INR)</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="650"
                className="w-full px-4 py-2 text-sm bg-white/80 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-skinora-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700">Size / Volume</label>
              <input
                type="text"
                required
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="30 ml"
                className="w-full px-4 py-2 text-sm bg-white/80 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-skinora-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700">Image URL</label>
            <input
              type="url"
              required
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-4 py-2 text-sm bg-white/80 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-skinora-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Antioxidant-rich brightening serum..."
              className="w-full px-4 py-2 text-sm bg-white/80 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-skinora-500"
            />
          </div>

          {/* Active Ingredients Table */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-skinora-900 uppercase tracking-wider">
                Ingredients & Actives Specification
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addIngredientRow}
                leftIcon={<Plus className="w-3 h-3" />}
              >
                Add Ingredient
              </Button>
            </div>

            <div className="space-y-2.5">
              {ingredients.map((ing, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 gap-2 bg-stone-50 p-3 rounded-2xl border border-stone-200 items-center"
                >
                  <div className="col-span-4">
                    <input
                      type="text"
                      placeholder="Name (e.g. 10% Vitamin C)"
                      value={ing.name}
                      onChange={(e) => updateIngredient(idx, 'name', e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-stone-200 rounded-lg"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="text"
                      placeholder="Concentration"
                      value={ing.concentration}
                      onChange={(e) => updateIngredient(idx, 'concentration', e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-stone-200 rounded-lg"
                    />
                  </div>
                  <div className="col-span-4">
                    <input
                      type="text"
                      placeholder="Purpose / Mechanism"
                      value={ing.purpose}
                      onChange={(e) => updateIngredient(idx, 'purpose', e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-stone-200 rounded-lg"
                    />
                  </div>
                  <div className="col-span-1 text-center">
                    <label className="text-[10px] font-semibold text-stone-500 flex flex-col items-center">
                      <input
                        type="checkbox"
                        checked={ing.keyActive}
                        onChange={(e) => updateIngredient(idx, 'keyActive', e.target.checked)}
                        className="rounded text-skinora-600 focus:ring-skinora-500"
                      />
                      Active
                    </label>
                  </div>
                  <div className="col-span-1 text-right">
                    <button
                      type="button"
                      onClick={() => removeIngredientRow(idx)}
                      className="text-stone-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700">
              Claimed Benefits (comma-separated)
            </label>
            <input
              type="text"
              value={claimedBenefits}
              onChange={(e) => setClaimedBenefits(e.target.value)}
              className="w-full px-4 py-2 text-sm bg-white/80 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-skinora-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700">
              Usage & Application Instructions
            </label>
            <textarea
              rows={2}
              value={usageInstructions}
              onChange={(e) => setUsageInstructions(e.target.value)}
              placeholder="Apply 3-5 drops onto cleansed face in AM/PM routines..."
              className="w-full px-4 py-2 text-sm bg-white/80 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-skinora-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700">
              Warnings & Precautions (comma-separated)
            </label>
            <input
              type="text"
              value={warnings}
              onChange={(e) => setWarnings(e.target.value)}
              className="w-full px-4 py-2 text-sm bg-white/80 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-skinora-500"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-stone-100">
            <Link href="/admin">
              <Button variant="ghost" type="button">
                Cancel
              </Button>
            </Link>
            <Button variant="primary" type="submit" isLoading={isLoading}>
              Save & Publish Product
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
