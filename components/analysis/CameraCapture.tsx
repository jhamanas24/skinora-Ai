'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, RefreshCw, CheckCircle2, AlertCircle, Sparkles, SwitchCamera } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  onCancel?: () => void;
}

export function CameraCapture({ onCapture, onCancel }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const startCamera = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    // Stop previous stream
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsLoading(false);
    } catch (err: any) {
      console.error('Camera access error:', err);
      setIsLoading(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Camera permission was denied. Please allow camera access in your browser settings or use photo upload.');
      } else {
        setError('Unable to access camera on this device. Please try uploading a photo instead.');
      }
    }
  }, [facingMode]);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [startCamera]);

  const takePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Flip horizontally if front camera for natural mirror feel
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(dataUrl);
  };

  const retake = () => {
    setCapturedImage(null);
  };

  const confirmPhoto = () => {
    if (capturedImage) {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      onCapture(capturedImage);
    }
  };

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center">
      {error ? (
        <div className="glass-panel p-8 text-center space-y-4 rounded-3xl border-rose-200">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-stone-900">Camera Access Error</h3>
          <p className="text-sm text-stone-600">{error}</p>
          <div className="flex justify-center gap-3 pt-2">
            <Button variant="primary" onClick={startCamera}>
              Try Again
            </Button>
            {onCancel && (
              <Button variant="outline" onClick={onCancel}>
                Switch to Upload
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full space-y-4">
          {/* Viewfinder or Preview Box */}
          <div className="relative w-full aspect-[3/4] md:aspect-[4/5] rounded-3xl overflow-hidden bg-stone-900 shadow-2xl border-2 border-stone-300">
            {capturedImage ? (
              // Captured Photo Preview
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={capturedImage}
                alt="Captured Face Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              // Live Video Stream
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${
                    facingMode === 'user' ? 'scale-x-[-1]' : ''
                  }`}
                />

                {/* Face Alignment Oval Guide */}
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6">
                  <div className="w-56 h-72 rounded-[50%] border-2 border-dashed border-white/70 shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]" />
                  <span className="mt-4 bg-black/60 backdrop-blur-md text-white text-xs font-medium px-4 py-1.5 rounded-full border border-white/20">
                    Align face inside the oval
                  </span>
                </div>

                {/* Switch Camera Button (Mobile) */}
                <button
                  onClick={toggleFacingMode}
                  className="absolute top-4 right-4 p-2.5 bg-black/60 backdrop-blur-md text-white rounded-full hover:bg-black/80 transition-all border border-white/20"
                  title="Switch Camera"
                >
                  <SwitchCamera className="w-5 h-5" />
                </button>
              </>
            )}

            {isLoading && (
              <div className="absolute inset-0 bg-stone-900/80 flex items-center justify-center text-white text-sm">
                <RefreshCw className="w-6 h-6 animate-spin mr-2" /> Initializing Camera...
              </div>
            )}
          </div>

          {/* Action Controls */}
          <div className="flex items-center justify-center gap-4 pt-2">
            {capturedImage ? (
              <>
                <Button
                  variant="outline"
                  onClick={retake}
                  leftIcon={<RefreshCw className="w-4 h-4" />}
                >
                  Retake Photo
                </Button>
                <Button
                  variant="primary"
                  onClick={confirmPhoto}
                  leftIcon={<CheckCircle2 className="w-4 h-4 text-emerald-300" />}
                >
                  Use This Photo
                </Button>
              </>
            ) : (
              <>
                {onCancel && (
                  <Button variant="ghost" onClick={onCancel}>
                    Cancel
                  </Button>
                )}
                <Button
                  variant="primary"
                  size="lg"
                  onClick={takePhoto}
                  disabled={isLoading}
                  leftIcon={<Camera className="w-5 h-5 text-amber-200" />}
                >
                  Take Photo
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
