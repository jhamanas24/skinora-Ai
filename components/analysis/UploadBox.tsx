'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, CheckCircle2, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface UploadBoxProps {
  onImageSelected: (imageData: string) => void;
}

const SAMPLE_FACES = [
  {
    name: 'Sample Portrait 1 (Even/Radiant tone)',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Sample Portrait 2 (Mild dullness & spots)',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Sample Portrait 3 (Natural texture & tone)',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
  },
];

export function UploadBox({ onImageSelected }: UploadBoxProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const compressAndResizeImage = (fileOrBlob: Blob, maxDimension = 1200, quality = 0.85): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(event.target?.result as string);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const outputDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(outputDataUrl);
        };
        img.onerror = () => {
          reject(new Error('Failed to parse image file'));
        };
        img.src = event.target?.result as string;
      };
      reader.onerror = () => {
        reject(new Error('Failed to read image file'));
      };
      reader.readAsDataURL(fileOrBlob);
    });
  };

  const processFile = async (file: File) => {
    setError(null);

    // Validate type
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type)) {
      setError('Please upload a valid image format (JPEG, PNG, or WEBP).');
      return;
    }

    // Validate size (max 15MB initial pick before compression)
    if (file.size > 15 * 1024 * 1024) {
      setError('Image file size is too large (maximum limit is 15MB).');
      return;
    }

    setIsProcessing(true);
    try {
      const compressedDataUrl = await compressAndResizeImage(file, 1200, 0.85);
      setPreview(compressedDataUrl);
    } catch (err: any) {
      console.error('Image compression error:', err);
      setError('Failed to process image file. Please try another photo.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const loadSample = async (url: string) => {
    try {
      setIsProcessing(true);
      setError(null);
      const response = await fetch(url);
      const blob = await response.blob();
      const compressedDataUrl = await compressAndResizeImage(blob, 1000, 0.85);
      setPreview(compressedDataUrl);
    } catch {
      setError('Could not load sample image. Please upload your own photo.');
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmUpload = () => {
    if (preview) {
      onImageSelected(preview);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileInputChange}
      />

      {preview ? (
        <div className="space-y-4">
          <div className="relative w-full aspect-[3/4] md:aspect-[4/5] rounded-3xl overflow-hidden bg-stone-900 shadow-2xl border-2 border-stone-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Selected Face Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-emerald-500/90 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
              <CheckCircle2 className="w-3.5 h-3.5" /> Photo Ready
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setPreview(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              Choose Another
            </Button>
            <Button
              variant="primary"
              onClick={confirmUpload}
              leftIcon={<CheckCircle2 className="w-4 h-4 text-emerald-300" />}
            >
              Use This Photo
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Drag & Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-8 md:p-12 text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-4 ${
              dragOver
                ? 'border-skinora-500 bg-skinora-50/80 scale-[1.01]'
                : 'border-stone-300 hover:border-skinora-400 bg-white/70 hover:bg-skinora-50/30'
            }`}
          >
            <div className="w-16 h-16 rounded-full bg-skinora-100 text-skinora-800 flex items-center justify-center shadow-inner">
              <UploadCloud className="w-8 h-8 text-skinora-700" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-skinora-900 text-base">
                Drag and drop your face photo here
              </p>
              <p className="text-xs text-stone-500">
                Supports high-resolution JPEG, PNG, or WEBP (Max 10MB)
              </p>
            </div>
            <Button variant="secondary" size="sm" type="button">
              Browse Files
            </Button>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Instant Sample Face Option */}
          <div className="pt-2">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-skinora-500" />
              <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider">
                Or test with sample portrait
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {SAMPLE_FACES.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => loadSample(sample.url)}
                  disabled={isProcessing}
                  className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-stone-200 hover:border-skinora-500 shadow-sm transition-all text-left"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sample.url}
                    alt={sample.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 text-[10px] text-white font-medium">
                    Sample {idx + 1}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
