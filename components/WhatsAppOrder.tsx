"use client";

import type { ReactNode } from "react";
import { MessageCircle } from "lucide-react";

type Props = {
  productName: string;
  color?: string | null;
  measurements?: Record<string, string> | null;
  phone?: string;
  className?: string;
  children?: ReactNode;
};

function prettyLabel(key: string) {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (value) => value.toUpperCase());
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
<<<<<<< HEAD
  const lines: string[] = [];
  lines.push("Hello Poshkaar ✨");
  lines.push("");
  lines.push(`I would like to order *${productName}*`);
=======
  const lines: string[] = [
    "Hello Poshkaar",
    "",
    `I would like to order *${productName}*.`,
  ];
>>>>>>> 4c42ba2 (Describe your changes)

  if (color) {
    lines.push("", `Colour: ${color}`);
  }

  if (measurements && Object.keys(measurements).length > 0) {
<<<<<<< HEAD
    lines.push("");
    lines.push("Measurements:");
    Object.entries(measurements).forEach(([k, v]) => {
      if (v) lines.push(`• ${prettyLabel(k)}: ${v}`);
    });
  }

  lines.push("");
  lines.push("Please confirm availability, price and delivery timeline. Thank you!");

=======
    lines.push("", "Measurements:");
    Object.entries(measurements).forEach(([key, value]) => {
      if (value) lines.push(`- ${prettyLabel(key)}: ${value}`);
    });
  }

  lines.push("", "Please confirm availability, price and delivery timeline.");
>>>>>>> 4c42ba2 (Describe your changes)
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
<<<<<<< HEAD
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
=======
      className={className}
    >
      <span className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-green-600 px-4 text-sm font-bold text-white transition hover:bg-green-700">
        {children ?? (
          <>
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Order on WhatsApp
          </>
        )}
      </span>
>>>>>>> 4c42ba2 (Describe your changes)
    </a>
  );
}
