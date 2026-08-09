import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, X } from 'lucide-react';
import { base44, hasConfiguredBackend } from '@/api/base44Client';
import ProductCard from '@/components/luxury/ProductCard';
import { LOCAL_PRODUCTS } from '@/lib/static-products';
import debounce from 'lodash/debounce';

const searchProducts = (products, q) => {
  const lower = q.toLowerCase();
  return products.filter(p =>
    p.title?.toLowerCase().includes(lower) ||
    p.category?.toLowerCase().includes(lower) ||
    p.embroidery_type?.toLowerCase().includes(lower) ||
    p.fabric?.toLowerCase().includes(lower) ||
    p.description?.toLowerCase().includes(lower) ||
    p.short_description?.toLowerCase().includes(lower)
  );
};

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [usingPreview, setUsingPreview] = useState(false);

  const updateQuery = (value) => {
    setQuery(value);
    if (value.trim()) {
      setSearchParams({ q: value });
    } else {
      setSearchParams({});
    }
  };

  const doSearch = useCallback(
    debounce(async (q) => {
      if (!q.trim()) { setResults([]); setSearched(false); return; }
      setLoading(true);
      setSearched(true);
      if (!hasConfiguredBackend) {
        setResults(searchProducts(LOCAL_PRODUCTS, q));
        setUsingPreview(true);
        setLoading(false);
        return;
      }
      try {
        const all = await base44.entities.Product.list('-created_date', 100);
        const filtered = searchProducts(all, q);
        setResults(filtered.length > 0 ? filtered : searchProducts(LOCAL_PRODUCTS, q));
        setUsingPreview(filtered.length === 0);
      } catch {
        setResults(searchProducts(LOCAL_PRODUCTS, q));
        setUsingPreview(true);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    doSearch(query);
    return () => doSearch.cancel();
  }, [doSearch, query]);

  return (
    <main className="pt-28 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="max-w-2xl mx-auto mb-16">
          <div className="relative">
            <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" />
            <input
              type="text"
              value={query}
              onChange={e => updateQuery(e.target.value)}
              placeholder="Search for pieces, fabrics, embroidery..."
              className="w-full bg-transparent border-b-2 border-gold/30 pl-12 pr-10 py-4 text-lg font-display text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-gold luxury-transition"
              autoFocus
            />
            {query && (
              <button
                onClick={() => updateQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2"
                aria-label="Clear search"
              >
                <X size={16} className="text-muted-foreground hover:text-charcoal" />
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
          </div>
        ) : searched && results.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-display text-2xl text-charcoal mb-2">No results found</p>
            <p className="text-sm text-muted-foreground">Try different keywords or browse our collections.</p>
          </div>
        ) : results.length > 0 ? (
          <>
            {usingPreview && (
              <aside className="mb-8 border border-gold/20 bg-sand/55 px-5 py-4 text-sm leading-6 text-charcoal/72" role="status">
                <strong className="font-medium text-charcoal">Preview results.</strong>{' '}
                These samples are not available to buy until verified product records are published.
              </aside>
            )}
            <p className="text-[10px] text-muted-foreground tracking-wider mb-8">
              {results.length} piece{results.length !== 1 ? 's' : ''} found
            </p>
            <div className="grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 md:grid-cols-3 md:gap-x-8 md:gap-y-14 lg:grid-cols-4">
              {results.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          </>
        ) : !searched ? (
          <div className="text-center py-20">
            <p className="font-display text-xl text-charcoal/70">Search the catalogue by title, category or material</p>
          </div>
        ) : null}
      </div>
    </main>
  );
}
