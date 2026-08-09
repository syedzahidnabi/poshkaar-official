import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { EASE_LUXURY, viewportOnce } from '@/lib/luxuryMotion';

const VALLEY_IMAGE = '/images/main-banner.jpg';

export default function KashmirBanner() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1.2, 1]);
  const textY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section className="relative h-[55vh] min-h-[420px] overflow-hidden" ref={ref}>
      <motion.img
        src={VALLEY_IMAGE}
        alt="Breathtaking Kashmir Valley with Dal Lake and snow-capped Himalayan mountains at golden hour"
        className="w-full h-full object-cover"
        style={{ scale }}
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-walnut/50 via-walnut/22 to-forest/54" />

      <div className="absolute inset-0 flex items-center justify-center text-center">
        <motion.div
          style={{ y: textY }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 1, ease: EASE_LUXURY }}
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="h-px w-12 bg-gold/50" />
            <span className="text-gold text-[10px] tracking-[0.4em] uppercase font-body">
              From the Valley of Kings
            </span>
            <span className="h-px w-12 bg-gold/50" />
          </div>
          <h2
            className="font-heading text-ivory font-light italic text-balance"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
          >
            Born in Kashmir
          </h2>
        </motion.div>
      </div>
    </section>
  );
}
