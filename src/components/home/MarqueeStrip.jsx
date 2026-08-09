import React from 'react';

const ITEMS = [
  'Handcrafted in Kashmir',
  'Made by Master Artisans',
  'Pure Pashmina',
  'Sozni and Tilla Work',
  'A Living Craft',
  'Worldwide Shipping',
  'True Handmade Pieces',
];

export default function MarqueeStrip() {
  const doubled = [...ITEMS, ...ITEMS];

  return (
    <section className="max-w-full overflow-hidden overflow-x-clip border-y border-gold/15 bg-walnut py-5 [contain:paint]">
      <div className="flex animate-marquee whitespace-nowrap will-change-transform">
        {doubled.map((item, i) => (
          <div key={i} className="flex shrink-0 items-center">
            <span className="px-8 font-body text-[10px] uppercase tracking-[0.3em] text-ivory/70">
              {item}
            </span>
            <span className="text-[8px] text-gold/70" aria-hidden="true">•</span>
          </div>
        ))}
      </div>
    </section>
  );
}
