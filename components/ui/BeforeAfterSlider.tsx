'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles, MoveHorizontal, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BeforeAfterSliderProps {
  originalImage: string;
  simulatedImage?: string;
  productName?: string;
  className?: string;
}

export function BeforeAfterSlider({
  originalImage,
  simulatedImage,
  productName = 'Vitamin C Serum',
  className,
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return;
      handleMove(e.touches[0].clientX);
    },
    [isDragging, handleMove]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      handleMove(e.clientX);
    },
    [isDragging, handleMove]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  const targetSimulated = simulatedImage || originalImage;

  return (
    <div className={cn('space-y-3', className)}>
      <div
        ref={containerRef}
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
        onClick={(e) => handleMove(e.clientX)}
        className="relative w-full aspect-[4/3] md:aspect-[16/11] max-w-xl mx-auto rounded-3xl overflow-hidden shadow-2xl border-2 border-stone-200/80 select-none bg-stone-900 cursor-ew-resize group"
      >
        {/* Layer 2: Simulated Image (Background / Right Side) */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={targetSimulated}
            alt="AI Visual Simulation"
            className="w-full h-full object-cover filter brightness-[1.08] contrast-[1.02] saturate-[1.05]"
            style={{
              filter: 'brightness(1.08) contrast(1.03) saturate(1.04) drop-shadow(0 0 1px rgba(255,255,255,0.2))',
            }}
          />
          {/* Simulation Watermark & Label */}
          <div className="absolute top-4 right-4 bg-skinora-900/85 backdrop-blur-md text-white text-[11px] md:text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI VISUAL SIMULATION</span>
          </div>
        </div>

        {/* Layer 1: Original Image (Foreground / Left Side with Clip-Path) */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={originalImage}
            alt="Current Appearance"
            className="w-full h-full object-cover"
          />
          {/* Original Label */}
          <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md text-white text-[11px] md:text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg border border-white/10">
            CURRENT APPEARANCE
          </div>
        </div>

        {/* Vertical Divider Handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl z-20 pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white text-skinora-900 shadow-xl border-2 border-skinora-200 flex items-center justify-center pointer-events-auto transition-transform group-hover:scale-110 active:scale-95">
            <MoveHorizontal className="w-4 h-4 text-skinora-800" />
          </div>
        </div>

        {/* Bottom Floating Disclaimer */}
        <div className="absolute bottom-3 inset-x-3 text-center">
          <span className="inline-flex items-center gap-1 bg-black/60 backdrop-blur-md text-stone-200 text-[10px] md:text-[11px] px-3 py-1 rounded-full border border-white/10">
            <Info className="w-3 h-3 text-stone-300" />
            AI Visual Simulation — Illustrative preview only. Actual cosmetic results vary.
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-stone-500 px-2">
        <span className="font-medium text-stone-700">← Slide left to view simulation</span>
        <span className="font-medium text-stone-700">Slide right to view original →</span>
      </div>
    </div>
  );
}
