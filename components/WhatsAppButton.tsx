"use client";

import { MessageCircle } from "lucide-react";
import { whatsappNumber } from "@/data/commerce";

export default function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-green-600 px-5 text-sm font-bold text-white transition hover:bg-green-700"
    >
      <MessageCircle className="h-4 w-4" aria-hidden="true" />
      Chat on WhatsApp
    </a>
  );
}
