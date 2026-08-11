import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, ArrowRight, ArrowUpRight } from 'lucide-react';
import SectionHeading from '@/components/luxury/SectionHeading';
import { HOME_MEDIA } from '@/lib/homepageMedia';
import { EASE_LUXURY, viewportOnce } from '@/lib/luxuryMotion';

const POSTS = [
  { image: HOME_MEDIA.visualEdit.gathering.src, caption: 'Pherans in conversation', span: 'md:col-span-2 md:row-span-2' },
  { image: HOME_MEDIA.visualEdit.copper.src, caption: 'Copper plate portrait' },
  { image: '/images/products/tilla/tilla1-main.jpg', caption: 'Tilla work closeup' },
  { image: HOME_MEDIA.visualEdit.willow.src, caption: 'Willow and winter cloth' },
  { image: '/images/products/walnut-wood/walnut2-main.jpg', caption: 'Hand-carved walnut wood' },
  { image: HOME_MEDIA.visualEdit.lake.src, caption: 'From Kashmir, clearly' },
  { image: '/images/products/papier-mache/papier1-main.jpg', caption: 'Hand-painted papier mache' },
  { image: HOME_MEDIA.visualEdit.loom.src, caption: 'At the loom' },
];

export default function InstagramFeed() {
  return (
    <section className="relative overflow-hidden bg-[#eee7dd] py-14 md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-12 lg:px-16">
        <SectionHeading
          title="Seen around Poshkaar"
          subtitle="The living edit"
          description="A visual pulse of pieces, places and craft details that make the store feel current."
          className="mb-8 md:mb-16"
        />

        <div className="grid auto-rows-[9rem] grid-cols-2 gap-2 md:auto-rows-[12rem] md:grid-cols-4 md:gap-4">
          {POSTS.map((post, i) => (
            <motion.a
              key={post.caption}
              href="https://instagram.com/posh__kaar"
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative overflow-hidden bg-beige luxury-card-3d ${post.span || ''}`}
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={viewportOnce}
              transition={{ duration: 0.65, delay: (i % 4) * 0.06, ease: EASE_LUXURY }}
              aria-label={post.caption}
            >
              <img
                src={post.image}
                alt={post.caption}
                className="h-full w-full object-cover luxury-transition-slow group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-charcoal/0 luxury-transition group-hover:bg-charcoal/60">
                <Instagram size={20} className="text-ivory opacity-0 luxury-transition group-hover:opacity-100" />
                <span className="px-3 text-center text-[9px] uppercase tracking-[0.16em] text-ivory opacity-0 luxury-transition group-hover:opacity-100">
                  {post.caption}
                </span>
              </div>
              <ArrowUpRight
                size={14}
                className="absolute right-3 top-3 text-ivory opacity-0 luxury-transition group-hover:opacity-100"
              />
            </motion.a>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 text-center sm:flex-row md:mt-12">
          <a
            href="https://instagram.com/posh__kaar"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-charcoal luxury-transition hover:text-walnut"
          >
            <Instagram size={14} />
            @posh__kaar
          </a>
          <a
            href="https://wa.me/916006491824"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-walnut luxury-transition hover:text-gold"
          >
            Request a piece
            <ArrowRight size={14} className="group-hover:translate-x-1 luxury-transition" />
          </a>
        </div>
      </div>
    </section>
  );
}
