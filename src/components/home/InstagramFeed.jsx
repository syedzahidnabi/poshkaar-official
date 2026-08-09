import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, ArrowUpRight } from 'lucide-react';
import SectionHeading from '@/components/luxury/SectionHeading';
import { EASE_LUXURY, viewportOnce } from '@/lib/luxuryMotion';

const POSTS = [
  { image: '/images/home/pashmina-sozni-jamawar.jpeg', caption: 'Sozni Pashmina detail' },
  { image: '/images/products/walnut-wood/walnut2-main.jpg', caption: 'Hand-carved walnut wood' },
  { image: '/images/products/papier-mache/papier1-main.jpg', caption: 'Hand-painted papier-mâché' },
  { image: '/images/products/copperware/copper1-main.jpg', caption: 'Chinar Naqashi copperware' },
  { image: '/images/products/willow-wicker/willow1-main.jpg', caption: 'Handwoven willow wicker' },
  { image: '/images/dabka2-main.jpg', caption: 'Lotus bloom saree' },
];

export default function InstagramFeed() {
  return (
    <section className="py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
        <SectionHeading
          title="The Poshkaar Journal"
          subtitle="Follow Our Story"
          description="See the craft, the artisans and the latest pieces we share on Instagram."
          className="mb-16"
        />

        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-4 lg:grid-cols-6">
          {POSTS.map((post, i) => (
            <motion.a
              key={post.caption}
              href="https://instagram.com/posh__kaar"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden bg-beige luxury-card-3d"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={viewportOnce}
              transition={{ duration: 0.6, delay: (i % 6) * 0.08, ease: EASE_LUXURY }}
              aria-label={post.caption}
            >
              <img
                src={post.image}
                alt={post.caption}
                className="h-full w-full object-cover luxury-transition-slow group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-charcoal/0 luxury-transition group-hover:bg-charcoal/60">
                <Instagram size={20} className="text-ivory opacity-0 luxury-transition group-hover:opacity-100" />
                <span className="px-3 text-center text-[9px] uppercase tracking-[0.16em] text-ivory opacity-0 luxury-transition group-hover:opacity-100">
                  {post.caption}
                </span>
              </div>
              <ArrowUpRight
                size={14}
                className="absolute right-3 top-3 text-ivory opacity-0 luxury-transition group-hover:opacity-100"
              />
            </motion.a>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="https://instagram.com/posh__kaar"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-charcoal luxury-transition hover:text-walnut"
          >
            <Instagram size={14} />
            @posh__kaar
          </a>
        </div>
      </div>
    </section>
  );
}
