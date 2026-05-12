import type { MetadataRoute } from "next";
import { buildSitemapEntries, fetchAllCategories, fetchAllProducts } from "@/lib/sitemap";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([
    fetchAllProducts(),
    fetchAllCategories(),
  ]);
  return buildSitemapEntries("en", products, categories);
}
