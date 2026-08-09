import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, FreeMode, Keyboard, Pagination } from 'swiper/modules';
import { ArrowRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import { EASE_LUXURY, viewportOnce } from '@/lib/luxuryMotion';

const LOOKS = [
  {
    title: 'The Pashmina drape',
    text: 'Soft handwork, gentle warmth and a shawl made to become part of a memory.',
    image: '/images/home/pashmina-jamawar-shawl.jpeg',
    path: '/collections/pashmina',
  },
  {
    title: 'The wedding morning',
    text: 'Tilla detail, soft fabric and pieces chosen for photographs that will outlive the day.',
    image: '/images/home/pashmina-jamawar-shawl.jpeg',
    path: '/collections/bridal',
  },
  {
    title: 'The painted home',
    text: 'Papier-mâché colour, careful pattern and objects that make a room feel personal.',
    image: '/images/home/papier-mache-vases.webp',
    path: '/collections',
  },
  {
    title: 'The woven corner',
    text: 'Willow baskets, quiet texture and small treasures for everyday living.',
    image: '/images/home/willow-wicker-baskets.jpeg',
    path: '/collections',
  },
];

export default function LookbookInteriors() {
  return (
    <section className="relative overflow-hidden bg-ivory py-20 md:py-32" aria-labelledby="lookbook-title">
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
        <div className="mb-12 grid gap-7 md:grid-cols-[0.8fr_1.2fr] md:items-end">
          <div data-luxury-reveal>
            <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-gold">Lookbook</p>
            <h2
              id="lookbook-title"
              className="font-heading font-light leading-[0.98] text-charcoal text-balance"
              style={{ fontSize: 'clamp(2.7rem, 6vw, 5.9rem)' }}
            >
              How craft lives with you.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-charcoal/65 md:justify-self-end md:text-base" data-luxury-reveal>
            A luxury piece is not only bought. It enters a room, a ceremony, a suitcase, a memory.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.9, ease: EASE_LUXURY }}
          className="lookbook-swiper"
        >
          <Swiper
            modules={[A11y, FreeMode, Keyboard, Pagination]}
            a11y={{ enabled: true }}
            freeMode
            grabCursor
            keyboard={{ enabled: true }}
            pagination={{ clickable: true }}
            slidesPerView="auto"
            spaceBetween={18}
            className="!overflow-visible"
          >
            {LOOKS.map((look) => (
              <SwiperSlide key={look.title} className="!h-auto !w-[82vw] md:!w-[38rem] lg:!w-[44rem]">
                <article className="group relative min-h-[30rem] overflow-hidden border border-walnut/10 bg-sand shadow-[0_35px_110px_-80px_rgba(91,58,41,0.9)] md:min-h-[38rem]">
                  <img
                    src={look.image}
                    alt={look.title}
                    className="absolute inset-0 h-full w-full object-cover transition duration-1000 ease-luxury group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/88 via-charcoal/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-7 md:p-10">
                    <h3 className="font-heading text-4xl font-light leading-tight text-ivory md:text-5xl">{look.title}</h3>
                    <p className="mt-4 max-w-md text-sm font-medium leading-7 text-ivory/86">{look.text}</p>
                    <Link
                      to={look.path}
                      className="group/link mt-7 inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-gold luxury-transition hover:text-ivory"
                    >
                      Explore pieces
                      <ArrowRight size={14} className="transition-transform duration-500 group-hover/link:translate-x-1.5" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
}
