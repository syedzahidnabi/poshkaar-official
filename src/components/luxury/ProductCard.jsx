import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Check, Star, Ruler, Eye, MessageCircle } from 'lucide-react';
import { formatPrice } from '@/lib/formatPrice';
import { useCart } from '@/lib/CartContext';
import { base44, hasConfiguredBackend } from '@/api/base44Client';
import { EASE_LUXURY } from '@/lib/luxuryMotion';
import {
  DEFAULT_PRODUCT_IMAGE,
  getLocalWebpSrcSet,
  hasCompareAtPrice,
  normalizeImageList,
} from '@/lib/imageUtils';
import {
  getProductImageFallback,
  getProductPresentation,
} from '@/lib/catalogPresentation';
import {
  addWishlistItem,
  isProductWishlisted,
  removeWishlistItem,
  subscribeToWishlist,
} from '@/lib/wishlist';

export default function ProductCard({ product, index = 0 }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [imageFallbackApplied, setImageFallbackApplied] = useState(false);
  const { addItem } = useCart();

  const displayProduct = getProductPresentation(product);
  const images = normalizeImageList(displayProduct.images, [DEFAULT_PRODUCT_IMAGE]).slice(0, 2);
  const mainImage = images[0];
  const hoverImage = images[1] || mainImage;
  const hasDiscount = hasCompareAtPrice(product);
  const hasVerifiedStock = product.stock_quantity !== null
    && product.stock_quantity !== undefined
    && product.stock_quantity !== ''
    && Number.isFinite(Number(product.stock_quantity));
  const isOutOfStock = hasVerifiedStock && Number(product.stock_quantity) === 0;
  const isPreview = displayProduct.catalog_source === 'local_preview';
  const reviewCount = Number(product.review_count || 0);
  const ratingNumber = Number(product.rating);
  const hasRating = reviewCount > 0 && Number.isFinite(ratingNumber);
  const primaryBadge = displayProduct.image_is_studio_preview || imageFallbackApplied
    ? 'Studio preview'
    : hasDiscount
      ? 'Reduced'
      : product.is_bestseller
        ? 'Bestseller'
        : '';
  const craftTag = product.embroidery_type || product.category || 'Kashmir craft';
  const whatsappText = encodeURIComponent(`Hello Poshkaar, I want help with ${displayProduct.title}.`);

  const mainImageSrcSet = getLocalWebpSrcSet(mainImage);
  const hoverImageSrcSet = getLocalWebpSrcSet(hoverImage);

  useEffect(() => {
    setIsWishlisted(isProductWishlisted(product.id));
    return subscribeToWishlist(() => {
      setIsWishlisted(isProductWishlisted(product.id));
    });
  }, [product.id]);

  const handleImageError = (event) => {
    const image = event.currentTarget;
    const stage = image.dataset.fallbackStage || '';
    image.parentElement?.querySelectorAll('source').forEach((source) => source.remove());

    if (!stage) {
      const fallback = getProductImageFallback(product);
      image.dataset.fallbackStage = fallback === DEFAULT_PRODUCT_IMAGE ? 'default' : 'studio';
      image.src = fallback;
      setImageFallbackApplied(fallback !== DEFAULT_PRODUCT_IMAGE);
      return;
    }

    if (stage !== 'default') {
      image.dataset.fallbackStage = 'default';
      image.src = DEFAULT_PRODUCT_IMAGE;
      setImageFallbackApplied(false);
    }
  };

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (adding || isOutOfStock || isPreview) return;
    setAdding(true);
    const size = product.sizes?.[0] || '';
    const color = product.colors?.[0] || '';
    addItem(displayProduct, size, color, 1);
    setTimeout(() => {
      setAdding(false);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    }, 600);
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const nextWishlisted = !isWishlisted;
    setIsWishlisted(nextWishlisted);

    if (nextWishlisted) {
      addWishlistItem(displayProduct);
      if (hasConfiguredBackend) {
        try {
          await base44.entities.WishlistItem.create({
            product_id: product.id,
            title: product.title,
            price: product.price,
            image: mainImage,
            category: product.category,
          });
        } catch { /* already wishlisted */ }
      }
    } else {
      removeWishlistItem(product.id);
      if (hasConfiguredBackend) {
        try {
          const items = await base44.entities.WishlistItem.filter({ product_id: product.id });
          if (items.length > 0) await base44.entities.WishlistItem.delete(items[0].id);
        } catch { /* noop */ }
      }
    }
  };

  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay: (index % 4) * 0.1, ease: EASE_LUXURY }}
      whileHover={{ y: -2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="block">
        <div className="relative mb-4 aspect-[3/4] overflow-hidden rounded-[0.15rem] border border-walnut/10 bg-beige">
          {/* Main image */}
          <motion.picture
            className="absolute inset-0 h-full w-full object-cover"
            animate={{ opacity: isHovered ? 0 : 1, scale: isHovered ? 1.035 : 1 }}
            transition={{ duration: 0.7, ease: EASE_LUXURY }}
          >
            {mainImageSrcSet && (
              <source
                srcSet={mainImageSrcSet}
                type="image/webp"
              />
            )}
            <img
              src={mainImage}
              alt={`${product.title}${displayProduct.image_is_studio_preview ? ' studio visualisation' : ''}`}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
              decoding="async"
              onError={handleImageError}
            />
          </motion.picture>
          {/* Hover image */}
          <motion.picture
            className="absolute inset-0 h-full w-full object-cover"
            animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 1.035 }}
            transition={{ duration: 0.7, ease: EASE_LUXURY }}
          >
            {hoverImageSrcSet && (
              <source
                srcSet={hoverImageSrcSet}
                type="image/webp"
              />
            )}
            <img
              src={hoverImage}
              alt={`${product.title} alternate view`}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
              decoding="async"
              onError={handleImageError}
            />
          </motion.picture>

          {/* Badges */}
          <div className="absolute left-4 top-4 z-30 flex flex-col gap-2">
            {primaryBadge && (
              <span className="border border-ivory/40 bg-charcoal/85 px-3 py-1.5 font-body text-[9px] uppercase tracking-[0.17em] text-ivory">
                {primaryBadge}
              </span>
            )}
            {isOutOfStock && (
              <span className="bg-charcoal/90 px-3 py-1 font-body text-[9px] uppercase tracking-[0.15em] text-ivory">
                Sold out
              </span>
            )}
          </div>

          {/* Wishlist control */}
          <motion.button
            className="absolute right-3 top-3 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-ivory/90 shadow-[0_10px_25px_-12px_rgba(74,14,14,0.4)] luxury-transition hover:bg-ivory md:right-4 md:top-4 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100"
            onClick={handleWishlist}
            whileTap={{ scale: 0.85 }}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart
              size={15}
              className={`luxury-transition ${isWishlisted ? 'fill-burgundy text-burgundy' : 'text-charcoal'}`}
            />
          </motion.button>

          <div className="absolute inset-x-3 bottom-3 z-30 grid translate-y-3 grid-cols-2 gap-2 opacity-0 luxury-transition group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
            <Link
              to={`/product/${product.id}`}
              className="flex min-h-10 items-center justify-center gap-2 bg-ivory/94 px-3 text-[8px] uppercase tracking-[0.16em] text-charcoal shadow-[0_14px_35px_-22px_rgba(0,0,0,0.7)] luxury-transition hover:bg-champagne sm:text-[9px]"
            >
              <Eye size={12} aria-hidden="true" />
              Quick view
            </Link>
            <a
              href={`https://wa.me/916006491824?text=${whatsappText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-10 items-center justify-center gap-2 bg-charcoal/88 px-3 text-[8px] uppercase tracking-[0.16em] text-ivory shadow-[0_14px_35px_-22px_rgba(0,0,0,0.7)] luxury-transition hover:bg-walnut sm:text-[9px]"
              onClick={(e) => e.stopPropagation()}
            >
              <MessageCircle size={12} aria-hidden="true" />
              Ask
            </a>
          </div>

        </div>
      </div>

      {/* Details */}
      <div className="space-y-1.5">
        <p className="text-[9px] tracking-[0.2em] uppercase text-gold font-body">
          {craftTag}
        </p>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-heading text-base font-medium leading-snug text-charcoal luxury-transition group-hover:text-burgundy sm:text-lg">
            {product.title}
          </h3>
        </Link>
        <div className="flex items-center gap-3 pt-0.5">
          <span className="font-body text-sm text-charcoal tracking-wide">
            {isPreview ? 'Details pending' : formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="font-body text-sm text-muted-foreground line-through">
              {formatPrice(product.compare_at_price)}
            </span>
          )}
        </div>
        {!isPreview && hasVerifiedStock && Number(product.stock_quantity) > 0 && Number(product.stock_quantity) <= 3 && (
          <p className="pt-1 text-[10px] text-walnut">Low stock | {product.stock_quantity} available</p>
        )}
        {hasRating && (
          <div className="flex items-center gap-1 pt-1">
            <Star size={10} className="fill-gold text-gold" />
            <span className="text-[10px] text-muted-foreground">{ratingNumber.toFixed(1)}</span>
            <span className="text-[10px] text-muted-foreground/60">({reviewCount})</span>
          </div>
        )}
        <div className="flex flex-wrap gap-2 pt-2">
          <span className="border border-walnut/10 px-2.5 py-1 text-[9px] uppercase tracking-[0.14em] text-charcoal/58">
            Real photo
          </span>
          <span className="border border-walnut/10 px-2.5 py-1 text-[9px] uppercase tracking-[0.14em] text-charcoal/58">
            Custom order
          </span>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-walnut/10 pt-3">
          <Link
            to={`/product/${product.id}?customize=1`}
            className="flex min-h-11 items-center gap-2 px-1 text-[8px] uppercase tracking-[0.18em] text-walnut luxury-transition hover:text-charcoal sm:text-[9px]"
          >
            <Ruler size={12} aria-hidden="true" />
            {product.customization_label || 'Customize'}
          </Link>
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={adding || added || isOutOfStock || isPreview}
            className="flex min-h-11 items-center justify-center gap-2 border border-charcoal bg-charcoal px-4 text-center text-[8px] uppercase tracking-[0.16em] text-ivory luxury-transition hover:border-walnut hover:bg-walnut disabled:cursor-not-allowed disabled:opacity-55 sm:text-[9px]"
            aria-label={isPreview
              ? `${product.title} is a catalogue preview`
              : isOutOfStock ? `${product.title} is sold out` : `Add ${product.title} to bag`}
          >
            {isPreview ? (
              <>Preview Only</>
            ) : isOutOfStock ? (
              <>Sold Out</>
            ) : adding ? (
              <>
                <span className="h-3 w-3 rounded-full border border-current/30 border-t-current animate-spin" />
                Adding
              </>
            ) : added ? (
              <>
                <Check size={12} aria-hidden="true" />
                Added
              </>
            ) : (
              <>
                <ShoppingBag size={12} aria-hidden="true" />
                Add to Bag
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
