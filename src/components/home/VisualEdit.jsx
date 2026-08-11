import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { HOME_MEDIA } from '@/lib/homepageMedia';
import { EASE_LUXURY, viewportOnce } from '@/lib/luxuryMotion';

const TILES = [
  {
    title: 'Worn with memory',
    label: 'Kashmiri attire',
    media: HOME_MEDIA.visualEdit.gathering,
    className: 'md:col-span-5 md:row-span-2',
  },
  {
    title: 'Copper glow',
    label: 'Objects',
    media: HOME_MEDIA.visualEdit.copper,
    className: 'md:col-span-3',
  },
  {
    title: 'From the valley',
    label: 'Place',
    media: HOME_MEDIA.visualEdit.lake,
    className: 'md:col-span-4',
  },
  {
    title: 'Hands at work',
    label: 'Loom',
    media: HOME_MEDIA.visualEdit.loom,
    className: 'md:col-span-4',
  },
  {
    title: 'Everyday craft',
    label: 'Willow',
    media: HOME_MEDIA.visualEdit.willow,
    className: 'md:col-span-3',
  },
];

export default function VisualEdit() {
  return (
    <section className="bg-charcoal py-12 text-ivory md:py-24" aria-labelledby="visual-edit-title">
      <div className="mx-auto max-w-7xl px-4 md:px-12 lg:px-16">
        <div className="mb-7 flex items-end justify-between gap-4 md:mb-9">
          <div>
            <p className="mb-3 text-[9px] uppercase tracking-[0.24em] text-champagne/75 md:mb-4 md:text-[10px] md:tracking-[0.3em]">Seen in Kashmir</p>
            <h2
              id="visual-edit-title"
              className="max-w-[15rem] font-heading text-3xl font-light leading-none text-ivory md:max-w-3xl md:text-balance"
              style={{ fontSize: 'clamp(2rem, 5.6vw, 5.4rem)' }}
            >
              Texture, place and people.
            </h2>
          </div>
          <Link
            to="/collections"
            className="group hidden shrink-0 items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-champagne luxury-transition hover:text-gold sm:inline-flex"
          >
            Shop the edit
            <ArrowRight size={14} className="transition-transform duration-500 group-hover:translate-x-1.5" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid auto-rows-[10.5rem] grid-cols-2 gap-3 md:grid-cols-12 md:auto-rows-[13.5rem] md:gap-4">
          {TILES.map((tile, index) => (
            <motion.article
              key={tile.title}
              className={`${tile.className} ${index === 0 ? 'col-span-2 md:col-span-5 md:row-span-2' : ''} group relative overflow-hidden border border-ivory/10 bg-ivory/5`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.75, delay: index * 0.06, ease: EASE_LUXURY }}
            >
              <img
                src={tile.media.src}
                alt={tile.media.alt}
                className="h-full w-full object-cover transition duration-1000 ease-luxury group-hover:scale-[1.035]"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/78 via-charcoal/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 md:p-6">
                <p className="text-[8px] uppercase tracking-[0.2em] text-champagne/75 md:text-[9px] md:tracking-[0.28em]">{tile.label}</p>
                <h3 className="mt-1 font-heading text-lg font-light leading-tight text-ivory md:mt-2 md:text-3xl">{tile.title}</h3>
              </div>
            </motion.article>
          ))}
        </div>
        <Link
          to="/collections"
          className="mt-5 inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-champagne luxury-transition hover:text-gold sm:hidden"
        >
          Shop the edit
          <ArrowRight size={13} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

