import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { HOME_MEDIA } from '@/lib/homepageMedia';
import { EASE_LUXURY, viewportOnce } from '@/lib/luxuryMotion';

const STRIP_IMAGES = [
  HOME_MEDIA.visualEdit.gathering,
  HOME_MEDIA.visualEdit.copper,
  HOME_MEDIA.visualEdit.lake,
  HOME_MEDIA.visualEdit.loom,
  HOME_MEDIA.visualEdit.willow,
  HOME_MEDIA.heritage.artisan,
];

const PROOFS = [
  'Custom sizing',
  'WhatsApp guidance',
  'Kashmir-led craft',
  'Verified product notes',
];

export default function LivingAtelier() {
  const marqueeImages = [...STRIP_IMAGES, ...STRIP_IMAGES];

  return (
    <section className="relative overflow-hidden bg-[#171513] py-14 text-ivory md:py-24" aria-labelledby="living-atelier-title">
      <div className="absolute inset-0 opacity-20" aria-hidden="true">
        <div className="absolute left-0 top-0 h-full w-1/3 bg-[radial-gradient(circle_at_center,rgba(200,169,106,0.32),transparent_62%)]" />
        <div className="absolute bottom-0 right-0 h-2/3 w-1/2 bg-[radial-gradient(circle_at_center,rgba(47,71,51,0.5),transparent_64%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 md:px-12 lg:px-16">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.85, ease: EASE_LUXURY }}
          >
            <p className="mb-5 text-[10px] uppercase tracking-[0.32em] text-champagne">Still moving</p>
            <h2
              id="living-atelier-title"
              className="max-w-xl font-heading font-light leading-[0.96] text-ivory text-balance"
              style={{ fontSize: 'clamp(2.25rem, 6vw, 5.8rem)' }}
            >
              From first look to final detail.
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-6 text-ivory/68 md:mt-7 md:text-base md:leading-8">
              Browse the edit, ask for measurements, compare materials and choose the piece that fits your moment.
            </p>

            <div className="mt-7 flex flex-wrap gap-3 md:mt-9">
              <Link
                to="/collections"
                className="inline-flex min-h-12 items-center gap-3 border border-champagne bg-champagne px-5 text-[10px] uppercase tracking-[0.2em] text-charcoal luxury-transition hover:border-ivory hover:bg-ivory"
              >
                Shop pieces
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
              <a
                href="https://wa.me/916006491824"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center gap-3 border border-ivory/20 px-5 text-[10px] uppercase tracking-[0.2em] text-ivory luxury-transition hover:border-champagne hover:text-champagne"
              >
                WhatsApp
                <MessageCircle size={14} aria-hidden="true" />
              </a>
            </div>
          </motion.div>

          <motion.div
            className="relative overflow-hidden border border-ivory/10 bg-ivory/5 py-5"
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.9, ease: EASE_LUXURY }}
          >
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#171513] to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#171513] to-transparent" />
            <div className="flex w-max gap-3 animate-marquee md:gap-4">
              {marqueeImages.map((media, index) => (
                <figure
                  key={`${media.src}-${index}`}
                  className="relative h-56 w-40 shrink-0 overflow-hidden border border-ivory/10 bg-charcoal md:h-96 md:w-64"
                >
                  <img
                    src={media.src}
                    alt={media.alt}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/45 to-transparent" />
                </figure>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 border-t border-ivory/10 pt-6 md:mt-12 lg:grid-cols-4">
          {PROOFS.map((proof, index) => (
            <motion.div
              key={proof}
              className="flex items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-ivory/62"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.58, delay: index * 0.05, ease: EASE_LUXURY }}
            >
              <span className="h-1.5 w-1.5 rotate-45 border border-champagne" aria-hidden="true" />
              {proof}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
