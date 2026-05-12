import type { MetadataRoute } from "next";
import { buildSitemapEntries, fetchAllCategories, fetchAllProducts, LOCALES, type Locale } from "@/lib/sitemap";
import { routing } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export async function generateStaticParams() {
  // Exclude "en" — it is served from the root /sitemap.xml
  return LOCALES.filter((l) => l !== "en").map((locale) => ({ locale }));
}

export default async function sitemap({ params }: Props): Promise<MetadataRoute.Sitemap> {
  const { locale } = await params;

  const isValidLocale = (routing.locales as readonly string[]).includes(locale);
  if (!isValidLocale || locale === "en") return [];

  const [products, categories] = await Promise.all([
    fetchAllProducts(),
    fetchAllCategories(),
  ]);

  return buildSitemapEntries(locale as Locale, products, categories);
}
