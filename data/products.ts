// ------------------------------------------------------------
// PRODUCT TYPE
// ------------------------------------------------------------
export type Product = {
  id: string;
  name: string;
  category: "tilla" | "zari" | "aari" | "dabka";
  price: string;
  description: string;

  // Core media
  image: string;
  images?: string[];

  // Rich media & features
  videos?: string[];       // product videos (mp4 or webm)
  view360?: string[];      // 360° frame-by-frame images
  colors?: string[];       // available colour names
  matchingSet?: boolean;
  customMeasurements?: boolean;
  fabric?: string;
  workType?: string;
  stockStatus?: "in-stock" | "low-stock" | "sold-out";

  specifications?: {
    weight?: string;
    embroideryHours?: string;
    artisan?: string;
    care?: string;
  };
};

// ------------------------------------------------------------
// PRODUCT LIST (40 ITEMS)
// ------------------------------------------------------------
export const products: Product[] = [
  // --------------------------------------------------------
  // TILLA (10 PRODUCTS)
  // --------------------------------------------------------
  {
    id: "tilla1",
    name: "Regal Tilla Pheran",
    category: "tilla",
    price: "₹19999",
    description: "Wool pheran with dense copper Tilla embroidery on neck and borders.",
    image: "/images/products/tilla/tilla1-main.jpg",
    images: [
      "/images/products/tilla/tilla1-main.jpg",
      "/images/products/tilla/tilla1-detail1.jpg",
      "/images/products/tilla/tilla1-detail2.jpg",
      "/images/products/tilla/tilla1-detail3.jpg",
    ],

    // ⭐ ENABLE VIDEO + 360° VIEW ⭐
    videos: ["/videos/tilla1.mp4"],

    view360: [
      "/images/products/tilla/tilla1-360/1.jpg",
      "/images/products/tilla/tilla1-360/2.jpg",
      "/images/products/tilla/tilla1-360/3.jpg",
      "/images/products/tilla/tilla1-360/4.jpg",
      "/images/products/tilla/tilla1-360/5.jpg",
      "/images/products/tilla/tilla1-360/6.jpg",
      "/images/products/tilla/tilla1-360/7.jpg",
      "/images/products/tilla/tilla1-360/8.jpg",
    ],

    colors: ["All colours"],
    fabric: "wool",
    workType: "Tilla",
    matchingSet: false,
    customMeasurements: true,
    stockStatus: "in-stock",
    specifications: {
      weight: "850g",
      embroideryHours: "1 month",
      care: "Dry clean only",
    },
  },

  {
    id: "tilla2",
    name: "Rust silk Silver Tilla Kurta",
    category: "tilla",
    price: "₹3499",
    description: "Rust silk kurta with intricate neckline and sleeve Tilla work.",
    image: "/images/products/tilla/tilla2-main.jpg",
    images: [
      "/images/products/tilla/tilla2-main.jpg",
      "/images/products/tilla/tilla2-detail1.jpg",
      "/images/products/tilla/tilla2-detail2.jpg",
    ],
    colors: ["All colours"],
    fabric: "Silk-blend",
    workType: "Tilla",
    customMeasurements: true,
    stockStatus: "in-stock",
  },

  {
    id: "tilla3",
    name: "Premium Velvet Tilla Suit",
    category: "tilla",
    price: "₹7,999",
    description: "Antique-finish Tilla borders on rich fabric, perfect for occasions.",
    image: "/images/products/tilla/tilla3-main.jpg",
    images: [
      "/images/products/tilla/tilla3-main.jpg",
      "/images/products/tilla/tilla3-detail1.jpg",
      "/images/products/tilla/tilla3-detail2.jpg",
    ],
    colors: ["Sandstone", "Ivory", "Dusky Rose"],
    fabric: "Velvet",
    workType: "Tilla",
    matchingSet: true,
    stockStatus: "low-stock",
  },

  {
    id: "tilla4",
    name: "Royal Maroon Raw Silk Tilla Elegance",
    category: "tilla",
    price: "₹7,999",
    description: "Soft ivory base with delicate Tilla vines and floral motifs.",
    image: "/images/products/tilla/tilla4-main.jpg",
    images: [
      "/images/products/tilla/tilla4-main.jpg",
      "/images/products/tilla/tilla4-detail1.jpg",
      "/images/products/tilla/tilla4-detail2.jpg",
    ],
    colors: ["Ivory", "Champagne", "Cream"],
    fabric: "Raw-Silk",
    workType: "Tilla",
    stockStatus: "in-stock",
  },

  {
    id: "tilla5",
    name: "Heritage Tilla Shawl",
    category: "tilla",
    price: "₹8,999",
    description: "Heavy Tilla embroidered shawl inspired by heirloom Kashmiri designs.",
    image: "/images/products/tilla/tilla5-main.jpg",
    images: [
      "/images/products/tilla/tilla5-main.jpg",
      "/images/products/tilla/tilla5-detail1.jpg",
      "/images/products/tilla/tilla5-detail2.jpg",
    ],
    colors: ["Black", "Pink", "Beige"],
    fabric: "Pashmina blend",
    workType: "Tilla",
    matchingSet: false,
    stockStatus: "in-stock",
  },

  {
    id: "tilla6",
    name: "Silk Velvet Machine Tilla Suit",
    category: "tilla",
    price: "₹4999",
    description: "Subtle multi colour Tilla detailing on a neck and sleeves.",
    image: "/images/products/tilla/tilla6-main.jpg",
    images: [
      "/images/products/tilla/tilla6-main.jpg",
      "/images/products/tilla/tilla6-detail1.jpg",
    ],
    colors: ["All clours"],
    fabric: "Georgette",
    customMeasurements: true,
    workType: "Tilla",
    stockStatus: "in-stock",
  },

  {
    id: "tilla7",
    name: "Classic kem khawb qurab Tilla suit",
    category: "tilla",
    price: "₹4999",
    description: "Kem khawb suit with qurab and tilla.",
    image: "/images/products/tilla/tilla7-main.jpg",
    images: [
      "/images/products/tilla/tilla7-main.jpg",
      "/images/products/tilla/tilla7-detail1.jpg",
    ],
    colors: ["All colours"],
    fabric: "Kem khawb",
    workType: "Tilla",
    stockStatus: "in-stock",
  },

  {
    id: "tilla8",
    name: "Festive Tilla Ensemble",
    category: "tilla",
    price: "₹5999",
    description: "Three-piece set with co-ordinated Tilla embroidery.",
    image: "/images/products/tilla/tilla8-main.jpg",
    images: [
      "/images/products/tilla/tilla8-main.jpg",
      "/images/products/tilla/tilla8-detail1.jpg",
      "/images/products/tilla/tilla8-detail2.jpg",
    ],
    colors: ["All colours"],
    fabric: "velvet",
    matchingSet: true,
    workType: "Tilla",
    stockStatus: "low-stock",
  },

  {
    id: "tilla9",
    name: "Bridal Tilla Ensemble",
    category: "tilla",
    price: "₹10999",
    description: "Lightweight premium silk with  hand Tilla.",
    image: "/images/products/tilla/tilla9-main.jpg",
    images: [
      "/images/products/tilla/tilla9-main.jpg",
      "/images/products/tilla/tilla9-detail1.jpg",
    ],
    colors: ["All colours"],
    fabric: "Premium Silk",
    workType: "Tilla",
    stockStatus: "in-stock",
  },

  {
    id: "tilla10",
    name: "crushed velvet Tilla Suit",
    category: "tilla",
    price: "₹5999",
    description: "Crushed velvet with machine tilla.",
    image: "/images/products/tilla/tilla10-main.jpg",
    images: [
      "/images/products/tilla/tilla10-main.jpg",
      "/images/products/tilla/tilla10-detail1.jpg",
      "/images/products/tilla/tilla10-detail2.jpg",
      "/images/products/tilla/tilla10-detail3.jpg",
    ],
    colors: ["All colours"],
    fabric: "Crushed Velvet",
    workType: "Tilla",
    stockStatus: "low-stock",
    specifications: {
      weight: "1.2kg",
      embroideryHours: "120 hours",
      care: "Professional dry clean only",
    },
  },

  // --------------------------------------------------------
  // ZARI (10)
  // --------------------------------------------------------
  {
    id: "zari1",
    name: "Velvet Zari Suit",
    category: "zari",
    price: "₹6,999",
    description: "  Zari work on neck and sleeves.",
    image: "/images/products/zari/zari1-main.jpg",
    images: [
      "/images/products/zari/zari1-main.jpg",
      "/images/products/zari/zari1-detail1.jpg",
      "/images/products/zari/zari1-detail2.jpg",
    ],
    colors: ["Brown", "Ivory", "Sandstone"],
    fabric: "Silk-velvet",
    workType: "Zari",
    stockStatus: "in-stock",
  },

  {
    id: "zari2",
    name: "Midnight Zari Saree",
    category: "zari",
    price: "₹28,500",
    description: "Rich saree with shimmering Zari pallu.",
    image: "/images/products/zari/zari2-main.jpg",
    images: [
      "/images/products/zari/zari1-main.jpg",
      "/images/products/zari/zari2-detail1.jpg",
    ],
    colors: ["Midnight Blue", "Silver", "Black"],
    fabric: "Silk",
    workType: "Zari",
    customMeasurements: false,
    stockStatus: "in-stock",
  },

  {
    id: "zari3",
    name: "Antique Zari Kurta",
    category: "zari",
    price: "₹18,900",
    description: "Kurta with antique Zari yoke.",
    image: "/images/products/zari/zari2-main.jpg",
    images: [
      "/images/products/zari/zari2-main.jpg",
      "/images/products/zari/zari3-detail1.jpg",
    ],
    colors: ["Antique Gold", "Olive", "Rust"],
    fabric: "Cotton-silk",
    workType: "Zari",
    stockStatus: "in-stock",
  },

  {
    id: "zari4",
    name: "Zari Panel Suit Set",
    category: "zari",
    price: "₹21,500",
    description: "Panelled suit set with geometric Zari patterns.",
    image: "/images/products/zari/zari2-main.jpg",
    images: [
      "/images/products/zari/zari2-main.jpg",
      "/images/products/zari/zari4-detail1.jpg",
    ],
    colors: ["Emerald", "Navy", "Maroon"],
    fabric: "Silk-blend",
    matchingSet: true,
    workType: "Zari",
    stockStatus: "in-stock",
  },

  {
    id: "zari5",
    name: "Soft Gold Zari Dupatta",
    category: "zari",
    price: "₹12,500",
    description: "Light dupatta with a soft-gold Zari jaal.",
    image: "/images/products/zari/zari2-main.jpg",
    images: [
      "/images/products/zari/zari2-main.jpg",
      "/images/products/zari/zari5-detail1.jpg",
    ],
    colors: ["Soft Gold", "Cream", "Blush"],
    fabric: "Georgette",
    workType: "Zari",
    stockStatus: "in-stock",
  },

  {
    id: "zari6",
    name: "Zari Border Pheran",
    category: "zari",
    price: "₹19,000",
    description: "Classic pheran with refined Zari borders.",
    image: "/images/products/zari/zari2-main.jpg",
    images: [
      "/images/products/zari/zari2-main.jpg",
      "/images/products/zari/zari6-detail1.jpg",
    ],
    colors: ["Wine", "Teal", "Charcoal"],
    fabric: "Velvet",
    customMeasurements: true,
    workType: "Zari",
    stockStatus: "in-stock",
  },

  {
    id: "zari7",
    name: "Emerald Zari Ensemble",
    category: "zari",
    price: "₹24,800",
    description: "Statement set with emerald base and bold Zari motifs.",
    image: "/images/products/zari/zari2-main.jpg",
    images: [
      "/images/products/zari/zari2-main.jpg",
      "/images/products/zari/zari7-detail1.jpg",
    ],
    colors: ["Emerald", "Gold", "Ivory"],
    fabric: "Silk",
    matchingSet: true,
    workType: "Zari",
    stockStatus: "low-stock",
  },

  {
    id: "zari8",
    name: "Zari Scallop Dupatta",
    category: "zari",
    price: "₹13,900",
    description: "Soft fabric with scalloped Zari edge.",
    image: "/images/products/zari/zari2-main.jpg",
    images: [
      "/images/products/zari/zari2-main.jpg",
      "/images/products/zari/zari8-detail1.jpg",
    ],
    colors: ["Blush", "Ivory", "Powder Blue"],
    fabric: "Organza",
    workType: "Zari",
    stockStatus: "in-stock",
  },

  {
    id: "zari9",
    name: "Full Zari Bridal Veil",
    category: "zari",
    price: "₹30,500",
    description: "Heavy bridal veil fully embellished with Zari embroidery.",
    image: "/images/products/zari/zari2-main.jpg",
    images: [
      "/images/products/zari/zari2-main.jpg",
      "/images/products/zari/zari9-detail1.jpg",
      "/images/products/zari/zari9-detail2.jpg",
    ],
    colors: ["Gold", "Cream", "Ruby"],
    fabric: "Silk",
    workType: "Zari",
    stockStatus: "low-stock",
    specifications: {
      embroideryHours: "90 hours",
      care: "Dry clean only",
    },
  },

  {
    id: "zari10",
    name: "Zari Heritage Wrap",
    category: "zari",
    price: "₹20,200",
    description: "Wrap with intricate traditional Zari borders.",
    image: "/images/products/zari/zari2-main.jpg",
    images: [
      "/images/products/zari/zari2-main.jpg",
      "/images/products/zari/zari10-detail1.jpg",
    ],
    colors: ["Beige", "Olive", "Marigold"],
    fabric: "Wool-silk",
    workType: "Zari",
    stockStatus: "in-stock",
  },

  // --------------------------------------------------------
  // AARI (10)
  // --------------------------------------------------------
  {
    id: "aari1",
    name: "White Aari Suit",
    category: "aari",
    price: "₹4,999",
    description: "Aari work on neck and Sleeves.",
    image: "/images/products/aari/aari1-main.jpg",
    images: [
      "/images/products/aari/aari1-main.jpg",
      "/images/products/aari/aari1-detail1.jpg",
    ],
    colors: ["Peach", "Mint", "Ivory"],
    fabric: "Cotton",
    workType: "Aari",
    stockStatus: "in-stock",
  },

  {
    id: "aari2",
    name: "Aari Work Yoke Dress",
    category: "aari",
    price: "₹7,999",
    description: "Dress with detailed Aari work and sleeve edges.",
    image: "/images/products/aari/aari2-main.jpg",
    images: [
      "/images/products/aari/aari2-main.jpg",
      "/images/products/aari/aari2-detail1.jpg",
    ],
    colors: ["Lavender", "Dusty Rose", "Sage"],
    fabric: "Count",
    customMeasurements: true,
    workType: "Aari",
    stockStatus: "in-stock",
  },

  {
    id: "aari3",
    name: "Full Aari Panel Kurta",
    category: "aari",
    price: "₹2,999",
    description: "Front-panel Aari embroidery inspired by Kashmiri gardens.",
    image: "/images/products/aari/aari3-main.jpg",
    images: [
      "/images/products/aari/aari3-main.jpg",
      "/images/products/aari/aari3-detail1.jpg",
    ],
    colors: ["Pink", "Mustard", "Green"],
    fabric: "Silk-blend",
    matchingSet: true,
    workType: "Aari",
    stockStatus: "in-stock",
  },

  {
    id: "aari4",
    name: "Aari Suit ",
    category: "aari",
    price: "₹4,999",
    description: "Soft suit with continuous Aari  work.",
    image: "/images/products/aari/aari4-main.jpg",
    images: [
      "/images/products/aari/aari4-main.jpg",
      "/images/products/aari/aari4-detail1.jpg",
    ],
    colors: ["Beige", "Teal", "Rust"],
    fabric: "Wool blend",
    workType: "Aari",
    stockStatus: "in-stock",
  },

  {
    id: "aari5",
    name: "Pastel Aari Ensemble Suit",
    category: "aari",
    price: "₹8,999",
    description: "Pastel-toned set with subtle Aari florals.",
    image: "/images/products/aari/aari5-main.jpg",
    images: [
      "/images/products/aari/aari5-main.jpg",
      "/images/products/aari/aari5-detail1.jpg",
    ],
    colors: ["Pastel Pink", "Mint", "Powder Blue"],
    fabric: "Pashmina- Blend",
    matchingSet: true,
    workType: "Aari",
    stockStatus: "in-stock",
  },

  {
    id: "aari6",
    name: "Regal Aari kurti",
    category: "aari",
    price: "₹5,999",
    description: "Soft wool with  floral Aari jaal.",
    image: "/images/products/aari/aari6-main.jpg",
    images: [
      "/images/products/aari/aari6-main.jpg",
      "/images/products/aari/aari6-detail1.jpg",
    ],
    colors: ["Olive", "Cream", "Peach"],
    fabric: "Premium - Wool",
    workType: "Aari",
    stockStatus: "in-stock",
  },

  {
    id: "aari7",
    name: "Classic Aari Suit",
    category: "aari",
    price: "₹7,999",
    description: "Everyday kurti with traditional Aari patterns.",
    image: "/images/products/aari/aari7-main.jpg",
    images: [
      "/images/products/aari/aari7-main.jpg",
      "/images/products/aari/aari7-detail1.jpg",
    ],
    colors: ["Navy", "Black", "Saffron"],
    fabric: "Premium count",
    workType: "Aari",
    stockStatus: "in-stock",
  },

  {
    id: "aari8",
    name: "Aari Bridal Suit",
    category: "aari",
    price: "₹5,999",
    description: "Heavier Aari work on neck and sleeves suitable for bridal wear.",
    image: "/images/products/aari/aari8-main.jpg",
    images: [
      "/images/products/aari/aari8-main.jpg",
      "/images/products/aari/aari8-detail1.jpg",
      "/images/products/aari/aari8-detail2.jpg",
    ],
    colors: ["Cream", "Gold", "Maroon"],
    fabric: "Silk- Velvet",
    workType: "Aari",
    stockStatus: "low-stock",
    specifications: {
      embroideryHours: "75 hours",
      care: "Dry clean recommended",
    },
  },

  {
    id: "aari9",
    name: "Regal Aari Wrap",
    category: "aari",
    price: "₹6,999",
    description: " Wrap with delicate Aari Work.",
    image: "/images/products/aari/aari9-main.jpg",
    images: [
      "/images/products/aari/aari9-main.jpg",
      "/images/products/aari/aari9-detail1.jpg",
    ],
    colors: ["Lilac", "Mint", "Navy-blue"],
    fabric: "Pashmina- Blend",
    workType: "Aari",
    stockStatus: "in-stock",
  },

  {
    id: "aari10",
    name: "Bridal Aari Suit",
    category: "aari",
    price: "₹7,999",
    description: "Bridal ensemble with full Aari neck and sleeves",
    image: "/images/products/aari/aari10-main.jpg",
    images: [
      "/images/products/aari/aari10-main.jpg",
      "/images/products/aari/aari10-detail1.jpg",
      "/images/products/aari/aari10-detail2.jpg",
    ],
    colors: ["Ruby", "Cream", "Gold"],
    fabric: "Premium -Silk",
    matchingSet: true,
    workType: "Aari",
    stockStatus: "low-stock",
  },

  // --------------------------------------------------------
  // DABKA (10)
  // --------------------------------------------------------
  {
    id: "dabka1",
    name: "Regal Dabka Pheran with trouser",
    category: "dabka",
    price: "₹5,999",
    description: "Rich dabka work on neckline and cuffs for a royal look.",
    image: "/images/products/dabka/dabka1-main.jpg",
    images: [
      "/images/products/dabka/dabka1-main.jpg",
      "/images/products/dabka/dabka1-detail1.jpg",
      "/images/products/dabka/dabka1-detail2.jpg",
    ],
    colors: ["Wine", "Black", "Emerald"],
    fabric: "Velvet",
    workType: "Dabka",
    stockStatus: "in-stock",
  },

  {
    id: "dabka2",
    name: "Dabka Cotton Velvet Suit",
    category: "dabka",
    price: "₹6,999",
    description: "Heavy dabka on neck and sleeves",
    image: "/images/products/dabka/dabka2-main.jpg",
    images: [
      "/images/products/dabka/dabka2-main.jpg",
      "/images/products/dabka/dabka2-detail1.jpg",
    ],
    colors: ["Red", "Beige", "Off-white"],
    fabric: "Cotton Velvet",
    workType: "Dabka",
    stockStatus: "in-stock",
  },

  {
    id: "dabka3",
    name: "Bridal Dabka silk suit",
    category: "dabka",
    price: "₹8,999",
    description: "Bridal Silk suit richly adorned with dabka coils.",
    image: "/images/products/dabka/dabka3-main.jpg",
    images: [
      "/images/products/dabka/dabka3-main.jpg",
      "/images/products/dabka/dabka3-detail1.jpg",
      "/images/products/dabka/dabka3-detail2.jpg",
    ],
    colors: ["All Colours"],
    fabric: "Premium Silk",
    matchingSet: true,
    workType: "Dabka",
    stockStatus: "low-stock",
  },

  {
    id: "dabka4",
    name: "Dabka Velvet Kurta with silk trouser",
    category: "dabka",
    price: "₹4,999",
    description: "Kurta with a statement dabka neck and sleeves.",
    image: "/images/products/dabka/dabka4-main.jpg",
    images: [
      "/images/products/dabka/dabka4-main.jpg",
      "/images/products/dabka/dabka4-detail1.jpg",
    ],
    colors: ["Navy", "Black", "Green"],
    fabric: "velvet-silk",
    workType: "Dabka",
    stockStatus: "in-stock",
  },

  {
    id: "dabka5",
    name: "Dabka Panel Ensemble",
    category: "dabka",
    price: "₹7,999",
    description: "Three-piece set with panelled dabka embroidery.",
    image: "/images/products/dabka/dabka5-main.jpg",
    images: [
      "/images/products/dabka/dabka5-main.jpg",
      "/images/products/dabka/dabka5-detail1.jpg",
    ],
    colors: ["Emerald", "Wine", "Midnight"],
    fabric: "Velvet",
    matchingSet: true,
    workType: "Dabka",
    stockStatus: "in-stock",
  },

  {
    id: "dabka6",
    name: "Dabka Kurti",
    category: "dabka",
    price: "₹2,999",
    description: "Kurti with a bold dabka yoke.",
    image: "/images/products/dabka/dabka6-main.jpg",
    images: [
      "/images/products/dabka/dabka6-main.jpg",
      "/images/products/dabka/dabka6-detail1.jpg",
    ],
    colors: ["Maroon", "Beige", "Olive"],
    fabric: "Wool",
    workType: "Dabka",
    stockStatus: "in-stock",
  },

  {
    id: "dabka7",
    name: "Dabka Count Kurti",
    category: "dabka",
    price: "₹2,999",
    description: "Count kurti with strong dabka accents on borders.",
    image: "/images/products/dabka/dabka7-main.jpg",
    images: [
      "/images/products/dabka/dabka7-main.jpg",
      "/images/products/dabka/dabka7-detail1.jpg",
    ],
    colors: ["Blue", "Olive", "Black"],
    fabric: "Count",
    workType: "Dabka",
    stockStatus: "in-stock",
  },
];
