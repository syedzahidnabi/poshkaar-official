"use client";

import React from "react";

type Props = {
  colors: string[];
  selected?: string;
  onSelect: (c: string) => void;
};

/* -------------------------------------------------------
   Color validation helper (prevents invalid CSS colors)
-------------------------------------------------------- */
function isValidColor(col: string) {
  try {
    const s = new Option().style;
    s.color = col;
    return s.color !== "";
  } catch {
    return false;
  }
}

export default function ColorSelector({ colors, selected, onSelect }: Props) {
  if (!colors || colors.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {colors.map((col) => {
        const active = col === selected;
        const safeColor = isValidColor(col) ? col : "#d9d9d9";

        return (
          <button
            key={col}
            aria-label={`Select color ${col}`}
            aria-pressed={active}
            onClick={() => onSelect(col)}
            className={`
              group relative flex items-center gap-3 px-3 py-1.5 rounded-xl 
              border transition-all duration-300
              bg-white shadow-sm

              ${active ? "border-amber-700 shadow-md scale-[1.02]" : "border-gray-300 hover:border-gray-400"}
            `}
          >
            {/* COLOR DOT */}
            <span
              className={`
                inline-block h-7 w-7 rounded-full shadow-inner 
                transition-transform duration-300 
                ${active ? "scale-110" : "scale-100"}
              `}
              style={{ backgroundColor: safeColor }}
            />

            {/* LABEL */}
            <span className="text-sm capitalize text-gray-700">
              {col.replace(/-/g, " ")}
            </span>

            {/* ACTIVE RING (LUXURY EFFECT) */}
            {active && (
              <span className="absolute inset-0 rounded-xl ring-2 ring-amber-600 animate-pulseSlow pointer-events-none" />
            )}
          </button>
        );
      })}
    </div>
  );
}
