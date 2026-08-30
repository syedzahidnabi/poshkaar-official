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
  'Papier Mache',
  'Copperware',
  'Willow Wicker',
];
const EMBROIDERY_TYPES = ['All', 'Sozni', 'Tilla', 'Aari', 'Dabka', 'Zari', 'Kashmiri Stitch', 'Calligraphy', 'Papier Mache', 'Crewel', 'Chain Stitch'];
const SORT_OPTIONS = [
  { label: 'Newest', value: '-created_date' },
  { label: 'Price: Low to High', value: 'price' },
  { label: 'Price: High to Low', value: '-price' },
  { label: 'Best Selling', value: '-review_count' },
];

const SITE_URL = (import.meta.env.VITE_PUBLIC_SITE_URL || 'https://poshkaarkashmir.com').replace(/\/$/, '');
const COLLECTION_SCHEMA_ID = 'poshkaar-collection-schema';
const DEFAULT_SOCIAL_IMAGE = '/images/social/poshkaar-kashmir-og.png';

const COLLECTION_MAP = {
  'new-arrivals': { title: 'New Arrivals', subtitle: 'The Latest Edit', filter: { collection: 'New Arrivals' }, image: '/images/main-banner.jpg' },
  'bridal': { title: 'The Wedding Edit', subtitle: 'Wedding Collection', filter: { category: 'Bridal' }, image: '/images/home/pashmina-jamawar-shawl.jpeg' },
  'pashmina': {
    title: 'Kashmiri Pashmina Shawls',
    subtitle: 'Pure Pashmina, Sozni and Tilla Wraps',
    filter: { category: 'Pashmina' },
    image: '/images/home/pashmina-sozni-jamawar.jpeg',
    seoTitle: 'Kashmiri Pashmina Shawls, Stoles and Wraps Online | Poshkaar Kashmir',
    seoDescription: 'Shop Kashmiri Pashmina shawls, pashmina stoles, Sozni Pashmina, Tilla Pashmina wraps, bridal shawls and luxury handmade Kashmir textiles from Poshkaar Kashmir.',
    intro: 'Explore Kashmiri Pashmina shawls, Pashmina stoles and soft winter wraps selected for drape, warmth, hand feel and craft clarity. Poshkaar Kashmir brings together Sozni embroidery, Tilla borders, bridal Pashmina pieces, gifting shawls and heirloom-style wraps with clear material, care and origin details.',
    highlights: ['Kashmiri Pashmina shawls for women', 'Sozni Pashmina and Tilla Pashmina work', 'Luxury shawls, stoles, wraps and bridal trousseau gifts'],
    keywords: ['Kashmiri Pashmina online', 'Pashmina shawl Kashmir', 'pure Pashmina shawl', 'Sozni Pashmina', 'Tilla Pashmina', 'Kashmir shawl for wedding', 'luxury Pashmina stole', 'hand embroidered Pashmina'],
  },
  'best-sellers': { title: 'Best Sellers', subtitle: 'Signature Edit', filter: { is_bestseller: true }, image: '/images/main-banner.jpg' },
  'dabka': {
    title: 'Kashmiri Dabka Work',
    subtitle: 'Dimensional Occasion Embroidery',
    filter: { embroidery_type: 'Dabka' },
    image: '/images/products/dabka/dabka1-main.jpg',
    seoTitle: 'Kashmiri Dabka Work Ensembles and Bridal Embroidery | Poshkaar Kashmir',
    seoDescription: 'Shop Kashmiri Dabka work, dimensional embroidery ensembles, bridal pherans and occasion wear with raised metallic Kashmir handwork.',
    intro: 'Explore Kashmiri Dabka work for bridal wear, festive ensembles and statement occasion clothing. Dabka embroidery brings raised metallic texture, floral placement and ceremonial depth to Kashmiri pherans, suits and custom outfits.',
    highlights: ['Raised Kashmiri Dabka embroidery', 'Bridal and occasion ensembles', 'Metallic surface work with dimensional detail'],
    keywords: ['Kashmiri Dabka work', 'Dabka embroidery', 'Dabka bridal wear', 'Kashmiri occasion wear', 'Dabka pheran', 'raised metallic embroidery', 'Kashmir festive outfit', 'hand embroidered bridal suit'],
  },
  'zari': {
    title: 'Kashmiri Zari Work',
    subtitle: 'Antique Gold Surface Embroidery',
    filter: { embroidery_type: 'Zari' },
    image: '/images/products/zari/zari1-main.jpg',
    seoTitle: 'Kashmiri Zari Work Clothing and Embroidered Ensembles | Poshkaar Kashmir',
    seoDescription: 'Shop Kashmiri Zari work, antique gold embroidery, festive pherans, suits and handmade Kashmir occasion wear from Poshkaar Kashmir.',
    intro: 'Discover Kashmiri Zari work with antique gold accents, refined surface embroidery and rich occasion-ready silhouettes. This collection is for buyers searching for handmade Kashmir festive wear, embroidered suits, pherans and heirloom-inspired clothing.',
    highlights: ['Kashmiri Zari embroidery and gold surface work', 'Festive pherans, suits and occasion pieces', 'Handmade Kashmir clothing with heirloom detail'],
    keywords: ['Kashmiri Zari work', 'Zari embroidery Kashmir', 'gold embroidery pheran', 'Kashmiri festive wear', 'Zari work suit', 'antique gold embroidery', 'Kashmir occasion clothing', 'handmade embroidered outfit'],
  },
  'walnut-wood': {
    title: 'Kashmiri Walnut Wood Carving',
    subtitle: 'Hand Carved Walnut Wood Decor',
    filter: { category: 'Walnut Wood' },
    image: '/images/products/walnut-wood/walnut1-main.jpg',
    seoTitle: 'Kashmiri Walnut Wood Carving and Handmade Decor | Poshkaar Kashmir',
    seoDescription: 'Shop Kashmiri walnut wood carving, hand carved boxes, wall panels, clocks, combs and walnut wood home decor made with traditional Kashmir woodcraft.',
    intro: 'Shop Kashmiri walnut wood carving made for homes that value natural grain, patient handwork and quiet luxury. This edit includes hand carved walnut boxes, keepsake boxes, wall panels, wooden clocks, decorative objects and small personal pieces shaped by Kashmir woodcraft traditions.',
    highlights: ['Hand carved Kashmiri walnut wood decor', 'Walnut boxes, panels, clocks and keepsakes', 'Natural wood grain with floral and chinar-inspired carving'],
    keywords: ['Kashmiri walnut wood carving', 'walnut wood decor Kashmir', 'hand carved walnut box', 'Kashmir wood carving online', 'walnut wall panel', 'wooden keepsake box', 'chinar walnut carving', 'luxury wooden home decor'],
  },
  'papier-mache': {
    title: 'Kashmiri Papier Mache',
    subtitle: 'Hand Painted Naqashi Decor',
    filter: { category: 'Papier Mache' },
    image: '/images/products/papier-mache/papier3-main.jpg',
    seoTitle: 'Kashmiri Papier Mache Gifts, Boxes and Home Decor | Poshkaar Kashmir',
    seoDescription: 'Shop Kashmiri Papier Mache boxes, hand painted Naqashi decor, vases, ewers and colorful Kashmir handicraft gifts from Poshkaar Kashmir.',
    intro: 'Discover Kashmiri Papier Mache, also searched as Kashmir paper mache, papier mache boxes and hand painted Naqashi decor. Poshkaar Kashmir presents lacquered keepsake boxes, trinket boxes, decorative vases, ewers and colorful handmade gifts with traditional floral, chinar and garden-inspired patterns.',
    highlights: ['Hand painted Kashmiri Papier Mache gifts', 'Naqashi boxes, vases, ewers and decorative objects', 'Colorful Kashmir handicrafts for home decor and gifting'],
    keywords: ['Kashmiri Papier Mache', 'Kashmir paper mache', 'papier mache box Kashmir', 'hand painted Naqashi', 'Kashmiri handicrafts online', 'paper mache gifts', 'papier mache vase', 'Kashmir home decor'],
  },
  'copperware': {
    title: 'Kashmiri Copperware',
    subtitle: 'Naqashi Copper and Samovar Craft',
    filter: { category: 'Copperware' },
    image: '/images/products/copperware/copper5-main.jpg',
    seoTitle: 'Kashmiri Copperware, Naqashi Copper and Samovar Sets | Poshkaar Kashmir',
    seoDescription: 'Shop Kashmiri copperware, engraved Naqashi copper, samovar sets, bowls, ewers and copper home decor handcrafted in Kashmir.',
    intro: 'Explore Kashmiri copperware with warm metal, engraved Naqashi patterns and heritage forms such as samovar sets, ewers, bowls, trays and keepsake boxes. Each copper piece is selected for finish, proportion, pattern detail and practical guidance before it reaches your home.',
    highlights: ['Kashmiri copperware and engraved Naqashi copper', 'Samovar sets, bowls, ewers and home decor', 'Traditional Kashmir metal craft for gifting and interiors'],
    keywords: ['Kashmiri copperware', 'Kashmir copper samovar', 'Naqashi copper', 'engraved copperware India', 'copper home decor', 'Kashmiri copper bowl', 'copper ewer Kashmir', 'handmade copper gifts'],
  },
  'willow-wicker': {
    title: 'Kashmiri Willow Wicker',
    subtitle: 'Handwoven Baskets and Home Objects',
    filter: { category: 'Willow Wicker' },
    image: '/images/products/willow-wicker/willow2-main.jpg',
    seoTitle: 'Kashmiri Willow Wicker Baskets and Handwoven Decor | Poshkaar Kashmir',
    seoDescription: 'Shop Kashmiri willow wicker baskets, picnic baskets, storage baskets, market baskets and handwoven Kashmir home decor from Poshkaar Kashmir.',
    intro: 'Shop Kashmiri willow wicker baskets and handwoven home objects made with natural texture and everyday usefulness. This collection includes carry baskets, picnic baskets, lidded storage baskets, market baskets and small woven pieces that bring Kashmir craft into daily living.',
    highlights: ['Kashmiri willow wicker baskets for home and gifting', 'Handwoven picnic, storage, carry and market baskets', 'Natural texture from traditional Kashmir willow craft'],
    keywords: ['Kashmiri willow wicker', 'willow basket Kashmir', 'handwoven wicker basket', 'Kashmir basketry', 'willow picnic basket', 'wicker storage basket', 'handmade baskets India', 'natural home decor'],
  },
  'tilla': {
    title: 'Kashmiri Tilla Work',
    subtitle: 'Metallic Embroidery and Occasion Wear',
    filter: { embroidery_type: 'Tilla' },
    image: '/images/products/tilla/tilla1-main.jpg',
    seoTitle: 'Kashmiri Tilla Work Suits, Pherans and Pashmina Wraps | Poshkaar Kashmir',
    seoDescription: 'Shop Kashmiri Tilla work, Tilla embroidery suits, pherans, bridal ensembles and Pashmina wraps with metallic Kashmir handwork.',
    intro: 'Browse Kashmiri Tilla work for weddings, festive dressing, bridal trousseau and refined occasion wear. Poshkaar Kashmir curates Tilla embroidery suits, Tilla pherans, metallic embroidered ensembles, Pashmina wraps and Kashmiri luxury clothing with clear product photographs and customization support.',
    highlights: ['Kashmiri Tilla embroidery for women', 'Tilla suits, pherans, bridal ensembles and wraps', 'Metallic gold and silver work for weddings and festive wear'],
    keywords: ['Kashmiri Tilla work', 'Tilla embroidery suit', 'Tilla pheran', 'Kashmiri bridal wear', 'Tilla Pashmina wrap', 'Kashmir wedding outfit', 'gold Tilla work', 'silver Tilla embroidery'],
  },
  'aari': {
    title: 'Kashmiri Aari Work',
    subtitle: 'Crewel Inspired Embroidery and Pherans',
    filter: { embroidery_type: 'Aari' },
    image: '/images/products/aari/aari1-main.jpg',
    seoTitle: 'Kashmiri Aari Work Pherans, Kurtas and Embroidered Suits | Poshkaar Kashmir',
    seoDescription: 'Shop Kashmiri Aari work, Aari embroidery pherans, kurtas, suits and handmade Kashmir clothing with floral embroidery from Poshkaar Kashmir.',
    intro: 'Discover Kashmiri Aari work, known for flowing floral embroidery, rhythmic needlework and wearable Kashmiri silhouettes. This edit includes Aari pherans, Aari kurtas, embroidered suits and made-to-measure pieces for women who want Kashmir craft in modern daily and occasion wear.',
    highlights: ['Kashmiri Aari embroidery and floral needlework', 'Aari pherans, kurtas, suits and custom outfits', 'Hand embroidered Kashmir clothing for everyday luxury'],
    keywords: ['Kashmiri Aari work', 'Aari embroidery', 'Aari pheran', 'Kashmiri embroidered kurta', 'Aari work suit', 'Kashmir clothing online', 'hand embroidered pheran', 'Kashmiri floral embroidery'],
  },
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

function absoluteUrl(url) {
  if (!url) return `${SITE_URL}${DEFAULT_SOCIAL_IMAGE}`;
  if (/^https?:\/\//i.test(url)) return url;
  return `${SITE_URL}${url.startsWith('/') ? url : `/${url}`}`;
}

function getProductSchemaName(product) {
  return product.title || product.name || product.product_name || product.slug || product.id || 'Poshkaar Kashmir product';
}

function getProductSchemaDescription(product, fallbackTitle) {
  return product.description
    || product.short_description
    || `${getProductSchemaName(product)} from ${fallbackTitle} at Poshkaar Kashmir.`;
}

function getProductSchemaPrice(product) {
  const price = Number(product.price || product.sale_price || product.compare_at_price);
  return Number.isFinite(price) && price > 0 ? price.toFixed(2) : null;
}

function getProductSchemaAvailability(product) {
  const quantity = Number(product.stock_quantity ?? product.stock);
  if (Number.isFinite(quantity)) {
    return quantity > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock';
  }
  if (product.availability) return product.availability;
  return 'https://schema.org/InStock';
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

function updateCollectionSeo(slug, title, subtitle, seo = {}) {
  const pageTitle = seo.seoTitle || `${title} | Poshkaar Kashmir`;
  const description = seo.seoDescription || `${subtitle}. Explore Poshkaar Kashmir products with clear origin, material, care and availability information.`;
  const canonicalUrl = `${SITE_URL}${slug ? `/collections/${slug}` : '/collections'}`;
  const socialImage = absoluteUrl(seo.image || DEFAULT_SOCIAL_IMAGE);
  const keywords = [
    'Poshkaar Kashmir',
    'poshkaarkashmir',
    'Kashmiri products online',
    'Kashmir handicrafts',
    ...(seo.keywords || []),
  ].join(', ');

  document.title = pageTitle;
  updateCanonical(canonicalUrl);
  updateMetaTag('name', 'description', description);
  updateMetaTag('name', 'keywords', keywords);
  updateMetaTag('property', 'og:title', pageTitle);
  updateMetaTag('property', 'og:description', description);
  updateMetaTag('property', 'og:url', canonicalUrl);
  updateMetaTag('property', 'og:type', 'website');
  updateMetaTag('property', 'og:image', socialImage);
  updateMetaTag('property', 'og:image:alt', `${title} by Poshkaar Kashmir`);
  updateMetaTag('name', 'twitter:title', pageTitle);
  updateMetaTag('name', 'twitter:description', description);
  updateMetaTag('name', 'twitter:image', socialImage);
}

function updateJsonLd(id, data) {
  let script = document.head.querySelector(`script[data-schema-id="${id}"]`);
  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.dataset.schemaId = id;
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

function updateCollectionStructuredData(slug, title, description, image, products, keywords) {
  const pageUrl = `${SITE_URL}${slug ? `/collections/${slug}` : '/collections'}`;
  const schemaProducts = products
    .filter((product) => getProductSchemaName(product) && getProductSchemaPrice(product))
    .slice(0, 24);
  const itemListElement = schemaProducts.map((product, index) => {
    const productPath = product.slug || product.id;
    const productUrl = `${SITE_URL}/product/${productPath}`;
    const productImage = absoluteUrl(product.images?.[0] || product.image_url || product.image);
    const productName = getProductSchemaName(product);
    const productPrice = getProductSchemaPrice(product);
    return {
      '@type': 'ListItem',
      position: index + 1,
      url: productUrl,
      item: {
        '@type': 'Product',
        '@id': `${productUrl}#product`,
        name: productName,
        description: getProductSchemaDescription(product, title),
        image: productImage,
        url: productUrl,
        sku: product.sku || product.id,
        mpn: product.sku || product.id,
        brand: {
          '@type': 'Brand',
          name: 'Poshkaar Kashmir',
        },
        category: product.category || title,
        offers: {
          '@type': 'Offer',
          url: productUrl,
          priceCurrency: 'INR',
          price: productPrice,
          availability: getProductSchemaAvailability(product),
          itemCondition: 'https://schema.org/NewCondition',
          seller: {
            '@type': 'Organization',
            name: 'Poshkaar Kashmir',
            url: `${SITE_URL}/`,
          },
        },
      },
    };
  });

  updateJsonLd(COLLECTION_SCHEMA_ID, {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${pageUrl}#collection`,
        name: title,
        description,
        url: pageUrl,
        image: absoluteUrl(image || DEFAULT_SOCIAL_IMAGE),
        inLanguage: 'en-IN',
        isPartOf: {
          '@type': 'WebSite',
          name: 'Poshkaar Kashmir',
          url: `${SITE_URL}/`,
        },
        about: keywords?.length ? keywords : ['Kashmiri craft', 'Kashmir handicrafts', title],
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${SITE_URL}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Collections',
            item: `${SITE_URL}/collections`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: title,
            item: pageUrl,
          },
        ],
      },
      {
        '@type': 'ItemList',
        '@id': `${pageUrl}#products`,
        name: `${title} products by Poshkaar Kashmir`,
        numberOfItems: schemaProducts.length,
        itemListElement,
      },
    ],
  });
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
  const seoIntro = collectionInfo?.intro;
  const seoHighlights = collectionInfo?.highlights || [];
  const seoKeywords = collectionInfo?.keywords || [];
  const showCategoryNav = !collectionInfo?.filter?.category;
  const activeFilterCount = (category !== 'All' && showCategoryNav ? 1 : 0) + (embroidery !== 'All' ? 1 : 0);

  useEffect(() => {
    if (isUnknownCollection) return;
    updateCollectionSeo(slug, title, subtitle, collectionInfo);
  }, [slug, title, subtitle, collectionInfo, isUnknownCollection]);

  useEffect(() => {
    if (isUnknownCollection || loading) return;
    const description = collectionInfo?.seoDescription
      || collectionInfo?.intro
      || `${subtitle}. Explore Poshkaar Kashmir products with clear origin, material, care and availability information.`;
    updateCollectionStructuredData(slug, title, description, heroImage, products, seoKeywords);
  }, [slug, title, subtitle, collectionInfo, heroImage, products, seoKeywords, loading, isUnknownCollection]);

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
        {seoIntro && (
          <section className="mb-8 border-b border-gold/10 pb-8 md:mb-10 md:pb-10" aria-labelledby="collection-seo-title">
            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
              <div>
                <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-gold">Shop by Kashmir craft</p>
                <h2 id="collection-seo-title" className="font-heading text-3xl font-light leading-tight text-charcoal md:text-5xl">
                  {title}
                </h2>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
                  {seoIntro}
                </p>
              </div>

              {seoHighlights.length > 0 && (
                <div className="grid grid-cols-1 gap-3 self-end sm:grid-cols-3 lg:grid-cols-1">
                  {seoHighlights.map((highlight) => (
                    <div key={highlight} className="border border-gold/15 bg-sand/35 px-4 py-4">
                      <p className="text-xs font-medium leading-5 text-charcoal">{highlight}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
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

        {seoKeywords.length > 0 && (
          <section className="mt-14 border-t border-gold/10 pt-8 md:mt-18 md:pt-10" aria-label={`${title} related searches`}>
            <div className="grid gap-5 md:grid-cols-[0.65fr_1.35fr] md:items-start">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-gold">Related searches</p>
                <h2 className="mt-3 font-heading text-2xl font-light text-charcoal md:text-3xl">
                  Find this craft by the words buyers use.
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {seoKeywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="border border-gold/15 bg-ivory px-3 py-2 text-[11px] uppercase tracking-[0.12em] text-charcoal/70"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </section>
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
