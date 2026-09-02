'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, Lock, Mail, User, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { AuthVisualSide } from '@/components/auth/AuthVisualSide';
import { useAuth } from '@/context/AuthContext';

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/analyze';

  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (!agreed) {
      setError('Please agree to the educational cosmetic terms and privacy notice.');
      return;
    }

    setIsLoading(true);

    const result = await register(name, email, password);
    if (!result.success) {
      setError(result.error || 'Registration failed');
      setIsLoading(false);
      return;
    }

    // Automatically navigate to redirect destination
    router.push(redirectPath);
    router.refresh();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch min-h-[660px]">
        {/* Left Side: Premium Skincare/AI Visual Section */}
        <div className="hidden lg:block lg:col-span-6">
          <AuthVisualSide />
        </div>

        {/* Right Side: Signup Card */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          <Card
            variant="glass"
            className="p-8 sm:p-12 shadow-2xl border-stone-200/90 space-y-6 max-w-lg mx-auto w-full"
          >
            {/* Mobile Branding Header */}
            <div className="lg:hidden flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-skinora-900 to-skinora-700 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5 text-amber-200" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-skinora-900 leading-none block">
                  SKINORA AI
                </span>
                <span className="text-[9px] uppercase tracking-widest text-stone-500 font-medium">
                  Know Before You Buy
                </span>
              </div>
            </div>

            {/* Headline & Supporting Text */}
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-skinora-900 tracking-tight">
                Your skin journey starts here.
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Create your Skinora profile to unlock personalized skin analysis, product compatibility and AI visual previews.
              </p>
            </div>

            {/* Tab Switcher (Sign In vs Create Account) */}
            <div className="grid grid-cols-2 bg-stone-100 p-1 rounded-2xl border border-stone-200 text-xs font-semibold text-center">
              <Link
                href={`/login${redirectPath !== '/analyze' ? `?redirect=${encodeURIComponent(redirectPath)}` : ''}`}
                className="py-2 rounded-xl text-stone-500 hover:text-stone-900 transition-colors"
              >
                Sign In
              </Link>
              <div className="py-2 rounded-xl bg-white text-skinora-900 shadow-sm">
                Create Account
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3.5 bg-rose-50 text-rose-700 text-xs rounded-2xl border border-rose-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Eleanor Vance"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-skinora-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-skinora-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-skinora-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-skinora-500 transition-all"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-start gap-2 text-[11px] text-stone-600">
                <input
                  type="checkbox"
                  id="agree-terms"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 rounded text-skinora-600 focus:ring-skinora-500"
                />
                <label htmlFor="agree-terms" className="leading-snug">
                  I agree to the educational cosmetic terms and{' '}
                  <Link href="/privacy" className="text-skinora-900 underline font-semibold">
                    Privacy Policy
                  </Link>
                  .
                </label>
              </div>

              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                className="w-full justify-center mt-2 py-3"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Create Account & Continue
              </Button>
            </form>

            <div className="text-center pt-1 border-t border-stone-100">
              <span className="text-xs text-stone-500">
                Already have an account?{' '}
                <Link
                  href={`/login${redirectPath !== '/analyze' ? `?redirect=${encodeURIComponent(redirectPath)}` : ''}`}
                  className="font-bold text-skinora-900 hover:underline underline-offset-2"
                >
                  Sign In
                </Link>
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="p-16 text-center text-sm text-stone-500">Loading registration...</div>}>
      <SignupContent />
    </Suspense>
  );
}
