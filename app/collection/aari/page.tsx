import { products } from "@/data/products";
import CollectionGridWithFilters from "@/components/CollectionGridWithFilters";

export default function AariPage() {
  return (
    <CollectionGridWithFilters
      title="Aari Collection"
      subtitle="Fine hooked-needle embroidery with floral, vine and garden-inspired motifs."
      bannerImage="/images/collections/aari-banner.jpg"
      products={products.filter((product) => product.category === "aari")}
    />
  );
}
