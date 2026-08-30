import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { base44, hasConfiguredBackend } from '@/api/base44Client';
import ProductCard from '@/components/luxury/ProductCard';
import SortDropdown from '@/components/luxury/SortDropdown';
import { LOCAL_PRODUCTS } from '@/lib/static-products';
import { formatPrice } from '@/lib/formatPrice';

const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price' },
  { label: 'Price: High to Low', value: '-price' },
  { label: 'Best Selling', value: 'bestseller' },
];

const SITE_URL = (import.meta.env.VITE_PUBLIC_SITE_URL || 'https://poshkaarkashmir.com').replace(/\/$/, '');

function updateMetaTag(attr, value, content) {
  let tag = document.head.querySelector(`meta[${attr}="${value}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, value);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function updateCanonical(href) {
  let tag = document.head.querySelector('link[rel="canonical"]');
  if (!tag) {
    tag = document.createElement('link');
    tag.setAttribute('rel', 'canonical');
    document.head.appendChild(tag);
  }
  tag.setAttribute('href', href);
}

function updateShopSeo() {
  const title = 'Shop Kashmiri Luxury Pieces | Poshkaar Kashmir';
  const description = 'Explore Poshkaar Kashmir textiles, clothing, gifts and objects with clear material, origin and availability details.';
  const url = `${SITE_URL}/shop`;

  document.title = title;
  updateCanonical(url);
  updateMetaTag('name', 'description', description);
  updateMetaTag('property', 'og:title', title);
  updateMetaTag('property', 'og:description', description);
  updateMetaTag('property', 'og:url', url);
  updateMetaTag('name', 'twitter:title', title);
  updateMetaTag('name', 'twitter:description', description);
}

const normalize = (value) => String(value || '').toLowerCase();

const sortProducts = (products, sortBy) => {
  const sorted = [...products];

  if (sortBy === 'price') return sorted.sort((a, b) => Number(a.price) - Number(b.price));
  if (sortBy === '-price') return sorted.sort((a, b) => Number(b.price) - Number(a.price));
  if (sortBy === 'bestseller') {
    return sorted.sort((a, b) => Number(b.review_count || 0) - Number(a.review_count || 0));
  }

  return sorted;
};

export default function Shop() {
  const [products, setProducts] = useState(LOCAL_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    updateShopSeo();

    let cancelled = false;
    if (!hasConfiguredBackend) {
      setProducts(LOCAL_PRODUCTS);
      setLoading(false);
      return () => {
        cancelled = true;
      };
    }

    base44.entities.Product.list('-created_date', 80)
      .then((remoteProducts) => {
        if (!cancelled && remoteProducts?.length > 0) {
          setProducts(remoteProducts);
        } else if (!cancelled) {
          setProducts(LOCAL_PRODUCTS);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setProducts(LOCAL_PRODUCTS);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => {
    const values = Array.from(new Set(products.map((product) => product.category).filter(Boolean)));
    return ['All', ...values];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const search = normalize(query.trim());
    const filtered = products.filter((product) => {
      const matchesCategory = category === 'All' || product.category === category;
      const matchesQuery = !search || [
        product.title,
        product.category,
        product.embroidery_type,
        product.fabric,
        product.description,
        product.short_description,
      ].map(normalize).join(' ').includes(search);

      return matchesCategory && matchesQuery;
    });

    return sortProducts(filtered, sortBy);
  }, [category, products, query, sortBy]);

  const priceRange = useMemo(() => {
    const prices = products
      .filter((product) => product.price !== null && product.price !== undefined && product.price !== '')
      .map((product) => Number(product.price))
      .filter(Number.isFinite);
    if (prices.length === 0) return '';
    return `${formatPrice(Math.min(...prices))} – ${formatPrice(Math.max(...prices))}`;
  }, [products]);

  return (
    <main className="min-h-screen pt-28 pb-20">
      <section className="relative overflow-hidden border-b border-ivory/10 bg-charcoal text-ivory">
        <div className="absolute inset-x-0 top-0 h-px bg-gold/45" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 md:px-12 lg:px-16">
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-champagne">
              <Sparkles size={13} /> The Full Shop
            </span>
            <h1 className="mt-5 font-display text-5xl font-light leading-tight md:text-7xl">
              Explore the Poshkaar catalogue
            </h1>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-ivory/65 md:text-base">
              Browse made-to-order Kashmiri clothing and occasion pieces with clear prices, materials, galleries and availability.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 md:px-12 lg:px-16">
        <div className="mb-8 grid grid-cols-1 gap-4 border-y border-gold/10 py-5 lg:grid-cols-[1fr_auto_auto] lg:items-center">
          <label className="relative block">
            <span className="sr-only">Search shop</span>
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search shawls, pashmina, tilla, bridal..."
              className="min-h-12 w-full border border-gold/20 bg-ivory/70 py-3 pl-11 pr-4 text-sm text-charcoal placeholder:text-charcoal/45 focus:border-gold focus:outline-none"
            />
          </label>

          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.18em] text-muted-foreground" aria-live="polite">
            <SlidersHorizontal size={14} className="text-gold" />
            {filteredProducts.length} piece{filteredProducts.length === 1 ? '' : 's'}
          </div>

          <SortDropdown value={sortBy} onChange={setSortBy} options={SORT_OPTIONS} />
        </div>

        <div className="mb-8 flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
              className={`min-h-11 shrink-0 border px-4 py-2 text-[10px] uppercase tracking-[0.16em] luxury-transition ${
                category === item
                  ? 'border-charcoal bg-charcoal text-ivory'
                  : 'border-gold/20 text-charcoal hover:border-gold'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mb-12 grid grid-cols-1 border-y border-gold/10 text-charcoal sm:grid-cols-3">
          <div className="py-5 sm:pr-6">
            <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Catalogue</p>
            <p className="mt-2 font-display text-xl">{products.length} pieces</p>
          </div>
          <div className="border-t border-gold/10 py-5 sm:border-l sm:border-t-0 sm:px-6">
            <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Price range</p>
            <p className="mt-2 font-display text-xl">{priceRange || 'Pending verification'}</p>
          </div>
          <div className="border-t border-gold/10 py-5 sm:border-l sm:border-t-0 sm:pl-6">
            <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Delivery</p>
            <p className="mt-2 font-display text-xl">Complimentary over ₹15,000</p>
          </div>
        </div>

        {loading ? (
         <div className="grid grid-cols-2 gap-10 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 md:gap-8 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index}>
                <div className="mb-4 aspect-[3/4] bg-beige shimmer" />
                <div className="mb-2 h-2 w-1/3 bg-beige shimmer" />
                <div className="mb-2 h-4 w-2/3 bg-beige shimmer" />
                <div className="h-2 w-1/4 bg-beige shimmer" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 md:gap-x-8 md:gap-y-14 lg:grid-cols-4">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="border border-gold/10 bg-beige/30 px-6 py-16 text-center">
            <p className="font-display text-2xl text-charcoal">No pieces match this search</p>
            <p className="mt-2 text-sm text-muted-foreground">Try another category or clear the search term.</p>
            <button
              type="button"
              onClick={() => { setCategory('All'); setQuery(''); }}
              className="mt-6 text-[10px] uppercase tracking-[0.18em] text-burgundy hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
