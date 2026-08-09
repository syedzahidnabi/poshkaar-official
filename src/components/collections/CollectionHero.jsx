import React from 'react';
import { motion } from 'framer-motion';
import { EASE_LUXURY } from '@/lib/luxuryMotion';

const DEFAULT_IMAGE = '/images/main-banner.jpg';

export default function CollectionHero({ title, subtitle, image, count }) {
  return (
    <section className="relative h-[42vh] min-h-[340px] overflow-hidden bg-charcoal">
      <motion.img
        src={image || DEFAULT_IMAGE}
        alt={`${title}: ${subtitle}`}
        className="w-full h-full object-cover"
        fetchpriority="high"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/35 via-charcoal/20 to-charcoal/80" />
      <div className="absolute inset-0" style={{ boxShadow: 'inset 0 0 120px 10px rgba(0,0,0,0.3)' }} />

      <div className="absolute inset-0 flex items-end">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 w-full pb-10 md:pb-14">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE_LUXURY, delay: 0.15 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <span className="h-px w-10 bg-gold/50" />
              <span className="font-body text-[10px] uppercase tracking-[0.35em] text-champagne">
                {subtitle}
              </span>
            </div>
            <h1
              className="font-heading text-ivory font-light leading-[0.95] text-balance"
              style={{ fontSize: 'clamp(2.25rem, 5.5vw, 4rem)' }}
            >
              {title}
            </h1>
            {count !== undefined && (
              <p className="mt-5 font-body text-[11px] uppercase tracking-[0.25em] text-ivory/70">
                {count} {count === 1 ? 'piece' : 'pieces'}
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
