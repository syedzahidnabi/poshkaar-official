import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44, hasConfiguredBackend } from '@/api/base44Client';

import { ArrowRight } from 'lucide-react';
import SectionHeading from '@/components/luxury/SectionHeading';
import ProductCard from '@/components/luxury/ProductCard';
import LuxuryButton from '@/components/luxury/LuxuryButton';
import { getProductPresentation } from '@/lib/catalogPresentation';
import { LOCAL_PRODUCTS } from '@/lib/static-products';

const selectApprovedPhotography = (items = []) => items
  .map((product) => getProductPresentation(product))
  .filter((product) => (
    product.photography_status === 'approved'
    && !product.image_is_studio_preview
    && product.image
    && !/placeholder\.svg(?:\?.*)?$/i.test(product.image)
  ))
  .slice(0, 8);

export default function BestSellers() {
  const fallbackProducts = useMemo(() => selectApprovedPhotography(LOCAL_PRODUCTS), []);
  const [products, setProducts] = useState(fallbackProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hasConfiguredBackend) {
      setProducts(fallbackProducts);
      setLoading(false);
      return;
    }

    base44.entities.Product.filter({ is_bestseller: true }, '-review_count', 8)
      .then((items) => {
        const approvedProducts = selectApprovedPhotography(items);
        setProducts(approvedProducts.length > 0 ? approvedProducts : fallbackProducts);
      })
      .catch(() => {
        setProducts(fallbackProducts);
      })
      .finally(() => setLoading(false));
  }, [fallbackProducts]);

  return (
    <section className="home-section-sand border-y border-gold/10 py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16">
          <SectionHeading
            title="Pieces photographed and ready"
            subtitle="The Poshkaar Edit"
            description="Only products with checked, real photographs appear in this edit."
            align="left"
            className="md:mb-0"
          />
          <Link
            to="/collections/best-sellers"
            className="hidden md:inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-charcoal hover:text-walnut luxury-transition group mt-6 md:mt-0"
          >
            View All
            <ArrowRight size={14} className="group-hover:translate-x-1.5 luxury-transition" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-5 md:grid-cols-4 md:gap-8">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-gold/10 mb-4 shimmer" />
                <div className="h-2.5 bg-gold/10 w-1/3 mb-2" />
                <div className="h-4 bg-gold/10 w-2/3 mb-2" />
                <div className="h-2.5 bg-gold/10 w-1/4" />
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 md:grid-cols-4 md:gap-x-8 md:gap-y-14">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        ) : (
          <div className="border border-walnut/12 bg-ivory px-6 py-12 text-center md:px-12">
            <h3 className="font-heading text-3xl font-light text-charcoal">Real product photos are being checked.</h3>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-charcoal/65">
              We will add each piece here only after its real photograph and product details are approved.
            </p>
            <Link
              to="/collections"
              className="mt-7 inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-walnut hover:text-gold"
            >
              Browse the full catalogue
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        )}

        <div className="text-center mt-14 md:hidden">
          <Link to="/collections/best-sellers">
            <LuxuryButton variant="gold" size="sm">
              View the Edit
            </LuxuryButton>
          </Link>
        </div>
      </div>
    </section>
  );
}
