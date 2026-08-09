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
    <section className="home-section-sand relative overflow-hidden border-y border-gold/10 py-16 md:py-24">
      <div className="absolute -left-20 top-10 h-52 w-52 rounded-full bg-gold/10 blur-3xl" />
      <div className="absolute -right-20 bottom-0 h-52 w-52 rounded-full bg-forest/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 md:px-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.9, ease: EASE_LUXURY }}
        >
          <div className="mb-5 inline-flex items-center gap-3 border border-gold/20 bg-white/45 px-4 py-2 text-[9px] uppercase tracking-[0.24em] text-gold">
            <Gem size={13} /> Why Poshkaar
          </div>
          <h2 className="max-w-2xl font-heading text-3xl font-light leading-tight text-charcoal text-balance md:text-5xl">
            Simple, beautiful pieces made with patience.
          </h2>
          <p className="mt-6 max-w-xl text-sm leading-7 text-charcoal/65 md:text-base">
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

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {PROOFS.map((proof, index) => (
            <motion.article
              key={proof.title}
              className="surface-glow border border-gold/10 bg-white/40 p-6 shadow-3d backdrop-blur"
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.75, delay: index * 0.1, ease: EASE_LUXURY }}
            >
              <proof.icon size={21} className="mb-8 text-gold" strokeWidth={1.4} />
              <span className="text-[9px] uppercase tracking-[0.22em] text-muted-foreground">{proof.label}</span>
              <h3 className="mt-3 font-heading text-xl font-light text-charcoal">{proof.title}</h3>
              <p className="mt-4 text-sm leading-6 text-charcoal/62">{proof.text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
