// components/ProductGallery.tsx
"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Product } from "@/data/products";

type Props = {
  product?: Product | null;
  selectedColor?: string | undefined;
  images?: string[];
  videos?: string[];
  view360?: string[];
  alt?: string;
};

type MediaItem = { type: "image" | "video" | "360"; src: string };

export default function ProductGallery({ product, images: simpleImages, videos: simpleVideos, view360: simple360, alt: simpleAlt }: Props) {
  const images = useMemo(() => {
    if (product) return (product.images && product.images.length) ? product.images : ([product.image].filter(Boolean) as string[]);
    return simpleImages ?? [];
  }, [product, simpleImages]);

  const videos = useMemo(() => (product ? (product.videos ?? []) : (simpleVideos ?? [])), [product, simpleVideos]);
  const view360 = useMemo(() => (product ? (product.view360 ?? []) : (simple360 ?? [])), [product, simple360]);
  const altText = simpleAlt ?? product?.name ?? "Product image";

  const media = useMemo<MediaItem[]>(() => {
    const arr: MediaItem[] = [];
    images.forEach(i => arr.push({ type: "image", src: i }));
    videos.forEach(v => arr.push({ type: "video", src: v }));
    if (view360.length) arr.push({ type: "360", src: view360[0] });
    return arr;
  }, [images, videos, view360]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [is360Mode, setIs360Mode] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    if (is360Mode) {
      const idx = media.findIndex(m => m.type === "360");
      if (idx >= 0) setActiveIndex(idx);
    }
  }, [is360Mode, media]);

  useEffect(() => {
    // when product changes, reset
    setActiveIndex(0);
    setIs360Mode(false);
    setZoomOpen(false);
    setFrameIndex(0);
  }, [product?.id]);

  const goPrev = useCallback(() => setActiveIndex(p => (p === 0 ? Math.max(0, media.length - 1) : p - 1)), [media.length]);
  const goNext = useCallback(() => setActiveIndex(p => (p === media.length - 1 ? 0 : p + 1)), [media.length]);

  // touch
  const touchStartX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => touchStartX.current = e.touches[0].clientX;
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const threshold = 50;
    if (dx > threshold) goPrev();
    if (dx < -threshold) goNext();
    touchStartX.current = null;
  };

  const current = media[activeIndex] ?? null;

  // keyboard (left/right + esc)
  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "ArrowLeft") goPrev();
      if (ev.key === "ArrowRight") goNext();
      if (ev.key === "Escape") setZoomOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext]);

  return (
    <div className="space-y-4">
      <div className="relative rounded-2xl overflow-hidden shadow-md bg-white">
        {/* 360 toggle */}
        {view360.length > 0 && (
          <div className="absolute top-4 left-4 z-20 flex gap-2">
            <button onClick={() => setIs360Mode(false)} className={`px-3 py-1 rounded-full text-xs ${!is360Mode ? "bg-white text-black shadow" : "bg-black/40 text-white"}`}>Photos</button>
            <button onClick={() => setIs360Mode(true)} className={`px-3 py-1 rounded-full text-xs ${is360Mode ? "bg-white text-black shadow" : "bg-black/40 text-white"}`}>360°</button>
          </div>
        )}

        {/* arrows */}
        {media.length > 1 && !is360Mode && (
          <>
            <button onClick={goPrev} aria-label="Prev" className="absolute z-30 left-3 top-1/2 -translate-y-1/2 arrow-btn">‹</button>
            <button onClick={goNext} aria-label="Next" className="absolute z-30 right-3 top-1/2 -translate-y-1/2 arrow-btn">›</button>
          </>
        )}

        {/* display */}
        {!is360Mode && current && (
          <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} className="relative cursor-zoom-in w-full h-[420px] md:h-[520px] flex items-center justify-center bg-white">
            {current.type === "image" ? (
              <img src={current.src} alt={altText} className="w-full h-full object-contain velvet-depth" onClick={() => setZoomOpen(true)} />
            ) : (
              <video src={current.src} controls className="w-full h-full object-contain bg-black" />
            )}
          </div>
        )}

        {/* 360 viewer */}
        {is360Mode && view360.length > 0 && (
          <div className="w-full h-[420px] md:h-[520px] bg-black flex items-center justify-center select-none">
            <img src={view360[frameIndex]} alt={`${altText} 360 frame ${frameIndex + 1}`} className="w-full h-full object-contain" draggable={false} />
          </div>
        )}
      </div>

      {/* dots */}
      {!is360Mode && media.length > 1 && (
        <div className="flex justify-center gap-2">
          {media.map((_, i) => (
            <button key={i} onClick={() => setActiveIndex(i)} className={`h-2 rounded-full ${i === activeIndex ? "w-6 bg-gray-900" : "w-2 bg-gray-300"}`} aria-label={`Go to media ${i + 1}`} />
          ))}
        </div>
      )}

      {/* thumbnails */}
      {!is360Mode && media.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pt-1">
          {media.map((m, i) => (
            <button key={i} onClick={() => setActiveIndex(i)} className={`h-20 w-20 rounded-xl overflow-hidden thumb ${i === activeIndex ? "active" : ""}`} aria-label={`Select thumbnail ${i + 1}`}>
              {m.type === "image" ? (
                <img src={m.src} alt={`thumb-${i + 1}`} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-black flex items-center justify-center text-xs text-white">Video</div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* cinematic zoom */}
      {zoomOpen && current && current.type === "image" && (
        <div className="fixed inset-0 cinematic-backdrop z-[9999]" onClick={() => setZoomOpen(false)}>
          <button className="absolute top-6 right-6 text-white text-4xl z-[10010]" onClick={() => setZoomOpen(false)}>×</button>
          <img src={current.src} alt={altText} className="cinematic-img object-contain" />
        </div>
      )}
    </div>
  );
}
