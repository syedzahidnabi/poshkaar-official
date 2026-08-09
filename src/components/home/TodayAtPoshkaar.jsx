import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, MessageCircle, Sparkles } from 'lucide-react';
import { LOCAL_PRODUCTS } from '@/lib/static-products';
import { getProductPresentation } from '@/lib/catalogPresentation';
import { formatPrice } from '@/lib/formatPrice';
import { EASE_LUXURY, viewportOnce } from '@/lib/luxuryMotion';
import { HOME_MEDIA } from '@/lib/homepageMedia';

const WHATSAPP_URL = 'https://wa.me/916006491824';

const pickLivePieces = () => LOCAL_PRODUCTS
  .map((product) => getProductPresentation(product))
  .filter((product) => (
    !product.image_is_studio_preview
    && product.image
    && !/placeholder\.svg(?:\?.*)?$/i.test(product.image)
  ))
  .slice(0, 3);

export default function TodayAtPoshkaar() {
  const pieces = useMemo(pickLivePieces, []);
  const featured = pieces[0];

  if (!featured) return null;

  return (
    <section className="relative overflow-hidden bg-[#f8f5f0] py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 md:px-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.8, ease: EASE_LUXURY }}
        >
          <div className="mb-6 flex items-center gap-4">
            <span className="h-px w-12 bg-gold/35" />
            <span className="font-body text-[10px] uppercase tracking-[0.26em] text-gold">
              Featured today
            </span>
          </div>
          <h2 className="max-w-xl font-heading text-4xl font-light leading-[0.98] text-charcoal md:text-6xl">
            A shop that feels awake when you reach the end.
          </h2>
          <p className="mt-6 max-w-lg text-sm leading-7 text-charcoal/65 md:text-base">
            Freshly photographed pieces, custom order guidance and Kashmir craft notes stay close to the shopping path.
          </p>

          <div className="mt-9 grid max-w-xl gap-3 sm:grid-cols-3">
            {[
              { icon: Sparkles, label: 'New edits rotate in' },
              { icon: MessageCircle, label: 'WhatsApp styling help' },
              { icon: Clock, label: 'Made with patient handwork' },
            ].map((item) => (
              <div key={item.label} className="border border-walnut/10 bg-white/50 p-4">
                <item.icon size={16} className="mb-4 text-gold" aria-hidden="true" />
                <p className="text-[10px] uppercase leading-5 tracking-[0.18em] text-charcoal/70">
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              to="/collections"
              className="inline-flex min-h-12 items-center gap-3 bg-charcoal px-5 text-[10px] uppercase tracking-[0.2em] text-ivory luxury-transition hover:bg-walnut"
            >
              Shop the edit
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center gap-3 border border-walnut/20 px-5 text-[10px] uppercase tracking-[0.2em] text-charcoal luxury-transition hover:border-gold hover:text-walnut"
            >
              Ask on WhatsApp
              <MessageCircle size={14} aria-hidden="true" />
            </a>
          </div>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-[1.15fr_0.85fr]">
          <motion.div
            className="group relative min-h-[28rem] overflow-hidden border border-walnut/10 bg-sand"
            initial={{ opacity: 0, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.9, ease: EASE_LUXURY }}
          >
            <img
              src={featured.image}
              alt={featured.title}
              className="h-full w-full object-cover luxury-transition-slow group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/82 via-charcoal/28 to-transparent p-6 text-ivory">
              <p className="text-[10px] uppercase tracking-[0.22em] text-champagne">
                {featured.embroidery_type || featured.category}
              </p>
              <h3 className="mt-2 font-heading text-3xl font-light leading-tight">
                {featured.title}
              </h3>
              <p className="mt-2 text-sm text-ivory/75">
                {formatPrice(featured.price)}
              </p>
              <Link
                to={`/product/${featured.id}`}
                className="mt-5 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-champagne"
              >
                View piece
                <ArrowRight size={13} aria-hidden="true" />
              </Link>
            </div>
          </motion.div>

          <div className="grid gap-4">
            {pieces.slice(1).map((piece, index) => (
              <motion.div
                key={piece.id}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.8, delay: index * 0.08, ease: EASE_LUXURY }}
              >
                <Link
                  to={`/product/${piece.id}`}
                  className="group grid min-h-[13.5rem] grid-cols-[0.8fr_1fr] overflow-hidden border border-walnut/10 bg-white/55"
                >
                  <img
                    src={piece.image}
                    alt={piece.title}
                    className="h-full w-full object-cover luxury-transition-slow group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="flex flex-col justify-between p-5">
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.2em] text-gold">
                        {piece.embroidery_type || piece.category}
                      </p>
                      <h3 className="mt-3 font-heading text-2xl font-light leading-tight text-charcoal">
                        {piece.title}
                      </h3>
                    </div>
                    <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-walnut">
                      {formatPrice(piece.price)}
                      <ArrowRight size={12} aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}

            <motion.div
              className="relative min-h-[13.5rem] overflow-hidden bg-charcoal p-6 text-ivory"
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.8, delay: 0.16, ease: EASE_LUXURY }}
            >
              <img
                src={HOME_MEDIA.visualEdit.loom.src}
                alt={HOME_MEDIA.visualEdit.loom.alt}
                className="absolute inset-0 h-full w-full object-cover opacity-40"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-charcoal/56" />
              <div className="relative">
                <p className="text-[9px] uppercase tracking-[0.24em] text-champagne">
                  Made in context
                </p>
                <h3 className="mt-4 max-w-xs font-heading text-3xl font-light leading-tight">
                  The handwork stays visible.
                </h3>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
