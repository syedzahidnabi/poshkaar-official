import { products } from "@/data/products";
import CollectionGridWithFilters from "@/components/CollectionGridWithFilters";

export default function TillaPage() {
  const tillaProducts = products.filter((p) => p.category === "tilla");

  return (
    <CollectionGridWithFilters
      title="Tilla Collection"
      subtitle="Handcrafted gold threadwork from Kashmir."
      bannerImage="/images/collections/tilla-banner.jpg"
      products={tillaProducts}
    />
  );
}
