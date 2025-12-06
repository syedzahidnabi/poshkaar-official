// app/product/[id]/page.tsx

import { products } from "@/data/products";
import ProductPageClient from "@/components/ProductPageClient";
import type { Metadata } from "next";
import React from "react";

// ----------------------------------------------------------------------
// ⭐ PHASE 6 — REVIEW + RATING DATA (Designer Picked)
// ----------------------------------------------------------------------
const RATINGS: Record<
  string,
  {
    rating: number;
    count: number;
    sampleReviews: {
      author: string;
      rating: number;
      text: string;
      date: string;
    }[];
  }
> = {
  tilla1: {
    rating: 4.9,
    count: 42,
    sampleReviews: [
      {
        author: "Sana K., Srinagar",
        rating: 5,
        text: "Exquisite craftsmanship—an heirloom to cherish.",
        date: "2025-10-14",
      },
      {
        author: "Aisha R., New Delhi",
        rating: 5,
        text: "Perfect fit and detailed tilla work. Beautifully made.",
        date: "2025-09-02",
      },
    ],
  },

  tilla2: {
    rating: 4.7,
    count: 18,
    sampleReviews: [
      {
        author: "M. Khan, Srinagar",
        rating: 5,
        text: "Lovely fabric and finish. Received a lot of compliments.",
        date: "2025-11-01",
      },
    ],
  },

  aari9: {
    rating: 4.8,
    count: 27,
    sampleReviews: [
      {
        author: "Hiba, Dubai",
        rating: 5,
        text: "Beautiful work — stunning and comfortable.",
        date: "2025-08-21",
      },
    ],
  },
};

// ----------------------------------------------------------------------
// ⭐ PHASE 1–5 SEO METADATA
// ----------------------------------------------------------------------
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const product = products.find((p) => p.id === params.id);

  if (!product) {
    return {
      title: "Product Not Found | Poshkaar Kashmir",
      description: "This product is unavailable or does not exist.",
    };
  }

  const url = `https://www.poshkaar.com/product/${product.id}`;
  const img = product.image ?? "/images/default-product.jpg";

  return {
    title: `${product.name} | Poshkaar Kashmir`,
    description:
      product.description ??
      `Handcrafted ${product.workType || ""} Kashmiri couture.`,
    alternates: { canonical: url },

    openGraph: {
      title: product.name,
      description: product.description,
      url,
      siteName: "Poshkaar Kashmir",
      type: "website",
      images: [{ url: img, width: 1200, height: 630, alt: product.name }],
    },

    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description,
      images: [img],
    },

    robots: { index: true, follow: true },
  };
}

// ----------------------------------------------------------------------
// ⭐ PHASE 6 — PRODUCT JSON-LD With Reviews + Ratings
// ----------------------------------------------------------------------
function buildProductJsonLd(product: any) {
  const ratingInfo = RATINGS[product.id];

  const aggregateRating = ratingInfo
    ? {
        "@type": "AggregateRating",
        ratingValue: ratingInfo.rating.toFixed(1),
        reviewCount: ratingInfo.count,
        bestRating: "5",
        worstRating: "1",
      }
    : undefined;

  const reviewList =
    ratingInfo?.sampleReviews?.map((review) => ({
      "@type": "Review",
      author: { "@type": "Person", name: review.author },
      datePublished: review.date,
      reviewBody: review.text,
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.rating.toString(),
        bestRating: "5",
        worstRating: "1",
      },
    })) ?? [];

  return {
    "@context": "https://schema.org",
    "@type": "Product",

    name: product.name,
    description: product.description,
    sku: product.id,
    mpn: product.id,
    category: product.category,
    color: product.colors?.[0] || "Multicolour",
    material: product.fabric || "Fabric",

    image: product.images?.length ? product.images : [product.image],

    brand: {
      "@type": "Brand",
      name: "Poshkaar Kashmir",
      url: "https://www.poshkaar.com",
    },

    offers: {
      "@type": "Offer",
      url: `https://www.poshkaar.com/product/${product.id}`,
      priceCurrency: "INR",
      price: (product.price ?? "").replace(/[^0-9.]/g, "") || "0",
      availability:
        product.stockStatus === "sold-out"
          ? "https://schema.org/SoldOut"
          : "https://schema.org/InStock",
      seller: { "@type": "Organization", name: "Poshkaar Kashmir" },
    },

    ...(aggregateRating && { aggregateRating }),
    ...(reviewList.length && { review: reviewList }),
  };
}

// ----------------------------------------------------------------------
// ⭐ PAGE COMPONENT (FINAL)
// ----------------------------------------------------------------------
export default function ProductPage({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === params.id);

  if (!product) {
    return (
      <div className="p-20 text-center">
        <h1 className="text-3xl font-bold">Product Not Found</h1>
        <p className="text-gray-600 mt-2">This item no longer exists.</p>
      </div>
    );
  }

  const jsonLd = buildProductJsonLd(product);
  const ratingData = RATINGS[product.id] ?? {
    rating: 0,
    count: 0,
    sampleReviews: [],
  };

  return (
    <>
      {/* ⭐ Inject JSON-LD FOR GOOGLE RICH SNIPPETS */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ⭐ Pass ratingData to Client Component */}
      <ProductPageClient productId={params.id} ratingData={ratingData} />
    </>
  );
}
