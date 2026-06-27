import { products } from "@/data/products";
import CollectionGridWithFilters from "@/components/CollectionGridWithFilters";

export default function ZariPage() {
  return (
    <CollectionGridWithFilters
      title="Zari Collection"
      subtitle="Luminous metallic detail for evening polish and traditional grandeur."
      bannerImage="/images/collections/zari-banner.jpg"
      products={products.filter((product) => product.category === "zari")}
    />
  );
}
