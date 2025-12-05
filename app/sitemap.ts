import { MetadataRoute } from "next";
import { products } from "@/data/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.poshkaarkashmir.com";

  // Homepage
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];

  // Collection pages (create unique categories automatically)
  const categories = Array.from(new Set(products.map((p) => p.category)));

  categories.forEach((cat) => {
    routes.push({
      url: `${baseUrl}/collection/${cat}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  });

  // Product pages
  products.forEach((product) => {
    routes.push({
      url: `${baseUrl}/product/${product.id}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    });
  });

  return routes;
}
