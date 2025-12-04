// components/FloatingWhatsApp.tsx
"use client";

import React from "react";

export default function FloatingWhatsApp({ phone = "916006491824" }: { phone?: string }) {
  const href = `https://wa.me/${phone}`;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="fixed right-6 bottom-6 z-50">
      <div className="w-14 h-14 rounded-full bg-green-600 shadow-lg flex items-center justify-center text-white">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M21 12.07c0 4.99-4.06 9.04-9.07 9.04a9 9 0 0 1-4.86-1.43L3 21l1.45-3.99A8.98 8.98 0 0 1 2.93 12.07C2.93 7.08 6.99 3.02 12 3.02S21 7.08 21 12.07Z" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
    </a>
  );
}
