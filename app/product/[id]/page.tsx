import type { Metadata } from "next";
import { products, type Product } from "@/data/products";
import ProductPageClient from "@/components/ProductPageClient";
import { parsePrice } from "@/lib/price";
import { siteUrl } from "@/data/commerce";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const product = products.find((item) => item.id === params.id);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "This product is no longer available.",
    };
  }

  return {
    title: `${product.name} | Poshkaar Kashmir`,
    description: product.description,
    alternates: { canonical: `${siteUrl}/product/${product.id}` },
    openGraph: {
      title: `${product.name} | Poshkaar Kashmir`,
      description: product.description,
      url: `${siteUrl}/product/${product.id}`,
      images: [{ url: product.image, width: 1200, height: 630, alt: product.name }],
    },
  };
}

function productJsonLd(product: Product) {
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: product.images?.length ? product.images : [product.image],
    description: product.description,
    sku: product.id,
    category: product.category,
    brand: { "@type": "Brand", name: "Poshkaar Kashmir" },
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/product/${product.id}`,
      priceCurrency: "INR",
      price: String(parsePrice(product.price)),
      availability:
        product.stockStatus === "sold-out"
          ? "https://schema.org/SoldOut"
          : "https://schema.org/InStock",
    },
  };
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = products.find((item) => item.id === params.id);

  if (!product) {
    return (
      <main className="min-h-screen bg-[#f7f4ef] px-6 py-20 text-center">
        <h1 className="font-serif text-4xl font-bold">Product not found</h1>
      </main>
    );
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)) }}
      />
      <ProductPageClient productId={params.id} />
    </>
  );
}
