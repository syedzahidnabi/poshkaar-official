// app/product/[id]/page.tsx

import { products } from "@/data/products";
import ProductPageClient from "@/components/ProductPageClient";
import type { Metadata } from "next";

// --------------------------------------------------
// GENERATE METADATA (SEO) — FIXED & FULLY VALID
// --------------------------------------------------
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const product = products.find((p) => p.id === params.id);

  if (!product) {
    return {
      title: "Product Not Found | Poshkaar Kashmir",
      description: "This product is no longer available on Poshkaar Kashmir.",
    };
  }

  const url = `https://poshkaar.in/product/${product.id}`;
  const img = product.image ?? "/images/default-product.jpg";

  return {
    title: `${product.name} | Poshkaar Kashmir`,
    description:
      product.description ??
      `Explore handcrafted ${product.workType || ""} Kashmiri couture.`,

    alternates: { canonical: url },

    // ⚠ FIX: OpenGraph type must be "website" (Next.js does not allow "product")
    openGraph: {
      title: `${product.name} | Poshkaar Kashmir`,
      description: product.description,
      url,
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

    // ✔ Twitter SEO
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Poshkaar Kashmir`,
      description: product.description,
      images: [img],
    },
  };
}

// --------------------------------------------------
// JSON-LD STRUCTURED DATA — GOOGLE PRODUCT SEO
// --------------------------------------------------
function generateJsonLd(product: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images?.length ? product.images : [product.image],
    description: product.description,
    sku: product.id,
    category: product.category,

    brand: {
      "@type": "Brand",
      name: "Poshkaar Kashmir",
    },

    offers: {
      "@type": "Offer",
      url: `https://poshkaar.in/product/${product.id}`,
      priceCurrency: "INR",
      price: product.price?.replace(/[^0-9]/g, "") || "0",
      availability:
        product.stockStatus === "sold-out"
          ? "https://schema.org/SoldOut"
          : "https://schema.org/InStock",
    },
  };
}

// --------------------------------------------------
// PAGE COMPONENT
// --------------------------------------------------
export default function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = products.find((p) => p.id === params.id);

  if (!product) {
    return (
      <div className="p-20 text-center text-gray-700">
        <h1 className="text-3xl font-semibold mb-4">Product Not Found</h1>
        <p className="text-gray-500">
          The product you are looking for does not exist.
        </p>
      </div>
    );
  }

  const jsonLd = generateJsonLd(product);

  return (
    <>
      {/* Inject JSON-LD SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Product Page Rendering */}
      <ProductPageClient productId={params.id} />
    </>
  );
}
