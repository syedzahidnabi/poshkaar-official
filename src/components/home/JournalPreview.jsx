import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { EASE_LUXURY, viewportOnce } from '@/lib/luxuryMotion';
import { HOME_MEDIA } from '@/lib/homepageMedia';

const STORIES = [
  {
    label: 'Craft note',
    title: 'Why slow handwork feels different',
    text: "A handmade piece carries small decisions: pressure, spacing, rhythm and the maker's eye.",
    media: HOME_MEDIA.journal.slowHandwork,
    path: '/journal/slow-handwork',
  },
  {
    label: 'Material guide',
    title: 'How to read cloth and handwork',
    text: 'Look at the cloth, thread, weight and handwork before choosing a piece.',
    media: HOME_MEDIA.journal.materialGuide,
    path: '/journal/keepsake-shawl',
  },
  {
    label: 'Product guide',
    title: 'What verified details mean',
    text: 'How material, origin, care and availability notes help you choose with confidence.',
    media: HOME_MEDIA.journal.productDetails,
    path: '/journal/product-provenance',
  },
];

export default function JournalPreview() {
  return (
    <section className="relative bg-ivory py-20 md:py-32" aria-labelledby="journal-preview-title">
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
        <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div data-luxury-reveal>
            <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-gold">Journal</p>
            <h2
              id="journal-preview-title"
              className="max-w-3xl font-heading font-light leading-[0.98] text-charcoal text-balance"
              style={{ fontSize: 'clamp(2.7rem, 6vw, 5.6rem)' }}
            >
              Notes from the atelier.
            </h2>
          </div>
          <Link
            to="/journal/slow-handwork"
            className="group inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-walnut luxury-transition hover:text-gold"
          >
            Read more
            <ArrowRight size={14} className="transition-transform duration-500 group-hover:translate-x-1.5" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {STORIES.map((story, index) => (
            <motion.article
              key={story.title}
              className="group border border-walnut/10 bg-sand/60"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.75, delay: index * 0.08, ease: EASE_LUXURY }}
            >
              <Link to={story.path} className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-gold">
                <div className="aspect-[4/3] overflow-hidden bg-sand">
                  <img
                    src={story.media.src}
                    alt={story.media.alt}
                    className="h-full w-full object-cover transition duration-1000 ease-luxury group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="p-6 md:p-7">
                  <p className="mb-4 text-[9px] uppercase tracking-[0.28em] text-gold">{story.label}</p>
                  <h3 className="font-heading text-3xl font-light leading-tight text-charcoal">{story.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-charcoal/64">{story.text}</p>
                  <span className="mt-7 inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-walnut">
                    Open story
                    <ArrowRight size={13} className="transition-transform duration-500 group-hover:translate-x-1.5" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
