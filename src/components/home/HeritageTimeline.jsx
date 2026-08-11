import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { EASE_LUXURY } from '@/lib/luxuryMotion';

const TIMELINE = [
  {
    year: '01',
    title: 'Begin with the material',
    place: 'Product record',
    text: 'A reliable listing starts with the exact material and construction details that are known for the item.',
    image: '/images/home/context-material.webp',
    imageAlt: 'A Kashmiri artisan working with textile material on a loom',
    imagePosition: 'center 46%',
  },
  {
    year: '02',
    title: 'Name the technique carefully',
    place: 'Technique',
    text: 'Technique names are attached to the individual product only when they can be checked.',
    image: '/images/home/context-technique.webp',
    imageAlt: 'A close view of traditional Kashmiri attire and hand-held wicker work',
    imagePosition: 'center 52%',
  },
  {
    year: '03',
    title: 'Keep origin transparent',
    place: 'Provenance',
    text: 'Origin and maker fields remain pending when the supporting record is not yet complete.',
    image: '/images/home/context-provenance.webp',
    imageAlt: 'A view over Srinagar showing historic architecture and the Kashmir valley',
    imagePosition: 'center 42%',
  },
  {
    year: '04',
    title: 'Plan for life with the piece',
    place: 'Care and delivery',
    text: 'Dimensions, care, delivery and return information help you decide whether a piece suits your needs.',
    image: '/images/home/context-care.webp',
    imageAlt: 'A quiet Dal Lake scene in Kashmir with boats and snow covered mountains',
    imagePosition: 'center 55%',
  },
];

const STEP_AUTOPLAY_DELAY = 3600;

export default function HeritageTimeline() {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const item = TIMELINE[active];

  useEffect(() => {
    if (isPaused) return undefined;

    const timer = window.setTimeout(() => {
      setActive((current) => (current + 1) % TIMELINE.length);
    }, STEP_AUTOPLAY_DELAY);

    return () => window.clearTimeout(timer);
  }, [active, isPaused]);

  return (
    <section className="relative overflow-hidden bg-charcoal py-14 text-ivory md:py-32" aria-labelledby="heritage-timeline-title">
      <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(248,245,240,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(248,245,240,0.7)_1px,transparent_1px)] [background-size:90px_90px]" aria-hidden="true" />
      <div className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-forest/35 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-7xl gap-8 px-4 md:gap-12 md:px-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:px-16">
        <div className="lg:sticky lg:top-32" data-luxury-reveal>
          <p className="mb-5 text-[10px] uppercase tracking-[0.32em] text-champagne">Craft in context</p>
          <h2
            id="heritage-timeline-title"
            className="font-heading font-light leading-[0.98] text-balance"
            style={{ fontSize: 'clamp(2.25rem, 6vw, 5.7rem)' }}
          >
            Product context, step by step.
          </h2>
          <p className="mt-5 max-w-md text-sm leading-6 text-ivory/62 md:mt-7 md:text-base md:leading-7">
            A clear way to read material, technique, provenance and care information.
          </p>
        </div>

        <div
          className="grid gap-6 lg:grid-cols-[0.48fr_0.52fr] lg:items-stretch"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocusCapture={() => setIsPaused(true)}
          onBlurCapture={() => setIsPaused(false)}
        >
          <div className="grid grid-cols-2 gap-3 lg:block lg:space-y-3" role="tablist" aria-label="Heritage timeline">
            {TIMELINE.map((step, index) => {
              const selected = active === index;
              return (
                <button
                  key={step.title}
                  type="button"
                  role="tab"
                  id={`heritage-tab-${index}`}
                  aria-controls="heritage-timeline-panel"
                  aria-selected={selected}
                  onClick={() => {
                    setActive(index);
                    setIsPaused(true);
                  }}
                  className={`group min-h-[9.5rem] w-full border p-4 text-left luxury-transition focus:outline-none focus-visible:ring-2 focus-visible:ring-gold md:p-5 lg:min-h-0 ${
                    selected
                      ? 'border-gold/55 bg-ivory text-charcoal'
                      : 'border-ivory/12 bg-white/[0.03] text-ivory hover:border-gold/35'
                  }`}
                >
                  <span className={`text-[10px] uppercase tracking-[0.3em] ${selected ? 'text-walnut' : 'text-champagne'}`}>{step.year}</span>
                  <span className="mt-3 block font-heading text-lg font-light leading-tight md:text-2xl">{step.title}</span>
                  <span className={`mt-3 flex items-center gap-2 text-[8px] uppercase tracking-[0.14em] md:text-[10px] md:tracking-[0.2em] ${selected ? 'text-charcoal/70' : 'text-ivory/70'}`}>
                    <MapPin size={12} aria-hidden="true" />
                    {step.place}
                  </span>
                </button>
              );
            })}
          </div>

          <motion.article
            key={item.title}
            className="relative min-h-[430px] overflow-hidden border border-gold/20 bg-ivory text-charcoal md:min-h-[520px]"
            initial={{ opacity: 0.65, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.72, ease: EASE_LUXURY }}
            role="tabpanel"
            id="heritage-timeline-panel"
            aria-labelledby={`heritage-tab-${active}`}
          >
            <div className="relative h-48 overflow-hidden border-b border-gold/15 md:h-64">
              <img
                src={item.image}
                alt={item.imageAlt}
                className="h-full w-full object-cover"
                style={{ objectPosition: item.imagePosition }}
                loading={active === 0 ? 'eager' : 'lazy'}
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-charcoal/38" aria-hidden="true" />
              <span className="absolute left-6 top-6 inline-flex h-12 w-12 items-center justify-center rounded-full border border-ivory/65 bg-charcoal/20 text-[10px] tracking-[0.2em] text-ivory backdrop-blur-sm md:left-8 md:top-8">
                {item.year}
              </span>
            </div>
            <div className="absolute right-5 top-52 font-heading text-[8rem] font-light leading-none text-walnut/[0.07] md:top-56 md:text-[11rem]" aria-hidden="true">
              {item.year}
            </div>
            <div className="relative flex min-h-[220px] flex-col justify-end p-5 md:p-9">
              <p className="mb-4 text-[10px] uppercase tracking-[0.28em] text-gold">{item.place}</p>
              <h3 className="max-w-sm font-heading text-3xl font-light leading-tight text-charcoal md:text-4xl">{item.title}</h3>
              <p className="mt-4 max-w-md text-sm leading-6 text-charcoal/68 md:mt-5 md:leading-7">{item.text}</p>
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
