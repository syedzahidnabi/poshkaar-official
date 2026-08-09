import React from 'react';
import { motion } from 'framer-motion';
import { Award, RotateCcw, Shield, Truck } from 'lucide-react';
import { EASE_LUXURY, viewportOnce } from '@/lib/luxuryMotion';

const BADGES = [
  { icon: Shield, title: 'Secure Payments', description: 'SSL encrypted checkout' },
  { icon: Truck, title: 'Free Shipping', description: 'On orders above ₹15,000' },
  { icon: RotateCcw, title: 'Easy Returns', description: '15-day return policy' },
  { icon: Award, title: 'Real Handwork', description: 'Made by skilled hands' },
];

export default function TrustBadges() {
  return (
    <section className="home-section-sand border-y border-gold/10 py-14">
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-4">
          {BADGES.map((badge, i) => (
            <motion.div
              key={badge.title}
              className="flex flex-col items-center gap-3 text-center md:flex-row md:gap-4 md:text-left"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ delay: i * 0.1, duration: 0.7, ease: EASE_LUXURY }}
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold/20 bg-ivory/55">
                <badge.icon size={18} className="text-gold" strokeWidth={1.5} aria-hidden="true" />
              </div>
              <div>
                <p className="font-body text-[11px] uppercase tracking-[0.15em] text-charcoal">
                  {badge.title}
                </p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">
                  {badge.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
