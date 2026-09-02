'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Mail, ArrowRight, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setSubmitted(true);
    } catch (err) {
      setSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-skinora-900">
            Reset Password
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Enter your email to receive recovery instructions
          </p>
        </div>

        <Card variant="glass" className="p-6 sm:p-8 shadow-xl border-stone-200/90 space-y-6">
          {submitted ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">Check Your Inbox</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                If an account exists for <strong>{email}</strong>, we have dispatched a secure password reset link.
              </p>
              <div className="pt-2">
                <Link href="/login">
                  <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                    Back to Login
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
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
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-white/80 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-skinora-500 focus:border-transparent"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                className="w-full justify-center mt-2"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Send Reset Link
              </Button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="text-xs text-stone-500 hover:text-skinora-900 flex items-center justify-center gap-1 font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
