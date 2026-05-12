import type { MetadataRoute } from "next";

export const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.zoom-europe.com";
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export const LOCALES = ["en", "de", "fr", "nl", "pl", "cz"] as const;
export type Locale = (typeof LOCALES)[number];

/** Absolute URL for a given locale + path. English has no prefix. */
export function localePath(locale: Locale, path: string): string {
  const prefix = locale === "en" ? "" : `/${locale}`;
  return `${BASE_URL}${prefix}${path}`;
}

// ---------------------------------------------------------------------------
// Static public pages — localized paths per locale (mirrors routing.ts)
// ---------------------------------------------------------------------------
export const STATIC_PAGES: Record<string, Partial<Record<Locale, string>>> = {
  "/": { en: "/", de: "/", fr: "/", nl: "/", pl: "/", cz: "/" },
  "/about-us": {
    en: "/about-us", de: "/uber-uns", fr: "/a-propos",
    nl: "/over-ons", pl: "/o-nas", cz: "/o-nas",
  },
  "/support": {
    en: "/support", de: "/support", fr: "/support",
    nl: "/support", pl: "/support", cz: "/podpora",
  },
  "/warranty-extension": {
    en: "/warranty-extension", de: "/garantieverlangerung", fr: "/extension-garantie",
    nl: "/garantieverlenging", pl: "/przedluzenie-gwarancji", cz: "/prodlouzeni-zaruky",
  },
  "/returns": {
    en: "/returns", de: "/retouren", fr: "/retours",
    nl: "/retourzendingen", pl: "/zwroty", cz: "/vraceni",
  },
  "/shipping-and-delivery": {
    en: "/shipping-and-delivery", de: "/versand-lieferung", fr: "/expedition-livraison",
    nl: "/verzending-levering", pl: "/wysylka-dostawa", cz: "/doprava-doruceni",
  },
  "/payment-methods": {
    en: "/payment-methods", de: "/zahlungsmethoden", fr: "/modes-paiement",
    nl: "/betaalmethoden", pl: "/metody-platnosci", cz: "/zpusoby-platby",
  },
  "/newsletter": {
    en: "/newsletter", de: "/newsletter", fr: "/newsletter",
    nl: "/newsletter", pl: "/newsletter", cz: "/newsletter",
  },
  "/podcasting": {
    en: "/podcasting", de: "/podcasting", fr: "/podcasting",
    nl: "/podcasting", pl: "/podcasty", cz: "/podcasty",
  },
  "/music": {
    en: "/music", de: "/musik", fr: "/musique",
    nl: "/muziek", pl: "/muzyka", cz: "/hudba",
  },
  "/filmmaking": {
    en: "/filmmaking", de: "/filmproduktion", fr: "/cinema",
    nl: "/filmmaken", pl: "/filmowanie", cz: "/filmovani",
  },
  "/sound-design": {
    en: "/sound-design", de: "/sound-design", fr: "/sound-design",
    nl: "/sound-design", pl: "/sound-design", cz: "/sound-design",
  },
  "/imprint": {
    en: "/imprint", de: "/impressum", fr: "/mentions-legales",
    nl: "/impressum", pl: "/impressum", cz: "/impressum",
  },
  "/privacy-policy": {
    en: "/privacy-policy", de: "/datenschutz", fr: "/politique-confidentialite",
    nl: "/privacybeleid", pl: "/polityka-prywatnosci", cz: "/ochrana-soukromi",
  },
  "/terms": {
    en: "/terms", de: "/agb", fr: "/conditions-generales",
    nl: "/algemene-voorwaarden", pl: "/regulamin", cz: "/obchodni-podminky",
  },
  "/withdrawal": {
    en: "/withdrawal", de: "/widerruf", fr: "/retractation",
    nl: "/herroeping", pl: "/odstapienie", cz: "/odstoupeni",
  },
  "/categories/sale": {
    en: "/categories/sale", de: "/kategorien/sale", fr: "/categories/soldes",
    nl: "/categorieen/sale", pl: "/kategorie/wyprzedaz", cz: "/kategorie/vyprodej",
  },
};

// ---------------------------------------------------------------------------
// Localized URL path builders
// ---------------------------------------------------------------------------
export const PRODUCT_PATH: Record<Locale, (slug: string) => string> = {
  en: (slug) => `/products/${slug}`,
  de: (slug) => `/produkte/${slug}`,
  fr: (slug) => `/produits/${slug}`,
  nl: (slug) => `/producten/${slug}`,
  pl: (slug) => `/produkty/${slug}`,
  cz: (slug) => `/produkty/${slug}`,
};

export const CATEGORY_PATH: Record<Locale, (slug: string) => string> = {
  en: (slug) => `/categories/${slug}`,
  de: (slug) => `/kategorien/${slug}`,
  fr: (slug) => `/categories/${slug}`,
  nl: (slug) => `/categorieen/${slug}`,
  pl: (slug) => `/kategorie/${slug}`,
  cz: (slug) => `/kategorie/${slug}`,
};

// ---------------------------------------------------------------------------
// API types
// ---------------------------------------------------------------------------
export type ApiProduct = {
  slug: string;
  updated_at?: string;
  descriptions?: {
    slug_de?: string | null;
    slug_fr?: string | null;
    slug_nl?: string | null;
    slug_pl?: string | null;
    slug_cz?: string | null;
  } | null;
};

export type ApiCategory = {
  slug: string;
  updated_at?: string;
};

// ---------------------------------------------------------------------------
// Fetch helpers
// ---------------------------------------------------------------------------
export async function fetchAllProducts(): Promise<ApiProduct[]> {
  try {
    const res = await fetch(
      `${API_URL}/api/products?per_page=2000&include=productDescription`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

export async function fetchAllCategories(): Promise<ApiCategory[]> {
  try {
    const res = await fetch(`${API_URL}/api/categories`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? json ?? [];
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Core builder — generates sitemap entries for a single locale
// ---------------------------------------------------------------------------
export function buildSitemapEntries(
  locale: Locale,
  products: ApiProduct[],
  categories: ApiCategory[]
): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Static pages
  for (const paths of Object.values(STATIC_PAGES)) {
    const path = paths[locale];
    if (!path) continue;

    const alternates: Record<string, string> = {};
    for (const l of LOCALES) {
      const p = paths[l];
      if (p) alternates[l] = localePath(l, p);
    }

    entries.push({
      url: localePath(locale, path),
      changeFrequency: "weekly",
      priority: path === "/" ? 1.0 : 0.7,
      alternates: { languages: alternates },
    });
  }

  // Product pages
  for (const product of products) {
    const localeSlug =
      locale === "en" ? product.slug
      : locale === "de" ? (product.descriptions?.slug_de ?? product.slug)
      : locale === "fr" ? (product.descriptions?.slug_fr ?? product.slug)
      : locale === "nl" ? (product.descriptions?.slug_nl ?? product.slug)
      : locale === "pl" ? (product.descriptions?.slug_pl ?? product.slug)
      : (product.descriptions?.slug_cz ?? product.slug);

    const alternates: Record<string, string> = {};
    for (const l of LOCALES) {
      const s =
        l === "en" ? product.slug
        : l === "de" ? (product.descriptions?.slug_de ?? product.slug)
        : l === "fr" ? (product.descriptions?.slug_fr ?? product.slug)
        : l === "nl" ? (product.descriptions?.slug_nl ?? product.slug)
        : l === "pl" ? (product.descriptions?.slug_pl ?? product.slug)
        : (product.descriptions?.slug_cz ?? product.slug);
      alternates[l] = localePath(l, PRODUCT_PATH[l](s));
    }

    entries.push({
      url: localePath(locale, PRODUCT_PATH[locale](localeSlug)),
      lastModified: product.updated_at ? new Date(product.updated_at) : undefined,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: { languages: alternates },
    });
  }

  // Category pages
  for (const category of categories) {
    const alternates: Record<string, string> = {};
    for (const l of LOCALES) {
      alternates[l] = localePath(l, CATEGORY_PATH[l](category.slug));
    }

    entries.push({
      url: localePath(locale, CATEGORY_PATH[locale](category.slug)),
      lastModified: category.updated_at ? new Date(category.updated_at) : undefined,
      changeFrequency: "weekly",
      priority: 0.75,
      alternates: { languages: alternates },
    });
  }

  return entries;
}
