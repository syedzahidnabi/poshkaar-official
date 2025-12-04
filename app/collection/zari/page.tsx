import { products } from "@/data/products";
import CollectionGridWithFilters from "@/components/CollectionGridWithFilters";

export const metadata = {
  title: "Zari Collection – Poshkaar",
  description:
    "Timeless metallic embroidery, handcrafted with traditional Kashmiri artistry.",
};

export default function ZariPage() {
  const zariProducts = products.filter((p) => p.category === "zari");

  return (
    <div className="fade-smooth">
      <CollectionGridWithFilters
        title="Zari Collection"
        subtitle="Timeless metallic thread embroidery with regal Kashmiri detailing."
        bannerImage="/images/collections/zari-banner.jpg"
        products={zariProducts}
        shimmer
        parallax
        goldenGlow
      />
    </div>
  );
}
