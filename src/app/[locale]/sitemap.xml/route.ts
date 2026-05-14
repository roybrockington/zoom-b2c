import { NextRequest, NextResponse } from "next/server";
import { buildSitemapEntries, fetchAllCategories, fetchAllProducts, LOCALES, type Locale } from "@/lib/sitemap";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale } = await params;

  if (!(LOCALES as readonly string[]).includes(locale) || locale === "en") {
    return new NextResponse("Not found", { status: 404 });
  }

  const [products, categories] = await Promise.all([
    fetchAllProducts(),
    fetchAllCategories(),
  ]);

  const entries = buildSitemapEntries(locale as Locale, products, categories);

  const urls = entries
    .map((entry) => {
      const alternateLinks = entry.alternates?.languages
        ? Object.entries(entry.alternates.languages)
            .map(([lang, href]) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${href}"/>`)
            .join("\n")
        : "";

      return `  <url>
    <loc>${entry.url}</loc>
    ${entry.lastModified ? `<lastmod>${new Date(entry.lastModified).toISOString().split("T")[0]}</lastmod>` : ""}
    <changefreq>${entry.changeFrequency ?? "weekly"}</changefreq>
    <priority>${entry.priority ?? 0.7}</priority>
${alternateLinks}
  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
