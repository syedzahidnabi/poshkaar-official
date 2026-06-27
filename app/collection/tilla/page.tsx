import { products } from "@/data/products";
import CollectionGridWithFilters from "@/components/CollectionGridWithFilters";

export default function TillaPage() {
  return (
    <CollectionGridWithFilters
      title="Tilla Collection"
      subtitle="Metallic Kashmiri threadwork for pherans, suits, shawls and occasionwear."
      bannerImage="/images/collections/tilla-banner.jpg"
      products={products.filter((product) => product.category === "tilla")}
    />
  );
}
