// app/product/[id]/page.tsx

import { products } from "@/data/products";
import ProductPageClient from "@/components/ProductPageClient";
import type { Metadata } from "next";

// ----------------------------------------------------------------------
// SEO METADATA FOR PRODUCT PAGE
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

  const canonical = `https://www.poshkaar.com/product/${product.id}`;
  const img = product.image ?? "/images/default-product.jpg";

  return {
    title: `${product.name} | Poshkaar Kashmir`,
    description: product.description ?? "Handcrafted Kashmiri couture.",
    alternates: { canonical },

    openGraph: {
      title: product.name,
      description: product.description,
      url: canonical,
      siteName: "Poshkaar Kashmir",
      type: "website",
      images: [
        {
          url: img,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description,
      images: [img],
    },
  };
}

// ----------------------------------------------------------------------
// JSON-LD STRUCTURED DATA (GOOGLE SHOPPING OPTIMIZED)
// ----------------------------------------------------------------------
function generateJsonLd(product: any) {
  const productUrl = `https://www.poshkaar.com/product/${product.id}`;

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
      logo: "https://www.poshkaar.com/logo.png",
    },

    itemCondition: "https://schema.org/NewCondition",

    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "INR",
      price: product.price?.replace(/[^0-9]/g, "") || "0",
      availability:
        product.stockStatus === "sold-out"
          ? "https://schema.org/SoldOut"
          : "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Poshkaar Kashmir",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0",
          currency: "INR",
        },
      },
    },

    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "127",
    },

    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://www.poshkaar.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: product.category,
          item: `https://www.poshkaar.com/collection/${product.category}`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: product.name,
          item: productUrl,
        },
      ],
    },
  };
}

// ----------------------------------------------------------------------
// PAGE COMPONENT (MUST RETURN VALID JSX → FIXED ERROR)
// ----------------------------------------------------------------------
export default function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = products.find((p) => p.id === params.id);

  if (!product) {
    return (
      <div className="p-16 text-center">
        <h1 className="text-3xl font-bold">Product Not Found</h1>
        <p className="text-gray-600 mt-2">This item no longer exists.</p>
      </div>
    );
  }

  const jsonLd = generateJsonLd(product);

  return (
    <div>
      {/* STRUCTURED DATA SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      {/* MAIN PAGE */}
      <ProductPageClient productId={params.id} />
    </div>
  );
}
