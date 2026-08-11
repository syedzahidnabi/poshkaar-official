import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import LuxuryButton from '@/components/luxury/LuxuryButton';
import { EASE_LUXURY, viewportOnce } from '@/lib/luxuryMotion';
import { HOME_MEDIA } from '@/lib/homepageMedia';

const CRAFT_PHOTO = HOME_MEDIA.heritage.artisan;

const STATS = [
  { number: 'Material', label: 'Clearly named' },
  { number: 'Origin', label: 'Published when checked' },
  { number: 'Care', label: 'Practical guidance' },
];

export default function HeritageStory() {
  return (
    <section className="relative py-14 md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-20">
          <motion.div
            className="relative luxury-card-3d"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 1, ease: EASE_LUXURY }}
          >
            <div className="relative luxury-card-3d-image">
              <div className="aspect-[5/4] overflow-hidden luxury-shadow-lg md:aspect-[4/5]">
                <motion.img
                  src={CRAFT_PHOTO.src}
                  alt={CRAFT_PHOTO.alt}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="lg:pl-8"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 1, ease: EASE_LUXURY }}
          >
            <div className="mb-6 flex items-center gap-4">
              <span className="h-px w-10 bg-gold/40" />
              <span className="font-body text-[10px] uppercase tracking-[0.3em] text-gold">
                Our approach
              </span>
            </div>
            <h2
              className="mb-8 font-heading font-light leading-[1.05] text-charcoal text-balance"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.25rem)' }}
            >
              Craft deserves context, not just a label
            </h2>
            <p className="mb-6 text-sm leading-relaxed text-charcoal/70 md:text-base">
              Craft traditions carry knowledge through material, tools and practice. Poshkaar publishes process and maker details only after they have been checked for the individual piece.
            </p>
            <p className="mb-10 text-sm leading-relaxed text-charcoal/70 md:text-base">
              For each listed piece, we show what has been verified and leave uncertain fields open until the right information is available.
            </p>

            <div className="mb-8 grid grid-cols-3 gap-3 md:mb-12 md:gap-6">
              {STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={viewportOnce}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                >
                  <p className="font-heading text-xl font-light text-walnut md:text-4xl">
                    {stat.number}
                  </p>
                  <p className="mt-1 font-body text-[8px] uppercase leading-4 tracking-[0.08em] text-muted-foreground md:text-[10px]">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>

            <Link to="/our-story">
              <LuxuryButton variant="secondary" size="lg">
                Read Our Story
              </LuxuryButton>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
