import { products } from "@/data/products";
import CollectionGridWithFilters from "@/components/CollectionGridWithFilters";

export default function AariPage() {
  const aariProducts = products.filter((p) => p.category === "aari");

  return (
    <CollectionGridWithFilters
      title="Aari Collection"
      subtitle="Exquisite needlework crafted by Kashmiri artisans."
      bannerImage="/images/collections/aari-banner.jpg"
      products={aariProducts}
    />
  );
}
