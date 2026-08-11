import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Fingerprint, Leaf, Scissors, Sparkles } from 'lucide-react';
import { EASE_LUXURY, viewportOnce } from '@/lib/luxuryMotion';

const DETAILS = [
  {
    icon: Fingerprint,
    title: 'Details before claims',
    text: 'Material, origin and maker information is shown only after it has been checked for the individual piece.',
  },
  {
    icon: Scissors,
    title: 'Personal guidance',
    text: 'For clothing and special orders, our team can help with measurements, fit and the right next step.',
  },
  {
    icon: Leaf,
    title: 'Care for the long term',
    text: 'Clear care, storage and handling notes help every verified piece remain part of your home for longer.',
  },
];

export default function AtelierSignature() {
  return (
    <section className="relative overflow-hidden bg-ivory py-14 md:py-32" aria-labelledby="atelier-signature-title">
      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="absolute -left-24 top-24 h-80 w-80 rounded-full bg-gold/10 blur-3xl" aria-hidden="true" />
      <div className="absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-forest/10 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 md:gap-10 md:px-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.9, ease: EASE_LUXURY }}
        >
          <div className="mb-5 inline-flex items-center gap-3 border border-gold/25 bg-white/45 px-3 py-2 text-[8px] uppercase tracking-[0.2em] text-walnut backdrop-blur md:mb-7 md:px-4 md:text-[9px] md:tracking-[0.24em]">
            <Sparkles size={13} className="text-gold" aria-hidden="true" />
            The Poshkaar approach
          </div>
          <h2
            id="atelier-signature-title"
            className="max-w-4xl font-heading font-light leading-[0.96] text-charcoal text-balance"
            style={{ fontSize: 'clamp(2.35rem, 7vw, 7rem)' }}
          >
            Chosen with a careful eye.
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-6 text-charcoal/68 md:mt-8 md:text-lg md:leading-8">
            Poshkaar is for people who notice detail. We pair a calm edit with clear product information and personal service.
          </p>
          <Link
            to="/our-story"
            className="group mt-6 inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-walnut luxury-transition hover:text-gold md:mt-9"
          >
            Read the story
            <ArrowRight size={14} className="transition-transform duration-500 group-hover:translate-x-1.5" aria-hidden="true" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-1">
          {DETAILS.map((detail, index) => (
            <motion.article
              key={detail.title}
              className={`group relative overflow-hidden border border-walnut/10 bg-sand/70 p-4 shadow-[0_24px_80px_-60px_rgba(91,58,41,0.8)] backdrop-blur luxury-transition hover:-translate-y-1 hover:border-gold/35 hover:bg-white/55 md:p-7 ${index === 2 ? 'col-span-2 lg:col-span-1' : ''}`}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.72, delay: index * 0.08, ease: EASE_LUXURY }}
            >
              <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-gold/50 to-transparent opacity-0 luxury-transition group-hover:opacity-100" />
              <div className="flex flex-col gap-3 md:flex-row md:gap-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-gold/25 bg-ivory text-gold md:h-12 md:w-12">
                  <detail.icon size={17} strokeWidth={1.4} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-light leading-tight text-charcoal md:text-2xl">{detail.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-charcoal/64 md:mt-3 md:text-sm md:leading-7">{detail.text}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
