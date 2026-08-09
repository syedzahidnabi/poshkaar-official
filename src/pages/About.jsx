import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import LuxuryButton from '@/components/luxury/LuxuryButton';
import CraftProcess from '@/components/home/CraftProcess';

const CRAFT_IMAGE = '/images/artists.jpg';
const FEATURE_IMAGE = '/images/main-banner.jpg';
const LIFESTYLE_IMAGE = '/images/home/pashmina-sozni-jamawar.jpeg';

const VALUES = [
  { title: 'Clear Details', desc: 'Material, origin and making information is published only after it has been checked.' },
  { title: 'Respectful Stories', desc: 'Maker names and workshop stories are shared only with recorded permission.' },
  { title: 'Personal Service', desc: 'Our team helps with product questions, measurements, care and delivery before you order.' }
];

export default function About() {
  return (
    <main className="pb-0 pt-28">
      <section className="mx-auto max-w-7xl px-6 pb-20 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-[10px] uppercase tracking-[0.3em] text-gold">Our Story</span>
            <h1 className="mt-4 font-display text-4xl font-light leading-tight text-charcoal md:text-5xl lg:text-6xl">
              A considered edit, rooted in Kashmir
            </h1>
            <div className="mb-8 mt-8 h-px w-12 bg-gold" />
            <p className="mb-6 text-sm leading-relaxed text-charcoal/70 md:text-base">
              Poshkaar Kashmir was created to present the region's craft traditions with clarity, restraint and respect.
            </p>
            <p className="mb-8 text-sm leading-relaxed text-charcoal/70 md:text-base">
              Each product page separates verified facts from details still being confirmed, so beauty never comes at the cost of trust.
            </p>
            <Link to="/collections">
              <LuxuryButton variant="secondary">Explore Collections</LuxuryButton>
            </Link>
          </motion.div>

          <motion.div
            className="relative luxury-card-3d"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="aspect-[3/4] overflow-hidden luxury-card-3d-image">
              <img src={CRAFT_IMAGE} alt="Close view of embroidery in progress" className="h-full w-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden aspect-square w-40 overflow-hidden border-4 border-ivory luxury-shadow md:block">
              <img src={LIFESTYLE_IMAGE} alt="Pashmina shawl in warm light" className="h-full w-full object-cover" />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative h-[40vh] min-h-[300px] overflow-hidden">
        <img src={FEATURE_IMAGE} alt="Close view of textile work in progress" className="h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 flex items-center justify-center bg-charcoal/40">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-display text-3xl font-light italic text-ivory md:text-5xl">
              Beauty deserves clear context
            </h2>
          </motion.div>
        </div>
      </section>

      <section className="py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {VALUES.map((value, i) => (
              <motion.div
                key={value.title}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.8 }}
              >
                <span className="font-display text-5xl text-gold/20">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-2 font-display text-2xl text-charcoal">{value.title}</h3>
                <div className="mx-auto mb-4 mt-4 h-px w-8 bg-gold" />
                <p className="text-sm leading-relaxed text-charcoal/60">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CraftProcess />
    </main>
  );
}
