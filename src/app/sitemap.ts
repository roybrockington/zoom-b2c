import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.zoom-europe.com";
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

const LOCALES = ["en", "de", "fr", "nl", "pl", "cz"] as const;
type Locale = (typeof LOCALES)[number];

/** Prefix a path with the locale segment. English uses no prefix. */
function localePath(locale: Locale, path: string): string {
  const prefix = locale === "en" ? "" : `/${locale}`;
  return `${BASE_URL}${prefix}${path}`;
}

// ---------------------------------------------------------------------------
// Static public pages and their localized paths (mirrors routing.ts)
// ---------------------------------------------------------------------------
const STATIC_PAGES: Record<string, Partial<Record<Locale, string>>> = {
  "/": {
    en: "/",
    de: "/",
    fr: "/",
    nl: "/",
    pl: "/",
    cz: "/",
  },
  "/about-us": {
    en: "/about-us",
    de: "/uber-uns",
    fr: "/a-propos",
    nl: "/over-ons",
    pl: "/o-nas",
    cz: "/o-nas",
  },
  "/support": {
    en: "/support",
    de: "/support",
    fr: "/support",
    nl: "/support",
    pl: "/support",
    cz: "/podpora",
  },
  "/warranty-extension": {
    en: "/warranty-extension",
    de: "/garantieverlangerung",
    fr: "/extension-garantie",
    nl: "/garantieverlenging",
    pl: "/przedluzenie-gwarancji",
    cz: "/prodlouzeni-zaruky",
  },
  "/returns": {
    en: "/returns",
    de: "/retouren",
    fr: "/retours",
    nl: "/retourzendingen",
    pl: "/zwroty",
    cz: "/vraceni",
  },
  "/shipping-and-delivery": {
    en: "/shipping-and-delivery",
    de: "/versand-lieferung",
    fr: "/expedition-livraison",
    nl: "/verzending-levering",
    pl: "/wysylka-dostawa",
    cz: "/doprava-doruceni",
  },
  "/payment-methods": {
    en: "/payment-methods",
    de: "/zahlungsmethoden",
    fr: "/modes-paiement",
    nl: "/betaalmethoden",
    pl: "/metody-platnosci",
    cz: "/zpusoby-platby",
  },
  "/newsletter": {
    en: "/newsletter",
    de: "/newsletter",
    fr: "/newsletter",
    nl: "/newsletter",
    pl: "/newsletter",
    cz: "/newsletter",
  },
  "/podcasting": {
    en: "/podcasting",
    de: "/podcasting",
    fr: "/podcasting",
    nl: "/podcasting",
    pl: "/podcasty",
    cz: "/podcasty",
  },
  "/music": {
    en: "/music",
    de: "/musik",
    fr: "/musique",
    nl: "/muziek",
    pl: "/muzyka",
    cz: "/hudba",
  },
  "/filmmaking": {
    en: "/filmmaking",
    de: "/filmproduktion",
    fr: "/cinema",
    nl: "/filmmaken",
    pl: "/filmowanie",
    cz: "/filmovani",
  },
  "/sound-design": {
    en: "/sound-design",
    de: "/sound-design",
    fr: "/sound-design",
    nl: "/sound-design",
    pl: "/sound-design",
    cz: "/sound-design",
  },
  "/imprint": {
    en: "/imprint",
    de: "/impressum",
    fr: "/mentions-legales",
    nl: "/impressum",
    pl: "/impressum",
    cz: "/impressum",
  },
  "/privacy-policy": {
    en: "/privacy-policy",
    de: "/datenschutz",
    fr: "/politique-confidentialite",
    nl: "/privacybeleid",
    pl: "/polityka-prywatnosci",
    cz: "/ochrana-soukromi",
  },
  "/terms": {
    en: "/terms",
    de: "/agb",
    fr: "/conditions-generales",
    nl: "/algemene-voorwaarden",
    pl: "/regulamin",
    cz: "/obchodni-podminky",
  },
  "/withdrawal": {
    en: "/withdrawal",
    de: "/widerruf",
    fr: "/retractation",
    nl: "/herroeping",
    pl: "/odstapienie",
    cz: "/odstoupeni",
  },
  "/categories/sale": {
    en: "/categories/sale",
    de: "/kategorien/sale",
    fr: "/categories/soldes",
    nl: "/categorieen/sale",
    pl: "/kategorie/wyprzedaz",
    cz: "/kategorie/vyprodej",
  },
};

// ---------------------------------------------------------------------------
// API types (minimal)
// ---------------------------------------------------------------------------
type ApiProduct = {
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

type ApiCategory = {
  slug: string;
  updated_at?: string;
};

type ProductLocaleSlugMap = {
  en: string;
  de: string;
  fr: string;
  nl: string;
  pl: string;
  cz: string;
};

// ---------------------------------------------------------------------------
// Fetch helpers
// ---------------------------------------------------------------------------
async function fetchAllProducts(): Promise<ApiProduct[]> {
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

async function fetchAllCategories(): Promise<ApiCategory[]> {
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
// Sitemap route paths per locale for products
// ---------------------------------------------------------------------------
const PRODUCT_PATH: Record<Locale, (slug: string) => string> = {
  en: (slug) => `/products/${slug}`,
  de: (slug) => `/produkte/${slug}`,
  fr: (slug) => `/produits/${slug}`,
  nl: (slug) => `/producten/${slug}`,
  pl: (slug) => `/produkty/${slug}`,
  cz: (slug) => `/produkty/${slug}`,
};

const CATEGORY_PATH: Record<Locale, (slug: string) => string> = {
  en: (slug) => `/categories/${slug}`,
  de: (slug) => `/kategorien/${slug}`,
  fr: (slug) => `/categories/${slug}`,
  nl: (slug) => `/categorieen/${slug}`,
  pl: (slug) => `/kategorie/${slug}`,
  cz: (slug) => `/kategorie/${slug}`,
};

// ---------------------------------------------------------------------------
// Sitemap export
// ---------------------------------------------------------------------------
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([
    fetchAllProducts(),
    fetchAllCategories(),
  ]);

  const entries: MetadataRoute.Sitemap = [];

  // Static pages — one entry per page with alternates for all locales
  for (const paths of Object.values(STATIC_PAGES)) {
    const enPath = paths.en ?? "/";
    const url = localePath("en", enPath);
    const alternates: Record<string, string> = {};
    for (const locale of LOCALES) {
      const p = paths[locale];
      if (p) alternates[locale] = localePath(locale, p);
    }
    entries.push({
      url,
      changeFrequency: "weekly",
      priority: enPath === "/" ? 1.0 : 0.7,
      alternates: { languages: alternates },
    });
  }

  // Dynamic product pages
  for (const product of products) {
    const slugs: ProductLocaleSlugMap = {
      en: product.slug,
      de: product.descriptions?.slug_de ?? product.slug,
      fr: product.descriptions?.slug_fr ?? product.slug,
      nl: product.descriptions?.slug_nl ?? product.slug,
      pl: product.descriptions?.slug_pl ?? product.slug,
      cz: product.descriptions?.slug_cz ?? product.slug,
    };

    const alternates: Record<string, string> = {};
    for (const locale of LOCALES) {
      alternates[locale] = localePath(locale, PRODUCT_PATH[locale](slugs[locale]));
    }

    entries.push({
      url: localePath("en", PRODUCT_PATH.en(slugs.en)),
      lastModified: product.updated_at ? new Date(product.updated_at) : undefined,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: { languages: alternates },
    });
  }

  // Dynamic category pages
  for (const category of categories) {
    const alternates: Record<string, string> = {};
    for (const locale of LOCALES) {
      alternates[locale] = localePath(locale, CATEGORY_PATH[locale](category.slug));
    }

    entries.push({
      url: localePath("en", CATEGORY_PATH.en(category.slug)),
      lastModified: category.updated_at ? new Date(category.updated_at) : undefined,
      changeFrequency: "weekly",
      priority: 0.75,
      alternates: { languages: alternates },
    });
  }

  return entries;
}
