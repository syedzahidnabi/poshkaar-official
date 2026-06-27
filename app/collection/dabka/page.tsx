import { products } from "@/data/products";
import CollectionGridWithFilters from "@/components/CollectionGridWithFilters";

export default function DabkaPage() {
  return (
    <CollectionGridWithFilters
      title="Dabka Collection"
      subtitle="Raised coiled embroidery with dimensional shine for statement pieces."
      bannerImage="/images/collections/dabka-banner.jpg"
      products={products.filter((product) => product.category === "dabka")}
    />
  );
}
