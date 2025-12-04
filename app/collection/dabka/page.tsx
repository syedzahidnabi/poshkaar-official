import { products } from "@/data/products";
import CollectionGridWithFilters from "@/components/CollectionGridWithFilters";

export default function DabkaPage() {
  const dabkaProducts = products.filter((p) => p.category === "dabka");

  return (
    <CollectionGridWithFilters
      title="Dabka Collection"
      subtitle="Rich, royal coils of dabka handwork."
      bannerImage="/images/collections/dabka-banner.jpg"
      products={dabkaProducts}
    />
  );
}
