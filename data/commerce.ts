import type { Product } from "@/data/products";
import { products } from "@/data/products";

export type CollectionSlug = Product["category"];

export const siteUrl = "https://poshkaarkashmir.com";

export const whatsappNumber = "916006491824";

export const craftCollections: Array<{
  slug: CollectionSlug;
  title: string;
  shortTitle: string;
  image: string;
  description: string;
  mood: string;
}> = [
  {
    slug: "tilla",
    title: "Tilla Collection",
    shortTitle: "Tilla",
    image: "/images/collections/tilla-banner.jpg",
    description:
      "Metallic threadwork with a regal Kashmiri language, shaped for pherans, suits, shawls and occasionwear.",
    mood: "Festive, heirloom, ceremonial",
  },
  {
    slug: "zari",
    title: "Zari Collection",
    shortTitle: "Zari",
    image: "/images/collections/zari-banner.jpg",
    description:
      "Luminous woven and embroidered detail for pieces that move between evening polish and traditional grandeur.",
    mood: "Polished, luminous, formal",
  },
  {
    slug: "aari",
    title: "Aari Collection",
    shortTitle: "Aari",
    image: "/images/collections/aari-banner.jpg",
    description:
      "Fine hooked-needle embroidery with floral, vine and garden-inspired motifs for refined everyday luxury.",
    mood: "Soft, detailed, graceful",
  },
  {
    slug: "dabka",
    title: "Dabka Collection",
    shortTitle: "Dabka",
    image: "/images/collections/dabka-banner.jpg",
    description:
      "Raised coiled embroidery with dimensional shine, made for statement suits and bridal-leaning ensembles.",
    mood: "Textured, bold, couture",
  },
];

export const atelierHighlights = [
  "Direct artisan-led production in Kashmir",
  "Custom sizing and color requests for most pieces",
  "Secure checkout through Razorpay, UPI or WhatsApp assistance",
  "Quality checked, packed and dispatched with care",
];

export const featuredProductIds = [
  "tilla1",
  "dabka3",
  "aari10",
  "zari2",
  "tilla5",
  "dabka5",
];

export function getProductsByIds(ids: string[]) {
  return ids
    .map((id) => products.find((product) => product.id === id))
    .filter(Boolean) as Product[];
}

export function getCollectionMeta(slug: CollectionSlug) {
  return craftCollections.find((collection) => collection.slug === slug);
}

export function getCollectionCount(slug: CollectionSlug) {
  return products.filter((product) => product.category === slug).length;
}
