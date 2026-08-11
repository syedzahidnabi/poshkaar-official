import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { base44, hasConfiguredBackend } from '@/api/base44Client';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Box,
  ChevronLeft,
  ChevronRight,
  Heart,
  MapPin,
  Maximize2,
  MessageCircle,
  Minus,
  PackageCheck,
  Plus,
  Ruler,
  RotateCcw,
  Shield,
  Sparkles,
  Star,
  Truck,
  X,
} from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import { formatPrice } from '@/lib/formatPrice';
import LuxuryButton from '@/components/luxury/LuxuryButton';
import ProductCard from '@/components/luxury/ProductCard';
import SectionHeading from '@/components/luxury/SectionHeading';
import { LOCAL_PRODUCTS } from '@/lib/static-products';
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
  buildCustomizationWhatsAppMessage,
  DEFAULT_CUSTOM_MEASUREMENTS,
  getWhatsAppOrderUrl,
} from '@/lib/whatsappOrders';
import {
  addWishlistItem,
  isProductWishlisted,
  removeWishlistItem,
  subscribeToWishlist,
} from '@/lib/wishlist';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from '@/components/ui/use-toast';
import useFocusTrap from '@/hooks/useFocusTrap';

const DEFAULT_TITLE = 'Poshkaar Kashmir Luxury Kashmiri Embroidery and Handcrafted Pashmina Couture';
const DEFAULT_DESCRIPTION = 'Explore Poshkaar Kashmir products with clear material, origin, care, availability and delivery information.';

const SITE_URL = (import.meta.env.VITE_PUBLIC_SITE_URL || 'https://poshkaarkashmir.com').replace(/\/$/, '');

const MEASUREMENT_FIELDS = [
  ['height', 'Height'],
  ['bust', 'Bust / Chest'],
  ['waist', 'Waist'],
  ['hips', 'Hips'],
  ['shoulder', 'Shoulder'],
  ['sleeve', 'Sleeve length'],
  ['length', 'Outfit length'],
  ['armhole', 'Armhole'],
];

const getProductCraftSteps = (product) => {
  if (product.catalog_source === 'local_preview') {
    return [
      ['The Story', Sparkles, 'Story pending'],
      ['The Craft', Box, 'Craft details pending'],
      ['The Artisan', MapPin, 'Maker details pending'],
      ['Materials', Shield, 'Material details pending'],
      ['Care', PackageCheck, 'Care instructions pending'],
      ['From Kashmir to Your Home', Truck, 'Origin and delivery pending'],
    ].map(([label, icon, title]) => ({
      label,
      icon,
      title,
      text: 'This information will be published only after it has been checked by the Poshkaar team.',
    }));
  }

  return [
  {
    icon: Sparkles,
    label: 'The Story',
    title: product.story_title || 'Product story',
    text: product.story || 'The verified story for this piece is being prepared. Ask our team if you would like its full background before ordering.',
  },
  {
    icon: Box,
    label: 'The Craft',
    title: product.embroidery_type || product.craft || 'Craft details pending',
    text: product.craft_description || 'Technique, process and production details will appear here after they have been checked by the Poshkaar team.',
  },
  {
    icon: MapPin,
    label: 'The Artisan',
    title: product.artisan_name || 'Maker details available on request',
    text: product.artisan_story || 'We publish artisan names and biographies only with the maker’s permission and after the relationship has been verified.',
  },
  {
    icon: Shield,
    label: 'Materials',
    title: product.fabric || product.material || 'Material details pending',
    text: product.material_description || 'Fibre, metal, wood and finish information is shown only when it is confirmed in the catalogue record.',
  },
  {
    icon: PackageCheck,
    label: 'Care',
    title: product.care_title || 'Care instructions',
    text: product.care_instructions || 'Ask our team for care guidance before cleaning or storing this piece. Product-specific instructions are being verified.',
  },
  {
    icon: Truck,
    label: 'From Kashmir to Your Home',
    title: product.crafting_time || product.lead_time || 'Delivery confirmed after order',
    text: product.origin
      ? `Recorded origin: ${product.origin}. Dispatch timing is confirmed with you after the order is reviewed.`
      : 'Origin and dispatch timing will be confirmed with you before fulfilment.',
  },
  ];
};

function ProductCraftPanel({ product }) {
  const steps = getProductCraftSteps(product);

  return (
    <section className="mt-16 border-y border-gold/10 bg-sand/55 py-12 md:mt-24 md:py-16" aria-labelledby="product-craft-title">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div data-luxury-reveal>
          <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-gold">Craft story</p>
          <h2
            id="product-craft-title"
            className="font-heading font-light leading-tight text-charcoal text-balance"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.75rem)' }}
          >
            What we know about this piece.
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-7 text-charcoal/64">
            Product stories should earn trust. Missing information is marked clearly instead of being replaced with an invented claim.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {steps.map((step, index) => (
            <motion.article
              key={step.label}
              className="border border-walnut/10 bg-ivory/72 p-6 shadow-[0_24px_80px_-64px_rgba(91,58,41,0.8)]"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.72, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-7 flex h-11 w-11 items-center justify-center border border-gold/25 bg-sand text-gold">
                <step.icon size={18} strokeWidth={1.4} aria-hidden="true" />
              </div>
              <p className="text-[9px] uppercase tracking-[0.26em] text-gold">{step.label}</p>
              <h3 className="mt-3 font-heading text-2xl font-light text-charcoal">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-charcoal/62">{step.text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function toAbsoluteUrl(url) {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  return `${SITE_URL}${url.startsWith('/') ? url : `/${url}`}`;
}

function updateMetaTag(attr, value, content) {
  let tag = document.head.querySelector(`meta[${attr}="${value}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, value);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
  return tag;
}

function updateCanonical(href) {
  let tag = document.head.querySelector('link[rel="canonical"]');
  if (!tag) {
    tag = document.createElement('link');
    tag.setAttribute('rel', 'canonical');
    document.head.appendChild(tag);
  }
  tag.setAttribute('href', href);
  return tag;
}

function updateProductSeo(product) {
  const title = product ? `${product.title} | Poshkaar Kashmir` : DEFAULT_TITLE;
  const description = product?.short_description || product?.description || DEFAULT_DESCRIPTION;
  const imageUrl = toAbsoluteUrl(normalizeImageList(product?.images, [DEFAULT_PRODUCT_IMAGE])[0] || DEFAULT_PRODUCT_IMAGE);
  const pageUrl = product?.id ? `${SITE_URL}/product/${product.id}` : `${SITE_URL}/`;

  document.title = title;
  updateCanonical(pageUrl);
  updateMetaTag('name', 'description', description);
  updateMetaTag('property', 'og:title', title);
  updateMetaTag('property', 'og:description', description);
  updateMetaTag('property', 'og:image', imageUrl);
  updateMetaTag('property', 'og:url', pageUrl);
  updateMetaTag('name', 'twitter:title', title);
  updateMetaTag('name', 'twitter:description', description);
  updateMetaTag('name', 'twitter:image', imageUrl);

  const scriptId = 'product-json-ld';
  let script = document.getElementById(scriptId);
  if (!product) {
    if (script) script.remove();
    return;
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description,
    image: imageUrl,
    sku: product.sku || product.id,
    brand: {
      '@type': 'Brand',
      name: 'Poshkaar Kashmir',
    },
    offers: {
      '@type': 'Offer',
      url: pageUrl,
      priceCurrency: 'INR',
      itemCondition: 'https://schema.org/NewCondition',
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'IN',
        },
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: Number(product.price) >= 15000 ? '0' : '500',
          currency: 'INR',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 3,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 5,
            maxValue: 7,
            unitCode: 'DAY',
          },
        },
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'IN',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 15,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/ReturnShippingFees',
      },
    },
  };

  if (product.price !== null && product.price !== undefined && Number.isFinite(Number(product.price))) {
    schema.offers.price = Number(product.price).toString();
  }
  if (product.stock_quantity !== null && product.stock_quantity !== undefined && product.stock_quantity !== '') {
    schema.offers.availability = Number(product.stock_quantity) > 0
      ? 'https://schema.org/InStock'
      : 'https://schema.org/OutOfStock';
  }

  // Add aggregateRating and reviews when available
  const ratingValue = product.rating ?? product.average_rating ?? null;
  const reviewCount = product.review_count ?? product.reviews?.length ?? null;
  if (ratingValue && reviewCount) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: ratingValue.toString(),
      reviewCount: reviewCount,
    };
  }

  // If detailed reviews exist, include a few in the JSON-LD
  const reviews = product.reviews && Array.isArray(product.reviews)
    ? product.reviews.filter((review) => Number.isFinite(Number(review.rating ?? review.stars)))
    : null;
  if (reviews && reviews.length > 0) {
    schema.review = reviews.slice(0, 3).map(r => ({
      '@type': 'Review',
      author: r.author || r.name || 'Customer',
      datePublished: r.date || r.published_at || undefined,
      reviewBody: r.body || r.comment || '',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: Number(r.rating ?? r.stars).toString(),
      },
    }));
  }

  // Build BreadcrumbList for better SEO
  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Collections', item: `${SITE_URL}/collections` },
      { '@type': 'ListItem', position: 3, name: product.title, item: pageUrl },
    ],
  };

  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = scriptId;
    document.head.appendChild(script);
  }

  // Output multiple schema entries as an array (Product + BreadcrumbList)
  script.textContent = JSON.stringify([schema, breadcrumbs]);
}

export default function ProductDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [measurements, setMeasurements] = useState(DEFAULT_CUSTOM_MEASUREMENTS);
  const [customNotes, setCustomNotes] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [related, setRelated] = useState([]);
  const [zoomOpen, setZoomOpen] = useState(false);
  const { addItem } = useCart();
  const { toast } = useToast();
  const zoomDialogRef = useFocusTrap(zoomOpen);
  const images = normalizeImageList(product?.images, [DEFAULT_PRODUCT_IMAGE]);
  const isPreview = product?.catalog_source === 'local_preview';
  const hasStockValue = product?.stock_quantity !== null
    && product?.stock_quantity !== undefined
    && product?.stock_quantity !== '';
  const stockQuantity = Number(product?.stock_quantity);
  const hasStockLimit = hasStockValue && Number.isFinite(stockQuantity) && stockQuantity >= 0;
  const isOutOfStock = hasStockLimit && stockQuantity === 0;

  useEffect(() => {
    setLoading(true);
    const fallbackProduct = LOCAL_PRODUCTS.find(item => item.id === id);

    const applyFallbackProduct = () => {
      if (fallbackProduct) {
        const displayProduct = getProductPresentation(fallbackProduct);
        setProduct(displayProduct);
        updateProductSeo(displayProduct);
        if (displayProduct.sizes?.length) setSelectedSize(displayProduct.sizes[0]);
        if (displayProduct.colors?.length) setSelectedColor(displayProduct.colors[0]);
        setRelated(LOCAL_PRODUCTS.filter(x => x.category === fallbackProduct.category && x.id !== fallbackProduct.id).slice(0, 4));
      }
      setLoading(false);
    };

    if (!hasConfiguredBackend) {
      applyFallbackProduct();
      return;
    }

    base44.entities.Product.get(id)
      .then(p => {
        const displayProduct = getProductPresentation(p);
        setProduct(displayProduct);
        updateProductSeo(displayProduct);
        if (displayProduct.sizes?.length) setSelectedSize(displayProduct.sizes[0]);
        if (displayProduct.colors?.length) setSelectedColor(displayProduct.colors[0]);
        if (displayProduct.category) {
          base44.entities.Product.filter({ category: displayProduct.category }, '-created_date', 4)
            .then(r => {
              const relatedProducts = r.filter(x => x.id !== p.id).slice(0, 4);
              setRelated(relatedProducts.length > 0
                ? relatedProducts
                : LOCAL_PRODUCTS.filter(x => x.category === p.category && x.id !== p.id).slice(0, 4)
              );
            })
            .catch(() => {
              setRelated(LOCAL_PRODUCTS.filter(x => x.category === p.category && x.id !== p.id).slice(0, 4));
            });
        }
      })
      .catch(() => {
        applyFallbackProduct();
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    updateProductSeo(product);
  }, [product]);

  useEffect(() => {
    if (!product?.id) return undefined;
    setIsWishlisted(isProductWishlisted(product.id));
    return subscribeToWishlist(() => {
      setIsWishlisted(isProductWishlisted(product.id));
    });
  }, [product?.id]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setSelectedImage(0);
    setQuantity(1);
    setMeasurements(DEFAULT_CUSTOM_MEASUREMENTS);
    setCustomNotes('');
  }, [id]);

  useEffect(() => {
    if (searchParams.get('customize') === '1') {
      setShowMeasurements(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!zoomOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setZoomOpen(false);
      if (event.key === 'ArrowLeft') {
        setSelectedImage((current) => (current - 1 + images.length) % images.length);
      }
      if (event.key === 'ArrowRight') {
        setSelectedImage((current) => (current + 1) % images.length);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [images.length, zoomOpen]);

  const updateMeasurement = (field, value) => {
    setMeasurements((currentMeasurements) => ({
      ...currentMeasurements,
      [field]: value,
    }));
  };

  const handleProductImageError = (event) => {
    const image = event.currentTarget;
    const stage = image.dataset.fallbackStage || '';
    image.parentElement?.querySelectorAll('source').forEach((source) => source.remove());

    if (!stage) {
      const fallback = getProductImageFallback(product);
      image.dataset.fallbackStage = fallback === DEFAULT_PRODUCT_IMAGE ? 'default' : 'studio';
      image.src = fallback;
      if (fallback !== DEFAULT_PRODUCT_IMAGE) {
        setProduct((current) => ({
          ...current,
          images: [fallback],
          image: fallback,
          image_is_studio_preview: true,
          image_disclosure: 'Studio visualisation. Ask our team for current photographs of the exact piece before ordering.',
        }));
        setSelectedImage(0);
      }
      return;
    }

    if (stage !== 'default') {
      image.dataset.fallbackStage = 'default';
      image.src = DEFAULT_PRODUCT_IMAGE;
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    if (isPreview) {
      toast({
        title: 'This is a catalogue preview',
        description: 'It cannot be added to the bag until its product data has been verified and published.',
        variant: 'destructive',
      });
      return;
    }
    if (isOutOfStock) {
      toast({
        title: 'This piece is sold out',
        description: 'Save it to your wishlist or contact us for a made-to-order request.',
        variant: 'destructive',
      });
      return;
    }
    addItem(product, selectedSize, selectedColor, quantity);
    toast({ title: 'Added to bag', description: `${product.title} has been added to your bag.` });
  };

  const handleWishlist = () => {
    if (!product) return;

    if (isWishlisted) {
      removeWishlistItem(product.id);
      setIsWishlisted(false);
      toast({ title: 'Removed from wishlist', description: `${product.title} was removed from your saved pieces.` });
    } else {
      addWishlistItem(product);
      setIsWishlisted(true);
      toast({ title: 'Saved to wishlist', description: `${product.title} is saved for later.` });
    }
  };

  if (loading) {
    return (
      <div className="pt-28 pb-20 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="animate-pulse space-y-4">
            <div className="aspect-[3/4] bg-beige" />
            <div className="flex gap-2">{[0,1,2].map(i => <div key={i} className="w-20 h-20 bg-beige" />)}</div>
          </div>
          <div className="animate-pulse space-y-4 pt-4">
            <div className="h-3 bg-beige w-1/4" />
            <div className="h-8 bg-beige w-3/4" />
            <div className="h-6 bg-beige w-1/4" />
            <div className="h-20 bg-beige w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-28 pb-20 text-center min-h-screen flex items-center justify-center flex-col">
        <h2 className="font-display text-2xl text-charcoal mb-4">Product Not Found</h2>
        <Link to="/collections" className="text-sm text-burgundy hover:underline">Browse Collections</Link>
      </div>
    );
  }

  const activeImage = images[selectedImage] || images[0];
  const activeImageSrcSet = getLocalWebpSrcSet(activeImage);
  const discount = hasCompareAtPrice(product)
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;
  const customizationMessage = buildCustomizationWhatsAppMessage({
    product,
    size: selectedSize,
    color: selectedColor,
    quantity,
    measurements,
    notes: customNotes,
  });
  const customizationWhatsAppUrl = getWhatsAppOrderUrl(customizationMessage);
  const isWearableProduct = !['Copperware', 'Walnut Wood', 'Papier Mâché', 'Willow Wicker'].includes(product.category);

  return (
    <main className="pb-32 pt-28 md:pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        {/* Breadcrumbs */}
        <nav className="mb-6 flex items-center gap-2 overflow-hidden text-[9px] uppercase tracking-wider text-muted-foreground md:mb-8 md:text-[10px]" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-charcoal luxury-transition">Home</Link>
          <ChevronRight size={10} />
          <Link to="/collections" className="hover:text-charcoal luxury-transition">Collections</Link>
          <ChevronRight size={10} />
          <span className="truncate text-charcoal" aria-current="page">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Gallery */}
          <div>
            <motion.div
              className="group mb-3 aspect-[3/4] overflow-hidden rounded-[0.35rem] border border-walnut/10 bg-beige shadow-[0_34px_110px_-78px_rgba(91,58,41,0.9)] md:mb-4"
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <picture>
                {activeImageSrcSet && (
                  <source
                    srcSet={activeImageSrcSet}
                    type="image/webp"
                  />
                )}
                <img
                  src={activeImage}
                  alt={`${product.title} view ${selectedImage + 1}`}
                  className="h-full w-full object-cover transition duration-1000 ease-luxury group-hover:scale-105"
                  loading={selectedImage === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  onError={handleProductImageError}
                />
              </picture>
              <button
                type="button"
                onClick={() => setZoomOpen(true)}
                className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center border border-ivory/55 bg-charcoal/55 text-ivory backdrop-blur-md luxury-transition hover:border-gold hover:bg-charcoal"
                aria-label={`Open a larger view of ${product.title}`}
              >
                <Maximize2 size={16} aria-hidden="true" />
              </button>
            </motion.div>
            {images.length > 1 && (
              <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`h-20 w-16 shrink-0 overflow-hidden border-2 luxury-transition ${
                      selectedImage === i ? 'border-gold' : 'border-transparent hover:border-gold/30'
                    }`}
                    aria-label={`View image ${i + 1}`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                      onError={handleProductImageError}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info stays sticky on desktop */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <span className="text-gold text-[10px] tracking-[0.3em] uppercase">
              {product.embroidery_type || product.category}
            </span>
            <h1 className="font-display text-3xl md:text-4xl text-charcoal font-light mt-2 mb-4">
              {product.title}
            </h1>

            {product.catalog_source === 'local_preview' && (
              <div className="mb-5 border border-gold/20 bg-sand/60 px-4 py-3 text-xs leading-5 text-charcoal/70" role="status">
                <strong className="font-medium text-charcoal">Preview record.</strong>{' '}
                The title, price, availability and imagery must be confirmed by Poshkaar before this item is published for sale.
              </div>
            )}

            {product.image_is_studio_preview && product.catalog_source !== 'local_preview' && (
              <div className="mb-5 border border-gold/20 bg-sand/60 px-4 py-3 text-xs leading-5 text-charcoal/70" role="status">
                <strong className="font-medium text-charcoal">Studio visual.</strong>{' '}
                This product is waiting for verified photography. Ask our team for current photographs of the exact piece before ordering.
              </div>
            )}

            {/* Rating */}
            {product.rating > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={12} className={i < Math.round(product.rating) ? 'fill-gold text-gold' : 'text-gold/30'} />
                  ))}
                </div>
                <span className="text-[10px] text-muted-foreground tracking-wider">
                  ({product.review_count} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-display text-2xl text-charcoal">
                {isPreview ? 'Details pending' : formatPrice(product.price)}
              </span>
              {discount > 0 && (
                <>
                  <span className="text-sm text-muted-foreground line-through">{formatPrice(product.compare_at_price)}</span>
                  <span className="text-[10px] tracking-wider uppercase bg-burgundy/10 text-burgundy px-2 py-0.5">
                    {discount}% Off
                  </span>
                </>
              )}
            </div>

            {/* Short description */}
            {product.short_description && (
              <p className="text-sm text-charcoal/70 leading-relaxed mb-6">{product.short_description}</p>
            )}

            <div className="w-full h-px needle-line mb-6" />

            {/* Color selector */}
            {product.colors?.length > 0 && (
              <div className="mb-6">
                <p className="text-[10px] tracking-[0.2em] uppercase text-charcoal mb-3">
                  Colour <span className="text-muted-foreground">{selectedColor}</span>
                </p>
                <div className="flex gap-3">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 text-[10px] tracking-wider uppercase border luxury-transition ${
                        selectedColor === color
                          ? 'bg-charcoal text-ivory border-charcoal'
                          : 'bg-transparent text-charcoal border-gold/20 hover:border-gold'
                      }`}
                      aria-pressed={selectedColor === color}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size selector */}
            {product.sizes?.length > 0 && (
              <div className="mb-6">
                <p className="text-[10px] tracking-[0.2em] uppercase text-charcoal mb-3">
                  Size <span className="text-muted-foreground">{selectedSize}</span>
                </p>
                <div className="flex gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`h-12 min-w-12 px-3 text-xs tracking-wider border luxury-transition flex items-center justify-center ${
                        selectedSize === size
                          ? 'bg-charcoal text-ivory border-charcoal'
                          : 'bg-transparent text-charcoal border-gold/20 hover:border-gold'
                      }`}
                      aria-pressed={selectedSize === size}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <p className="text-[10px] tracking-[0.2em] uppercase text-charcoal mb-3">Quantity</p>
              <div className="inline-flex items-center border border-gold/20">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-beige luxury-transition"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="w-12 text-center text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity(hasStockLimit ? Math.min(stockQuantity, quantity + 1) : quantity + 1)}
                  disabled={hasStockLimit && quantity >= stockQuantity}
                  className="w-10 h-10 flex items-center justify-center hover:bg-beige luxury-transition disabled:cursor-not-allowed disabled:opacity-35"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Stock indicator */}
            {hasStockLimit && product.stock_quantity <= 5 && product.stock_quantity > 0 && (
              <p className="text-[10px] tracking-wider text-burgundy mb-4">
                {product.stock_quantity} available in current stock
              </p>
            )}
            {isOutOfStock && (
              <p className="mb-4 text-[10px] uppercase tracking-[0.16em] text-burgundy" role="status">
                Sold out — contact our concierge for a made-to-order request
              </p>
            )}

            {/* Actions */}
            <div className="mb-6 flex gap-3">
              <LuxuryButton
                variant="primary"
                className="min-h-12 flex-1"
                onClick={handleAddToCart}
                disabled={isOutOfStock || isPreview}
              >
                {isPreview ? 'Preview Only' : isOutOfStock ? 'Sold Out' : 'Add to Bag'}
              </LuxuryButton>
              <motion.button
                className={`flex h-12 w-12 shrink-0 items-center justify-center border luxury-transition ${
                  isWishlisted ? 'border-burgundy bg-burgundy/5' : 'border-gold/20 hover:border-gold'
                }`}
                onClick={handleWishlist}
                whileTap={{ scale: 0.9 }}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart size={16} className={isWishlisted ? 'fill-burgundy text-burgundy' : 'text-charcoal'} />
              </motion.button>
            </div>

            <div className="mb-6">
              <button
                type="button"
                onClick={() => setShowMeasurements((isOpen) => !isOpen)}
                className="flex min-h-12 w-full items-center justify-center gap-2 border border-gold/30 bg-sand/35 px-5 text-[10px] uppercase tracking-[0.18em] text-charcoal luxury-transition hover:border-gold hover:bg-gold"
                aria-expanded={showMeasurements}
              >
                <Ruler size={14} />
                {product.customization_label || (isWearableProduct ? 'Customize with measurements' : 'Customize this piece')}
              </button>

              <AnimatePresence initial={false}>
                {showMeasurements && (
                  <motion.section
                    className="mt-4 border border-gold/15 bg-ivory/80 p-5 shadow-[0_24px_80px_-64px_rgba(91,58,41,0.8)]"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <p className="text-[10px] uppercase tracking-[0.24em] text-gold">Custom order</p>
                    <h2 className="mt-2 font-display text-2xl font-light text-charcoal">
                      {isWearableProduct ? 'Share your measurements' : 'Tell us how you would like it finished'}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-charcoal/65">
                      {product.customization_prompt
                        || (isWearableProduct
                          ? 'Add what you know. Empty fields are fine — our team can guide you on WhatsApp.'
                          : 'Share your preferred size, finish, inscription or gifting request. Our team will confirm what is possible.')}
                    </p>

                    {isWearableProduct && (
                      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {MEASUREMENT_FIELDS.map(([field, label]) => (
                          <label key={field} className="block">
                            <span className="mb-2 block text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{label}</span>
                            <input
                              value={measurements[field]}
                              onChange={(event) => updateMeasurement(field, event.target.value)}
                              placeholder="e.g. 36 in"
                              inputMode="decimal"
                              className="w-full border border-gold/20 bg-transparent px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/30 focus:border-gold focus:outline-none"
                            />
                          </label>
                        ))}
                      </div>
                    )}

                    <label className="mt-4 block">
                      <span className="mb-2 block text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Custom request</span>
                      <textarea
                        value={customNotes}
                        onChange={(event) => setCustomNotes(event.target.value)}
                        placeholder={isWearableProduct
                          ? 'Example: make sleeves longer, loose fit, add lining, bridal fitting call...'
                          : 'Example: preferred finish, size, inscription, gift note or presentation box...'}
                        className="h-24 w-full resize-none border border-gold/20 bg-transparent px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/30 focus:border-gold focus:outline-none"
                      />
                    </label>

                    <a
                      href={customizationWhatsAppUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 bg-[#2F4733] px-5 text-[10px] uppercase tracking-[0.18em] text-ivory luxury-transition hover:bg-charcoal"
                    >
                      <MessageCircle size={14} />
                      Send on WhatsApp
                    </a>
                  </motion.section>
                )}
              </AnimatePresence>
            </div>

            {/* Trust badges */}
            <div className="mb-8 grid grid-cols-3 gap-2 border-y border-gold/10 py-4 text-center text-[9px] tracking-wider text-muted-foreground sm:text-[10px]">
              <span className="flex flex-col items-center gap-1.5 sm:flex-row sm:justify-center"><Truck size={13} className="text-gold" /> Free Shipping</span>
              <span className="flex flex-col items-center gap-1.5 sm:flex-row sm:justify-center"><RotateCcw size={13} className="text-gold" /> 15-Day Returns</span>
              <span className="flex flex-col items-center gap-1.5 sm:flex-row sm:justify-center"><Shield size={13} className="text-gold" /> Secure Checkout</span>
            </div>

            {/* Accordion details */}
            <Accordion type="single" collapsible className="border-t border-gold/10">
              {product.description && (
                <AccordionItem value="description" className="border-gold/10">
                  <AccordionTrigger className="text-[11px] tracking-[0.15em] uppercase text-charcoal hover:text-burgundy py-4">
                    Description
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-charcoal/70 leading-relaxed pb-6">
                    {product.description}
                  </AccordionContent>
                </AccordionItem>
              )}
              <AccordionItem value="details" className="border-gold/10">
                <AccordionTrigger className="text-[11px] tracking-[0.15em] uppercase text-charcoal hover:text-burgundy py-4">
                  Specifications
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  <div className="space-y-3 text-sm">
                    {product.fabric && <div className="flex justify-between"><span className="text-muted-foreground">Fabric</span><span className="text-charcoal">{product.fabric}</span></div>}
                    {product.embroidery_type && <div className="flex justify-between"><span className="text-muted-foreground">Embroidery</span><span className="text-charcoal">{product.embroidery_type}</span></div>}
                    {product.origin && <div className="flex justify-between"><span className="text-muted-foreground">Origin</span><span className="text-charcoal">{product.origin}</span></div>}
                    {product.crafting_time && <div className="flex justify-between"><span className="text-muted-foreground">Crafting Time</span><span className="text-charcoal">{product.crafting_time}</span></div>}
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="shipping" className="border-gold/10">
                <AccordionTrigger className="text-[11px] tracking-[0.15em] uppercase text-charcoal hover:text-burgundy py-4">
                  Shipping and Delivery
                </AccordionTrigger>
                <AccordionContent className="text-sm text-charcoal/70 leading-relaxed pb-6">
                  <p className="mb-2">Complimentary shipping on orders above ₹15,000.</p>
                  <p className="mb-2">Standard delivery: 5-7 business days across India.</p>
                  <p>International shipping: 10-15 business days.</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="care" className="border-gold/10">
                <AccordionTrigger className="text-[11px] tracking-[0.15em] uppercase text-charcoal hover:text-burgundy py-4">
                  Care and Returns
                </AccordionTrigger>
                <AccordionContent className="text-sm text-charcoal/70 leading-relaxed pb-6">
                  {product.care_instructions || (
                    <>
                      <p className="mb-2">Dry clean only. Store flat in a muslin cloth to preserve embroidery detail.</p>
                      <p>15-day return policy. Items must be unworn and in original packaging.</p>
                    </>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        <ProductCraftPanel product={product} />

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-16 border-t border-gold/10 pt-14 md:mt-24 md:pt-20">
            <SectionHeading title="You May Also Love" subtitle="Similar Pieces" className="mb-12" />
            <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-4 md:gap-x-8 md:gap-y-14">
              {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </div>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gold/20 bg-ivory/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-20px_55px_-36px_rgba(29,29,29,0.6)] backdrop-blur-xl md:hidden">
        <div className="mx-auto flex max-w-xl items-center gap-4">
          <div className="min-w-0 flex-1">
            <p className="truncate font-heading text-base text-charcoal">{product.title}</p>
            <p className="text-sm text-walnut">{isPreview ? 'Details pending' : formatPrice(product.price)}</p>
          </div>
          <LuxuryButton
            variant="primary"
            size="sm"
            className="min-h-11 shrink-0"
            onClick={handleAddToCart}
            disabled={isOutOfStock || isPreview}
          >
            {isPreview ? 'Preview Only' : isOutOfStock ? 'Sold Out' : 'Add to Bag'}
          </LuxuryButton>
        </div>
      </div>

      <AnimatePresence>
        {zoomOpen && (
          <motion.div
            ref={zoomDialogRef}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-charcoal/96 p-4 md:p-10"
            role="dialog"
            aria-modal="true"
            aria-label={`${product.title} image viewer`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              onClick={() => setZoomOpen(false)}
              className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center border border-ivory/25 text-ivory luxury-transition hover:border-gold hover:text-gold md:right-8 md:top-8"
              aria-label="Close image viewer"
            >
              <X size={20} aria-hidden="true" />
            </button>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setSelectedImage((current) => (current - 1 + images.length) % images.length)}
                  className="absolute left-3 z-10 flex h-12 w-12 items-center justify-center border border-ivory/25 text-ivory luxury-transition hover:border-gold hover:text-gold md:left-8"
                  aria-label="Previous product image"
                >
                  <ChevronLeft size={20} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedImage((current) => (current + 1) % images.length)}
                  className="absolute right-3 z-10 flex h-12 w-12 items-center justify-center border border-ivory/25 text-ivory luxury-transition hover:border-gold hover:text-gold md:right-8"
                  aria-label="Next product image"
                >
                  <ChevronRight size={20} aria-hidden="true" />
                </button>
              </>
            )}

            <motion.img
              key={`${activeImage}-${selectedImage}`}
              src={activeImage}
              alt={`${product.title} enlarged view ${selectedImage + 1}`}
              className="max-h-[88vh] max-w-[88vw] object-contain"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
            />
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-[0.22em] text-ivory/75 md:bottom-7">
              {selectedImage + 1} / {images.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
