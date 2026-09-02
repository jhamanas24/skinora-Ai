'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Camera,
  UploadCloud,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Sun,
  EyeOff,
  Smile,
  Lock,
  ArrowRight,
  Scan,
  Zap,
  Layers,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CameraCapture } from '@/components/analysis/CameraCapture';
import { UploadBox } from '@/components/analysis/UploadBox';
import { LoadingAnimation } from '@/components/ui/LoadingAnimation';
import { DisclaimerBanner } from '@/components/layout/DisclaimerBanner';
import { useAuth } from '@/context/AuthContext';

function AnalyzeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedProductId = searchParams.get('productId');

  const { user, isLoading: authLoading } = useAuth();

  // Stage state: 'welcome' (The Skinora Moment) -> 'capture' -> 'analyzing'
  const [stage, setStage] = useState<'welcome' | 'capture'>('welcome');
  const [mode, setMode] = useState<'upload' | 'camera'>('upload');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirectQuery = preselectedProductId
    ? `?redirect=${encodeURIComponent(`/analyze?productId=${preselectedProductId}`)}`
    : `?redirect=${encodeURIComponent('/analyze')}`;

  const handleImageReady = async (imageData: string) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      // 1. Upload & Persist image file
      const uploadRes = await fetch('/api/analyze/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: imageData }),
      });

      let uploadData: any = null;
      const uploadContentType = uploadRes.headers.get('content-type') || '';
      if (uploadContentType.includes('application/json')) {
        uploadData = await uploadRes.json();
      } else {
        const text = await uploadRes.text();
        console.error('Non-JSON response from upload endpoint:', text);
        if (uploadRes.status === 401) {
          router.push(`/login${redirectQuery}`);
          return;
        }
        if (uploadRes.status === 413) {
          throw new Error('The selected image is too large. Please select a smaller photo.');
        }
        throw new Error(`Upload server error (${uploadRes.status}). Please try again.`);
      }

      if (!uploadRes.ok) {
        if (uploadRes.status === 401) {
          router.push(`/login${redirectQuery}`);
          return;
        }
        throw new Error(uploadData?.error || 'Failed to upload image');
      }

      // 2. Perform skin analysis
      const analyzeRes = await fetch('/api/analyze/skin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: uploadData.imageUrl,
          imageBase64: imageData,
        }),
      });

      let analyzeData: any = null;
      const analyzeContentType = analyzeRes.headers.get('content-type') || '';
      if (analyzeContentType.includes('application/json')) {
        analyzeData = await analyzeRes.json();
      } else {
        const text = await analyzeRes.text();
        console.error('Non-JSON response from analyze endpoint:', text);
        if (analyzeRes.status === 401) {
          router.push(`/login${redirectQuery}`);
          return;
        }
        throw new Error(`Analysis server error (${analyzeRes.status}). Please try again.`);
      }

      if (!analyzeRes.ok) {
        if (analyzeRes.status === 401) {
          router.push(`/login${redirectQuery}`);
          return;
        }
        throw new Error(analyzeData?.error || 'Failed to analyze skin image');
      }

      // Store current analysis info in sessionStorage for smooth multi-step flow
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('currentAnalysisId', analyzeData.analysisId);
        sessionStorage.setItem('currentAnalysisImage', uploadData.imageUrl);
        sessionStorage.setItem('currentAnalysisMetrics', JSON.stringify(analyzeData.metrics));
      }

      // Route to Snapshot or Product Selection
      if (preselectedProductId) {
        router.push(`/analyze/snapshot?id=${analyzeData.analysisId}&productId=${preselectedProductId}`);
      } else {
        router.push(`/analyze/snapshot?id=${analyzeData.analysisId}`);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during skin analysis.');
      setIsAnalyzing(false);
    }
  };

  // 1. Loading Auth State
  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-2 border-skinora-300 border-t-skinora-900 rounded-full animate-spin" />
        <p className="text-xs text-stone-500 font-medium">Verifying authorization...</p>
      </div>
    );
  }

  // 2. Unauthenticated State -> Show Premium Analysis Access Card
  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-skinora-100 text-skinora-800 flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-6 h-6 text-skinora-700" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-skinora-600 block">
            Member Access Only
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-skinora-900 tracking-tight">
            Your personalized skin analysis is waiting.
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-md mx-auto">
            Sign in to let Skinora AI analyze your skin and match it with skincare products.
          </p>
        </div>

        {/* Feature Highlights Card */}
        <Card variant="glass" className="p-8 md:p-10 border-stone-200/90 shadow-xl space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/80 p-4 rounded-2xl border border-stone-200/70 text-center space-y-2">
              <Scan className="w-6 h-6 text-skinora-700 mx-auto" />
              <h4 className="text-xs font-bold text-skinora-900">1. Visual Surface Scan</h4>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                Evaluates visible radiance, tone evenness, and surface texture.
              </p>
            </div>

            <div className="bg-white/80 p-4 rounded-2xl border border-stone-200/70 text-center space-y-2">
              <Zap className="w-6 h-6 text-amber-600 mx-auto" />
              <h4 className="text-xs font-bold text-skinora-900">2. 5-Factor Score</h4>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                Matches active ingredients with detected cosmetic concerns.
              </p>
            </div>

            <div className="bg-white/80 p-4 rounded-2xl border border-stone-200/70 text-center space-y-2">
              <Sparkles className="w-6 h-6 text-rose-accent mx-auto" />
              <h4 className="text-xs font-bold text-skinora-900">3. AI Visual Simulation</h4>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                Interactive Before/After cosmetic preview before you purchase.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href={`/login${redirectQuery}`} className="w-full sm:w-auto">
              <Button size="lg" variant="primary" className="w-full sm:w-auto justify-center">
                Sign In to Continue
              </Button>
            </Link>
            <Link href={`/signup${redirectQuery}`} className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto justify-center">
                Create Skinora Account
              </Button>
            </Link>
          </div>
        </Card>

        <DisclaimerBanner compact />
      </div>
    );
  }

  // 3. Active Analyzing Screen
  if (isAnalyzing) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <LoadingAnimation stage="skin" />
      </div>
    );
  }

  // 4. Authenticated Entry Experience — The "Skinora Moment"
  if (stage === 'welcome') {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-8">
        <Card
          variant="glass"
          className="p-8 md:p-14 text-center border-stone-200 shadow-2xl space-y-8 bg-gradient-to-b from-white via-skinora-50/30 to-white relative overflow-hidden"
        >
          {/* Animated Facial Scan Radar Effect */}
          <div className="relative mx-auto w-36 h-36 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-skinora-200/50 animate-ping opacity-30" />
            <div className="absolute inset-2 rounded-full border border-skinora-400/40 animate-pulse-slow" />
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-skinora-900 via-skinora-800 to-skinora-600 flex items-center justify-center text-white shadow-xl relative z-10">
              <Scan className="w-10 h-10 text-amber-200 animate-float" />
            </div>
          </div>

          <div className="space-y-3 max-w-lg mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-skinora-100 text-skinora-800 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-skinora-600" />
              <span>Skinora AI Consultation</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-skinora-900 tracking-tight">
              Welcome to your Skinora analysis.
            </h1>

            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              Let&apos;s understand what your skin is telling us.
            </p>
          </div>

          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80 max-w-sm mx-auto text-xs text-stone-600">
            <span className="font-semibold text-skinora-900 block mb-0.5">Ready when you are.</span>
            <span>Position your face in good natural light for the most accurate cosmetic assessment.</span>
          </div>

          <div className="pt-2">
            <Button
              size="lg"
              variant="primary"
              onClick={() => setStage('capture')}
              rightIcon={<ArrowRight className="w-5 h-5" />}
              className="px-8 py-3.5"
            >
              Start Skin Scan
            </Button>
          </div>
        </Card>

        <DisclaimerBanner compact />
      </div>
    );
  }

  // 5. Active Capture / Upload Viewfinder
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-10">
      {/* Title & Introduction */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-skinora-100 text-skinora-800 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-skinora-600" />
          <span>Step 1 of 3: Facial Photo Setup</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-skinora-900 tracking-tight">
          Let&apos;s Understand Your Skin
        </h1>
        <p className="text-sm sm:text-base text-stone-600">
          Upload or capture a clear face photo to evaluate visible surface radiance, tone uniformity, and cosmetic characteristics.
        </p>
      </div>

      {/* Guidelines Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/70 p-4 rounded-3xl border border-stone-200/80 shadow-sm text-center">
        <div className="p-2 space-y-1">
          <Sun className="w-5 h-5 text-amber-600 mx-auto" />
          <span className="text-xs font-bold text-stone-800 block">Natural Lighting</span>
          <span className="text-[10px] text-stone-500">Face window or daylight</span>
        </div>
        <div className="p-2 space-y-1">
          <Smile className="w-5 h-5 text-emerald-600 mx-auto" />
          <span className="text-xs font-bold text-stone-800 block">Direct Angle</span>
          <span className="text-[10px] text-stone-500">Face camera directly</span>
        </div>
        <div className="p-2 space-y-1">
          <EyeOff className="w-5 h-5 text-skinora-600 mx-auto" />
          <span className="text-xs font-bold text-stone-800 block">No Filters</span>
          <span className="text-[10px] text-stone-500">Keep face natural</span>
        </div>
        <div className="p-2 space-y-1">
          <ShieldCheck className="w-5 h-5 text-skinora-800 mx-auto" />
          <span className="text-xs font-bold text-stone-800 block">Private & Safe</span>
          <span className="text-[10px] text-stone-500">Delete anytime</span>
        </div>
      </div>

      {/* Main Interaction Card */}
      <Card variant="glass" className="p-6 md:p-10 shadow-xl border-stone-200/90 space-y-6">
        {/* Toggle Mode Switcher */}
        <div className="flex items-center justify-center">
          <div className="bg-stone-100 p-1.5 rounded-full flex items-center gap-1 border border-stone-200">
            <button
              onClick={() => setMode('upload')}
              className={`px-5 py-2 text-xs font-bold rounded-full transition-all flex items-center gap-1.5 ${
                mode === 'upload'
                  ? 'bg-white text-skinora-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Photo</span>
            </button>
            <button
              onClick={() => setMode('camera')}
              className={`px-5 py-2 text-xs font-bold rounded-full transition-all flex items-center gap-1.5 ${
                mode === 'camera'
                  ? 'bg-white text-skinora-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Take Photo (Camera)</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200 text-center">
            {error}
          </div>
        )}

        {/* Viewfinder or Uploader Box */}
        <div className="pt-2">
          {mode === 'camera' ? (
            <CameraCapture
              onCapture={handleImageReady}
              onCancel={() => setMode('upload')}
            />
          ) : (
            <UploadBox onImageSelected={handleImageReady} />
          )}
        </div>
      </Card>

      <DisclaimerBanner compact />
    </div>
  );
}

export default function AnalyzePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-stone-500">Loading analysis setup...</div>}>
      <AnalyzeContent />
    </Suspense>
  );
}
