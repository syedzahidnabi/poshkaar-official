"use client";

import React from "react";

type Props = {
  productName: string;
  color?: string | null;
  measurements?: Record<string, string> | null;
  phone?: string;
  className?: string;
  children?: React.ReactNode;
};

function prettyLabel(key: string) {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
}

function buildMessage({
  productName,
  color,
  measurements,
}: {
  productName: string;
  color?: string | null;
  measurements?: Record<string, string> | null;
}) {
  const lines: string[] = [];
  lines.push("Hello Poshkaar ✨");
  lines.push("");
  lines.push(`I would like to order *${productName}*`);

  if (color) {
    lines.push("");
    lines.push(`Colour: ${color}`);
  }

  if (measurements && Object.keys(measurements).length > 0) {
    lines.push("");
    lines.push("Measurements:");
    Object.entries(measurements).forEach(([k, v]) => {
      if (v) lines.push(`• ${prettyLabel(k)}: ${v}`);
    });
  }

  lines.push("");
  lines.push("Please confirm availability, price and delivery timeline. Thank you!");

  return lines.join("\n");
}

export default function WhatsAppOrder({
  productName,
  color,
  measurements,
  phone = "916006491824",
  className = "",
  children,
}: Props) {
  const message = buildMessage({ productName, color, measurements });
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Order via WhatsApp"
      className={`
        whatsapp-btn
        flex items-center justify-center
        gap-2
        w-full h-12
        rounded-lg
        bg-green-600
        text-white text-sm font-semibold
        shadow-md
        hover:bg-green-700 hover:shadow-lg
        transition-all
        ${className}
      `}
    >
      <svg
        className="whatsapp-icon"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
      >
        <path
          d="M21 12.07c0 4.99-4.06 9.04-9.07 9.04a9 9 0 0 1-4.86-1.43L3 21l1.45-3.99A8.98 8.98 0 0 1 2.93 12.07C2.93 7.08 6.99 3.02 12 3.02S21 7.08 21 12.07Z"
          stroke="#fff"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {children ?? "Order on WhatsApp"}
    </a>
  );
}
