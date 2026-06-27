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
  const lines = ["Hello Poshkaar", "", `I would like to order *${productName}*.`];

  if (color) lines.push("", `Colour: ${color}`);

  if (measurements && Object.keys(measurements).length > 0) {
    lines.push("", "Measurements:");
    Object.entries(measurements).forEach(([key, value]) => {
      if (value) lines.push(`- ${prettyLabel(key)}: ${value}`);
    });
  }

  lines.push("", "Please confirm availability, price and delivery timeline.");
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
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(
    buildMessage({ productName, color, measurements })
  )}`;

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={className}>
      <span className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-green-600 px-4 text-sm font-bold text-white transition hover:bg-green-700">
        {children ?? (
          <>
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Order on WhatsApp
          </>
        )}
      </span>
    </a>
  );
}
