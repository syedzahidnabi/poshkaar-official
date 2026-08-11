import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import SectionHeading from '@/components/luxury/SectionHeading';
import { EASE_LUXURY, viewportOnce } from '@/lib/luxuryMotion';
import { HOME_MEDIA } from '@/lib/homepageMedia';

const COLLECTIONS = [
  {
    title: 'New Arrivals',
    subtitle: 'The latest edit',
    media: HOME_MEDIA.collections.newArrivals,
    path: '/collections/new-arrivals',
    layout: 'lg:col-span-5 lg:row-span-2',
  },
  {
    title: 'The Wedding Edit',
    subtitle: 'For considered ceremonies',
    media: HOME_MEDIA.collections.wedding,
    path: '/collections/bridal',
    layout: 'lg:col-span-7',
  },
  {
    title: 'Pashmina Shawls',
    subtitle: 'Textiles and wraps',
    media: HOME_MEDIA.collections.pashmina,
    path: '/collections/pashmina',
    layout: 'lg:col-span-4',
  },
  {
    title: 'Signature Edit',
    subtitle: 'A focused selection',
    media: HOME_MEDIA.collections.signature,
    path: '/collections/best-sellers',
    layout: 'lg:col-span-3',
  },
];

export default function FeaturedCollections() {
  return (
    <section id="home-collections" className="scroll-mt-24 py-14 md:py-32">
      <div className="max-w-7xl mx-auto px-4 md:px-12 lg:px-16">
        <SectionHeading
          title="Shop by Collection"
          subtitle="Discover"
          description="Explore shawls, clothing, gifts and objects with clear material, origin and care details."
          className="mb-8 md:mb-16"
        />

        {/* Bento grid */}
        <div className="grid auto-rows-[190px] grid-cols-2 gap-3 md:auto-rows-[320px] md:grid-cols-2 md:gap-6 lg:grid-cols-12">
          {COLLECTIONS.map((col, i) => {
            return (
              <motion.div
                key={col.title}
                className={`group relative ${col.layout}`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.9, delay: i * 0.12, ease: EASE_LUXURY }}
              >
                <Link
                  to={col.path}
                  className="block h-full"
                >
                  <div className="relative h-full overflow-hidden rounded-[0.2rem] border border-walnut/10">
                    <img
                      src={col.media.src}
                      alt={col.media.alt}
                      className="h-full w-full object-cover transition duration-1000 ease-luxury group-hover:scale-[1.035]"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={viewportOnce}
                        transition={{ delay: 0.3 + i * 0.12, duration: 0.6 }}
                      >
                        <span className="text-champagne text-[8px] tracking-[0.2em] uppercase block mb-2 md:text-[9px] md:tracking-[0.3em]">
                          {col.subtitle}
                        </span>
                        <h3 className="font-heading text-xl md:text-3xl text-ivory font-light mb-3 md:mb-4">
                          {col.title}
                        </h3>
                        <div className="flex items-center gap-2 text-ivory/70 group-hover:text-champagne luxury-transition">
                          <span className="text-[10px] tracking-[0.2em] uppercase">Explore</span>
                          <ArrowRight
                            size={14}
                            className="group-hover:translate-x-1.5 luxury-transition"
                          />
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

