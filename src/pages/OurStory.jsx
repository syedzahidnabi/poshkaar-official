import React from 'react';
import { Link } from 'react-router-dom';
import LuxuryButton from '@/components/luxury/LuxuryButton';
import CraftProcess from '@/components/home/CraftProcess';

const STORY_IMAGE = '/images/main-banner.jpg';
const DETAIL_IMAGE = '/images/home/pashmina-sozni-jamawar.jpeg';

const PILLARS = [
  { title: 'Verified Context', desc: 'Origin, material and maker information is shown only when it belongs to the exact piece.' },
  { title: 'Respectful Purpose', desc: 'We want Kashmiri craft to be understood, valued and presented without invented claims.' },
  { title: 'Quiet Luxury', desc: 'Rich detail, calm presentation and personal guidance without visual or commercial noise.' }
];

export default function OurStory() {
  return (
    <main className="min-h-screen bg-ivory pt-28">
      <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 pb-20 md:px-12 lg:grid-cols-2 lg:px-16">
        <div>
          <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-gold">Our Story</p>
          <h1 className="mb-8 font-display text-4xl font-light leading-tight text-charcoal md:text-6xl">
            Kashmir, presented with context
          </h1>
          <p className="mb-6 leading-relaxed text-charcoal/70">
            Poshkaar began with a simple idea: Kashmiri craft should be presented beautifully while the people, places and processes behind it are treated with respect.
          </p>
          <p className="mb-10 leading-relaxed text-charcoal/70">
            We bring textiles, clothing, gifts and objects into one calm edit, with clear information and an easy path to ask questions before buying.
          </p>
          <Link to="/collections">
            <LuxuryButton variant="gold">Shop the Craft</LuxuryButton>
          </Link>
        </div>
        <div className="relative luxury-card-3d">
          <div className="aspect-[4/5] overflow-hidden luxury-card-3d-image">
            <img src={STORY_IMAGE} alt="Close view of textile work in progress" className="h-full w-full object-cover" />
          </div>
          <div className="absolute -bottom-8 -left-6 hidden w-44 overflow-hidden border-4 border-ivory md:block">
            <img src={DETAIL_IMAGE} alt="Close view of an embroidered textile" className="h-56 w-full object-cover" />
          </div>
        </div>
      </section>

      <section className="border-y border-gold/10 bg-beige/40 py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 text-center md:grid-cols-3 md:px-12 lg:px-16">
          {PILLARS.map((pillar, index) => (
            <div key={pillar.title}>
              <p className="mb-4 font-display text-xl text-gold/60">{String(index + 1).padStart(2, '0')}</p>
              <h2 className="mb-4 font-display text-2xl text-charcoal">{pillar.title}</h2>
              <p className="text-sm leading-relaxed text-charcoal/65">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <CraftProcess />
    </main>
  );
}
