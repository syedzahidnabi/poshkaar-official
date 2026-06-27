"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Product } from "@/data/products";

type Props = {
  product?: Product | null;
  images?: string[];
  videos?: string[];
  view360?: string[];
  alt?: string;
};

type MediaItem = { type: "image" | "video" | "360"; src: string };

export default function ProductGallery({
  product,
  images: simpleImages,
  videos: simpleVideos,
  view360: simple360,
  alt,
}: Props) {
  const images = useMemo(() => {
    if (product) {
      return product.images?.length ? product.images : [product.image].filter(Boolean);
    }
    return simpleImages ?? [];
  }, [product, simpleImages]);

  const videos = useMemo(
    () => (product ? product.videos ?? [] : simpleVideos ?? []),
    [product, simpleVideos]
  );
  const view360 = useMemo(
    () => (product ? product.view360 ?? [] : simple360 ?? []),
    [product, simple360]
  );
  const altText = alt ?? product?.name ?? "Product image";

  const media = useMemo<MediaItem[]>(() => {
    const items: MediaItem[] = [];
    images.forEach((image) => items.push({ type: "image", src: image }));
    videos.forEach((video) => items.push({ type: "video", src: video }));
    if (view360.length) items.push({ type: "360", src: view360[0] });
    return items;
  }, [images, videos, view360]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [is360Mode, setIs360Mode] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [frameIndex, setFrameIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const goPrev = useCallback(
    () => setActiveIndex((current) => (current === 0 ? Math.max(0, media.length - 1) : current - 1)),
    [media.length]
  );
  const goNext = useCallback(
    () => setActiveIndex((current) => (current === media.length - 1 ? 0 : current + 1)),
    [media.length]
  );

  useEffect(() => {
    if (is360Mode) {
      const index = media.findIndex((item) => item.type === "360");
      if (index >= 0) setActiveIndex(index);
    }
  }, [is360Mode, media]);

  useEffect(() => {
    setActiveIndex(0);
    setIs360Mode(false);
    setZoomOpen(false);
    setFrameIndex(0);
  }, [product?.id]);

  const current = media[activeIndex] ?? null;

  const onTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = event.changedTouches[0].clientX - touchStartX.current;
    if (dx > 50) goPrev();
    if (dx < -50) goNext();
    touchStartX.current = null;
  };

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-black/10">
        {view360.length > 0 && (
          <div className="absolute left-4 top-4 z-20 flex gap-2">
            <button
              type="button"
              onClick={() => setIs360Mode(false)}
              className={`rounded-md px-3 py-1 text-xs font-bold ${
                !is360Mode ? "bg-white text-black shadow" : "bg-black/50 text-white"
              }`}
            >
              Photos
            </button>
            <button
              type="button"
              onClick={() => setIs360Mode(true)}
              className={`rounded-md px-3 py-1 text-xs font-bold ${
                is360Mode ? "bg-white text-black shadow" : "bg-black/50 text-white"
              }`}
            >
              360
            </button>
          </div>
        )}

        {media.length > 1 && !is360Mode && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-3 top-1/2 z-30 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md bg-white/92 text-[#171412] shadow-sm ring-1 ring-black/10"
              aria-label="Previous image"
              title="Previous image"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-3 top-1/2 z-30 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md bg-white/92 text-[#171412] shadow-sm ring-1 ring-black/10"
              aria-label="Next image"
              title="Next image"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </>
        )}

        {!is360Mode && current && (
          <div
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            className="relative flex h-[420px] w-full cursor-zoom-in items-center justify-center bg-white md:h-[620px]"
          >
            {current.type === "image" ? (
              <img
                src={current.src}
                alt={altText}
                className="h-full w-full object-contain"
                onClick={() => setZoomOpen(true)}
              />
            ) : (
              <video src={current.src} controls className="h-full w-full bg-black object-contain" />
            )}
          </div>
        )}

        {is360Mode && view360.length > 0 && (
          <div className="flex h-[420px] w-full items-center justify-center bg-black md:h-[620px]">
            <img
              src={view360[frameIndex]}
              alt={`${altText} 360 frame ${frameIndex + 1}`}
              className="h-full w-full object-contain"
              draggable={false}
            />
          </div>
        )}
      </div>

      {!is360Mode && media.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pt-1">
          {media.map((item, index) => (
            <button
              key={`${item.src}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-20 w-20 shrink-0 overflow-hidden rounded-md border ${
                index === activeIndex ? "border-[#8a1538]" : "border-black/10"
              }`}
              aria-label={`Select image ${index + 1}`}
              title={`Select image ${index + 1}`}
            >
              {item.type === "image" ? (
                <img src={item.src} alt={`${altText} thumbnail`} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-black text-xs text-white">
                  Video
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {zoomOpen && current?.type === "image" && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-6"
          onClick={() => setZoomOpen(false)}
        >
          <button
            type="button"
            className="absolute right-6 top-6 z-[10010] inline-flex h-11 w-11 items-center justify-center rounded-md bg-white/10 text-white ring-1 ring-white/20"
            onClick={() => setZoomOpen(false)}
            aria-label="Close image"
            title="Close image"
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
          <img src={current.src} alt={altText} className="max-h-[92vh] max-w-[96vw] rounded-lg object-contain shadow-2xl" />
        </div>
      )}
    </div>
  );
}
