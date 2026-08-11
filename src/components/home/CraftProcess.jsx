import React from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '@/components/luxury/SectionHeading';

const STEPS = [
  {
    number: '01',
    title: 'Material',
    description: 'Each published product names its material only when that information has been checked.'
  },
  {
    number: '02',
    title: 'Technique',
    description: 'Technique notes belong to the individual item instead of being assumed across a whole category.'
  },
  {
    number: '03',
    title: 'Origin',
    description: 'Origin and maker information stays open until there is a reliable record for the exact piece.'
  },
  {
    number: '04',
    title: 'Care',
    description: 'Care and storage guidance is matched to the product material before it is published.'
  }
];

export default function CraftProcess() {
  return (
    <section className="home-section-sand py-14 text-charcoal md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-12 lg:px-16">
        <SectionHeading title="Details you can check" subtitle="Product information" className="mb-9 md:mb-20" />

        <div className="grid grid-cols-2 gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 lg:gap-12">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              className="relative luxury-process-step"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.15, duration: 0.8 }}
            >
              <span className="font-heading text-4xl text-gold/20 md:text-5xl">{step.number}</span>
              <h3 className="mt-2 font-heading text-lg font-medium text-charcoal md:text-xl">{step.title}</h3>
              <div className="mb-3 mt-3 h-px w-8 bg-gold/40 md:mb-4 md:mt-4" />
              <p className="text-xs leading-5 text-charcoal/62 md:text-sm md:leading-relaxed">{step.description}</p>
              {i < STEPS.length - 1 && (
                <div className="needle-line absolute top-6 hidden h-px w-12 lg:-right-6 lg:block" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
