"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Product } from "@/data/products";

type Props = {
  product?: Product | null;
  selectedColor?: string | undefined;
  images?: string[];
  videos?: string[];
  view360?: string[];
  alt?: string;
};

type MediaItem = {
  type: "image" | "video" | "360";
  src: string;
};

export default function ProductGallery({
  product,
  images: simpleImages,
  videos: simpleVideos,
  view360: simple360,
  alt: simpleAlt,
}: Props) {
  const images = useMemo(() => {
    if (product)
      return product.images?.length
        ? product.images
        : ([product.image].filter(Boolean) as string[]);
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

  const altText = simpleAlt ?? product?.name ?? "Product image";

  const media = useMemo<MediaItem[]>(() => {
    const arr: MediaItem[] = [];
    images.forEach((i) => arr.push({ type: "image", src: i }));
    videos.forEach((v) => arr.push({ type: "video", src: v }));
    if (view360.length) arr.push({ type: "360", src: view360[0] });
    return arr;
  }, [images, videos, view360]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [is360Mode, setIs360Mode] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [frameIndex, setFrameIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const current = media[activeIndex] ?? null;

  useEffect(() => {
    setActiveIndex(0);
    setIs360Mode(false);
    setZoomOpen(false);
    setFrameIndex(0);
    setIsLoaded(false);
  }, [product?.id]);

  useEffect(() => {
    if (is360Mode) {
      const idx = media.findIndex((m) => m.type === "360");
      if (idx >= 0) setActiveIndex(idx);
    }
  }, [is360Mode, media]);

  const goPrev = useCallback(() => {
    if (is360Mode) return;
    setActiveIndex((p) => (p === 0 ? media.length - 1 : p - 1));
  }, [media.length, is360Mode]);

  const goNext = useCallback(() => {
    if (is360Mode) return;
    setActiveIndex((p) => (p === media.length - 1 ? 0 : p + 1));
  }, [media.length, is360Mode]);

  const touchStartX = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) =>
    (touchStartX.current = e.touches[0].clientX);

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const threshold = 50;
    if (dx > threshold) goPrev();
    if (dx < -threshold) goNext();
    touchStartX.current = null;
  };

  useEffect(() => {
    const handler = (ev: KeyboardEvent) => {
      if (ev.key === "ArrowLeft") goPrev();
      if (ev.key === "ArrowRight") goNext();
      if (ev.key === "Escape") setZoomOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goPrev, goNext]);

  const dragStartX = useRef<number | null>(null);

  const startRotate = (e: React.MouseEvent) =>
    (dragStartX.current = e.clientX);

  const endRotate = (e: React.MouseEvent) => {
    if (!is360Mode || dragStartX.current === null) return;

    const diff = e.clientX - dragStartX.current;
    if (Math.abs(diff) > 10) {
      const newIndex =
        (frameIndex + (diff > 0 ? -1 : 1) + view360.length) % view360.length;
      setFrameIndex(newIndex);
    }
    dragStartX.current = null;
  };

  return (
    <div className="space-y-4">
      {/* MAIN DISPLAY */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl bg-white border border-amber-200/40">
        {view360.length > 0 && (
          <div className="absolute top-4 left-4 z-20 flex gap-2">
            <button
              onClick={() => setIs360Mode(false)}
              className={`px-3 py-1 rounded-full text-xs ${
                !is360Mode ? "bg-white text-black shadow-lg" : "bg-black/40 text-white"
              }`}
            >
              Photos
            </button>

            <button
              onClick={() => setIs360Mode(true)}
              className={`px-3 py-1 rounded-full text-xs ${
                is360Mode ? "bg-white text-black shadow-lg" : "bg-black/40 text-white"
              }`}
            >
              360°
            </button>
          </div>
        )}

        {!is360Mode && media.length > 1 && (
          <>
            <button className="lux-arrow left-3" onClick={goPrev}>‹</button>
            <button className="lux-arrow right-3" onClick={goNext}>›</button>
          </>
        )}

        {!is360Mode && current && (
          <div
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            className="relative w-full h-[420px] md:h-[520px] flex items-center justify-center bg-white"
          >
            {!isLoaded && <div className="absolute inset-0 shimmer rounded-3xl" />}

            {current.type === "image" ? (
              <img
                src={current.src}
                alt={altText}
                className={`w-full h-full object-contain transition ${
                  isLoaded ? "opacity-100" : "opacity-0"
                } cursor-zoom-in`}
                onLoad={() => setIsLoaded(true)}
                onClick={() => setZoomOpen(true)}
              />
            ) : (
              <video src={current.src} controls className="w-full h-full object-contain bg-black" />
            )}
          </div>
        )}

        {is360Mode && view360.length > 0 && (
          <div
            className="w-full h-[420px] md:h-[520px] bg-black flex items-center justify-center"
            onMouseDown={startRotate}
            onMouseUp={endRotate}
          >
            <img
              src={view360[frameIndex]}
              alt="360 view"
              className="w-full h-full object-contain"
            />
          </div>
        )}
      </div>

      {/* DOTS */}
      {!is360Mode && media.length > 1 && (
        <div className="flex justify-center gap-2">
          {media.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-2 rounded-full ${
                activeIndex === i ? "w-6 bg-amber-800" : "w-2 bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}

      {/* THUMBNAILS */}
      {!is360Mode && media.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pt-1">
          {media.map((m, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-20 w-20 rounded-xl overflow-hidden border ${
                i === activeIndex
                  ? "border-amber-700 shadow-md scale-[1.05]"
                  : "border-gray-300 opacity-80"
              }`}
            >
              {m.type === "image" ? (
                <img src={m.src} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="bg-black flex items-center justify-center text-white text-xs w-full h-full">
                  VIDEO
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* ZOOM VIEWER */}
      {zoomOpen && current?.type === "image" && (
        <div className="fixed inset-0 cinematic-backdrop z-[9999]" onClick={() => setZoomOpen(false)}>
          <button
            className="absolute top-6 right-6 text-white text-4xl"
            onClick={() => setZoomOpen(false)}
          >
            ×
          </button>
          <img src={current.src} className="cinematic-img object-contain" />
        </div>
      )}
    </div>
  );
}
