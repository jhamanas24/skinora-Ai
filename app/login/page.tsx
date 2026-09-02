'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { AuthVisualSide } from '@/components/auth/AuthVisualSide';
import { useAuth } from '@/context/AuthContext';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';

  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const result = await login(email, password);
    if (!result.success) {
      setError(result.error || 'Failed to login');
      setIsLoading(false);
      return;
    }

    // Automatically navigate to redirect destination
    router.push(redirectPath);
    router.refresh();
  };

  const handleDemoLogin = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
    setIsLoading(true);

    const result = await login(demoEmail, demoPass);
    if (!result.success) {
      setError(result.error || 'Demo login failed');
      setIsLoading(false);
      return;
    }

    router.push(redirectPath);
    router.refresh();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch min-h-[620px]">
        {/* Left Side: Premium Skincare/AI Visual Section */}
        <div className="hidden lg:block lg:col-span-6">
          <AuthVisualSide />
        </div>

        {/* Right Side: Authentication Card */}
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
                Sign in to your Skinora account to access personalized skin analysis, product compatibility, and AI visual simulations.
              </p>
            </div>

            {/* Tab Switcher (Sign In vs Create Account) */}
            <div className="grid grid-cols-2 bg-stone-100 p-1 rounded-2xl border border-stone-200 text-xs font-semibold text-center">
              <div className="py-2 rounded-xl bg-white text-skinora-900 shadow-sm">
                Sign In
              </div>
              <Link
                href={`/signup${redirectPath !== '/dashboard' ? `?redirect=${encodeURIComponent(redirectPath)}` : ''}`}
                className="py-2 rounded-xl text-stone-500 hover:text-stone-900 transition-colors"
              >
                Create Account
              </Link>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3.5 bg-rose-50 text-rose-700 text-xs rounded-2xl border border-rose-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
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

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-stone-700">Password</label>
                  <Link
                    href="/forgot-password"
                    className="text-[11px] text-skinora-600 hover:text-skinora-900 font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
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

              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                className="w-full justify-center mt-2 py-3"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Sign In to Continue
              </Button>
            </form>

            {/* Quick Demo Access */}
            <div className="pt-4 border-t border-stone-100 space-y-2 text-center">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">
                Instant Demo Access
              </span>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => handleDemoLogin('user@skinora.ai', 'DemoUser123!')}
                  className="text-xs py-2"
                >
                  Demo User
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => handleDemoLogin('admin@skinora.ai', 'Admin@Skinora2026')}
                  className="text-xs py-2"
                >
                  Demo Admin
                </Button>
              </div>
            </div>

            <div className="text-center pt-1">
              <span className="text-xs text-stone-500">
                Don&apos;t have an account?{' '}
                <Link
                  href={`/signup${redirectPath !== '/dashboard' ? `?redirect=${encodeURIComponent(redirectPath)}` : ''}`}
                  className="font-bold text-skinora-900 hover:underline underline-offset-2"
                >
                  Create your Skinora account
                </Link>
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-16 text-center text-sm text-stone-500">Loading sign in...</div>}>
      <LoginContent />
    </Suspense>
  );
}
