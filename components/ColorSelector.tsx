// components/ColorSelector.tsx
"use client";

import React from "react";

type Props = { colors: string[]; selected?: string | undefined; onSelect: (c: string) => void; };

export default function ColorSelector({ colors, selected, onSelect }: Props) {
  if (!colors || colors.length === 0) return null;

  const isValidColor = (c: string) => {
    try { const s = new Option().style; s.color = c; return s.color !== ""; } catch { return false; }
  };

  return (
    <div className="flex flex-wrap gap-3">
      {colors.map(col => {
        const active = col === selected;
        return (
          <button
            key={col}
            onClick={() => onSelect(col)}
            aria-pressed={active}
            className={`relative flex items-center gap-3 px-3 py-1.5 rounded-lg border transition ${active ? "border-gray-900 bg-white shadow-sm" : "border-gray-300 bg-white"}`}
            aria-label={`Select ${col}`}
          >
            <span className="inline-block h-6 w-6 rounded-full border border-gray-300 shadow-inner" style={{ backgroundColor: isValidColor(col) ? col : "#f2f2f2" }} />
            <span className="text-sm capitalize">{col}</span>
            {active && <span className="absolute inset-0 rounded-lg ring-2 ring-amber-500 pointer-events-none" />}
          </button>
        );
      })}
    </div>
  );
}
