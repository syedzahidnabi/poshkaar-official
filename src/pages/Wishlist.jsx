import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44, hasConfiguredBackend } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import SectionHeading from '@/components/luxury/SectionHeading';
import LuxuryButton from '@/components/luxury/LuxuryButton';
import { formatPrice } from '@/lib/formatPrice';
import {
  getWishlistItems,
  removeWishlistItem,
  subscribeToWishlist,
} from '@/lib/wishlist';

const mergeWishlistItems = (...lists) => {
  const byProductId = new Map();
  lists.flat().forEach((item) => {
    if (item?.product_id) byProductId.set(item.product_id, item);
  });
  return Array.from(byProductId.values()).sort((a, b) => new Date(b.created_date || 0) - new Date(a.created_date || 0));
};

export default function Wishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    if (!hasConfiguredBackend) {
      setItems(getWishlistItems());
      setLoading(false);
      const unsubscribe = subscribeToWishlist((localItems) => {
        setItems(localItems);
      });
      return () => {
        cancelled = true;
        unsubscribe();
      };
    }

    base44.entities.WishlistItem.list('-created_date', 50)
      .then((remoteItems) => {
        if (!cancelled) setItems(mergeWishlistItems(remoteItems, getWishlistItems()));
      })
      .catch(() => {
        if (!cancelled) setItems(getWishlistItems());
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    const unsubscribe = subscribeToWishlist((localItems) => {
      setItems((currentItems) => mergeWishlistItems(currentItems.filter((item) => !item.local), localItems));
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  const handleRemove = async (id) => {
    const item = items.find((currentItem) => currentItem.id === id);
    if (!item) return;

    removeWishlistItem(item.product_id);
    if (hasConfiguredBackend && !item.local) {
      await base44.entities.WishlistItem.delete(id).catch(() => {});
    }
    setItems(prev => prev.filter(i => i.product_id !== item.product_id));
  };

  return (
    <main className="pt-28 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <SectionHeading title="Your Wishlist" subtitle="Saved Pieces" className="mb-12" />

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <Heart size={40} className="text-gold/20 mx-auto mb-4" />
            <p className="font-display text-2xl text-charcoal mb-2">Your wishlist is empty</p>
            <p className="text-sm text-muted-foreground mb-6">Save pieces you love and come back to them later.</p>
            <Link to="/collections">
              <LuxuryButton variant="secondary">Explore Collections</LuxuryButton>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 md:grid-cols-3 md:gap-x-8 md:gap-y-14 lg:grid-cols-4">
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                className="group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={`/product/${item.product_id}`}>
                  <div className="relative aspect-[3/4] bg-beige overflow-hidden mb-4">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 luxury-transition" loading="lazy" />
                    <button
                      onClick={(e) => { e.preventDefault(); handleRemove(item.id); }}
                      className="absolute top-3 right-3 w-8 h-8 bg-ivory/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-ivory"
                      aria-label="Remove from wishlist"
                    >
                      <Heart size={14} className="fill-burgundy text-burgundy" />
                    </button>
                  </div>
                </Link>
                <p className="text-[10px] tracking-wider uppercase text-gold">{item.category}</p>
                <h3 className="font-display text-lg text-charcoal">{item.title}</h3>
                <p className="text-sm text-charcoal">{formatPrice(item.price)}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
