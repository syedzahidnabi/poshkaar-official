import React from 'react';
import { motion } from 'framer-motion';
import { EASE_LUXURY, viewportOnce } from '@/lib/luxuryMotion';

export default function SectionHeading({
  title,
  subtitle,
  description = '',
  align = 'center',
  dark = false,
  className = '',
}) {
  return (
    <motion.div
      className={`section-heading ${align === 'center' ? 'text-center' : 'text-left'} ${className}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.9, ease: EASE_LUXURY }}
    >
      {subtitle && (
        <div className={`mb-6 flex items-center ${align === 'center' ? 'justify-center' : 'justify-start'} gap-4`}>
          <span className="h-px w-10 needle-line" />
          <span className="font-body text-[9px] uppercase tracking-[0.32em] text-gold sm:text-[10px]">
            {subtitle}
          </span>
          {align === 'center' && <span className="h-px w-10 needle-line" />}
        </div>
      )}
      <h2
        className={`font-heading font-light leading-[0.98] tracking-[-0.035em] text-balance ${
          dark ? 'text-ivory' : 'text-charcoal'
        }`}
        style={{ fontSize: 'clamp(2.7rem, 5.2vw, 5.15rem)' }}
      >
        {title}
      </h2>
      {description && (
        <p className={`mt-6 max-w-xl text-sm leading-7 md:text-base ${align === 'center' ? 'mx-auto' : ''} ${
          dark ? 'text-ivory/60' : 'text-charcoal/60'
        }`}>
          {description}
        </p>
      )}
    </motion.div>
  );
}
