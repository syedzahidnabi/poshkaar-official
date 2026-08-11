import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, PackageCheck, ShieldCheck } from 'lucide-react';
import { EASE_LUXURY, viewportOnce } from '@/lib/luxuryMotion';

const PROMISES = [
  {
    icon: MessageCircle,
    title: 'Personal guidance',
    text: 'Speak with a real person about colour, size, measurements and the right piece for your moment.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure ordering',
    text: 'Checkout uses clear totals and verified payment status before an online order is marked paid.',
  },
  {
    icon: PackageCheck,
    title: 'Clear fulfilment details',
    text: 'Delivery, care and return information is shown where it applies to the individual product.',
  },
];

export default function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-charcoal py-14 text-ivory md:py-32" aria-labelledby="poshkaar-promise-title">
      <div className="absolute inset-0 opacity-35" aria-hidden="true">
        <div className="absolute -left-36 top-[-7rem] h-96 w-96 rounded-full bg-gold/20 blur-3xl" />
        <div className="absolute -right-40 bottom-[-9rem] h-[28rem] w-[28rem] rounded-full bg-forest/45 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 md:px-12 lg:px-16">
        <div className="grid gap-6 border-b border-ivory/12 pb-8 md:gap-10 md:pb-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.9, ease: EASE_LUXURY }}
          >
            <p className="mb-5 text-[10px] uppercase tracking-[0.32em] text-champagne">The Poshkaar promise</p>
            <h2
              id="poshkaar-promise-title"
              className="max-w-4xl font-heading font-light leading-[0.94] tracking-[-0.04em] text-ivory text-balance"
              style={{ fontSize: 'clamp(2.35rem, 7vw, 7.4rem)' }}
            >
              Luxury should feel personal.
            </h2>
          </motion.div>
          <motion.p
            className="max-w-xl text-sm leading-6 text-ivory/68 md:text-base md:leading-8 lg:justify-self-end lg:text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.9, delay: 0.12, ease: EASE_LUXURY }}
          >
            Product details, payment status and personal guidance should make every decision easy to understand.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3">
          {PROMISES.map((promise, index) => (
            <motion.article
              key={promise.title}
              className={`group relative border-b border-ivory/12 py-6 pr-3 odd:border-r odd:border-ivory/12 even:pl-3 md:border-b-0 md:border-r md:px-8 md:py-12 md:first:pl-0 md:last:border-r-0 md:last:pr-0 ${index === 2 ? 'col-span-2 md:col-span-1 md:border-r-0' : ''}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.75, delay: index * 0.09, ease: EASE_LUXURY }}
            >
              <div className="mb-5 flex items-center justify-between md:mb-8">
                <span className="flex h-10 w-10 items-center justify-center border border-gold/30 text-champagne luxury-transition group-hover:bg-gold group-hover:text-charcoal md:h-11 md:w-11">
                  <promise.icon size={16} strokeWidth={1.4} aria-hidden="true" />
                </span>
                <span className="font-heading text-2xl font-light text-ivory/20">{String(index + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="font-heading text-xl font-light leading-tight text-ivory md:text-3xl">{promise.title}</h3>
              <p className="mt-3 max-w-sm text-xs leading-5 text-ivory/72 md:mt-4 md:text-sm md:leading-7">{promise.text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
