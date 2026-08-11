import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { EASE_LUXURY, viewportOnce } from '@/lib/luxuryMotion';
import { HOME_MEDIA } from '@/lib/homepageMedia';

const CATEGORIES = [
  {
    title: 'Pashmina',
    eyebrow: 'Textiles and wraps',
    text: 'Explore product-level material, technique, origin and care information.',
    media: HOME_MEDIA.categories.pashmina,
    path: '/collections/pashmina',
  },
  {
    title: 'Walnut Wood',
    eyebrow: 'Wood objects',
    text: 'Carved boxes, wall pieces and small objects with current prices and clear care notes.',
    media: HOME_MEDIA.categories.walnut,
    path: '/collections/walnut-wood',
  },
  {
    title: 'Papier Mache',
    eyebrow: 'Pattern and colour',
    text: 'Painted boxes, vases and decorative objects with current prices and clear care notes.',
    media: HOME_MEDIA.categories.papier,
    path: '/collections/papier-mache',
  },
  {
    title: 'Copperware',
    eyebrow: 'Metal objects',
    text: 'Engraved ewers, serving pieces and samovars with current prices and clear care notes.',
    media: HOME_MEDIA.categories.copper,
    path: '/collections/copperware',
  },
  {
    title: 'Willow Wicker',
    eyebrow: 'Woven objects',
    text: 'Handwoven baskets and home objects with current prices, sizes and care notes.',
    media: HOME_MEDIA.categories.willow,
    path: '/collections/willow-wicker',
  },
];

export default function LuxuryCategories() {
  return (
    <section className="relative overflow-hidden bg-ivory py-14 md:py-32" aria-labelledby="luxury-categories-title">
      <div className="mx-auto max-w-7xl px-4 md:px-12 lg:px-16">
        <div className="mb-8 grid gap-4 md:mb-16 md:grid-cols-[0.9fr_1.1fr] md:items-end">
          <div data-luxury-reveal>
            <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-gold">Luxury categories</p>
            <h2
              id="luxury-categories-title"
              className="font-heading font-light leading-[0.98] text-charcoal text-balance"
              style={{ fontSize: 'clamp(2.25rem, 6vw, 5.8rem)' }}
            >
              Craft, material and form.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-charcoal/65 md:justify-self-end md:text-base md:leading-7" data-luxury-reveal>
            Explore the catalogue by category. Product-level records explain what is known about each material, technique and origin.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
          {CATEGORIES.map((category, index) => (
            <motion.article
              key={category.title}
              className="group relative min-h-[190px] overflow-hidden border border-walnut/10 bg-sand shadow-[0_28px_90px_-74px_rgba(91,58,41,0.9)] sm:min-h-[240px] md:min-h-[260px]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.8, delay: index * 0.06, ease: EASE_LUXURY }}
            >
              <Link to={category.path} className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-gold">
                <img
                  src={category.media.src}
                  alt={category.media.alt}
                  className="absolute inset-0 h-full w-full object-cover transition duration-1000 ease-luxury group-hover:scale-105"
                  style={{ objectPosition: category.media.objectPosition || 'center' }}
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/94 via-charcoal/48 to-charcoal/12" />
                <div className="absolute inset-x-0 bottom-0 p-4 md:p-8">
                  <p className="mb-2 text-[8px] uppercase tracking-[0.2em] text-champagne md:mb-3 md:text-[9px] md:tracking-[0.28em]">{category.eyebrow}</p>
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <h3 className="font-heading text-xl font-light leading-tight text-ivory sm:text-2xl md:text-4xl">{category.title}</h3>
                      <p className="mt-2 hidden max-w-sm text-sm font-medium leading-6 text-ivory sm:block">{category.text}</p>
                    </div>
                    <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ivory/30 text-ivory transition duration-500 group-hover:border-gold group-hover:text-champagne md:flex">
                      <ArrowUpRight size={16} aria-hidden="true" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
        <p className="mt-5 text-right text-[9px] leading-5 text-charcoal/50">
          Copperware photograph by{' '}
          <a
            href={HOME_MEDIA.categories.copper.credit.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:text-walnut"
          >
            {HOME_MEDIA.categories.copper.credit.name}
          </a>
          {' '}under{' '}
          <a
            href={HOME_MEDIA.categories.copper.credit.licenseUrl}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:text-walnut"
          >
            {HOME_MEDIA.categories.copper.credit.licenseName}
          </a>
          . Reduced in size and cropped by the layout.
        </p>
      </div>
    </section>
  );
}

