"use client";

<<<<<<< HEAD
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
=======
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
>>>>>>> 4c42ba2 (Describe your changes)
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

export default function ProductGallery({
  product,
  images: simpleImages,
  videos: simpleVideos,
  view360: simple360,
  alt: simpleAlt,
}: Props) {
<<<<<<< HEAD
  /* ----------------------------------------------
   *  BUILD MEDIA ARRAYS
   * ---------------------------------------------- */
  const images = useMemo(() => {
    if (product)
      return product.images?.length
        ? product.images
        : ([product.image].filter(Boolean) as string[]);
=======
  const images = useMemo(() => {
    if (product) {
      return product.images?.length ? product.images : [product.image].filter(Boolean);
    }

>>>>>>> 4c42ba2 (Describe your changes)
    return simpleImages ?? [];
  }, [product, simpleImages]);

  const videos = useMemo(
    () => (product ? product.videos ?? [] : simpleVideos ?? []),
    [product, simpleVideos]
  );
<<<<<<< HEAD

=======
>>>>>>> 4c42ba2 (Describe your changes)
  const view360 = useMemo(
    () => (product ? product.view360 ?? [] : simple360 ?? []),
    [product, simple360]
  );
<<<<<<< HEAD

  const altText = simpleAlt ?? product?.name ?? "Product Image";

  const media = useMemo<MediaItem[]>(() => {
    const arr: MediaItem[] = [];
    images.forEach((i) => arr.push({ type: "image", src: i }));
    videos.forEach((v) => arr.push({ type: "video", src: v }));
    if (view360.length) arr.push({ type: "360", src: view360[0] });
    return arr;
=======
  const altText = simpleAlt ?? product?.name ?? "Product image";

  const media = useMemo<MediaItem[]>(() => {
    const items: MediaItem[] = [];
    images.forEach((image) => items.push({ type: "image", src: image }));
    videos.forEach((video) => items.push({ type: "video", src: video }));
    if (view360.length) items.push({ type: "360", src: view360[0] });
    return items;
>>>>>>> 4c42ba2 (Describe your changes)
  }, [images, videos, view360]);

  /* ----------------------------------------------
   *  STATE
   * ---------------------------------------------- */
  const [activeIndex, setActiveIndex] = useState(0);
  const [is360Mode, setIs360Mode] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [frameIndex, setFrameIndex] = useState(0);
<<<<<<< HEAD
  const [loaded, setLoaded] = useState(false);

  const current = media[activeIndex] ?? null;
=======
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
>>>>>>> 4c42ba2 (Describe your changes)

  /* Reset on product change */
  useEffect(() => {
    setActiveIndex(0);
    setIs360Mode(false);
    setZoomOpen(false);
    setFrameIndex(0);
    setLoaded(false);
  }, [product?.id]);

<<<<<<< HEAD
  /* Auto-select 360 frame */
  useEffect(() => {
    if (is360Mode) {
      const idx = media.findIndex((m) => m.type === "360");
      if (idx >= 0) setActiveIndex(idx);
    }
  }, [is360Mode]);

  /* ----------------------------------------------
   *  NEXT / PREV
   * ---------------------------------------------- */
  const goPrev = useCallback(() => {
    if (is360Mode) return;
    setActiveIndex((p) => (p === 0 ? media.length - 1 : p - 1));
  }, [media.length, is360Mode]);

  const goNext = useCallback(() => {
    if (is360Mode) return;
    setActiveIndex((p) => (p === media.length - 1 ? 0 : p + 1));
  }, [media.length, is360Mode]);

  /* ----------------------------------------------
   *  TOUCH SWIPE
   * ---------------------------------------------- */
  const touchStartX = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) =>
    (touchStartX.current = e.touches[0].clientX);

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartX.current) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx > 40) goPrev();
    else if (dx < -40) goNext();
=======
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
      if (event.key === "Escape") setZoomOpen(false);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  const onTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current == null) return;

    const dx = event.changedTouches[0].clientX - touchStartX.current;
    if (dx > 50) goPrev();
    if (dx < -50) goNext();
>>>>>>> 4c42ba2 (Describe your changes)
    touchStartX.current = null;
  };

  /* ----------------------------------------------
   *  360° DRAG ROTATION
   * ---------------------------------------------- */
  const dragStartX = useRef<number | null>(null);

<<<<<<< HEAD
  const startRotate = (e: React.MouseEvent) =>
    (dragStartX.current = e.clientX);

  const endRotate = (e: React.MouseEvent) => {
    if (!is360Mode || dragStartX.current === null) return;

    const diff = e.clientX - dragStartX.current;

    if (Math.abs(diff) > 10) {
      const newIndex =
        (frameIndex + (diff > 0 ? -1 : 1) + view360.length) %
        view360.length;

      setFrameIndex(newIndex);
    }
    dragStartX.current = null;
  };

  /* ----------------------------------------------
   *  KEYBOARD CONTROL
   * ---------------------------------------------- */
  useEffect(() => {
    const handler = (ev: KeyboardEvent) => {
      if (ev.key === "ArrowLeft") goPrev();
      if (ev.key === "ArrowRight") goNext();
      if (ev.key === "Escape") setZoomOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goPrev, goNext]);

  /* ----------------------------------------------
   *  RENDER
   * ---------------------------------------------- */
  return (
    <div className="space-y-4">

      {/* MAIN GALLERY */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl bg-white border border-amber-200/40">
        <div
          className="relative w-full aspect-[4/5] bg-white"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* 360 Buttons */}
          {view360.length > 0 && (
            <div className="absolute top-4 left-4 z-20 flex gap-2">
              <button
                onClick={() => setIs360Mode(false)}
                className={`px-3 py-1 rounded-full text-xs ${
                  !is360Mode
                    ? "bg-white text-black shadow-lg"
                    : "bg-black/40 text-white"
                }`}
              >
                Photos
              </button>

              <button
                onClick={() => setIs360Mode(true)}
                className={`px-3 py-1 rounded-full text-xs ${
                  is360Mode
                    ? "bg-white text-black shadow-lg"
                    : "bg-black/40 text-white"
                }`}
              >
                360°
              </button>
            </div>
          )}

          {/* NAV ARROWS */}
          {!is360Mode && media.length > 1 && (
            <>
              <button className="lux-arrow left-3" onClick={goPrev}>‹</button>
              <button className="lux-arrow right-3" onClick={goNext}>›</button>
            </>
          )}

          {/* IMAGE */}
          {!is360Mode && current?.type === "image" && (
            <>
              {!loaded && <div className="absolute inset-0 shimmer" />}
              <Image
                src={current.src}
                alt={altText}
                fill
                onLoadingComplete={() => setLoaded(true)}
                className={`object-cover transition-all duration-500 ${
                  loaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
                } cursor-zoom-in`}
                onClick={() => setZoomOpen(true)}
              />
            </>
          )}

          {/* VIDEO */}
          {!is360Mode && current?.type === "video" && (
            <video
              src={current.src}
              controls
              className="w-full h-full object-cover"
            />
          )}

          {/* 360 VIEW */}
          {is360Mode && (
            <Image
              src={view360[frameIndex]}
              alt="360 View"
              fill
              className="object-cover select-none"
              onMouseDown={startRotate}
              onMouseUp={endRotate}
            />
          )}
        </div>
      </div>

      {/* DOTS */}
      {!is360Mode && (
        <div className="flex justify-center gap-2 mt-2">
          {media.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-2 rounded-full transition-all ${
                activeIndex === i ? "w-6 bg-amber-800" : "w-2 bg-gray-300"
              }`}
=======
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
              aria-label="Previous image"
              title="Previous image"
              className="absolute left-3 top-1/2 z-30 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md bg-white/92 text-[#171412] shadow-sm ring-1 ring-black/10 transition hover:bg-white"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next image"
              title="Next image"
              className="absolute right-3 top-1/2 z-30 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md bg-white/92 text-[#171412] shadow-sm ring-1 ring-black/10 transition hover:bg-white"
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
          <div className="flex h-[420px] w-full select-none items-center justify-center bg-black md:h-[620px]">
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
        <div className="flex justify-center gap-2">
          {media.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-2 rounded-full ${
                index === activeIndex ? "w-6 bg-[#171412]" : "w-2 bg-gray-300"
              }`}
              aria-label={`Go to media ${index + 1}`}
              title={`Go to media ${index + 1}`}
>>>>>>> 4c42ba2 (Describe your changes)
            />
          ))}
        </div>
      )}

<<<<<<< HEAD
      {/* THUMBNAILS */}
      {!is360Mode && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {media.map((m, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-24 w-20 rounded-xl overflow-hidden border transition ${
                i === activeIndex
                  ? "border-amber-700 shadow-md scale-[1.05]"
                  : "border-gray-300 opacity-80"
              }`}
            >
              {m.type === "image" ? (
                <div className="relative w-full h-full">
                  <Image src={m.src} alt="" fill className="object-cover" />
                </div>
              ) : (
                <div className="relative w-full h-full aspect-[4/5] bg-black flex items-center justify-center text-white text-xs">
                  VIDEO
=======
      {!is360Mode && media.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pt-1">
          {media.map((item, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-20 w-20 shrink-0 overflow-hidden rounded-md border ${
                index === activeIndex ? "border-[#8a1538]" : "border-black/10"
              }`}
              aria-label={`Select thumbnail ${index + 1}`}
              title={`Select thumbnail ${index + 1}`}
            >
              {item.type === "image" ? (
                <img
                  src={item.src}
                  alt={`${altText} thumbnail ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-black text-xs text-white">
                  Video
>>>>>>> 4c42ba2 (Describe your changes)
                </div>
              )}
            </button>
          ))}
        </div>
      )}

<<<<<<< HEAD
      {/* ZOOM VIEW */}
      {zoomOpen && current?.type === "image" && (
        <div
          className="fixed inset-0 cinematic-backdrop z-[9999]"
          onClick={() => setZoomOpen(false)}
        >
          <button className="absolute top-6 right-6 text-white text-4xl">
            ×
          </button>

          <Image
            src={current.src}
            alt="Zoom"
            fill
            className="object-contain cinematic-img"
          />
=======
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
>>>>>>> 4c42ba2 (Describe your changes)
        </div>
      )}
    </div>
  );
}
