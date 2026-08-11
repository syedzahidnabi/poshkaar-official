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
    <section className="relative overflow-hidden bg-[#f8f5f0] py-12 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-7 px-4 md:px-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.8, ease: EASE_LUXURY }}
        >
          <div className="mb-4 flex items-center gap-3 md:mb-6 md:gap-4">
            <span className="h-px w-12 bg-gold/35" />
            <span className="font-body text-[9px] uppercase tracking-[0.22em] text-gold md:text-[10px] md:tracking-[0.26em]">
              Featured today
            </span>
          </div>
          <h2 className="max-w-xl font-heading text-2xl font-light leading-tight text-charcoal md:text-6xl md:leading-[0.98]">
            A shop that feels awake when you reach the end.
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-6 text-charcoal/65 md:mt-6 md:text-base md:leading-7">
            Freshly photographed pieces, custom order guidance and Kashmir craft notes stay close to the shopping path.
          </p>

          <div className="mt-5 grid max-w-xl grid-cols-3 gap-2 md:mt-9 md:gap-3">
            {[
              { icon: Sparkles, label: 'New edits rotate in' },
              { icon: MessageCircle, label: 'WhatsApp styling help' },
              { icon: Clock, label: 'Made with patient handwork' },
            ].map((item) => (
              <div key={item.label} className="border border-walnut/10 bg-white/50 p-2.5 md:p-4">
                <item.icon size={14} className="mb-2 text-gold md:mb-4 md:size-[15px]" aria-hidden="true" />
                <p className="text-[7px] uppercase leading-3 tracking-[0.1em] text-charcoal/70 md:text-[10px] md:leading-5 md:tracking-[0.18em]">
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-2 md:mt-9 md:gap-3">
            <Link
              to="/collections"
              className="inline-flex min-h-10 items-center gap-2 bg-charcoal px-4 text-[9px] uppercase tracking-[0.16em] text-ivory luxury-transition hover:bg-walnut md:min-h-12 md:gap-3 md:px-5 md:text-[10px] md:tracking-[0.2em]"
            >
              Shop the edit
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center gap-2 border border-walnut/20 px-4 text-[9px] uppercase tracking-[0.16em] text-charcoal luxury-transition hover:border-gold hover:text-walnut md:min-h-12 md:gap-3 md:px-5 md:text-[10px] md:tracking-[0.2em]"
            >
              Ask on WhatsApp
              <MessageCircle size={14} aria-hidden="true" />
            </a>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-[1.15fr_0.85fr] md:gap-4">
          <motion.div
            className="group relative col-span-2 min-h-[13rem] overflow-hidden border border-walnut/10 bg-sand md:min-h-[28rem] sm:col-span-1"
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
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/82 via-charcoal/28 to-transparent p-4 text-ivory md:p-6">
              <p className="text-[8px] uppercase tracking-[0.18em] text-champagne md:text-[10px] md:tracking-[0.22em]">
                {featured.embroidery_type || featured.category}
              </p>
              <h3 className="mt-2 font-heading text-2xl font-light leading-tight md:text-3xl">
                {featured.title}
              </h3>
              <p className="mt-1 text-xs text-ivory/75 md:mt-2 md:text-sm">
                {formatPrice(featured.price)}
              </p>
              <Link
                to={`/product/${featured.id}`}
                className="mt-3 inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.16em] text-champagne md:mt-5 md:text-[10px] md:tracking-[0.2em]"
              >
                View piece
                <ArrowRight size={13} aria-hidden="true" />
              </Link>
            </div>
          </motion.div>

          <div className="col-span-2 grid grid-cols-2 gap-3 sm:col-span-1 sm:grid-cols-1 md:gap-4">
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
                  className="group grid min-h-[10.75rem] grid-rows-[0.7fr_1fr] overflow-hidden border border-walnut/10 bg-white/55 sm:min-h-[10.5rem] sm:grid-cols-[0.82fr_1fr] sm:grid-rows-1 md:min-h-[13.5rem]"
                >
                  <img
                    src={piece.image}
                    alt={piece.title}
                    className="h-full w-full object-cover luxury-transition-slow group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="flex flex-col justify-between p-3 md:p-5">
                    <div>
                      <p className="text-[8px] uppercase tracking-[0.16em] text-gold md:text-[9px] md:tracking-[0.2em]">
                        {piece.embroidery_type || piece.category}
                      </p>
                      <h3 className="mt-1.5 line-clamp-2 font-heading text-base font-light leading-tight text-charcoal md:mt-3 md:text-2xl">
                        {piece.title}
                      </h3>
                    </div>
                    <span className="inline-flex items-center gap-2 text-[8px] uppercase tracking-[0.12em] text-walnut md:text-[10px] md:tracking-[0.18em]">
                      {formatPrice(piece.price)}
                      <ArrowRight size={12} aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}

            <motion.div
              className="relative col-span-2 min-h-[8rem] overflow-hidden bg-charcoal p-4 text-ivory sm:col-span-1 md:min-h-[13.5rem] md:p-6"
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
                <p className="text-[8px] uppercase tracking-[0.2em] text-champagne md:text-[9px] md:tracking-[0.24em]">
                  Made in context
                </p>
                <h3 className="mt-2 max-w-xs font-heading text-xl font-light leading-tight md:mt-4 md:text-3xl">
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
