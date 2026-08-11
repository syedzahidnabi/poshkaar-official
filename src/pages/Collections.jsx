import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { base44, hasConfiguredBackend } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, Search } from 'lucide-react';
import ProductCard from '@/components/luxury/ProductCard';
import CollectionHero from '@/components/collections/CollectionHero';
import SortDropdown from '@/components/luxury/SortDropdown';
import { LOCAL_PRODUCTS } from '@/lib/static-products';
import { EASE_LUXURY } from '@/lib/luxuryMotion';
import PageNotFound from '@/lib/PageNotFound';

const CATEGORIES = [
  'All',
  'Shawls',
  'Kurtis',
  'Sarees',
  'Suits',
  'Bridal',
  'Pashmina',
  'Stoles',
  'Kaftans',
  'Jackets',
  'Walnut Wood',
  'Papier Mâché',
  'Copperware',
  'Willow Wicker',
];
const EMBROIDERY_TYPES = ['All', 'Sozni', 'Tilla', 'Aari', 'Dabka', 'Zari', 'Kashmiri Stitch', 'Calligraphy', 'Papier Mâché', 'Crewel', 'Chain Stitch'];
const SORT_OPTIONS = [
  { label: 'Newest', value: '-created_date' },
  { label: 'Price: Low to High', value: 'price' },
  { label: 'Price: High to Low', value: '-price' },
  { label: 'Best Selling', value: '-review_count' },
];

const SITE_URL = (import.meta.env.VITE_PUBLIC_SITE_URL || 'https://poshkaarkashmir.com').replace(/\/$/, '');

const COLLECTION_MAP = {
  'new-arrivals': { title: 'New Arrivals', subtitle: 'The Latest Edit', filter: { collection: 'New Arrivals' }, image: '/images/main-banner.jpg' },
  'bridal': { title: 'The Wedding Edit', subtitle: 'Wedding Collection', filter: { category: 'Bridal' }, image: '/images/home/pashmina-jamawar-shawl.jpeg' },
  'pashmina': { title: 'Pashmina Heritage', subtitle: 'Textiles and Wraps', filter: { category: 'Pashmina' }, image: '/images/home/pashmina-sozni-jamawar.jpeg' },
  'best-sellers': { title: 'Best Sellers', subtitle: 'Signature Edit', filter: { is_bestseller: true }, image: '/images/main-banner.jpg' },
  'walnut-wood': { title: 'Walnut Wood', subtitle: 'Carved Objects', filter: { category: 'Walnut Wood' }, image: '/images/products/walnut-wood/walnut1-main.jpg' },
  'papier-mache': { title: 'Papier-Mâché', subtitle: 'Pattern and Colour', filter: { category: 'Papier Mâché' }, image: '/images/products/papier-mache/papier3-main.jpg' },
  'copperware': { title: 'Copperware', subtitle: 'Warm Metal', filter: { category: 'Copperware' }, image: '/images/products/copperware/copper5-main.jpg' },
  'willow-wicker': { title: 'Willow Wicker', subtitle: 'Natural Form', filter: { category: 'Willow Wicker' }, image: '/images/products/willow-wicker/willow2-main.jpg' },
  'wedding-gifts': { title: 'Wedding Gifts', subtitle: 'For Meaningful Moments', filter: { collection: 'Wedding Gifts' }, image: '/images/home/pashmina-jamawar-shawl.jpeg' },
};

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

function updateCollectionSeo(slug, title, subtitle) {
  const pageTitle = `${title} | Poshkaar Kashmir`;
  const description = `${subtitle}. Explore Poshkaar Kashmir products with clear origin, material, care and availability information.`;
  const canonicalUrl = `${SITE_URL}${slug ? `/collections/${slug}` : '/collections'}`;

  document.title = pageTitle;
  updateCanonical(canonicalUrl);
  updateMetaTag('name', 'description', description);
  updateMetaTag('property', 'og:title', pageTitle);
  updateMetaTag('property', 'og:description', description);
  updateMetaTag('property', 'og:url', canonicalUrl);
  updateMetaTag('name', 'twitter:title', pageTitle);
  updateMetaTag('name', 'twitter:description', description);
}

function filterProducts(products, query, sortBy) {
  const filtered = products.filter((product) => {
    if (query.category && product.category !== query.category) return false;
    if (query.embroidery_type && product.embroidery_type !== query.embroidery_type) return false;
    if (query.collection && product.collection !== query.collection) return false;
    if (query.is_bestseller !== undefined && product.is_bestseller !== query.is_bestseller) return false;
    return true;
  });

  return [...filtered].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === '-price') return b.price - a.price;
    if (sortBy === '-review_count') return (b.review_count || 0) - (a.review_count || 0);
    return 0;
  });
}

export default function Collections() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [embroidery, setEmbroidery] = useState('All');
  const [sortBy, setSortBy] = useState('-created_date');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const collectionInfo = slug ? COLLECTION_MAP[slug] : null;
  const isUnknownCollection = Boolean(slug && !collectionInfo);

  useEffect(() => {
    setCategory('All');
    setEmbroidery('All');
    setFiltersOpen(false);
  }, [slug]);

  useEffect(() => {
    setLoading(true);
    if (isUnknownCollection) {
      setProducts([]);
      setLoading(false);
      return;
    }
    const query = {};
    if (collectionInfo?.filter) Object.assign(query, collectionInfo.filter);
    if (category !== 'All' && !collectionInfo?.filter?.category) query.category = category;
    if (embroidery !== 'All') query.embroidery_type = embroidery;

    if (!hasConfiguredBackend) {
      setProducts(filterProducts(LOCAL_PRODUCTS, query, sortBy));
      setLoading(false);
      return;
    }

    const fetcher = Object.keys(query).length > 0
      ? base44.entities.Product.filter(query, sortBy, 80)
      : base44.entities.Product.list(sortBy, 80);

    fetcher
      .then((items) => {
        if (items?.length > 0) {
          setProducts(items);
        } else {
          setProducts(filterProducts(LOCAL_PRODUCTS, query, sortBy));
        }
      })
      .catch(() => {
        setProducts(filterProducts(LOCAL_PRODUCTS, query, sortBy));
      })
      .finally(() => setLoading(false));
  }, [category, embroidery, sortBy, slug, isUnknownCollection]);

  const title = collectionInfo?.title || 'All Collections';
  const subtitle = collectionInfo?.subtitle || 'Discover';
  const heroImage = collectionInfo?.image;
  const showCategoryNav = !collectionInfo?.filter?.category;
  const activeFilterCount = (category !== 'All' && showCategoryNav ? 1 : 0) + (embroidery !== 'All' ? 1 : 0);

  useEffect(() => {
    if (isUnknownCollection) return;
    updateCollectionSeo(slug, title, subtitle);
  }, [slug, title, subtitle, isUnknownCollection]);

  if (isUnknownCollection) return <PageNotFound />;

  return (
    <main className="min-h-screen">
      <CollectionHero
        title={title}
        subtitle={subtitle}
        image={heroImage}
        count={!loading ? products.length : undefined}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-12 lg:px-16 pt-8 md:pt-14 pb-16 md:pb-20">
        {/* Inline category navigation */}
        {showCategoryNav && (
          <div className="flex items-center gap-5 md:gap-7 overflow-x-auto no-scrollbar pb-1 mb-6">
            {CATEGORIES.map((cat) => {
              const isActive = category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  type="button"
                  aria-pressed={isActive}
                  className={`relative min-h-11 shrink-0 py-2 text-[11px] uppercase tracking-[0.2em] luxury-transition ${
                    isActive ? 'text-burgundy' : 'text-charcoal/65 hover:text-charcoal'
                  }`}
                >
                  {cat}
                  {isActive && (
                    <motion.span
                      layoutId="category-underline"
                      className="absolute left-0 -bottom-0.5 w-full h-px bg-gold"
                      transition={{ duration: 0.4, ease: EASE_LUXURY }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Sort + Filter bar */}
        <div className="flex items-center justify-between py-5 border-y border-gold/10">
          <button
            type="button"
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex min-h-11 items-center gap-2 text-[11px] uppercase tracking-[0.15em] text-charcoal luxury-transition hover:text-burgundy"
            aria-expanded={filtersOpen}
            aria-controls="collection-filter-panel"
          >
            <SlidersHorizontal size={14} />
            Filters
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 bg-burgundy text-ivory text-[9px] rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          <SortDropdown value={sortBy} onChange={setSortBy} options={SORT_OPTIONS} />
        </div>

        {/* Active filter chips */}
        <AnimatePresence>
          {activeFilterCount > 0 && (
            <motion.div
              className="flex flex-wrap items-center gap-3 mt-5"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: EASE_LUXURY }}
            >
              {category !== 'All' && showCategoryNav && (
                <FilterChip label={category} onClear={() => setCategory('All')} />
              )}
              {embroidery !== 'All' && (
                <FilterChip label={embroidery} onClear={() => setEmbroidery('All')} />
              )}
              <button
                type="button"
                onClick={() => { setCategory('All'); setEmbroidery('All'); }}
                className="min-h-11 px-2 text-[10px] uppercase tracking-wider text-burgundy luxury-transition hover:text-charcoal"
              >
                Clear All
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Embroidery filter panel */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              id="collection-filter-panel"
              className="overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE_LUXURY }}
            >
              <div className="py-6">
                <p className="text-[10px] tracking-[0.2em] uppercase text-gold mb-4">
                  Embroidery Technique
                </p>
                <div className="flex flex-wrap gap-2">
                  {EMBROIDERY_TYPES.map((emb) => (
                    <button
                      key={emb}
                      type="button"
                      aria-pressed={embroidery === emb}
                      onClick={() => setEmbroidery(emb)}
                      className={`min-h-11 border px-4 py-2 text-[10px] uppercase tracking-wider luxury-transition ${
                        embroidery === emb
                          ? 'bg-charcoal text-ivory border-charcoal'
                          : 'bg-transparent text-charcoal border-gold/20 hover:border-gold'
                      }`}
                    >
                      {emb}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results count */}
        <p className="mt-8 mb-8 text-[10px] uppercase tracking-[0.2em] text-muted-foreground" aria-live="polite">
          {loading ? 'Curating...' : `${products.length} ${products.length === 1 ? 'piece' : 'pieces'}`}
        </p>

        {/* Product grid */}
        {loading ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-5 md:grid-cols-3 md:gap-8 lg:grid-cols-4">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i}>
                <div className="aspect-[3/4] bg-beige mb-4 shimmer" />
                <div className="h-2 bg-beige w-1/3 mb-2 shimmer" />
                <div className="h-3.5 bg-beige w-2/3 mb-2 shimmer" />
                <div className="h-2 bg-beige w-1/4 shimmer" />
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <motion.div
            key={`${category}-${embroidery}-${sortBy}-${slug}`}
            className="grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-5 sm:gap-y-12 md:grid-cols-3 md:gap-x-8 md:gap-y-14 lg:grid-cols-4"
          >
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full border border-gold/20 flex items-center justify-center mb-6">
              <Search size={20} className="text-gold/40" strokeWidth={1.5} />
            </div>
            <p className="font-heading text-2xl text-charcoal font-light mb-2">No pieces found</p>
            <p className="text-sm text-muted-foreground mb-8 max-w-sm">
              We couldn't find pieces matching your selection. Try adjusting your filters.
            </p>
            <button
              type="button"
              onClick={() => { setCategory('All'); setEmbroidery('All'); }}
              className="min-h-11 border-b border-gold/30 px-2 pb-0.5 text-[11px] uppercase tracking-[0.2em] text-burgundy luxury-transition hover:border-gold hover:text-charcoal"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

function FilterChip({ label, onClear }) {
  return (
    <span className="inline-flex min-h-11 items-center gap-1 bg-beige pl-3 text-[10px] uppercase tracking-wider text-charcoal">
      {label}
      <button
        type="button"
        onClick={onClear}
        className="flex h-11 w-11 items-center justify-center luxury-transition hover:text-burgundy"
        aria-label={`Remove ${label} filter`}
      >
        <X size={11} />
      </button>
    </span>
  );
}
