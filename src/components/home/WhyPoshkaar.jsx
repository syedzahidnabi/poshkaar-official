import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Gem, HandHeart, Landmark, ScrollText } from 'lucide-react';
import { EASE_LUXURY, viewportOnce } from '@/lib/luxuryMotion';

const PROOFS = [
  {
    icon: HandHeart,
    label: 'Human hands',
    title: 'Not factory made',
    text: 'Our pieces are made by real people with time, care and skill.',
  },
  {
    icon: Landmark,
    label: 'From Kashmir',
    title: 'Rooted in Kashmir',
    text: 'The designs, stitches and fabrics come from Kashmiri craft.',
  },
  {
    icon: ScrollText,
    label: 'For special days',
    title: 'Made for memories',
    text: 'For weddings, gifts and clothes you want to keep for years.',
  },
];

export default function WhyPoshkaar() {
  return (
    <section className="home-section-sand relative overflow-hidden border-y border-gold/10 py-12 md:py-24">
      <div className="absolute -left-20 top-10 h-52 w-52 rounded-full bg-gold/10 blur-3xl" />
      <div className="absolute -right-20 bottom-0 h-52 w-52 rounded-full bg-forest/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-7 px-4 md:px-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.9, ease: EASE_LUXURY }}
        >
          <div className="mb-4 inline-flex items-center gap-2 border border-gold/20 bg-white/45 px-3 py-2 text-[8px] uppercase tracking-[0.22em] text-gold md:text-[9px]">
            <Gem size={13} /> Why Poshkaar
          </div>
          <h2 className="max-w-2xl font-heading text-2xl font-light leading-tight text-charcoal text-balance md:text-5xl">
            Simple, beautiful pieces made with patience.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-charcoal/65 md:mt-6 md:text-base md:leading-7">
            We focus on clear design, honest handwork and pieces that feel special without shouting.
          </p>
          <Link
            to="/collections"
            className="group mt-8 inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-walnut luxury-transition hover:text-gold"
          >
            Shop the collection
            <ArrowRight size={14} className="transition-transform duration-500 group-hover:translate-x-1.5" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {PROOFS.map((proof, index) => (
            <motion.article
              key={proof.title}
              className={`surface-glow border border-gold/10 bg-white/40 p-4 shadow-3d backdrop-blur md:p-6 ${index === 2 ? 'col-span-2 md:col-span-1' : ''}`}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.75, delay: index * 0.1, ease: EASE_LUXURY }}
            >
              <proof.icon size={18} className="mb-4 text-gold md:mb-8 md:size-[21px]" strokeWidth={1.4} />
              <span className="text-[8px] uppercase tracking-[0.18em] text-muted-foreground md:text-[9px] md:tracking-[0.22em]">{proof.label}</span>
              <h3 className="mt-2 font-heading text-base font-light text-charcoal md:mt-3 md:text-xl">{proof.title}</h3>
              <p className="mt-2 text-xs leading-5 text-charcoal/62 md:mt-4 md:text-sm md:leading-6">{proof.text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
