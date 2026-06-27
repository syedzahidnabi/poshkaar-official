"use client";

import React from "react";

type Props = {
  rating: number; // e.g. 4.8
  count?: number; // e.g. 27
  size?: number; // pixel size
  className?: string;
};

export default function RatingStars({ rating, count = 0, size = 16, className = "" }: Props) {
  // clamp rating between 0 and 5
  const r = Math.max(0, Math.min(5, rating));
  const full = Math.floor(r);
  const half = r - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  const renderStar = (type: "full" | "half" | "empty", key: string) => {
    if (type === "full") {
      return (
        <svg key={key} width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className="text-amber-500">
          <path d="M12 .587l3.668 7.431L23.5 9.75l-5.75 5.602L19.335 24 12 19.77 4.665 24l1.585-8.648L.5 9.75l7.832-1.732L12 .587z" />
        </svg>
      );
    }
    if (type === "half") {
      return (
        <svg key={key} width={size} height={size} viewBox="0 0 24 24" className="text-amber-500">
          <defs>
            <linearGradient id={`half-grad-${key}`}>
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path d="M12 .587l3.668 7.431L23.5 9.75l-5.75 5.602L19.335 24 12 19.77 4.665 24l1.585-8.648L.5 9.75l7.832-1.732L12 .587z" fill={`url(#half-grad-${key})`} stroke="currentColor" strokeWidth="0.5" />
        </svg>
      );
    }
    return (
      <svg key={key} width={size} height={size} viewBox="0 0 24 24" fill="none" className="text-gray-300">
        <path d="M12 .587l3.668 7.431L23.5 9.75l-5.75 5.602L19.335 24 12 19.77 4.665 24l1.585-8.648L.5 9.75l7.832-1.732L12 .587z" stroke="currentColor" strokeWidth="1" />
      </svg>
    );
  };

  const stars: React.ReactNode[] = [];
  for (let i = 0; i < full; i++) stars.push(renderStar("full", `f${i}`));
  if (half) stars.push(renderStar("half", "h0"));
  for (let i = 0; i < empty; i++) stars.push(renderStar("empty", `e${i}`));

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div className="flex gap-1 items-center" aria-hidden>
        {stars}
      </div>
      <div className="text-sm text-gray-700">
        <strong className="text-gray-900">{rating.toFixed(1)}</strong>
        <span className="text-gray-500"> ({count})</span>
      </div>
    </div>
  );
}
