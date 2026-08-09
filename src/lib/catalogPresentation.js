import {
  DEFAULT_PRODUCT_IMAGE,
  normalizeImageList,
} from './imageUtils.js';

export const CATALOG_PRESENTATION_PRESETS = [
  {
    id: 'catalogue-preview-sozni',
    title: 'Burgundy Sozni Shawl',
    category: 'Shawls',
    collection: 'Sozni',
    embroidery_type: 'Sozni',
    image: '/images/product-sozni-burgundy.jpg',
    short_description: 'A deep burgundy shawl composition framed by fine floral detail.',
    description: 'A studio visual for a richly coloured Sozni shawl direction. Material, dimensions, availability and making details will be published only after the product record and photography have been verified.',
  },
  {
    id: 'catalogue-preview-tilla',
    title: 'Ivory Tilla Pheran',
    category: 'Pherans',
    collection: 'Tilla',
    embroidery_type: 'Tilla',
    image: '/images/product-tilla-ivory.jpg',
    short_description: 'A quiet ivory silhouette with restrained antique-gold detail.',
    description: 'A studio visual for an ivory Tilla pheran direction. Material, measurements, availability and care information remain pending until the Poshkaar team verifies the final product record.',
  },
  {
    id: 'catalogue-preview-aari',
    title: 'Forest Aari Long Jacket',
    category: 'Jackets',
    collection: 'Aari',
    embroidery_type: 'Aari',
    image: '/images/product-aari-forest.jpg',
    short_description: 'A forest-green long jacket with calm, tonal botanical detail.',
    description: 'A studio visual for a forest-green Aari jacket direction. Fabric, fit, availability and care details will be shown only after they have been checked against the finished piece.',
  },
  {
    id: 'catalogue-preview-dabka',
    title: 'Maroon Dabka Bridal Ensemble',
    category: 'Bridal',
    collection: 'Dabka',
    embroidery_type: 'Dabka',
    image: '/images/product-dabka-bridal.jpg',
    short_description: 'A deep maroon bridal composition with muted metal-thread detail.',
    description: 'A studio visual for a maroon Dabka bridal direction. Final construction, measurements, lead time and care guidance must be confirmed with the Poshkaar team before an order is accepted.',
  },
  {
    id: 'catalogue-preview-walnut',
    title: 'Carved Walnut Keepsake Box',
    category: 'Home Objects',
    collection: 'Walnut Wood',
    embroidery_type: 'Walnut carving',
    image: '/images/product-walnut-keepsake-box.jpg',
    short_description: 'A compact keepsake form shaped around layered botanical carving.',
    description: 'A studio visual for a carved walnut keepsake box direction. Dimensions, wood source, finish, maker information and availability remain pending until the catalogue record is verified.',
  },
  {
    id: 'catalogue-preview-papier',
    title: 'Forest Papier-Mâché Vase',
    category: 'Home Objects',
    collection: 'Papier Mâché',
    embroidery_type: 'Papier Mâché',
    image: '/images/product-papier-mache-vase.jpg',
    short_description: 'A forest-green vase composition with restrained floral painting.',
    description: 'A studio visual for a papier-mâché vase direction. Size, finish, maker information and care instructions will be added only after the final piece has been photographed and checked.',
  },
  {
    id: 'catalogue-preview-copper',
    title: 'Engraved Copper Samovar',
    category: 'Copperware',
    collection: 'Copperware',
    embroidery_type: 'Copper engraving',
    image: '/images/product-copper-samovar.jpg',
    short_description: 'A traditional copper form with a warm patina and botanical engraving.',
    description: 'A studio visual for an engraved copper samovar direction. Capacity, dimensions, finish, food-use guidance and availability must be verified before the object is published for sale.',
  },
  {
    id: 'catalogue-preview-willow',
    title: 'Willow Lidded Basket',
    category: 'Home Objects',
    collection: 'Willow',
    embroidery_type: 'Willow weaving',
    image: '/images/product-willow-basket.jpg',
    short_description: 'A clean lidded basket form defined by an even natural weave.',
    description: 'A studio visual for a willow basket direction. Dimensions, materials, maker information and availability will be published after the finished object has been checked and photographed.',
  },
];

const PRESENTATION_RULES = [
  { pattern: /papier|m[aâ]ch[eé]|vase/i, preset: 5 },
  { pattern: /walnut|wood|carv|keepsake|box/i, preset: 4 },
  { pattern: /copper|samovar|metal|qalamzani/i, preset: 6 },
  { pattern: /willow|wicker|basket|weav/i, preset: 7 },
  { pattern: /dabka|zardozi|bridal|wedding|lehenga|saree/i, preset: 3 },
  { pattern: /tilla|pheran/i, preset: 1 },
  { pattern: /aari|ari work|jacket|coat|kurta|kurti|chikankari/i, preset: 2 },
  { pattern: /sozni|pashmina|shawl|stole|jamawar/i, preset: 0 },
];

const isPlaceholderImage = (image) => (
  !image
  || image === DEFAULT_PRODUCT_IMAGE
  || /(?:product|craft)-placeholder\.svg(?:\?.*)?$/i.test(image)
);

const getProductSearchText = (product = {}) => [
  product.title,
  product.slug,
  product.category,
  product.collection,
  product.embroidery_type,
  product.craft,
  product.material,
].filter(Boolean).join(' ');

export function getPresentationPreset(product = {}) {
  const searchText = getProductSearchText(product);
  const match = PRESENTATION_RULES.find((rule) => rule.pattern.test(searchText));
  return match ? CATALOG_PRESENTATION_PRESETS[match.preset] : null;
}

export function getProductImageFallback(product = {}) {
  return getPresentationPreset(product)?.image || DEFAULT_PRODUCT_IMAGE;
}

function getSafeShortDescription(product = {}) {
  const type = product.category || product.collection || 'piece';
  const craft = product.embroidery_type || product.craft || '';
  return `A considered ${String(type).toLowerCase()} from Poshkaar Kashmir${craft ? `, presented with ${craft} detail` : ''}.`;
}

function getSafeDescription(product = {}) {
  const type = product.category || product.collection || 'piece';
  return `This ${String(type).toLowerCase()} is presented as part of the Poshkaar Kashmir collection. Review the verified material, measurements, colour, availability and care information on this page before ordering. Our team can share current photographs and answer product-specific questions on WhatsApp.`;
}

export function getProductPresentation(product = {}) {
  const suppliedImages = normalizeImageList(
    [product.images, product.image],
    [],
  ).filter((image) => !isPlaceholderImage(image));
  const preset = suppliedImages.length === 0 ? getPresentationPreset(product) : null;
  const hasPendingPhotography = Boolean(product.photography_status)
    && product.photography_status !== 'approved';
  const isStudioPreview = Boolean(
    preset
    || product.image_is_studio_preview
    || hasPendingPhotography,
  );
  const images = suppliedImages.length > 0
    ? suppliedImages
    : preset
      ? [preset.image]
      : [DEFAULT_PRODUCT_IMAGE];

  return {
    ...product,
    images,
    image: images[0],
    short_description: product.short_description || getSafeShortDescription(product),
    description: product.description || getSafeDescription(product),
    image_is_studio_preview: isStudioPreview,
    image_disclosure: preset
      ? 'Studio visualisation. Ask our team for current photographs of the exact piece before ordering.'
      : product.image_disclosure
        || (hasPendingPhotography
          ? 'Studio visualisation. Ask our team for current photographs of the exact piece before ordering.'
          : ''),
  };
}
